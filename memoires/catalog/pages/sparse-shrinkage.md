# Sparse regression & shrinkage priors

## Claims (the *why* — mid-level, ~3–5)

*Five mid-level principles synthesized from 20 granular claims. Tier is the best-supported of the
granular claims each subsumes. Source short-ids resolve to URLs at the bottom.*

### C1 · Bayesian sparsity is posterior concentration, not selection — so it always needs a downstream decision rule 🟢
*[→ full entry](../claims/sparse-shrinkage/C1.md)*

**Statement.** Bayesian sparsity is a property of the *full posterior* concentrating near the sparse
region of parameter space, not a point-estimate decision that forces coefficients to exactly zero
(frequentist sparsity); and because every continuous scale-mixture-of-normals prior induces only a
*logarithmic* spike at zero — not a true spike-and-slab — approximate sparsity is unreachable from
the prior alone and always requires a separate downstream decision rule. Reading shrunk coefficients
off the marginal posterior is therefore not variable selection.

**Nuance.** The posterior *mode* equals the penalized MLE, but proper inference uses posterior
*expectations* over the whole distribution, not the mode. The logarithmic-spike result is a formal
theorem (Theorem 1, arXiv:1403.4630) governed by the local-scale density's behavior near r=0, with
the Bayesian Lasso as its corollary failure case. A horseshoe never yields exact zeros — it pulls
marginals below a relevance threshold, which is not the same as removal; genuine selection is a
utility/decision problem, best handled by *projection-predictive* selection (projpred) from one
good reference model. Scoring candidate submodels by independently refitting each and removing terms
that improve LOO/CV is itself a search that *overfits the CV estimate* and rarely improves true
predictive performance.

**Conditions.** Non-identified / weakly-identified likelihood (M > N); full Bayesian inference
(posterior expectations), not MAP; the relevant-vs-irrelevant distinction must be inferentially
meaningful; a decision process applied downstream.

**Tier.** 🟢 established (subsumes `bayesian-sparsity-is-not-frequentist-sparsity`,
`scale-mixture-logarithmic-spike-and-bayesian-lasso-failure`; plus supported `forum-c255`
horseshoe-never-zeros, `merged-6` projpred).

**Sources.** betanalpha:bayes_sparse_regression · dansblog:cheat · mc-stan:26200 · mc-stan:12866 ·
mc-stan:18721 · mc-stan:28952

---

### C2 · A sparse prior needs two scales — every single-scale prior compromises and fails one side 🟢
*[→ full entry](../claims/sparse-shrinkage/C2.md)*

**Statement.** A well-specified sparse prior needs two *distinct* scales — a tight inner-core scale
that regularizes the majority of coefficients toward zero and an explicit outer-expanse scale that
lets a few escape unconstrained — so any single-scale prior (Normal, Laplace, Cauchy, classic
horseshoe) must compromise between shrinking small slopes and freeing large ones, and fails one side.

**Nuance.** The failure modes are complementary. The Laplace (Bayesian LASSO) has a uniform tail
above its scale competing with its spike below on the full posterior *simultaneously*, so it
over-shrinks relevant slopes *and* under-shrinks irrelevant ones — a soft failure that passes most
diagnostics but leaves E-BFMI at 0.028–0.058 on all four chains and R-hat > 1.1 for σ and lp__. The
classic horseshoe solves inner-core shrinkage but its *unbounded* local scales let the
non-identifiability propagate through the heavy tails, catastrophically over-regularizing the
relevant slopes and collapsing the geometry. The Finnish / regularized horseshoe (Piironen & Vehtari
2017a) adds a Student-t *slab* (slab_scale, slab_df / c²) that caps large slopes at ~s·few —
identifying the posterior even when the likelihood is not, and eliminating divergences, tree-depth
saturation, and the E-BFMI pathology in a single addition — without disturbing the near-zero spike.
For *prediction*, where future observations are unlabeled, the two-scale requirement is starkest:
single-scale tails give catastrophic predictive ECRPS.

**Conditions.** M > N non-identified regime; prediction alongside inference; compromise worst when
the ratio of true scales exceeds ~100×.

**Tier.** 🟢 established (subsumes `sparse-priors-require-two-scales`,
`laplace-prior-produces-dichotomous-failure`, `horseshoe-without-slab-fails-under-non-identified-likelihood`,
`finnish-horseshoe-slab-regularizes-and-identifies`).

**Sources.** betanalpha:modeling_sparsity · betanalpha:bayes_sparse_regression

---

### C3 · The global scale is a design-dependent quantity — calibrate it to (N, M, expected sparsity) 🟢
*[→ full entry](../claims/sparse-shrinkage/C3.md)*

**Statement.** In local-global (scale-mixture) sparse priors the global scale is not a free constant
but a *design-dependent* quantity: it must be calibrated jointly to N observations, M covariates, and
the expected number of relevant effects m_0; a fixed global scale is effectively non-informative
about sparsity regardless of dimension.

