export const meta = {
  name: 'mine-divergence-moves',
  description: 'Step 1 of the edges-embedding build: CTA-extract a move-graph from each of 60 divergence/HMC-geometry forum threads → move-instances for the move-graph induction',
  phases: [{ title: 'Mine', detail: 'one agent per thread: extract the expert investigation as a move-graph' }],
}

const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const UIDS = (args && args.uids) || []

const SCHEMA = {
  type: "object", required: ["thread_uid","route","entry_situation","moves"],
  properties: {
    thread_uid: { type: "string" },
    on_topic: { type: "boolean", description: "false if this thread isn't really a divergence/geometry investigation (e.g. pure software) — then leave moves empty" },
    route: { type: "string", enum: ["lookup","recall","reason","none"] },
    entry_situation: { type: "string", description: "the recognizable situation a question would land on (the entry node), in observation terms (e.g. 'divergences concentrated in the tail of a hierarchical scale parameter')" },
    qualifiers: { type: "array", items: { type: "string" }, description: "semantic qualifiers for routing (e.g. hierarchical, funnel, small-data, tail-concentrated, post-warmup)" },
    live_hypotheses: { type: "array", items: { type: "string" } },
    moves: { type: "array", items: { type: "object", required: ["action","discriminates","expected_findings"], properties: {
      trigger: { type: "string", description: "the observed pattern that makes this move apply" },
      action: { type: "string", description: "the probe/technique to run (coarse — the leaf carries specifics)" },
      discriminates: { type: "string", description: "which hypotheses this separates" },
      expected_findings: { type: "string", description: "what you expect to see under each hypothesis (RPD expectancies)" },
      branches: { type: "array", items: { type: "object", properties: { if_observe: {type:"string"}, then: {type:"string"} } } },
      leaf: { type: "string", description: "the diagnosis/fix this resolves to, if terminal" },
    } } },
    terminal: { type: "string", description: "the resolution the thread converged to (the gold)" },
  },
}

const results = await pipeline(
  UIDS,
  (uid) => {
    const [forum, id] = uid.split(":")
    return agent(
`Read the forum thread ${ROOT}/raw/${forum}/${id}.json — a real expert investigation of a divergence / HMC-geometry problem (problem → attempts → correction → resolution). Using the Critical Decision Method (probe the decision points), extract the EXPERT'S INVESTIGATION as a MOVE-GRAPH — "how to investigate," NOT "the final answer."

Return: route (lookup = answer is a known fact to retrieve; recall = a near-identical prior case; reason = genuine path-finding; none = off-topic/software); the entry_situation (the recognizable observation-level state a future question would match — this is the retrieval key); semantic qualifiers; the live hypotheses; the ordered MOVES (each: the trigger pattern, the coarse action/probe, what it discriminates, the EXPECTED FINDINGS under each hypothesis, and branches if-observe→then); and the terminal resolution.

Read the WHOLE thread including failed attempts — the failure branches are the most valuable part. Keep moves COARSE (e.g. "locate the divergences", "tighten the scale prior", "reparameterize non-centered"); specifics go in the leaf. If the thread is not actually a divergence/geometry investigation, set on_topic=false, route="none", and leave moves empty.`,
      { label: `mine:${uid}`, phase: "Mine", schema: SCHEMA }
    )
  }
)

const ok = results.filter(r => r && r.on_topic !== false && (r.moves||[]).length)
const byRoute = {}
for (const r of ok) byRoute[r.route] = (byRoute[r.route]||0)+1
return {
  n_threads: results.filter(Boolean).length,
  n_on_topic: ok.length,
  total_moves: ok.reduce((s,r)=>s+(r.moves||[]).length, 0),
  by_route: byRoute,
  graphs: ok,
}
