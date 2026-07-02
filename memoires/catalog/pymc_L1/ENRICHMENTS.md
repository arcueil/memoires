# ENRICHMENTS to graft onto existing entries (21)

### Horseshoe double-funnel sampling pathology + tuning
*📐 portable*

Enrich W3/C1: the horseshoe's spike-at-0 + heavy-tail geometry is a 'double funnel' that is very hard for NUTS -> divergences common; mitigations: target_accept 0.99+, use the regularized (Finnish) horseshoe, or fall back to Laplace if full sparsity isn't needed. Our catalog carries the global-scale FORMULA but not the sampler-difficulty/tuning nuance.

---
### Centered vs non-centered decision rule by data-per-group
*📐 portable*

Add a move/heuristic to the hierarchical section: use NON-centered when data per group is sparse / group variance is small relative to observation noise (funnel regime); CENTERED can be better when there is lots of data per group. We treat NCP as an exact device (C6/K1) but never give the Betancourt data-per-group selection rule.

---
### Few-groups underpooling
*📐 portable*

Add move: with a SMALL number of groups (<5-10) the variance hyperparameter is weakly identified; a broad half-Cauchy underpools -> use a tighter half-Normal(~0.5); with many groups broader scale priors are fine. Enriches partial-pooling (P5) and N3 (which is about little data PER group, a distinct axis from few groups).

---
### GP implementation-choice decision table (n>500 -> HSGP; n<500 -> exact Marginal/Latent since HSGP overhead not justified; >3D -> HSGP scales poorly, use full GP/inducing points; non-stationary -> full GP)
*📐 portable*

Add a selection rec with concrete crossovers: our S2/C3 say 'HSGP for large smooth stationary' but give no n or dimension numbers. New nuance to capture: (a) a lower crossover -- below ~500 pts prefer the exact GP because HSGP is an approximation whose overhead isn't justified; (b) a dimension ceiling -- HSGP cost = product of per-dim m, so it becomes inefficient beyond 2-3D. Both are absent from us.

---
### Mixture PPC with ecdf (clearer than kde for multimodal data) and component-separation check via non-overlapping HDIs
*🔧 PyMC-specific*

Add moves: az.plot_ppc(kind='ecdf') is clearer than kde for multimodal mixture data; assess component separation via non-overlapping HDIs of component means (az.summary hdi). Concrete diagnostic how's attaching to C4/O-recs.

---
### ess_bulk vs ess_tail operational split
*📐 portable*

Concrete instantiation of C5 ('ESS is function-specific'): ArviZ reports ess_bulk (accuracy of posterior mean/median) and ess_tail (accuracy of credible-interval quantiles, usually the smaller/binding one). Add a move to check ess_tail explicitly, not just a single ESS number.

---
### Rank plots are more sensitive than trace plots
*📐 portable*

Add move: prefer az.plot_rank over eyeballing trace plots - rank(-normalized) plots surface between-chain non-uniformity that traces hide (Vehtari 2021). Complements our existing 'Re-examine the raw draws instead of the rendered traceplot' move.

---
### High Pareto-k remediation (K-fold, moment matching, inspect influential points)
*📐 portable*

C4/E2 cover what k-hat MEANS (moment existence, PSIS-LOO 0.7 threshold) but give no remediation. Add moves: for PSIS-LOO k-hat>0.7 points, inspect them as influential outliers, refit with K-fold CV where PSIS fails, or apply moment-matching to salvage the LOO estimate.

---
### az.plot_energy / E-BFMI as a sampler-health check
*🔧 PyMC-specific*

We name E-BFMI in the C2/B3/B7 claim lists but never operationalize it. Add move: az.plot_energy(idata) overlays marginal vs transition energy; poor overlap (low E-BFMI) flags momentum/mass-matrix mismatch (heavy tails), a useful check when divergences persist after reparameterization.

---
### 'Mass matrix contains zeros on diagonal' -> standardize predictors / weakly-informative prior for curvature
*📐 portable*

New rec enriching ST3: zero mass-matrix diagonal = a param's logp gradient is numerically 0 via (a) predictors on wildly different scales -> large-scale gradient underflows -> standardize ALL predictors to unit scale; (b) flat likelihood (empty group / no data) -> replace diffuse prior (Uniform(0,100)) with a weakly-informative one (HalfNormal(1)) to supply soft curvature. Our RP10 only covers dense-metric rescaling, not the standardize/weak-prior fixes.

---
### CP-vs-NCP numeric rule of thumb (~20 obs/group)
*📐 portable*

Add threshold to RP1/RP2/RP3: non-center levels averaging < ~20 observations per group; center levels with many obs per group (likelihood 'pins' the parameter). Our recs give the sparse/dense direction but no numeric cutoff.

---
### Sum-to-zero constraint for non-identifiable categorical/group effects; single-intercept-per-group
*📐 portable*

Enrich the identifiability/collinearity recs (alongside QR): for non-identifiable categorical/group effects — or an intercept-per-predictor redundancy — impose a sum-to-zero constraint (alpha = concat(alpha_raw, -alpha_raw.sum())) or use a single group-intercept + slopes. Our catalog covers QR and reparam but not the sum-to-zero contrast fix.

---
### 'Initial evaluation at starting point failed' / -inf logp — cause taxonomy, debug APIs, and a corrective to ST1
*🔧 PyMC-specific*

