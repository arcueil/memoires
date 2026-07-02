export const meta = {
  name: 'review-mid-level-claims',
  description: 'Review the 76 synthesized mid-level claims for OVER-GENERALIZATION beyond their subsumed granular claims (the synthesis-specific risk), per model-class page',
  phases: [{ title: 'Review', detail: 'one reviewer per page' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const PAGES = ["CC-geometry-sampling","CC-priors-identifiability","CC-model-evaluation","CC-convergence-diagnostics",
  "regression","hierarchical-multilevel","mixture","gaussian-process","time-series-state-space","spatial-areal",
  "latent-factor","ode-dynamical","measurement-error-missing","sparse-shrinkage"]
const SCHEMA = {
  type: "object",
  required: ["page","claims"],
  properties: {
    page: { type: "string" },
    claims: { type: "array", items: { type: "object", required: ["claim","verdict","note"], properties: {
      claim: { type: "string", description: "the C# id" },
      verdict: { type: "string", enum: ["faithful","over-generalized","tier-inflated","imported"] },
      note: { type: "string", description: "if not faithful: the specific over-reach, quoting the mid-level phrase and what the subsumed granulars actually support" } } } },
  },
}
const results = await parallel(PAGES.map(pg => () => agent(
`Review the SYNTHESIZED mid-level claims on one page for OVER-GENERALIZATION — the risk that a mid-level claim claims MORE than the granular claims it subsumes actually support. You are a Bayesian statistician; be exacting but fair (a faithful synthesis is "faithful", even if bold).

Read ${ROOT}/dist/target_sample/${pg}.md — its "## Claims" section has ~3-7 mid-level claims, each with a **Statement**, **Nuance**, and a "subsumes [id1, id2, ...]" list. For EACH claim, read a few of its subsumed granular claims at ${ROOT}/dist/claims/<id>.md and check: does the mid-level statement/nuance assert anything (a mechanism, a universal, a number, a "never/always") that the subsumed granulars do NOT support? Is the tier justified (best-supported subsumed)?

For each claim return: verdict = faithful | over-generalized | tier-inflated | imported, and (if not faithful) a note quoting the specific over-reach + what the granulars actually support. Most should be "faithful" — only flag genuine over-reach. Return one line: "${pg}: <n> claims, <n_flagged> flagged".`,
  { label: `rev:${pg.slice(0,16)}`, phase: "Review", schema: SCHEMA }
)))
return { reviews: results.filter(Boolean) }
