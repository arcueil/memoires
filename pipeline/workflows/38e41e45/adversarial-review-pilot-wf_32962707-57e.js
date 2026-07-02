export const meta = {
  name: 'adversarial-review-pilot',
  description: 'Pilot: a neutral Bayesian-geometry-expert reviewer audits 10 spine claims for over-claiming, sloppiness, mis-attribution, folklore, and tier inflation — grounded in each entry’s own evidence',
  phases: [{ title: 'Review', detail: 'one reviewer per entry' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const FILES = [
  "inv-gamma-beats-gamma-via-autodiff-operator-asymmetry",
  "best-geometry-does-not-imply-best-ess-per-second",
  "cauchy-nuts-correctness-requires-elevated-max-treedepth",
  "high-dim-typical-set-onset-at-d-3",
  "matern-nu-should-be-fixed",
  "forum-c81-when-an-outcome-is-a-proportion-formed-by-aggreg",
  "adapt-delta-reduces-but-cannot-cure-funnel-geometry",
  "casestudy-finnish-horseshoe-slab-regularizes-relevant-slopes-and-identifies-post",
  "casestudy-marginalize-discrete-assignments-before-sampling",
  "more-data-worsens-hmc-under-persistent-degeneracy",
]
const SCHEMA = {
  type: "object",
  required: ["id","verdict","severity","critique","proposed_tier_change","one_line"],
  properties: {
    id: { type: "string" },
    verdict: { type: "array", items: { type: "string", enum: ["clean","over-claimed","mis-attributed","folklore","grade-mismatch","conceptually-sloppy"] } },
    severity: { type: "string", enum: ["clean","minor","major","blocker"] },
    critique: { type: "string", description: "specific, citing the entry's own statement/nuance/evidence; empty-ish if clean" },
    proposed_tier_change: { type: "string", description: "e.g. 'established -> candidate' or 'none'" },
    one_line: { type: "string" },
  },
}
const LENS = `You are a Bayesian statistician with deep expertise in HMC/NUTS posterior geometry, MCMC diagnostics, and computational statistics. You are an exacting, adversarial reviewer of a distilled knowledge catalog. You are critical of: (a) OVER-CLAIMING beyond what the evidence supports; (b) FOLKLORE — confident assertions (especially specific numbers like "1.4x faster", "max_treedepth=20", "D>=3") stated as fact without an experiment or with single-platform/single-model evidence; (c) MIS-ATTRIBUTION — attributing a position to a source the evidence does not actually show; (d) CONCEPTUAL SLOPPINESS — conflations, imprecise probabilistic language; (e) TIER INFLATION — tier 'established' on evidence that is a single assertion or weak. You do NOT manufacture criticism: if an entry is sound, well-scoped, and its tier matches its evidence, your verdict is ["clean"]. Every criticism MUST cite specifics from the entry itself.`

const results = await parallel(FILES.map(stem => () => agent(
`${LENS}

Read ${ROOT}/dist/claims/${stem}.md — the full entry (frontmatter tier + evidence{kind,strength}, statement, naive_version, nuance, conditions, and the ## Evidence bullets that quote the source). You MAY also read a cited source under ${ROOT}/raw/<forum>/<id>.json if you want to verify a specific quote, but the core check is internal: does the statement/nuance claim MORE than the ## Evidence bullets actually support? Does the tier match evidence{kind,strength}?

Review it. Decide:
- verdict: one or more of clean / over-claimed / mis-attributed / folklore / grade-mismatch / conceptually-sloppy.
- severity: clean / minor / major / blocker.
- critique: SPECIFIC — quote the offending phrase from the entry and say why it over-reaches or what the evidence actually supports. If clean, briefly say why it holds.
- proposed_tier_change: e.g. "established -> candidate", or "none".
- one_line: a one-sentence verdict.
Be exacting but fair. A precise, well-scoped, evidence-matched claim is "clean" even if it is bold.`,
  { label: `rev:${stem.slice(0,28)}`, phase: "Review", schema: SCHEMA }
)))
return { reviews: results.filter(Boolean) }