Enrich ST1. (a) Add PyMC debug APIs it lacks: `model.point_logps()` / `model.debug()` to pinpoint which RV is -inf. (b) Corrective nuance / mild contradiction: ST1's headline 'forcing a new starting point does NOT work' overstates — pymc splits four causes, two of which ARE start-fixable: jitter pushing a valid param outside a constraint (fix: `init='adapt_diag'`, no jitter) and bad default initvals (fix: `initvals=...`); only data-outside-support and constant-response are truly structural. Scope ST1's 'new start won't help' to the structural sub-case (its own `conditions` already imply this).

---
### VI/Pathfinder can miss multimodality (second VI failure mode)
*📐 portable*

One-line addition to ST5's 'why': beyond variance-underestimation (which ST5 nails), a unimodal q also misses multimodality entirely. Cross-link DM4 (missed well-separated modes) — 'Always validate VI/Pathfinder against MCMC.'

---
### Fake-data simulation / parameter recovery as a distinct pre-real-data check
*📐 portable*

Sharpen the existing 'run on simulated data' move: 'before touching real data on a novel/custom structure → simulate ONE dataset from known parameter values and check the true values fall within posterior intervals; catches specification bugs, non-identifiability, and prior-likelihood conflict.' Explicitly distinguish this lighter single-draw recovery check from full SBC (prior-averaged) — our catalog currently conflates them under 'run on simulated data' (B1 escalates straight to SBC). Note it is most valuable for custom likelihoods, latent-variable models, and complex indexing.

---
### Missing caveats: pm.do gives P(y|do(x)) only WITHIN the assumed graph, and the example estimates ATE from prior predictive not posterior
*📐 portable*

Attach our central caveat to the library-note: (1) pm.do is graph surgery on the *assumed* model - if the graph omits a confounder, the interventional estimate is wrong and diagnostic-silent exactly as CF1/CF3/CF8/SA2 warn; pm.do is not a substitute for getting the marginal-covariate/confounder structure right. (2) The file's 'Causal Effect Estimation' computes ATE via pm.sample_prior_predictive() - for a data-informed effect the model must be FIT first and interventions pushed through the POSTERIOR predictive (SA1/C4: derived quantities through the full generative process). Not a contradiction (pm.do builds the full model, aligning with Betancourt), but the confounding-invisibility and fit-then-intervene caveats are the load-bearing message the pymc file omits.

---
### Proactive gradient-finiteness check for a custom logp
*🔧 PyMC-specific*

Enriches C7/ST2 ('finite logp != finite gradient') with a proactive check: before sampling a custom distribution, compile pytensor.grad(logp, x) and assert np.isfinite over a grid of test points. Turns the ST2 run-time 'Gradient at initial value not finite' failure into a pre-flight test that localizes non-differentiable seams (switch/abs/boundary) in hand-written densities.

---
### BART is fit by Particle Gibbs (PGBART), not HMC/NUTS — HMC geometry diagnostics do not apply
*📐 portable*

Enrich the convergence-diagnostics/geometry material with a scope boundary: because trees are discrete/non-differentiable, BART is sampled by a Particle-Gibbs (PGBART) step, so the catalog's HMC-specific diagnostic suite (divergences, E-BFMI, tree-depth saturation, funnel/NCP reasoning — the bulk of CC-geometry-sampling) is INAPPLICABLE. Convergence is judged on the continuous params (sigma) and the predictions via R-hat/ESS/ppc only. High value: bounds the catalog's near-total HMC-centric worldview with a concrete counterexample model.

---
### Zero-inflated models (ZIP/ZINB/ZIB): two-source-of-zeros structure + psi/mu interpretation
*📐 portable*

C1/B1 only name-drop 'zero-inflation mechanisms'; add a modeling recipe. Draft rec: for count data with more zeros than the base count dist predicts, model as a mixture of a point-mass-at-zero (prob psi = 'structural' zeros) + a count process (Poisson/NegBin/Binomial) that itself emits sampling zeros. Interpret psi=P(structural zero), mu=count-process mean; observed zeros come from BOTH sources. Regress both: logit(psi)=X.b_psi, log(mu)=X.b_mu. Use the NegBin variant when also overdispersed. PyMC: pm.ZeroInflatedPoisson/NegativeBinomial/Binomial(psi=, mu=).

---
### High-k remedies: robust-likelihood-for-outliers, moment-match-first ordering, and the k->misspecification framing
*📐 portable*

Enrich G7 remedy set: (1) try moment-matching first (fast, automatic) before reloo/k-fold; (2) if the high-k units are OUTLIERS, switch to a robust likelihood (Student-t / NegBin) rather than only reweighting (we lack this remedy). Framing tension to note: the pymc file says 'high k often signals model misspecification', whereas our G6 says k is fundamentally an INFLUENCE measure, 'not (by itself) misspecification'. Keep our more-precise framing (triage via the p_loo-vs-p tree) but acknowledge outlier/misspecification as a common co-cause.

---
### Prior-predictive interpretation checklist with red-flag thresholds
*📐 portable*

Enrich our existing 'refit and run a prior predictive check' move (currently threshold-free) with concrete pass/fail criteria + thresholds. Check: (1) predictions cover plausible data range; (2) no impossible values (negative counts, p outside [0,1], negative durations); (3) spread reasonable vs data; (4) shape qualitatively matches. Red flags: spans 10+ orders of magnitude -> too vague; >10% of draws impossible -> wrong family/scale; concentrated far from data -> miscalibrated; all draws identical -> too tight/dogmatic. API: pm.sample_prior_predictive; az.plot_ppc_dist(..., group='prior_predictive', kind='ecdf'). Note ties into our N1/N4 support-boundary failures.
