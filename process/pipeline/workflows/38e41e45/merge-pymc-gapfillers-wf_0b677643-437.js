export const meta = {
  name: 'merge-pymc-gapfillers',
  description: 'Merge the pymc-L1 gap-filler claims + new model classes into the corpus per receiving page: faithfully format the vetted content as claims/recs, attributed to pymc-labs, staged for append',
  phases: [{ title: 'Merge', detail: 'one agent per receiving page formats its new entries' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
// receiving page -> what new pymc-L1 content belongs there
const TARGETS = [
  {pg:'CC-model-evaluation', want:"Box's-loop / iterative build→check→expand (CLAIM), forward-sampling-the-prior (CLAIM), LOO/PSIS + elpd_diff decision rule, stacking vs pseudo-BMA+ vs equal-weights, LOO-PIT calibration, model-comparison decision procedure"},
  {pg:'CC-priors-identifiability', want:"maximum-entropy priors (CLAIM), prior-data-conflict as a diagnostic (CLAIM), the concrete weakly-informative default prior MENU per parameter type, prior-elicitation (SHELF/PreliZ/roulette/maxent), prior strategy decision procedure"},
  {pg:'CC-geometry-sampling', want:"mean-field vs full-rank VI approximating family (CLAIM), DADVI (deterministic ADVI), samplers/backends (nutpie, numpyro) as a library-note"},
  {pg:'regression', want:"BART as a model class (CLAIM) + its regularization knobs, hurdle/zero-inflated decision, Tobit (censored-at-0), ordinal regression + cutpoint ordering, quantile regression (asymmetric-Laplace), robust Student-t regression, instrumental-variables + front-door (causal identification)"},
  {pg:'time-series-state-space', want:"structural time-series additive decomposition (CLAIM), GARCH / conditional volatility, seasonality encodings (Fourier vs sum-to-zero), GP time-series kernels"},
  {pg:'measurement-error-missing', want:"censored vs truncated as distinct likelihoods (CLAIM), pm.Censored, robust/contamination likelihoods"},
  {pg:'sparse-shrinkage', want:"Laplace/LASSO prior, spike-and-slab (exact zeros), R2D2 prior (variance-explained)"},
]
const results = await parallel(TARGETS.map(t => () => agent(
`Merge the relevant pymc-L1 (human-curated, vetted) content into ONE catalog page as new entries. Read the source proposals ${ROOT}/dist/pymc_L1/CLAIMS.md and ${ROOT}/dist/pymc_L1/RECS.md, and the target page ${ROOT}/dist/target_sample/${t.pg}.md (to match format + avoid duplicating what's already there).

Select the pymc-L1 items relevant to THIS page: ${t.want}

Format each as a proper entry matching the page's existing style:
- **CLAIMS** (mid-level principles): \`### C? · <statement> 🟢\` + **Statement.** + **Nuance.** + **Conditions.** + **Tier.** 🟢 established (source: pymc-labs L1, human-curated) + **Sources.** pymc-labs:<skill>. Give it a fresh C-id not already used on the page.
- **RECS**: \`**✓/✗ <id>** · for <model+setup> → <technique> works/doesn't\` + why + conditions + tier 🟢 (source: pymc-labs) + \`efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}\`.

RULES: **faithful transcription** — carry pymc's vetted specifics (formulas, thresholds, API names) verbatim; do NOT invent numbers or add mechanisms beyond the pymc source (this content is vetted — preserve it, don't embellish). Attribute everything to pymc-labs. Skip anything already covered on the page.

Write your formatted additions to ${ROOT}/catalog/_intermediate/merge/${t.pg}.md (claims first under a '## CLAIMS to append' header, then '## RECS to append'). Return one line: "${t.pg}: <n_claims> claims, <n_recs> recs".`,
  { label:`merge:${t.pg.slice(0,14)}`, phase:"Merge" }
)))
log(`gap-filler merge staged: ${results.filter(Boolean).length}/${TARGETS.length} pages`)
return { done: results.filter(Boolean).length }
