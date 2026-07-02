export const meta = {
  name: 'full-review-fix-recs',
  description: 'Full review + in-place fix of all recs, per page: correct the why/moves/verdict errors the audit found (backwards mechanisms, wrong formulas, mis-attached moves, over-broad ✗), keep reliable verdicts, drop nothing',
  phases: [{ title: 'ReviewFix', detail: 'one agent per page fixes its recs' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const PAGES = ["CC-geometry-sampling","CC-priors-identifiability","CC-model-evaluation","CC-convergence-diagnostics",
  "regression","hierarchical-multilevel","mixture","gaussian-process","time-series-state-space","spatial-areal",
  "latent-factor","ode-dynamical","measurement-error-missing","sparse-shrinkage"]

const results = await parallel(PAGES.map(pg => () => agent(
`Full review + FIX of the recommendation layer on one page. Read ${ROOT}/dist/target_sample/${pg}.md — its "## Practical" section has bidirectional recs, each: a ✓works/✗doesn't verdict + \`why:\` + \`conditions:\` + \`tier:\` + \`source:\` + \`efficacy:\` + \`moves:\`.

A cross-model spot-audit found ~22% of recs contain a genuine error, CONCENTRATED in the fast-generated \`why:\` and \`moves:\` (verdicts mostly fine). Target these exact failure modes:
- **why:** backwards mechanisms, wrong formulas, wrong directions, or a \`why\` that CONTRADICTS its own ✓/✗ verdict or the rec's statement (real examples caught: "underdetermined N<M constrains σ *away from* zero" [wrong: σ→0]; "KL to a point mass = τ" [wrong: infinite]; "QR-rotated *rows*" [wrong: QR orthogonalizes columns]; "deeper levels aggregate more data → CP" [backwards]).
- **moves:** a move that contradicts the verdict, or an irrelevant/mis-attached move.
- **verdict (rare):** a ✓ that is actually a warned-against/risky practice, or a ✗ stated too broadly (fails only in the narrow \`conditions\` but asserted generally).
- **efficacy:** numbers that don't match the verdict.

Correct each error IN PLACE. RULES: (1) preserve EVERY rec — drop none; (2) keep correct recs VERBATIM — only edit what's genuinely wrong; (3) fix by correcting the \`why\`/\`moves\`/wording, not by deleting content; (4) flip a verdict only if it's genuinely wrong; (5) be a careful Bayesian statistician — don't introduce NEW errors.

Write ${ROOT}/catalog/_intermediate/recs_fixed/${pg}.md — the COMPLETE corrected "## Practical …" section only (everything from the \`## Practical\` header to end of file), nothing before it. Return one line: "${pg}: <n_recs> recs, <n_fixed> fixed".`,
  { label: `fix:${pg.slice(0,16)}`, phase: "ReviewFix" }
)))
log(`rec review+fix done: ${results.filter(Boolean).length}/${PAGES.length}`)
return { done: results.filter(Boolean).length }