**Nuance.** The correct horseshoe scale is tau_0 = (m_0/(M − m_0))·(σ/√N), *not* tau_0 = σ. The σ/√N
factor accounts for the data's ability to resolve effects as small as σ/√N — ignoring it makes the
threshold data-size-dependent — while the m_0/(M − m_0) factor tames the ensemble of M heavy-tailed
local scales that would otherwise push several slopes above threshold *by chance* in a
high-dimensional setting. This design-dependence enters through the *downstream decision process*,
and is worked out only for a simple deterministic threshold rule (generalization to richer
predictive losses is explicitly left open). It is one of three mechanistically independent reasons a
principled Bayesian scales priors to the design (the other two: the GMRF precision-vs-elicitable-SD
parameterization gap; GP design-dependence).

**Conditions.** High-dimensional / M > N regression with covariates ~standardized to unit variance;
horseshoe family (half-Cauchy local scales) as reference; for non-linear likelihoods the σ/√N
argument must be modified (GLM-appropriate scales).

**Tier.** 🟢 established (subsumes `global-scale-must-account-for-n-and-m0`,
`scale-mixture-tau-must-be-design-scaled`, `design-dependent-priors-three-distinct-mechanisms`).

**Sources.** betanalpha:bayes_sparse_regression · dansblog:cheat

---

### C4 · Sparsity pathology is intrinsic funnel geometry — diagnostics are signals to read, not knobs to turn 🟢
*[→ full entry](../claims/sparse-shrinkage/C4.md)*

**Statement.** The sampling pathology of sparse priors is *intrinsic funnel geometry*, not a tuning
deficit — so the divergences, E-BFMI collapse, and tree-depth saturation they produce are geometry
signals to be read, not knobs (adapt_delta, max_treedepth) to be turned up.

**Nuance.** The horseshoe's half-Cauchy local scales create a *per-context* funnel between each
coefficient θ_k and its local scale λ_k that cannot be reparameterized away: centered → downward
funnel (divergences at small λ_k), non-centered → inverted *upward* funnel (divergences at large
λ_k), partial centering at weight w → a "diamond". The correct choice is *per-parameter*, governed by
where each likelihood concentrates relative to the inner-core scale τ_1 — not by the N_k observation
count that works for single-scale hierarchies. Turning knobs only *masks* the geometry: at
adapt_delta=0.99, max_treedepth=15 the classic horseshoe still shows 138 divergences and E-BFMI <
0.12; pushing adapt_delta to 0.999 buys a false-green 2/4000 divergences while 46.9% of draws
saturate max_treedepth (the neck is crossed only at ruinous step-size cost). The σ posterior is a
free sentinel: over-regularization inflates it (true σ=1, inferred ~10–11) as suppressed signal is
absorbed into the noise term; only a correctly-specified prior concentrates σ near truth.

**Conditions.** Classic horseshoe / mixture prior, non-identified likelihood; non-centered
parameterization already applied; the joint divergence + tree-depth-saturation read is required
(either diagnostic alone is insufficient).

**Tier.** 🟢 established (subsumes `horseshoe-dual-funnel-not-reparameterizable`,
`ncp-cp-choice-mixture-models-depends-on-value-location`,
`horseshoe-diagnostics-are-geometry-signal-not-tuning-deficit`,
`tree-depth-saturation-false-green-detector`, `sigma-posterior-is-a-sentinel`).

**Sources.** betanalpha:modeling_sparsity · betanalpha:bayes_sparse_regression

---

### C5 · Build sparse models by nested expansion under valid warmup — fix geometry before scaling 🟢
*[→ full entry](../claims/sparse-shrinkage/C5.md)*

**Statement.** Sparse models are built and scaled by discipline, not force: each iteration should
*strictly nest* the previous (recovered when new parameters → 0, with priors concentrated near zero),
warmup is valid only if the full chain would already satisfy the MCMC CLT, and a stalled fit is a
geometry problem to diagnose — not a workload to parallelize.

**Nuance.** Nested expansion with shrinkage (PC-style) priors *bounds* the overfitting that iterative
posterior-retrodictive checking can cause — the posterior can always retreat to the simpler
configuration, so the worst outcome is merely wider posteriors; model *replacement* discards that
protection entirely. Warmup discards early states whose initialization influence has not yet decayed,
which is sound only when a CLT holds — it does *not* rescue a chain that was never converging. Warmup
itself can be made *adaptive* (terminate on between-chain R-hat / bulk-ESS targets, drop the earliest
non-stationary windows, pool the variance estimate across chains for faster mass-matrix adaptation),
but this must not be applied to structurally non-identifiable models (factor / sign / label
indeterminacy) without first fixing identifiability. And when a fit stalls or runs super-linearly,
parallelization (map_rect / reduce_sum / MPI / more cores) is the *wrong first move*: it cuts cost
per gradient but never effective-samples-per-gradient, which geometry alone sets — fix the model
first, then parallelize a well-conditioned likelihood.

