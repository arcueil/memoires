export const meta = {
  name: 'verify-major-flags',
  description: '2nd are-you-sure: 3 independent different-lens skeptics refute each of the 134 major flags; 2-of-3 majority decides whether a genuine MAJOR problem survives',
  phases: [{ title: 'Verify', detail: '3 refuters per major flag' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const MANIFEST = ROOT + "/catalog/_intermediate/verify_manifest.json"
const OUT = ROOT + "/catalog/_intermediate/verify_out"
const N = 134
const SCHEMA = {
  type: "object",
  required: ["id","survives_major","surviving_issues","refuted_issues","reasoning"],
  properties: {
    id: { type: "string" },
    survives_major: { type: "boolean", description: "true ONLY if a genuine MAJOR problem is independently confirmed against the source" },
    surviving_issues: { type: "array", items: { type: "string" }, description: "the reviewer's points that hold up against the source" },
    refuted_issues: { type: "array", items: { type: "string" }, description: "the reviewer's points that are over-reach / nitpick / wrong" },
    reasoning: { type: "string" },
  },
}
const jobs = []
for (let e = 0; e < N; e++) for (let v = 0; v < 3; v++) jobs.push([e, v])

const results = await parallel(jobs.map(([e, v]) => () => agent(
`Read ${MANIFEST} and take entry index [${e}] (0-based). Fields: id, severity, verify_lens_desc (YOUR persona), original_critique (another reviewer's criticism), imported_assertions, proposed_tier_change, raw_sources.

YOU ARE the persona in that entry's \`verify_lens_desc\` — a DIFFERENT expert than the original reviewer. Your job is the 2nd "are you sure?": independently RE-CHECK the criticism. Reviewers over-flag. **Your DEFAULT is that the entry is acceptable and the criticism is overblown.** You uphold a MAJOR finding ONLY if you can independently confirm, against the SOURCE, that the entry makes a substantive claim its source does not support — i.e. a genuine: mis-attribution (a position/number/mechanism pinned to a source that does not show it), a fabricated number/figure, a real conceptual/statistical error, or 'established' tier resting on an empty/weak evidence block. **Wording nitpicks, hedge-hardening, "single-source" grumbles, and minor imprecision do NOT make a MAJOR — those are minor at most.**

Read ${ROOT}/dist/claims/<id>.md (the entry) and the listed raw_sources (${ROOT}/<rawpath>) to check the original_critique's specific claims against the actual source. Then decide: does a genuine MAJOR problem SURVIVE?

Write ${OUT}/<id>__${v}.json with:
  { "id", "survives_major": <bool>, "surviving_issues": [<reviewer points that hold up>], "refuted_issues": [<reviewer points that are over-reach/nitpick/wrong>], "reasoning": "<cite the source>" }
Be skeptical of the reviewer, fair to the source. Return one line: "<id> v${v}: survives=<bool>".`,
  { label: `vf:${e}.${v}`, phase: "Verify", schema: SCHEMA }
)))
log(`verify agents finished: ${results.filter(Boolean).length}/${jobs.length}`)
return { done: results.filter(Boolean).length }
