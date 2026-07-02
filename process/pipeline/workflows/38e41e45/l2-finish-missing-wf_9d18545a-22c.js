export const meta = {
  name: 'l2-finish-missing',
  description: 'Name the 6 R1 clusters whose L2 names were lost to the OOM kill',
  phases: [{ title: 'Name', detail: 'one agent per missing cluster' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const MISSING = (args && args.ids) || [29, 31, 35, 36, 38, 39]
const SCHEMA = {
  type: "object", required: ["cluster_id","topic","summary"],
  properties: {
    cluster_id: { type: "integer" },
    topic: { type: "string" },
    summary: { type: "string" },
    subthemes: { type: "array", items: { type: "string" } },
    coherence: { type: "string", enum: ["tight","mixed","grab-bag"] },
  },
}
const results = await pipeline(
  MISSING,
  (i) => agent(
`Name and summarise one topic cluster of the Bayesian-catalog. Read ${ROOT}/catalog/r1/c${i}.json (size, n_claims/n_techniques, spine = the statements nearest the centroid). Produce: a crisp topic title (<=8 words); a 2-3 sentence summary of the failure-mode / modeling-decision family it covers (the catalog is about failure-path nuance); distinct sub-themes; and a coherence judgement (tight/mixed/grab-bag).`,
    { label: `L2:c${i}`, phase: 'Name', schema: SCHEMA }
  )
)
return { topics: results.filter(Boolean) }