**Conditions.** Iterative model development; HMC/NUTS with windowed warmup and multiple chains for
the adaptive-warmup route; over-parameterized / non-centered-needing models for the parallelization
caution (does not apply once the model is confirmed well-specified and well-conditioned).

**Tier.** 🟢 established (subsumes `nested-model-expansion-overfitting-protection`,
`warmup-validity-requires-preexisting-clt`; plus supported `forum-c143` adaptive-warmup, `forum-c199`
parallelization-is-wrong-first-move).

**Sources.** betanalpha:principled_bayesian_workflow · betanalpha:markov_chain_monte_carlo_basics ·
mc-stan:12039 · mc-stan:12912 · mc-stan:14303 · mc-stan:14300

---

---

### C6 · Spike-and-slab is the gold standard for EXACT zeros — it builds the selection decision into the prior via a discrete indicator 🟢
*[→ full entry](../claims/sparse-shrinkage/C6.md)*

**Statement.** A discrete-mixture spike-and-slab prior — a Bernoulli inclusion indicator times a
diffuse slab — is the gold-standard prior for genuine variable selection / *exact* zeros. Unlike every
continuous shrinkage prior, the inclusion indicator puts literal probability mass on a coefficient
being exactly zero, so the removal decision is baked into the prior rather than deferred to a
downstream rule.

**Nuance.** This is the direct complement to C1: continuous scale-mixtures of normals never yield exact
zeros (Bayesian sparsity there is a whole-posterior property, and genuine selection is handled
downstream by projection-predictive selection, V2) — spike-and-slab instead encodes the exact-zero
decision *inside* the model through the discrete inclusion variable. The cost is computational: the
discrete latent (inclusion indicator) makes it demanding to fit.

**Conditions.** Genuine variable selection / exact zeros is the modeling goal; you can afford the
discrete-latent computational cost.

**Tier.** 🟢 established (source: pymc-labs L1, human-curated)

**Sources.** pymc-labs:regression

---

### C7 · R2D2 puts the prior on variance explained (R²) — the total-variance budget as a named, off-the-shelf method 🟢
*[→ full entry](../claims/sparse-shrinkage/C7.md)*

**Statement.** The R2D2 prior places an interpretable Beta-style prior directly on R² (the proportion
of variance explained) and then distributes that variance budget across the coefficients — turning the
recurring "put the scale on TOTAL model variance" move into a single named, usable prior instead of an
abstract principle.

**Nuance.** Because the prior is specified on R² (variance explained) rather than on individual
coefficient scales, it is interpretable in units a modeler can reason about, and it operationalizes the
global-scale / total-variance-budgeting spirit of C3 (calibrate the scale to the design as a whole
rather than per-coefficient). PyMC library-note: `pymc_extras.R2D2M2CP(output_sigma, input_sigma, r2,
r2_std, dims)`; X must be centered.

**Conditions.** Linear-model-style variance decomposition where R² is meaningful; X centered (required
by the `R2D2M2CP` implementation).

**Tier.** 🟢 established (source: pymc-labs L1, human-curated)

**Sources.** pymc-labs:regression

## Practical — what works / what doesn't (comprehensive, bidirectional)

*27 recs (13 ✓ / 14 ✗). `efficacy` is the benchmark-shaped slot
`{divergences, min_ess, ess_per_sec, rmse, coverage}` — filled from a metric present in the input,
else `pending`. Attached `moves` are the diagnostic "how", matched by relevance. Grouped by problem.*

### Choice of sparsity prior

**✓ P1** · for a **non-identified sparse regression (M > N)** → the **Finnish / regularized *[→ entry](../recs/sparse-shrinkage/P1.md)*
horseshoe** (Student-t slab on large slopes) works.
- why: the slab caps escaping slopes at ~s·few, identifying the posterior even when the likelihood is not; one addition removes divergences, tree-depth saturation, and the E-BFMI pathology while leaving the near-zero spike untouched.
- conditions: slab_scale must cover plausible large slopes (s~3–5 for slopes ~10), slab_df large enough to be ~Gaussian above the slab; requires non-centered β and τ.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: ~0 (slab eliminates divergences + tree-depth saturation) · min_ess: E-BFMI pathology resolved · ess_per_sec: pending · rmse: σ posterior concentrates at true value (≈1); accurate narrow posteriors for relevant & irrelevant slopes · coverage: pending}
- moves: "Run prior predictive checks via sample_prior='only' + pp_check()/fitted() to visualize what the priors imply, iterating across candidate priors" · "Run a controlled data-strength sweep: vary dataset size and watch divergence incidence" · "Try a minimal heavy-tailed 1-D target and read the diagnostic triple (divergences / E-BFMI / R-hat / treedepth)"

