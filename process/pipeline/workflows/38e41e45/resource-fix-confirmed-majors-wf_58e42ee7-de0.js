export const meta = {
  name: 'resource-fix-confirmed-majors',
  description: 'Constructive pass: for each of the 105 confirmed-major claims, propose the fix (re-source / downgrade / de-fabricate / correct / backfill-needed) — proposals only, not applied',
  phases: [{ title: 'Fix', detail: 'one fixer per confirmed-major claim' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const DIR = ROOT + "/catalog/_intermediate/resourcing_in"
const OUT = ROOT + "/catalog/_intermediate/resourcing_out"
const TALLY = ROOT + "/catalog/_intermediate/verify_tally.json"
const N = 105
const SCHEMA = {
  type: "object",
  required: ["id","proposed_outcome","proposed_tier","fixes","corrected_statement","needs_jp","summary"],
  properties: {
    id: { type: "string" },
    proposed_outcome: { type: "string", enum: ["re-sourced","downgraded","corrected","de-fabricated","backfill-needed","mixed","keep"] },
    proposed_tier: { type: "string", description: "e.g. established -> candidate, or established (keep)" },
    found_sources: { type: "array", items: { type: "object", properties: { uid:{type:"string"}, url:{type:"string"}, establishes:{type:"string"} } } },
    fixes: { type: "array", items: { type: "object", required: ["issue","resolution"], properties: {
      issue: { type: "string" }, resolution: { type: "string", enum: ["re-source","downgrade","de-fabricate","correct","backfill-needed","keep"] }, detail: { type: "string" } } } },
    corrected_statement: { type: "string", description: "a proposed corrected statement if the headline over-claims; else empty" },
    needs_jp: { type: "boolean", description: "true if the fix is a genuine judgment call needing the maintainer" },
    summary: { type: "string" },
  },
}
const jobs = Array.from({ length: N }, (_, i) => i)
const results = await parallel(jobs.map(i => () => agent(
`You are a Bayesian statistician fixing a catalog claim that an adversarial review + independent verification CONFIRMED has a major problem. Propose the fix — do NOT edit any catalog file; write a proposal.

Read ${TALLY} -> result.confirmed_major[${i}] for the id, surviving_issues (the confirmed problems), imported_assertions, proposed_tier_change. Then read ${DIR}/<id>.json for its \`candidates\` (forum threads that MIGHT ground the imported knowledge) and \`raw_sources\`. Read ${ROOT}/dist/claims/<id>.md (the entry). Read the most promising 2-4 candidate rawpaths to check whether any genuinely establishes the imported knowledge (a thread merely ASKING does not count; you need a credible contributor AFFIRMING it).

For EACH surviving issue, choose a resolution (the re-source-don't-delete policy):
- re-source: a candidate genuinely establishes the (properly nuanced) knowledge → re-attribute; record found_sources {uid, url, establishes} and GRAFT the caveat the import flattened.
- downgrade: no corpus source establishes it → it is folklore/candidate, not established → tier down.
- de-fabricate: a fabricated quote/number/figure → say what to remove/correct.
- correct: a real conceptual/statistical error → propose the corrected wording.
- backfill-needed: the ## Evidence block is empty (BACKFILL PENDING) → the fix is to backfill, flag it (don't fabricate).
- keep: on reflection this specific point is actually fine.

Write ${OUT}/<id>.json with: { id, proposed_outcome, proposed_tier, found_sources:[...], fixes:[{issue,resolution,detail}], corrected_statement:"<if headline over-claims, else empty>", needs_jp:<bool>, summary }. Set needs_jp=true if it is a genuine judgment call. Return one line: "<id>: <proposed_outcome>, needs_jp=<bool>".`,
  { label: `fix:${i}`, phase: "Fix", schema: SCHEMA }
)))
log(`re-sourcing/fix finished: ${results.filter(Boolean).length}/${N}`)
return { fixes: results.filter(Boolean) }
