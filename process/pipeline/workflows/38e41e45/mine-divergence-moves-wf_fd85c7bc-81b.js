export const meta = {
  name: 'mine-divergence-moves',
  description: 'Step 1 of the edges-embedding build: CTA-extract a move-graph from each of 60 divergence/HMC-geometry forum threads (uids hardcoded) → move-instances',
  phases: [{ title: 'Mine', detail: 'one agent per thread: extract the expert investigation as a move-graph' }],
}

const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const UIDS = ["stan:25781","stan:35053","pymc:16279","stan:97","stan:16822","stan:2235","stan:17099","stan:8684","stan:1436","pymc:6872","stan:23311","pymc:11935","stan:27791","stan:26964","stan:38601","stan:21119","stan:41026","stan:13841","stan:22671","stan:4226","stan:10131","stan:8383","pymc:4713","pyro:5045","stan:32734","pymc:12333","pymc:13711","stan:4358","stan:9202","stan:8059","stan:24155","stan:22548","stan:27064","stan:29410","stan:19357","stan:34158","stan:11569","stan:18700","stan:19024","pyro:4366","stan:9524","stan:12033","stan:22601","pymc:7817","stan:2104","stan:1526","stan:39200","stan:14838","stan:7549","stan:11697","stan:21862","stan:9727","pymc:5655","stan:16973","pymc:16905","stan:20330","stan:10759","stan:6346","stan:349","stan:25770"]

const SCHEMA = {
  type: "object", required: ["thread_uid","route","entry_situation","moves"],
  properties: {
    thread_uid: { type: "string" },
    on_topic: { type: "boolean", description: "false if not really a divergence/geometry investigation (e.g. pure software) — then leave moves empty" },
    route: { type: "string", enum: ["lookup","recall","reason","none"] },
    entry_situation: { type: "string", description: "the recognizable observation-level state a future question would match (the retrieval key), e.g. 'divergences concentrated in the tail of a hierarchical scale parameter'" },
    qualifiers: { type: "array", items: { type: "string" }, description: "semantic qualifiers for routing (hierarchical, funnel, small-data, tail-concentrated, post-warmup, ...)" },
    live_hypotheses: { type: "array", items: { type: "string" } },
    moves: { type: "array", items: { type: "object", required: ["action","discriminates","expected_findings"], properties: {
      trigger: { type: "string" }, action: { type: "string", description: "coarse probe/technique; specifics go in leaf" },
      discriminates: { type: "string" }, expected_findings: { type: "string", description: "expected observation under each hypothesis (RPD expectancies)" },
      branches: { type: "array", items: { type: "object", properties: { if_observe: {type:"string"}, then: {type:"string"} } } },
      leaf: { type: "string" },
    } } },
    terminal: { type: "string", description: "the resolution the thread converged to" },
  },
}

const results = await pipeline(
  UIDS,
  (uid) => {
    const [forum, id] = uid.split(":")
    return agent(
`Read the forum thread ${ROOT}/raw/${forum}/${id}.json — a real expert investigation of a divergence / HMC-geometry problem (problem -> attempts -> correction -> resolution). Using the Critical Decision Method, extract the EXPERT'S INVESTIGATION as a MOVE-GRAPH — "how to investigate," NOT "the final answer."
Return: route (lookup = answer is a known fact to retrieve; recall = near-identical prior case; reason = genuine path-finding; none = off-topic/software); the entry_situation (the observation-level state a future question would match — the retrieval key); qualifiers; live_hypotheses; the ordered MOVES (each: trigger pattern, coarse action, what it discriminates, EXPECTED FINDINGS per hypothesis, branches if-observe->then); and the terminal resolution.
Read the WHOLE thread including failed attempts — the failure branches are the most valuable part. Keep moves COARSE ("locate the divergences", "tighten the scale prior", "reparameterize non-centered"); specifics go in the leaf. If not actually a divergence/geometry investigation, set on_topic=false, route="none", moves empty.`,
      { label: `mine:${uid}`, phase: "Mine", schema: SCHEMA }
    )
  }
)

const ok = results.filter(r => r && r.on_topic !== false && (r.moves||[]).length)
const byRoute = {}
for (const r of ok) byRoute[r.route] = (byRoute[r.route]||0)+1
return {
  n_threads: results.filter(Boolean).length, n_on_topic: ok.length,
  total_moves: ok.reduce((s,r)=>s+(r.moves||[]).length, 0), by_route: byRoute, graphs: ok,
}
