export const meta = {
  name: 'adversarial-gap-hunt',
  description: 'Hunt for latent gaps in a demo example (dead code, API misuse, vestigial bits), 2x adversarial verify',
  phases: [
    { title: 'Find', detail: 'parallel finders, distinct lenses' },
    { title: 'Verify', detail: '2x are-you-sure refutation per finding' },
  ],
}

const DIR = args.dir
const SAGENT = args.sagentRoot
const LABEL = args.label

const FINDINGS_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    findings: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      properties: {
        file: { type: 'string' },
        line: { type: ['integer', 'null'] },
        kind: { type: 'string', description: 'dead-code | api-misuse | vestigial | correctness | other' },
        title: { type: 'string' },
        detail: { type: 'string' },
        suggested_fix: { type: 'string' },
        severity: { type: 'string', description: 'low | med | high' },
      },
      required: ['file', 'line', 'kind', 'title', 'detail', 'suggested_fix', 'severity'],
    }},
  },
  required: ['findings'],
}

const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: { survives: { type: 'boolean' }, reason: { type: 'string' } },
  required: ['survives', 'reason'],
}

const CONTEXT = `You are auditing a polished, ALREADY-APPROVED sagent demo example at ${DIR}.
The sagent library source is at ${SAGENT}. Work with absolute paths (cwd is unrelated).
This example went through MANY iterations before the final version, so vestigial/leftover gaps are likely.
The maintainer's review already caught: (1) dead modules comms.py/sim.py (now DELETED — do not re-report them),
(2) an invalid ModelSpec(auth="api") with no matching factory, (3) broad pyproject lint suppressions (now inlined).
Find OTHER, SIMILAR latent gaps. Be HIGH-PRECISION: only real, actionable issues a careful maintainer would fix.
Ignore: the shipped web/data.js contents, intentional CLI prints (already noqa'd), and style nits.`

const FINDERS = [
  { key: 'dead-code', prompt: `${CONTEXT}
LENS: dead / unreachable code. Find unused functions, classes, methods, module-level constants, imports, and
function parameters that are never read; unreachable branches; helpers defined but never called. Use grep to prove
each symbol has no use site (search the whole ${DIR} tree AND check it isn't part of a public __all__/entry point).
Report only symbols you verified are genuinely unused.` },
  { key: 'api-misuse', prompt: `${CONTEXT}
LENS: sagent API correctness (the auth="api" class of bug). For EVERY sagent symbol, factory, class, kwarg, and
attribute the demo uses, verify it actually exists in ${SAGENT} with the right signature/spelling and is used
correctly. grep the sagent source to confirm. Flag any call/param/attribute that doesn't exist, is deprecated, or
is mis-used (wrong type, wrong enum/literal value, nonexistent factory).` },
  { key: 'vestigial', prompt: `${CONTEXT}
LENS: vestigial / stale leftovers from iteration. Find: docstrings/comments/README/WORKLOG text that references
things that no longer exist (e.g. removed modules, renamed concepts, "coordinator" vs "first agent", old filenames),
commented-out code, TODO/HACK/FIXME/XXX markers, dead config keys, duplicated logic, and stale module docstrings that
describe a design the code no longer implements. grep to confirm the referenced thing is actually gone/changed.` },
  { key: 'correctness', prompt: `${CONTEXT}
LENS: internal consistency & correctness. Check the controller (lock_lockstep.py) output shape vs what web/index.html
+ web/data.js consume (ids, fields, canvas element ids referenced by JS that don't exist or vice-versa); logic that
contradicts its own docstring; off-by-one or wrong-default bugs; test files that test removed behaviour. grep both
the .py and web/*.{html,js} to confirm any mismatch.` },
]

phase('Find')
const raw = (await parallel(FINDERS.map(f => () =>
  agent(f.prompt, { label: `find:${f.key}`, phase: 'Find', schema: FINDINGS_SCHEMA })
))).filter(Boolean).flatMap(r => r.findings)

// light dedup by file + normalized title
const seen = new Set()
const found = []
for (const fd of raw) {
  const k = (fd.file + '|' + fd.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()).slice(0, 120)
  if (seen.has(k)) continue
  seen.add(k); found.push(fd)
}
log(`finders surfaced ${raw.length} raw, ${found.length} after dedup; verifying each 2x`)

phase('Verify')
const verifyPrompt = (fd, n) => `${CONTEXT}
ADVERSARIAL VERIFICATION pass ${n} of 2 ("are you sure?"). A finder claims this gap:
  file: ${fd.file}  line: ${fd.line}
  kind: ${fd.kind}  severity: ${fd.severity}
  title: ${fd.title}
  detail: ${fd.detail}
  suggested_fix: ${fd.suggested_fix}
Try HARD to REFUTE it. Read the actual code at ${fd.file} and grep ${DIR} and ${SAGENT} as needed. A claim only
survives if it is a REAL, actionable issue worth fixing in an approved PR AND the suggested fix is correct/safe.
Default to survives=false if it's a false positive, intentional, a style nit, or you are uncertain.`

const verified = await parallel(found.map(fd => () =>
  parallel([1, 2].map(n => () =>
    agent(verifyPrompt(fd, n), { label: `verify:${fd.kind}#${n}`, phase: 'Verify', schema: VERDICT_SCHEMA })
  )).then(votes => {
    const v = votes.filter(Boolean)
    const survives = v.length === 2 && v.every(x => x.survives)
    return { ...fd, survives, votes: v }
  })
))

const confirmed = verified.filter(x => x && x.survives)
const dropped = verified.filter(x => x && !x.survives)
log(`CONFIRMED ${confirmed.length} / dropped ${dropped.length} for ${LABEL}`)
return {
  label: LABEL,
  confirmed: confirmed.map(({ votes, ...f }) => f),
  dropped: dropped.map(f => ({ file: f.file, title: f.title, why: (f.votes[0] && f.votes[0].reason) || 'refuted' })),
}
