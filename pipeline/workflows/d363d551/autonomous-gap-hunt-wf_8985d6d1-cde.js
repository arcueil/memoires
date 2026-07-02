export const meta = {
  name: 'autonomous-gap-hunt',
  description: 'Adversarial gap-hunt on the autonomous agent_maze refactor; 2x are-you-sure verify',
  phases: [
    { title: 'Find', detail: '4 lenses, capped, high-precision' },
    { title: 'Verify', detail: '2x refutation per finding' },
  ],
}

const DIR = args.dir
const SAGENT = args.sagentRoot

const FIND_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    findings: { type: 'array', maxItems: 6, items: {
      type: 'object', additionalProperties: false,
      properties: {
        file: { type: 'string' },
        line: { type: ['integer', 'null'] },
        kind: { type: 'string', description: 'dead-code | api-misuse | correctness | concurrency | vestigial' },
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
const VERDICT = {
  type: 'object', additionalProperties: false,
  properties: { survives: { type: 'boolean' }, reason: { type: 'string' } },
  required: ['survives', 'reason'],
}

const CTX = `You are auditing the recently-refactored "agent_maze" sagent demo at ${DIR} (sagent
library source at ${SAGENT}). Work with absolute paths; READ the code before claiming anything.
The demo was just rewritten from a hand-rolled ModelRequest lockstep (lock_lockstep.py, now DELETED)
into AUTONOMOUS sagent Agents: each agent is its own agent.run() task acting through tools
(engine.py = reactive Engine on a LOGICAL interaction clock + event log + the press latch; tools.py
= WorldTool/CommsTool/SpawnTool; arena.py = one arm, concurrent tasks + a shutdown barrier;
capture.py = 4 arms + metrics + event-stream web/data.js; web/index.html = event-stream replay).
The one mechanic: press(partner) arms a plate naming a partner for PRESS_WINDOW logical interactions;
a lock opens when both plates are armed, each naming the other, two distinct agents on the two
different same-letter plates, within overlapping windows. Be HIGH-PRECISION: only real, actionable
gaps a careful maintainer would fix. Report at most your 5-6 best. Ignore: intentional CLI prints
(noqa'd), the cherry-pick disclosure, and pure style nits.`

const FINDERS = [
  { key: 'dead-code', prompt: `${CTX}
LENS: dead / unreachable code in the NEW modules (engine.py, tools.py, arena.py, capture.py, run.py).
Find unused functions, methods, module constants, imports, params never read; unreachable branches;
helpers defined but never called. grep the whole ${DIR} tree to prove each is genuinely unused
(check it isn't a Tool-protocol attribute, a test entry, or referenced from web/).` },
  { key: 'api-misuse', prompt: `${CTX}
LENS: sagent API correctness (the auth="api" class of bug). For EVERY sagent symbol / class / kwarg /
attribute the new code uses — Agent(model=,system=,tools=,max_tool_call_rounds=), agent.run(),
agent.shutdown(), ToolResult, AgentSendQueuedMessage, agent_label_var(.set/.get), agent_registry,
target.runtime.inbox.push_back, json_freeze/JSON, Model, Anthropic.from_key, model.close, the Tool
protocol attributes — verify it actually exists in ${SAGENT} with the right name/signature and is
used correctly. grep the sagent source to confirm. Flag anything nonexistent, deprecated, or misused.` },
  { key: 'concurrency', prompt: `${CTX}
LENS: correctness + concurrency of the engine/arena. Scrutinize: the press latch & open-check in
engine.py (races, the armed-expiry math, re-check on arrival, leaving-plate drops arm); arena.py's
concurrency (does engine.lock actually serialize all mutations? is the shutdown barrier correct —
agent.shutdown() + cancel + gen.aclose, no events after solve?); the spawn-ack gap (a child's first
tool call before it's registered in world.agents -> _aid() None?); capture metrics (cost/lock None
handling, pick() best/worst logic). Flag concrete bugs with the scenario that triggers them.` },
  { key: 'vestigial-web', prompt: `${CTX}
LENS: vestigial/stale + the webpage. Find docstrings/comments/README/WORKLOG that still reference
removed things (lock_lockstep, "ticks"/"per-tick", the old 4-action MOVE/SPAWN/PRESS/SEND model,
"pressed on the same turn") now that it's autonomous; leftover TODO/FIXME. THEN check web/index.html's
event-stream replay for bugs: stateUpTo reconstruction, move interpolation edge cases, the broadcast
(to==='all') arrow path, a message whose src/dst has no position yet, genealogy birth-time keying,
maxLen/idx bounds. grep web/ + the .py to confirm each.` },
]

phase('Find')
const raw = (await parallel(FINDERS.map(f => () =>
  agent(f.prompt, { label: `find:${f.key}`, phase: 'Find', schema: FIND_SCHEMA })
))).filter(Boolean).flatMap(r => r.findings)

const seen = new Set(); const found = []
for (const fd of raw) {
  const k = (fd.file + '|' + fd.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()).slice(0, 120)
  if (seen.has(k)) continue
  seen.add(k); found.push(fd)
}
log(`finders surfaced ${raw.length} raw, ${found.length} deduped; 2x verifying each`)

phase('Verify')
const vp = (fd, n) => `${CTX}
ADVERSARIAL VERIFICATION pass ${n} of 2 ("are you sure?"). A finder claims this gap:
  file: ${fd.file}  line: ${fd.line}  kind: ${fd.kind}  severity: ${fd.severity}
  title: ${fd.title}
  detail: ${fd.detail}
  fix: ${fd.suggested_fix}
Try HARD to REFUTE it: read ${fd.file} and grep ${DIR}/${SAGENT}. It survives ONLY if it is a real,
actionable issue whose fix is correct and safe. Default survives=false if it's a false positive,
intentional, already-handled, or you are uncertain.`

const verified = await parallel(found.map(fd => () =>
  parallel([1, 2].map(n => () =>
    agent(vp(fd, n), { label: `verify:${fd.kind}#${n}`, phase: 'Verify', schema: VERDICT })
  )).then(votes => {
    const v = votes.filter(Boolean)
    return { ...fd, survives: v.length === 2 && v.every(x => x.survives), votes: v }
  })
))
const confirmed = verified.filter(x => x && x.survives)
const dropped = verified.filter(x => x && !x.survives)
log(`CONFIRMED ${confirmed.length} / dropped ${dropped.length}`)
return {
  confirmed: confirmed.map(({ votes, ...f }) => f),
  dropped: dropped.map(f => ({ file: f.file, title: f.title, why: (f.votes[0] && f.votes[0].reason) || 'refuted' })),
}
