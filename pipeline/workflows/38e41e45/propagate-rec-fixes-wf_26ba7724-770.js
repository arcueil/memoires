export const meta = {
  name: 'propagate-rec-fixes',
  description: 'Targeted pattern-sweep of all 459 recs for the specific adjudicated failure types (scale-conflation, fixed-hyperparam geometry, mis-attached moves, backwards mechanisms), fixing the unsampled instances the general pass missed',
  phases: [{ title: 'Sweep', detail: 'one agent per page, targeted at known patterns' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const PAGES = ["CC-geometry-sampling","CC-priors-identifiability","CC-model-evaluation","CC-convergence-diagnostics",
  "regression","hierarchical-multilevel","mixture","gaussian-process","time-series-state-space","spatial-areal",
  "latent-factor","ode-dynamical","measurement-error-missing","sparse-shrinkage"]

const results = await parallel(PAGES.map(pg => () => agent(
`Targeted pattern-sweep of one page's recs. A prior general review left a ~13% residual; audits then pinned down the EXACT recurring failure types below. Hunt for them across EVERY rec on this page (many instances were never sampled) and fix in place. Read ${ROOT}/dist/target_sample/${pg}.md — the "## Practical" section.

THE KNOWN PATTERNS (check every rec against each):
1. **Response-vs-latent scale conflation** — a rec that says a scale-dependent quantity (ICC/VPC, variance decomposition, R², a "single variance") "doesn't work / has no single value" WITHOUT distinguishing the *latent* scale (where it often IS well-defined, e.g. logistic latent residual var = π²/3, probit = 1) from the *response* scale (where it isn't). Fix: add the latent-scale exception; narrow the ✗.
2. **Fixed-hyperparameter geometry mischaracterization** — a rec calling a geometry a "funnel / banana / curvature" pathology when, at FIXED hyperparameters, it is actually ill-conditioning / anisotropy (an elongated ELLIPSOID) — funnels/bananas need the hyperparameter↔latent coupling. Fix the mechanism (and note whitening/Cholesky is the *fix*, not the pathology).
3. **Mis-attached moves** — for each rec, check its 1-3 attached \`moves:\` actually fit THIS failure + verdict. Drop or replace moves that are irrelevant or contradict the verdict.
4. **Backwards mechanism / wrong direction / wrong formula** — re-check each \`why:\` for a reversed causal direction, an inverted knob, or a wrong formula (e.g. σ direction under N<M, KL to a point mass, over-broad fixed percentages).

RULES: preserve EVERY rec (drop none); keep correct recs VERBATIM; fix ONLY genuine instances of the 4 patterns; don't invent new errors; be a careful Bayesian statistician. Write ${ROOT}/catalog/_intermediate/recs_fixed2/${pg}.md — the COMPLETE corrected "## Practical …" section only (from the \`## Practical\` header to EOF). Return one line: "${pg}: <n_recs> recs, <n_fixed> fixed, breakdown by pattern".`,
  { label: `sweep:${pg.slice(0,14)}`, phase: "Sweep" }
)))
log(`pattern-sweep done: ${results.filter(Boolean).length}/${PAGES.length}`)
return { done: results.filter(Boolean).length }
