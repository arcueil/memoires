export const meta = {
  name: 'full-review-stage1-established',
  description: 'Stage 1: adversarial review of all 273 established-tier claims, each by its best-matched neutral domain lens; emits verdict + imported_assertions for re-sourcing',
  phases: [{ title: 'Review', detail: 'one lens-matched reviewer per established claim' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const MANIFEST = ROOT + "/catalog/_intermediate/review_manifest.json"
const OUT = ROOT + "/catalog/_intermediate/review_out"
const N = 273
const SCHEMA = {
  type: "object",
  required: ["id","verdict","severity","critique","proposed_tier_change","imported_assertions"],
  properties: {
    id: { type: "string" },
    verdict: { type: "array", items: { type: "string", enum: ["clean","over-claimed","mis-attributed","folklore","grade-mismatch","conceptually-sloppy"] } },
    severity: { type: "string", enum: ["clean","minor","major","blocker"] },
    critique: { type: "string" },
    proposed_tier_change: { type: "string" },
    imported_assertions: { type: "array", items: { type: "object", required: ["phrase","issue"], properties: {
      phrase: { type: "string", description: "the specific assertion in the entry made BEYOND its cited source" },
      issue: { type: "string", description: "why it is unsupported / where it over-reaches" } } } },
  },
}
const idxs = Array.from({ length: N }, (_, i) => i)
const results = await parallel(idxs.map(i => () => agent(
`Read ${MANIFEST} and take entry index [${i}] (0-based list). It has: id, tier (established), lens_desc (YOUR persona), observed, structure, raw_sources (local thread/case-study JSONs).

YOU ARE: ${"${entry.lens_desc}"} — but read the actual lens_desc from the manifest entry. You are an exacting, adversarial reviewer of a distilled knowledge catalog. You are critical of: (a) OVER-CLAIMING beyond the evidence; (b) FOLKLORE — confident specifics (numbers, mechanisms) stated as fact without an experiment or on single-source/single-platform evidence; (c) MIS-ATTRIBUTION — attributing a position to a source that does not actually show it; (d) CONCEPTUAL SLOPPINESS — conflations, imprecise probabilistic language; (e) TIER INFLATION — 'established' on assertion/weak evidence. You do NOT manufacture criticism: a precise, well-scoped, evidence-matched claim is ["clean"] even if bold. Every criticism MUST cite specifics from the entry.

Read ${ROOT}/dist/claims/<id>.md (the entry: tier, evidence{kind,strength}, statement, naive_version, nuance, conditions, ## Evidence bullets). Read the listed raw_sources (${ROOT}/<rawpath>) to verify quotes where you can (Discourse JSON: post_stream.posts[] with username/post_number/cooked; betanalpha case-study JSON: full body). The core check: does the statement/nuance claim MORE than the ## Evidence + the actual source support? Does the tier match evidence{kind,strength}?

Then WRITE ${OUT}/<id>.json (use the entry's id) with:
  { "id", "verdict":[...], "severity":"clean|minor|major|blocker", "critique":"specific, quote the offending phrase",
    "proposed_tier_change":"e.g. established -> candidate, or none",
    "imported_assertions":[ {"phrase":"<assertion made beyond the cited source>", "issue":"<why unsupported>"} ] }
imported_assertions is THE routing field — list every specific claim/number/mechanism asserted beyond what the source shows (empty [] if none). Return one line: "<id>: <severity>, <n_imports> imports".`,
  { label: `rev:${i}`, phase: "Review" }
)))
log(`stage-1 review finished: ${results.filter(Boolean).length}/${N}`)
return { done: results.filter(Boolean).length }
