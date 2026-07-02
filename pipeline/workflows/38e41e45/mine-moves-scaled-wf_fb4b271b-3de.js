export const meta = {
  name: 'mine-moves-scaled',
  description: 'Milestone-2 scaling: CTA-extract move-graphs from 400 high-engagement multi-topic statistical forum threads → a broad move corpus',
  phases: [{ title: 'Mine', detail: 'one agent per thread (reads its uid from the mining set by index)' }],
}

const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const SET = `${ROOT}/catalog/_intermediate/mining_set_v2.json`
const COUNT = 400
const IDX = Array.from({ length: COUNT }, (_, i) => i)

const SCHEMA = {
  type: "object", required: ["thread_uid","route","entry_situation","moves"],
  properties: {
    thread_uid: { type: "string" },
    topic: { type: "string", description: "the statistical topic (e.g. hierarchical-divergences, mixture-identifiability, GP-priors, ordinal, survival, reparameterization, calibration, ...)" },
    on_topic: { type: "boolean", description: "false if not a real statistical-modeling investigation (pure software/release/feature-request) — then leave moves empty" },
    route: { type: "string", enum: ["lookup","recall","reason","none"] },
    entry_situation: { type: "string", description: "the observation-level state a future question would match (the retrieval key)" },
    qualifiers: { type: "array", items: { type: "string" } },
    live_hypotheses: { type: "array", items: { type: "string" } },
    moves: { type: "array", items: { type: "object", required: ["action","discriminates","expected_findings"], properties: {
      trigger: { type: "string" }, action: { type: "string", description: "coarse probe/technique; specifics in leaf" },
      discriminates: { type: "string" }, expected_findings: { type: "string" },
      branches: { type: "array", items: { type: "object", properties: { if_observe: {type:"string"}, then: {type:"string"} } } },
      leaf: { type: "string" },
    } } },
    terminal: { type: "string" },
  },
}

const results = await pipeline(
  IDX,
  (i) => agent(
`Run this to get your thread: \`python3 -c "import json; print(json.load(open('${SET}'))[${i}]['uid'])"\` — it prints a uid like "stan:1234". Then read ${ROOT}/raw/<forum>/<id>.json (forum = part before ':').
This is a real expert statistical-modeling investigation (problem -> attempts -> correction -> resolution). Using the Critical Decision Method, extract the EXPERT'S INVESTIGATION as a MOVE-GRAPH — "how to investigate," NOT "the final answer."
Return: topic; route (lookup=known fact to retrieve; recall=near-identical prior case; reason=path-finding; none=off-topic/software); entry_situation (the observation-level state a future question matches — the retrieval key); qualifiers; live_hypotheses; ordered MOVES (each: trigger, coarse action, what it discriminates, EXPECTED FINDINGS per hypothesis, branches if-observe->then); terminal resolution.
Read the WHOLE thread including failed attempts. Keep moves COARSE; specifics go in the leaf. If it's not a real statistical investigation (pure software/release/feature-request/announcement), set on_topic=false, route="none", moves empty.`,
    { label: `mine:${i}`, phase: "Mine", schema: SCHEMA }
  )
)

const ok = results.filter(r => r && r.on_topic !== false && (r.moves||[]).length)
const byTopic = {}; for (const r of ok) byTopic[r.topic] = (byTopic[r.topic]||0)+1
return {
  n_threads: results.filter(Boolean).length, n_on_topic: ok.length,
  total_moves: ok.reduce((s,r)=>s+(r.moves||[]).length, 0),
  topics: Object.fromEntries(Object.entries(byTopic).sort((a,b)=>b[1]-a[1]).slice(0,20)),
  graphs: ok,
}