**✗ P2** · for a **non-identified sparse regression (M > N)** → the **classic horseshoe (no slab)** *[→ entry](../recs/sparse-shrinkage/P2.md)*
does **NOT** work.
- why: unbounded local scales let the likelihood's non-identifiability propagate through the heavy tails — relevant slopes diffuse to huge values, τ goes bimodal/funnel, E-BFMI collapses.
- conditions: M > N, collinear design; classic parameterization β ~ N(0, τ·λ), λ ~ HalfCauchy(0,1), τ ~ HalfCauchy(0,σ); NCP already applied.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: 138 (with 25% tree-depth saturation at max_treedepth=15; persists at adapt_delta=0.99) · min_ess: E-BFMI < 0.12 · ess_per_sec: pending · rmse: relevant slopes under-regularized — unbounded heavy tails let their marginals diffuse to large values instead of concentrating at truth · coverage: pending}
- moves: "Confirm the failure is real and characterize it: look at the pairs plot and count divergences / mean treedepth at default settings." · "Try a minimal heavy-tailed 1-D target and read the diagnostic triple (divergences / E-BFMI / R-hat / treedepth)" · "Try the cheap generic knobs but treat their FAILURE as diagnostic, not as a dead end"

**✗ P3** · for a **sparse regression** → the **Laplace prior (Bayesian LASSO)** does **NOT** work *[→ entry](../recs/sparse-shrinkage/P3.md)*
(dichotomous over/under-shrink).
- why: the exponential tail above the scale competes with the spike below on the full posterior simultaneously → over-shrinks relevant slopes *and* insufficiently concentrates irrelevant ones; can't hit both sparsity goals.
- conditions: M > N non-identified regime; Laplace scale of order 1 (≈ noise σ=1); collinear unit-variance covariates.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression, dansblog:cheat
- efficacy: {divergences: passes at adapt_delta=0.99, max_treedepth=12 · min_ess: E-BFMI 0.028–0.058 on all 4 chains; R-hat > 1.1 for σ and lp__ · ess_per_sec: pending · rmse: relevant slopes shrunk toward zero + irrelevant under-shrunk · coverage: pending}
- moves: "decompose the E-BFMI formula and directly inspect its inputs per chain" · "Write out the density on the unconstrained (log-scale) space explicitly, INCLUDING the Jacobian of the log transform, then plot a slice at beta=0" · "Set the interpretation policy for divergence counts before chasing them, and separate 'predictive metric looks fine' from 'posterior is unbiased'."

**✗ P4** · for **prediction** with unlabeled future observations → a **single-scale prior** (Normal, *[→ entry](../recs/sparse-shrinkage/P4.md)*
Cauchy, or classic horseshoe) does **NOT** work.
- why: with no explicit outer-expanse bound the heavy tails extend to infinity, wrecking predictive calibration; a single scale cannot serve both regimes when membership is unknown.
- conditions: prediction/forecasting a goal; ratio of true scales large (worst > ~100×).
- tier: 🟢 · source: betanalpha:modeling_sparsity
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: ECRPS Cauchy 4631.8, horseshoe 4814.1 (K=9 benchmark) — vs Normal-mixture 1098.2 · coverage: pending}
- moves: "Run prior predictive checks via sample_prior='only' + pp_check()/fitted() to visualize what the priors imply, iterating across candidate priors" · "Check propriety of the target and the tails of priors/parameter constraints."

**✓ P5** · for **prediction** → a **two-scale prior** (mixture of two normals / regularized *[→ entry](../recs/sparse-shrinkage/P5.md)*
horseshoe: tight inner-core + explicit outer-expanse) works.
- why: an explicit outer-expanse scale bounds the escaping few while the inner-core shrinks the majority, so predictive scores stay controlled without conditioning on membership.
- conditions: prediction goal; the two true scales well-separated.
- tier: 🟢 · source: betanalpha:modeling_sparsity
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: ECRPS Normal-mixture 1098.2 (K=9 benchmark), ~4× better than single-scale · coverage: pending}
- moves: "Run prior predictive checks via sample_prior='only' + pp_check()/fitted() to visualize what the priors imply, iterating across candidate priors" · "Reparameterize: specify the two-scale prior as an explicit mixture of two normals (one draw from the mixture), rather than summing two separate scale components."

### Global-scale calibration

**✓ S1** · for a **horseshoe / Finnish horseshoe** → setting **tau_0 = (m_0/(M − m_0))·(σ/√N)** *[→ entry](../recs/sparse-shrinkage/S1.md)*
works.
- why: the σ/√N factor matches the data's resolution of small effects; the m_0/(M − m_0) factor tames the ensemble of M heavy-tailed local scales that would else push slopes above threshold by chance.
- conditions: covariates ~standardized to unit variance; expected m_0 relevant slopes; non-linear likelihoods need a modified σ/√N argument.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: pending (underlies the clean Finnish-horseshoe fit, P1) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Rescale predictors so coefficient axes are comparable in magnitude" · "Run prior predictive checks via sample_prior='only' + pp_check()/fitted() to visualize what the priors imply, iterating across candidate priors"

