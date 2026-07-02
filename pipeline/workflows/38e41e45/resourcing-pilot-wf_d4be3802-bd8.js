export const meta = {
  name: 'resourcing-pilot',
  description: 'Re-sourcing pilot: for 3 flagged imported assertions, adjudicate whether the corpus actually establishes them (→ re-attribute + graft nuance) or not (→ downgrade)',
  phases: [{ title: 'Resource', detail: 'one agent per flagged import' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const DIR = ROOT + "/catalog/_intermediate/resource_pilot"
const IDS = ["marginalize-discrete--rao-blackwell-hmc","inv-gamma--autodiff-division-cost","cauchy--silent-bias-at-treedepth-10"]
const SCHEMA = {
  type: "object",
  required: ["id","outcome","found_source","corrected_claim","nuance_added","proposed_tier","reasoning"],
  properties: {
    id: { type: "string" },
    outcome: { type: "string", enum: ["re-sourced","partial","downgrade"] },
    found_source: { type: ["object","null"], properties: { uid:{type:"string"}, url:{type:"string"}, establishes:{type:"string"}, strength:{type:"string"} } },
    corrected_claim: { type: "string", description: "the properly-nuanced replacement claim grounded in the found source; empty if downgrade" },
    nuance_added: { type: "string", description: "the caveat the import flattened (e.g. the energy-gap exception for HMC-discrete)" },
    proposed_tier: { type: "string" },
    reasoning: { type: "string" },
  },
}
const results = await parallel(IDS.map(id => () => agent(
`You are a Bayesian statistician (HMC geometry / computational stats). A distilled catalog entry made an assertion NOT supported by its originally-cited source ("imported knowledge"). Your job: decide whether the FORUM CORPUS actually establishes it — if so re-attribute it properly (with the nuance the import flattened); if not, recommend downgrading it to candidate/folklore.

Read ${DIR}/${id}.json — it has \`imported\` (the assertion) and \`candidates\` (top forum threads by semantic similarity, each {uid, title, rawpath, replies, accepted, ...}). Read the most promising 3-5 candidates' rawpath (a Discourse JSON: post_stream.posts[], each post has username, post_number, cooked/raw; slug+id → URL https://discourse.<forum>/t/<slug>/<id>; forum: stan=discourse.mc-stan.org, pymc=discourse.pymc.io, pyro=forum.pyro.ai).

CRITICAL JUDGEMENT:
- A thread merely ASKING about the topic does NOT establish anything. You need a post where a credible contributor AFFIRMS the claim with reasoning/evidence.
- Preserve nuance: if the corpus establishes a MORE CAVEATED version than the import (e.g. "HMC can't sample discrete PARAMETERS, but a hard if-else cutoff is sometimes traversable when the energy gap is small, and continuous-latent/marginalization makes discrete models HMC-able"), the corrected_claim must carry that caveat — do not re-import a flattened over-claim.
- Be honest: if no candidate genuinely establishes the imported assertion, outcome = "downgrade" (found_source=null), and say what the honest status is (candidate / folklore-to-verify / just wrong).

Return:
- outcome: re-sourced (a real source establishes it) / partial (establishes a weaker/caveated version) / downgrade (no corpus source).
- found_source: {uid, url, establishes (what the source ACTUALLY says, short), strength} or null.
- corrected_claim: the properly-nuanced replacement grounded in the source (or "" if downgrade).
- nuance_added: the caveat the original import flattened.
- proposed_tier: e.g. "established -> supported" or "established -> candidate".
- reasoning: cite the specific post(s) you relied on.`,
  { label: `rsrc:${id.slice(0,20)}`, phase: "Resource", schema: SCHEMA }
)))
return { resourcing: results.filter(Boolean) }
