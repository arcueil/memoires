export const meta = {
  name: 'plan-adversarial-review',
  description: 'Adversarially review the agent_maze autonomous-refactor design plan; 2x verify each concern',
  phases: [
    { title: 'Critique', detail: '4 lenses: mechanic, metrics/headline, recording/replay, robustness' },
    { title: 'Verify', detail: '2x are-you-sure per concern' },
  ],
}

const PLAN = args.plan
const DIR = args.dir
const SAGENT = args.sagentRoot

const FIND_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    findings: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      properties: {
        lens: { type: 'string' },
        title: { type: 'string' },
        problem: { type: 'string', description: 'the concrete gap/flaw and why it matters' },
        recommendation: { type: 'string', description: 'specific change to the plan' },
        severity: { type: 'string', description: 'low | med | high' },
      },
      required: ['lens', 'title', 'problem', 'recommendation', 'severity'],
    }},
    headline_recommendation: { type: ['string', 'null'], description: 'only the metrics lens fills this: the single best dashboard headline number + why' },
  },
  required: ['findings', 'headline_recommendation'],
}
const VERDICT = {
  type: 'object', additionalProperties: false,
  properties: { survives: { type: 'boolean' }, reason: { type: 'string' } },
  required: ['survives', 'reason'],
}

const BASE = `You are adversarially reviewing a DESIGN PLAN (not code yet) for refactoring the
"agent_maze" sagent demo. The plan is at ${PLAN} — READ IT FIRST (absolute path; cwd is unrelated).
Ground every critique in the ACTUAL code: the maze/world at ${DIR}/world.py, the current engine
${DIR}/lock_lockstep.py, and the deleted comms prototype (\`git -C ${DIR}/.. show HEAD:examples/agent_maze/comms.py\`
and \`...:examples/agent_maze/sim.py\`). The sagent library is at ${SAGENT}.
Context: the demo compares decentralized (mesh: any-to-any + broadcast) vs centralized (tree: hub
relay) agent coordination on a paired-lock maze. The redesign drops global turns; agents are
autonomous; a lock opens via press(partner=id) with overlapping TTL windows. Be HIGH-PRECISION and
CONCRETE — only real design gaps a careful engineer would fix before building.`

const LENSES = [
  { key: 'mechanic', prompt: `${BASE}
LENS: mechanic soundness. Can the maze be solved (or the metric gamed) WITHOUT real communication,
despite partner-naming + TTL? Hunt for degenerate/cheat strategies (like the dead-end camping the
designer already caught). Check the actual maze layout in world.py: how many plates/locks, are
agent ids guessable at small scale, can two agents collide, can an agent name a partner it never
talked to? Does the TTL actually force a handshake, or can blind retry win? Is mesh's advantage
real or trivially "broadcast once"? Stress the open-criteria against the real grid.` },
  { key: 'metrics', prompt: `${BASE}
LENS: metrics + the HEADLINE number (the designer is explicitly unsure here). The plan proposes
"total interactions to solve" as the headline. Critique it: is it honest, legible, gameable, and
does it cleanly separate mesh from tree? Compare candidates (total interactions, messages-to-solve,
failed-press attempts, messages-per-lock, tokens/$ cost, wall-clock). Are we recording ENOUGH to
compute every claim AND to be robust to gaming? What metric is MISSING (e.g. does a non-solving
tree run even have a "to-solve" number — what headlines a FAILURE)? Fill headline_recommendation
with the single best dashboard number + rationale, and note the 2-3 supporting stats.` },
  { key: 'recording', prompt: `${BASE}
LENS: event recording + replay completeness. The plan's event schema {seq,t,agent,kind,payload}
drives BOTH the metrics AND the webpage replay (maze animation, message arrows, spawn genealogy,
TTL countdown/overlap viz). Is anything needed by the replay or a metric NOT captured? Check: can
the genealogy (who-spawned-whom-when) be rebuilt? can the TTL overlap moment be shown? are relayed
(tree) messages distinguishable from direct? are invalid/expired presses recorded with reason? is
agent perception state replayable? Find unrecorded info the viz/metrics would silently need.` },
  { key: 'robustness', prompt: `${BASE}
LENS: robustness, termination, concurrency, cost, capture-reproducibility. The plan uses wall-clock
TTL + autonomous concurrent agents + "stop on first solve" + a global interaction budget + a
cherry-picked capture. Find failure modes: TTL fragility vs LLM latency; async state races (two
agents mutate world state concurrently — is the serialization sound? can a lock open on a stale
read?); termination correctness (stop-on-first-solve with concurrent tasks still running — clean
shutdown? half-finished events?); cost runaway (free-running agents); non-determinism making the
cherry-pick flaky or dishonest; deadlock (an agent holds armed forever waiting a partner).` },
]

phase('Critique')
const results = (await parallel(LENSES.map(l => () =>
  agent(l.prompt, { label: `critique:${l.key}`, phase: 'Critique', schema: FIND_SCHEMA })
))).filter(Boolean)
const raw = results.flatMap(r => r.findings)
const headlines = results.map(r => r.headline_recommendation).filter(Boolean)

// dedup by lens+title
const seen = new Set(); const found = []
for (const f of raw) {
  const k = (f.lens + '|' + f.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()).slice(0, 120)
  if (seen.has(k)) continue
  seen.add(k); found.push(f)
}
log(`critiques: ${raw.length} raw, ${found.length} deduped; verifying each 2x`)

phase('Verify')
const vp = (f, n) => `${BASE}
ADVERSARIAL VERIFICATION pass ${n} of 2 ("are you sure?"). A reviewer raised this concern about the PLAN:
  lens: ${f.lens}  severity: ${f.severity}
  title: ${f.title}
  problem: ${f.problem}
  recommendation: ${f.recommendation}
Try HARD to REFUTE it: is it ALREADY handled by the plan (re-read ${PLAN}), a misreading, out of
scope, or not worth a plan change? It survives ONLY if it is a real, important design gap whose
recommendation is sound. Default survives=false if uncertain or already-addressed.`

const verified = await parallel(found.map(f => () =>
  parallel([1, 2].map(n => () =>
    agent(vp(f, n), { label: `verify:${f.lens}#${n}`, phase: 'Verify', schema: VERDICT })
  )).then(votes => {
    const v = votes.filter(Boolean)
    return { ...f, survives: v.length === 2 && v.every(x => x.survives), votes: v }
  })
))
const confirmed = verified.filter(x => x && x.survives)
const dropped = verified.filter(x => x && !x.survives)
log(`CONFIRMED ${confirmed.length} / dropped ${dropped.length}`)
return {
  confirmed: confirmed.map(({ votes, ...f }) => f),
  dropped: dropped.map(f => ({ lens: f.lens, title: f.title, why: (f.votes[0] && f.votes[0].reason) || 'refuted' })),
  headline_recommendations: headlines,
}