**✗ S2** · for a **horseshoe** → the common default **tau_0 = σ** does **NOT** work. *[→ entry](../recs/sparse-shrinkage/S2.md)*
- why: it ignores both N (making the effective threshold data-size-dependent) and the m_0 ensemble correction, so several irrelevant slopes clear the threshold by chance.
- conditions: M > N; commonly recommended but unscaled.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: pending (contributes to the classic-horseshoe failure, P2: 138 divergences) · min_ess: E-BFMI < 0.12 · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a controlled data-strength sweep: vary dataset size and watch divergence incidence." · "Confirm the failure is real and characterize it: look at the pairs plot and count divergences / mean treedepth at default settings."

**✗ S3** · for **high-dimensional (p ≫ n) sparse regression** → a **fixed global scale τ** (not *[→ entry](../recs/sparse-shrinkage/S3.md)*
calibrated to n, p, k) does **NOT** work.
- why: a fixed τ is effectively non-informative about sparsity regardless of dimension — the a-priori mass on genuinely sparse signals disappears.
- conditions: p ≫ n; sparsity is a modeling goal; a downstream decision process applied to the posterior.
- tier: 🟢 · source: dansblog:cheat
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run prior predictive checks via sample_prior='only' + pp_check()/fitted() to visualize what the priors imply, iterating across candidate priors" · "Run a controlled data-strength sweep: vary dataset size and watch divergence incidence."

### Parameterization & geometry

**✗ G1** · for a **classic-horseshoe per-context funnel** → **non-centered parameterization alone** *[→ entry](../recs/sparse-shrinkage/G1.md)*
does **NOT** work.
- why: the θ_k↔λ_k funnel is dual — NCP resolves the small-λ_k downward funnel but *creates* an inverted upward funnel at large λ_k; the pathology cannot be reparameterized away.
- conditions: half-Cauchy on λ_k; τ near the inner-core scale; each λ_k informed by one context.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression, betanalpha:modeling_sparsity
- efficacy: {divergences: 138 (NCP already applied; adapt_delta=0.99, max_treedepth=15) · min_ess: E-BFMI < 0.12 · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reduce to a minimal reproducer (strip to Neal's funnel) and test both parameterizations at the worst-case data size." · "verify the tool's ACTUAL current parameterization before assuming the standard fix applies" · "Localize the divergences to specific parameters and apply parameterization selectively"

**✓ G2** · for a **mixture-prior / horseshoe** → choosing **CP vs NCP per-parameter by likelihood *[→ entry](../recs/sparse-shrinkage/G2.md)*
location** relative to the inner-core scale τ_1 works.
- why: parameters whose likelihoods concentrate at/below τ_1 need NCP; those concentrating above τ_1 (dominated by the outer component) need CP — location, not width, sets the regime.
- conditions: scale-mixture of normals with well-separated τ_1 ≪ τ_2; contexts may have small N_k.
- tier: 🟢 · source: betanalpha:modeling_sparsity
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Localize the divergences to specific parameters and apply parameterization selectively" · "Reduce to a minimal reproducer (strip to Neal's funnel) and test both parameterizations at the worst-case data size." · "re-attribute the residual geometry to a different mechanism — covariate correlations or genuinely heterogeneous group scales"

**✗ G3** · for a **mixture-prior / horseshoe** → the **N_k observation-count heuristic** for choosing *[→ entry](../recs/sparse-shrinkage/G3.md)*
CP vs NCP does **NOT** work.
- why: N_k governs only likelihood *width*; a mixture adds a second degree of freedom (which component dominates), which depends on likelihood *location* — the K=9 demo holds N_k=1 fixed yet the right choice still varies.
- conditions: scale-mixture prior; well-separated scales; small N_k is exactly the heuristic's failure domain.
- tier: 🟢 · source: betanalpha:modeling_sparsity
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reduce to a minimal reproducer (strip to Neal's funnel) and test both parameterizations at the worst-case data size." · "Run a controlled data-strength sweep: vary dataset size and watch divergence incidence."

**✓ G4** · for a **Finnish horseshoe under HMC** → **non-centering β *and* τ (τ relative to σ)** *[→ entry](../recs/sparse-shrinkage/G4.md)*
works.
- why: τ centered on σ funnels; decoupling both β and τ from the sampling geometry is required for HMC efficiency, on top of the slab that identifies the posterior.
- conditions: Finnish-horseshoe parameterization; HMC/NUTS.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: pending (precondition for the clean P1 fit) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "verify the tool's ACTUAL current parameterization before assuming the standard fix applies" · "Reduce to a minimal reproducer (strip to Neal's funnel) and test both parameterizations at the worst-case data size."

### Diagnostics interpretation

**✗ D1** · for a **horseshoe funnel** → **raising adapt_delta / max_treedepth to suppress *[→ entry](../recs/sparse-shrinkage/D1.md)*
divergences** does **NOT** work.
- why: the divergences are geometry, not a tuning deficit — the heavy-tailed τ/λ funnel is not resolved by a smaller step size; it is only worked around at enormous cost, or masked.
- conditions: classic horseshoe, non-identified likelihood; NCP already applied.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: 138 at adapt_delta=0.99, max_treedepth=15 (unchanged) · min_ess: E-BFMI < 0.12 · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Distinguish masking a pathology from removing it; flag an extreme target_accept as a red flag, not a solution" · "Try the cheap generic knobs but treat their FAILURE as diagnostic, not as a dead end" · "Build a funnel and dial its dimension; raise adapt_delta to suppress divergences and watch which diagnostic survives"

**✗ D2** · for a **sparsity funnel** → reading a **near-zero divergence count from adapt_delta=0.999** *[→ entry](../recs/sparse-shrinkage/D2.md)*
as clean does **NOT** work (false-green).
- why: the tiny step size keeps the leapfrog integrator inside the funnel neck without triggering energy-error heuristics — the geometry is not resolved, only expensively skirted.
- conditions: funnel neck narrower than the chain's natural step size; adapt_delta pushed to 0.99+ specifically to suppress divergences.
- tier: 🟢 · source: betanalpha:modeling_sparsity
- efficacy: {divergences: 2/4000 (0.05%) — apparently clean — but 1875/4000 (46.875%) saturate max_treedepth=10 · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify the warning: separate treedepth-saturation from divergences before choosing a playbook." · "Read saturation as evidence the target is highly degenerate / possibly non-identifiable, and decide to investigate the target geometry" · "Probe adaptation sufficiency, e.g. via the leapfrog/treedepth history rather than divergence count alone."

**✓ D3** · for a **sparsity model at high adapt_delta** → checking **tree-depth saturation jointly *[→ entry](../recs/sparse-shrinkage/D3.md)*
with divergence count** works to detect an unresolved funnel.
- why: either diagnostic alone is insufficient; the pair (low divergences + high saturation) is the fingerprint of a neck skirted at tiny step size.
- conditions: funnel geometry; adapt_delta raised to suppress divergences.
- tier: 🟢 · source: betanalpha:modeling_sparsity
- efficacy: {divergences: the diagnostic pair — 2/4000 divergences vs 46.9% treedepth saturation — reveals the unresolved neck · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify the warning: separate treedepth-saturation from divergences before choosing a playbook." · "Frame the signal before chasing fixes: decide whether saturated treedepth is a validity problem or an efficiency/geometry problem" · "Probe adaptation sufficiency, e.g. via the leapfrog/treedepth history rather than divergence count alone."

**✓ D4** · for **sparse regression** → reading the **σ (noise) posterior as a sentinel** for prior *[→ entry](../recs/sparse-shrinkage/D4.md)*
misspecification works.
- why: unexplained variance from over-shrunk slopes must go somewhere — it is absorbed into σ, so a wildly biased σ is a free, cheap flag that the sparse prior is over-regularizing.
- conditions: linear regression with inferred σ (σ needs its own weakly-informative prior); collinear M > N design.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: σ true=1, inferred ~10–11 under over-regularization (narrow prior peaks ~10, fig006); Finnish horseshoe → σ near 1 · coverage: pending}
- moves: "Set the interpretation policy for divergence counts before chasing them, and separate 'predictive metric looks fine' from 'posterior is unbiased'." · "Run prior predictive checks via sample_prior='only' + pp_check()/fitted() to visualize what the priors imply, iterating across candidate priors"

**✓ D5** · for **sparsity samplers** → reading **E-BFMI collapse as a geometry signal** (not a tuning *[→ entry](../recs/sparse-shrinkage/D5.md)*
deficit) works.
- why: E-BFMI stays low across adapt_delta because the heavy-tailed τ/λ funnel breaks the energy dynamics; the value localizes the pathology to geometry rather than adaptation.
- conditions: horseshoe / mixture prior, non-identified likelihood.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: pending · min_ess: E-BFMI < 0.12 (classic horseshoe), 0.028–0.058 (Laplace, all 4 chains) — persists across adapt_delta · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "decompose the E-BFMI formula and directly inspect its inputs per chain" · "cross-read the convergence summary as corroborating evidence for the energy finding" · "Reattribute the cross-spec difference to sampler-geometry sensitivity, not to model quality"

### Variable selection

**✗ V1** · for **selecting a smaller predictor set** → **scoring candidate submodels by refitting *[→ entry](../recs/sparse-shrinkage/V1.md)*
each and removing terms that improve LOO/CV** does **NOT** work.
- why: the search overfits the CV estimate — the more submodels compared, the more the LOO gain is noise — and rarely improves true out-of-sample performance.
- conditions: Bayesian regression / GLM(M) feature selection; especially many predictors relative to N.
- tier: 🟡 · source: mc-stan:12866, mc-stan:18721, mc-stan:28952
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Set the interpretation policy for divergence counts before chasing them, and separate 'predictive metric looks fine' from 'posterior is unbiased'." · "isolate the offending term by ablation"

**✓ V2** · for **selecting a smaller predictor set** → **projection-predictive selection (projpred) *[→ entry](../recs/sparse-shrinkage/V2.md)*
from one good reference model** works.
- why: every submodel is a *projection* of the full reference model rather than an independent refit, so the CV-overfitting search is avoided; a Gaussian-surrogate route handles ordinal/non-exponential-family references on older projpred.
- conditions: a sensible full reference model exists; minimal-vs-complete-selection caveat applies under correlated predictors.
- tier: 🟡 · source: mc-stan:12866, mc-stan:18721, mc-stan:28952
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Set the interpretation policy for divergence counts before chasing them, and separate 'predictive metric looks fine' from 'posterior is unbiased'."

**✗ V3** · for a **hierarchical model with fixed + correlated random slopes** → a **horseshoe on the *[→ entry](../recs/sparse-shrinkage/V3.md)*
fixed-effect coefficients** to remove a covariate does **NOT** work.
- why: you can shrink the fixed effect to ~0 while a sizeable random-slope SD keeps the covariate influential (or vice versa); the horseshoe never gives exact zeros, so removal is a separate decision.
- conditions: fixed + group-varying effects for the same covariates; sparsity/whole-covariate-removal goal; any MCMC backend.
- tier: 🟡 · source: mc-stan:26200
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Re-express fixed effects over factor levels as (partially-pooled) random effects to improve posterior conditioning" · "Test whether over-regularized (over-tight zero-centered) random-effect SD priors are themselves creating the hard geometry"

**✓ V4** · for **genuine covariate removal in a hierarchical model** → **handling the fixed *and* *[→ entry](../recs/sparse-shrinkage/V4.md)*
random-slope contributions jointly** (and using projpred for the decision) works.
- why: you must shrink/remove both the fixed effect and the associated random-slope SD, then treat removal as an explicit utility + posterior-over-deletion decision problem — not read off shrunk marginals.
- conditions: fixed + correlated random slopes for the same covariates.
- tier: 🟡 · source: mc-stan:26200
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Re-express fixed effects over factor levels as (partially-pooled) random effects to improve posterior conditioning" · "Diagnose the unidentified-subgroup pathology and pool group-level parameters so data-starved groups borrow strength."

### Workflow — build & scale

**✓ W1** · for **iterative sparse-model development** → **nested model expansion** (each step *[→ entry](../recs/sparse-shrinkage/W1.md)*
recovers the previous at parameter=0, with priors concentrated near zero) works to limit overfitting.
- why: Bayesian inference keeps the previous model within reach, so the posterior only ventures into the new region if the data support it; the worst outcome is wider posteriors.
- conditions: parameterize so the simpler model is recovered at a specific value (usually zero); PC-style priors natural but not mandatory; protection degrades if data overwhelm the shrinkage.
- tier: 🟢 · source: betanalpha:principled_bayesian_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "ablate the model to a minimal version and run on simulated data" · "isolate the offending term by ablation"

**✗ W2** · for **iterative sparse-model development** → **replacing the model wholesale** (non-nested *[→ entry](../recs/sparse-shrinkage/W2.md)*
iteration) does **NOT** preserve overfitting protection.
- why: replacement discards the previous model's protection entirely — there is no simpler configuration for the posterior to retreat to.
- conditions: iterative posterior-retrodictive checking driving model changes.
- tier: 🟢 · source: betanalpha:principled_bayesian_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "ablate the model to a minimal version and run on simulated data" · "isolate the offending term by ablation"

**✓ W3** · for **HMC/NUTS with windowed warmup and multiple chains** → **adaptive warmup driven by *[→ entry](../recs/sparse-shrinkage/W3.md)*
between-chain R-hat / bulk-ESS** works.
- why: R-hat/ESS already tell you whether the ensemble has reached stationarity, so you can stop warmup on target, drop the earliest non-stationary windows (ABCD vs BCD vs CD vs D by max ESS), and pool the variance across chains for faster mass-matrix adaptation.
- conditions: multiple chains that genuinely should converge to the same distribution; do NOT apply to structurally non-identifiable models (factor/sign/label switching) without fixing identifiability first.
- tier: 🟡 · source: mc-stan:12039, mc-stan:12912
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: fewer leapfrog steps / faster mass-matrix adaptation (qualitative) · rmse: pending · coverage: pending}
- moves: "Reconfigure warmup windows to drop the metric-adaptation phase" · "Read Rhat and ESS (incl. in the unconstrained space) as a localizer, not just a pass/fail gate"

**✗ W4** · for a **chain that never satisfies the MCMC CLT** → **warmup** does **NOT** rescue it. *[→ entry](../recs/sparse-shrinkage/W4.md)*
- why: warmup only discards early states whose initialization influence has not decayed; if the CLT never holds (reducibility, non-ergodicity), no sub-chain after warmup is valid either.
- conditions: choose the warmup window by the visual criterion (trace plots show no initialization influence), not a fixed fraction — but that presupposes convergence.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Re-examine the raw draws instead of the rendered traceplot" · "Reframe flat traces as whole-chain freezing from leapfrog/Hamiltonian divergence, not as proof of acceptance" · "Read Rhat and ESS (incl. in the unconstrained space) as a localizer, not just a pass/fail gate"

**✗ W5** · for a **large sparse/hierarchical fit that stalls or runs pathologically slowly** → *[→ entry](../recs/sparse-shrinkage/W5.md)*
**parallelization** (map_rect / reduce_sum / MPI / more cores) as the *first* move does **NOT** work.
- why: a stuck model is usually misspecified / non-identified / over-parameterized; parallelism cuts cost per gradient by at most a constant factor, never effective-samples-per-gradient, which geometry alone sets.
- conditions: stalls in warmup, fails to mix, or runtime grows super-linearly; over-parameterized or non-centered-needing models; small-N fits never validated.
- tier: 🟡 · source: mc-stan:14303, mc-stan:14300
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Pull get_sampler_params() and read stepsize__, treedepth__, n_leapfrog__, divergent__, and energy__ per chain — compare the stuck chain's columns…" · "Test whether the data can actually identify the latent dynamics, or whether the joint is over-flexible / under-informed."

**✓ W6** · for the **same stalled fit** → **diagnosing and fixing the geometry first, then *[→ entry](../recs/sparse-shrinkage/W6.md)*
parallelizing a well-conditioned likelihood** works.
- why: reduce parameter count / reparameterize (non-centered) / check identifiability restores effective-samples-per-gradient; once well-specified, reduce_sum/map_rect/MPI is exactly the right wall-clock tool.
- conditions: model confirmed well-specified, identified, and well-conditioned before parallelizing.
- tier: 🟡 · source: mc-stan:14303, mc-stan:14300
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Test whether the data can actually identify the latent dynamics, or whether the joint is over-flexible / under-informed." · "Rescale predictors so coefficient axes are comparable in magnitude"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
bayes_sparse_regression · modeling_sparsity · principled_bayesian_workflow ·
markov_chain_monte_carlo_basics

**Dan Simpson blog** (`dansblog:<id>` → `https://dansblog.netlify.app/posts/…`):
cheat (`2021-12-09-why-wont-you-cheat-with-me-repost`)

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`):
12039 (adaptive-warmup proposal) · 12912 (cross-chain warmup via MPI) · 14303 (stuck at warmup) ·
14300 (parallelisation suggestion) · 26200 (horseshoe in a hierarchical model) · 12866 (shrinkage &
feature selection in designed experiments) · 18721 (projpred for GLMMs/GAMMs) · 28952 (projpred with
a CAR component)

**Referenced within claims:** arXiv:1403.4630 (Theorem 1, logarithmic-spike result for
scale-mixture-of-normals priors); Piironen & Vehtari 2017a (regularized "Finnish" horseshoe).

*(append under "### Choice of sparsity prior", continuing the P-series.)*

**✓ P6** · for **continuous shrinkage when full sparsity is NOT required** → the **Laplace / LASSO prior (Laplace(0, b))** works — simpler and better-behaved than the horseshoe. *[→ entry](../recs/sparse-shrinkage/P6.md)*
- why: Laplace(0, b) gives continuous shrinkage — a tall mode at 0 with thick tails — and is simpler and better-behaved than the horseshoe when you do not need genuine sparsity; contrast the horseshoe, which lets large signals escape.
- conditions: full sparsity is NOT a requirement (in the M > N non-identified sparse regime where it IS, the same Laplace over-shrinks relevant slopes *and* under-shrinks irrelevant ones — see C2 / ✗ P3); unsuitable when a few large signals must escape unconstrained, because Laplace shrinks even LARGE coefficients.
- tier: 🟢 (source: pymc-labs)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ P7** · for **genuine variable selection / EXACT zeros** → the **discrete-mixture spike-and-slab prior (Bernoulli inclusion × diffuse slab)** works — the "gold standard". *[→ entry](../recs/sparse-shrinkage/P7.md)*
- why: the Bernoulli inclusion indicator puts literal mass on a coefficient being exactly zero, so it performs genuine variable selection rather than mere shrinkage. Complements C1 (continuous scale-mixtures never give exact zeros — that is a whole-posterior property handled downstream by projpred, V2) by building the exact-zero decision into the prior.
- conditions: exact zeros / genuine selection is the goal; computationally demanding because of the discrete latent (inclusion indicator) — budget for that cost.
- tier: 🟢 (source: pymc-labs)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ P8** · for **budgeting the prior on TOTAL model variance / variance explained** → the **R2D2 prior (Beta-style prior on R², distributed across coefficients)** works — an off-the-shelf tool for the total-variance-budget move. *[→ entry](../recs/sparse-shrinkage/P8.md)*
- why: instead of setting per-coefficient scales, R2D2 places an interpretable Beta-style prior directly on R² and distributes the variance across coefficients, turning the abstract "put the scale on TOTAL model variance" move (cf. C3's design-dependent global scale) into a named, usable method.
- conditions: X must be centered. Library-note: `pymc_extras.R2D2M2CP(output_sigma, input_sigma, r2, r2_std, dims)`.
- tier: 🟢 (source: pymc-labs)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
