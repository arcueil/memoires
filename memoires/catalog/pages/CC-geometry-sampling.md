# Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)

## Claims (the *why* — mid-level, ~4–7)

*Seven mid-level principles synthesized from 60 granular claims. This is a CROSS-CUTTING
computation-diagnostics area: the claims are indexed by the sampler/geometry pathology, not by any one
model — they apply wherever HMC/NUTS meets a posterior. Tier is the best-supported of the granular
claims each subsumes; single-witness items are kept ⚪. Source short-ids resolve at the bottom.*

### C1 · Geometry belongs to the *model*, not the sampler — knobs and hardware mitigate cost, only re-specification cures, and the failure is silent bias 🟢
*[→ full entry](../claims/CC-geometry-sampling/C1.md)*

**Statement.** Posterior geometry is a property of the model (prior × likelihood), so it cannot be
turned off with sampler knobs, more cores, or vectorization: parallelization and vectorization lower
*cost per gradient*, never *effective-samples-per-gradient*, which geometry alone sets — and a
geometry the sampler can't resolve doesn't merely run slow, it *silently biases* the estimator at any
finite N.

**Nuance.** The two speed factors are independent: cost-per-gradient (reducible by a constant factor
via workers/vectorization) and ESS-per-gradient (fixed by geometry). A model stuck in warmup or with
super-linear runtime is usually misspecified / non-identified / over-parameterized, and that must be
re-specified, not parallelized (once well-conditioned, `reduce_sum`/`map_rect`/MPI *is* the right
wall-clock tool). Vectorization helps Stan only by shrinking the autodiff-variable graph — the lever
order is (1) geometry, (2) number of autodiff variables, then (3) specialized `*_lpdf`/matrix
functions. The bias mechanism: at a high-curvature pinch the chain intermittently freezes; those
frozen excursions are the *only* asymptotic bias correction, but on finite runs they produce
oscillating signed bias and declining ESS-per-iteration, because the MCMC CLT needs the geometric
ergodicity the pinch breaks.

**Conditions.** HMC/NUTS; single-chain diagnostics show the declining-ESS pattern most clearly; the
"parallelize later" exception holds only once the model is confirmed identified and well-conditioned.

**Tier.** 🟢 established — subsumes `adapt-delta-reduces-but-cannot-cure-funnel-geometry`,
`curvature-pinch-suspension-bias-oscillation`; plus supported `forum-c199` (parallelization),
`forum-c186` (vectorization).

**Sources.** betanalpha:hierarchical_modeling · betanalpha:rstan_workflow ·
betanalpha:divergences_and_bias · betanalpha:markov_chain_monte_carlo · mc-stan:14303 · mc-stan:14300 ·
mc-stan:510 · mc-stan:20567 · mc-stan:16486

---

### C2 · Divergences are read by *location* and *origin*, not count — and their *absence* is not a clean bill of health 🟢
*[→ full entry](../claims/CC-geometry-sampling/C2.md)*

**Statement.** A divergent transition signals failed geometric ergodicity in a neighborhood (hence
finite-N bias), which makes divergences the primary single-chain HMC diagnostic — but the count is
nearly useless on its own: what matters is *where* divergences concentrate, *whether* they survive an
`adapt_delta` sweep, and *what* their origin is; conversely, zero divergences can coexist with a
badly-explored posterior.

**Nuance.** Three orthogonal reads. (1) *Location:* divergences that CLUSTER at a boundary/funnel-neck
(e.g. small τ, with a sharp lower boundary in the non-divergent cloud) are true-positive geometry;
divergences that SCATTER uniformly like ordinary draws are false positives (step-size numerical
error). (2) *True vs false positive:* sweep `adapt_delta` — false positives vanish completely near 1,
true geometry stays roughly *flat* across 0.85→0.99 (and a near-zero count at the *largest* step size,
`adapt_delta≈0.80`, is a false *negative*: the chain never entered the funnel). (3) *Origin:* run the
prior model with no likelihood — divergences that persist are prior/`reject()`-induced. The mirror
trap: in an underdetermined regression (N<M) the data soften the funnel tip enough that *zero*
divergences appear alongside E-FMI 0.028, 74.5% tree-depth saturation, and R̂=2.38; and in a
multimodal posterior every within-mode diagnostic passes cleanly while chains sit in separate modes —
only split-R̂ ≫ 1 and multi-chain scatter reveal it.

**Conditions.** HMC/NUTS (the energy-error check is absent in MH/Gibbs); cluster analysis needs
scatter visualization; the sweep needs a *range* of `adapt_delta`, not one value.

**Tier.** 🟢 established — subsumes `divergences-signal-geometric-bias`,
`divergence-location-and-origin-not-count`, `divergence-spatial-location-identifies-geometric-bottleneck`,
`flat-divergence-count-across-adapt-delta-sweep-diagnoses-non-ergodicity`,
`divergence-absence-misleads-in-underdetermined-regression-funnel`,
`casestudy-zero-divergences-does-not-mean-correct-exploration-in-multimodal-setting`.

**Sources.** betanalpha:divergences_and_bias · betanalpha:rstan_workflow · betanalpha:pystan_workflow ·
betanalpha:underdetermined_linear_regression · betanalpha:identifying_mixture_models · mc-stan:10759 ·
mc-stan:18100 · mc-stan:24267

---

### C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth saturation, E-FMI, and divergences each detect a *different* pathology, and each carries a calibration caveat 🟢
*[→ full entry](../claims/CC-geometry-sampling/C3.md)*

**Statement.** Tree-depth saturation, the energy diagnostic (E-BFMI/E-FMI), and divergences respond to
mechanically distinct failure modes; reading one as a proxy for another — or treating any threshold as
a calibrated law — misdiagnoses the geometry.

**Nuance.** *Tree-depth saturation without divergences and with normal E-FMI* = an elongated ridge
whose correlation length exceeds 2^max_treedepth leapfrog steps — a non-identifiability or near-unit
neighbor-correlation signal (ordinal ridge: R̂~2.3, n_eff/iter~0.00073, ~97% saturation for *all* params;
single-parameter wandering: R̂~1.95, n_eff/iter~0.00075, ~87% for the one c[k]); raising max_treedepth
buys longer trajectories but never removes the ridge (fix the identifiability, or NCP a fine-grid
Markov chain). Even a geometrically-correct sampler can need max_treedepth=20 to reach Cauchy tails —
at default 10 the tail quantiles are *silently* biased downward with no warning. *E-FMI* detects only
incoherent diffusive energy exploration: it is blind to localized (per-latent-pair) funnels, to flat
directions / lower-dimensional concentration, and to multimodality — yet for a *global* single-scale
funnel it can flag obstruction *earlier* than divergences (E-FMI 0.134/0.160 at only 2/4000
divergences). The 0.2 threshold is an author-declared "very rough recommendation," and E-BFMI > 1 is a
benign low-dimensional artifact, not a pathology.

**Conditions.** HMC/NUTS; the E-FMI blindnesses sharpen as the number of localized funnels grows
(each dilutes the global energy variance); tree-depth reads require E-FMI to be normal to rule out
curvature.

**Tier.** 🟢 established — subsumes `casestudy-tree-depth-saturation-as-geometry-signal`,
`cp-markov-chain-treedepth-ncp-resolves`, `cauchy-nuts-correctness-requires-elevated-max-treedepth`,
`efmi-blind-to-localized-funnel-geometry`, `efmi-blind-to-posterior-degeneracy`,
`efmi-early-warning-for-global-funnel`; plus supported `ebfmi-threshold-preliminary-rough-guide`,
`forum-c220` (E-BFMI > 1 benign).

**Sources.** betanalpha:ordinal_regression · betanalpha:brownian_bridge · betanalpha:fitting_the_cauchy ·
betanalpha:factor_modeling · betanalpha:modeling_sparsity · betanalpha:hierarchical_modeling ·
betanalpha:identifiability · betanalpha:pystan_workflow · betanalpha:rstan_workflow · mc-stan:28554

---

### C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, family-specific, and not free, and the metric is the complementary lever 🟢
*[→ full entry](../claims/CC-geometry-sampling/C4.md)*

**Statement.** Reparameterizing to decouple a scale from the sampling geometry is the first-line cure,
but there is no universal choice: centered (CP) and non-centered (NCP) forms have *exactly
complementary* failure regimes set by per-group data richness, the transform must be chosen per level
and per distribution family, the "best geometry" is not always the fastest, and mass-matrix adaptation
is a parallel lever that can substitute for reparameterization when the pathology is mere linear
correlation.

**Nuance.** CP funnels when data are sparse and the prior dominates (as τ→0, θ~N(μ,τ) pinches); NCP
inverts the funnel (η·τ=const) when data are dense and the likelihood dominates — so mixed / per-level
parameterization is the correct answer under imbalance. Family matters: Stan's `offset/multiplier`
sugar is *not* numerically equal to a hand-written NCP (the +1/σ Jacobian gradient and −1/σ
`normal_lpdf` gradient cancel catastrophically → stuck at σ→0), so hand-roll `x = μ + σ·x_raw`; a
Gamma/Inv-Gamma prior *resists* NCP (no cheap inverse-CDF, no offset/multiplier) → substitute
LogNormal; a Cauchy/half-Cauchy in the prior-dominated regime is best fixed by a Gamma/Inv-Gamma
scale-mixture-of-Gaussians that compacts ~2000 grad-evals/iter to 7–31. And "best geometry" (fewest
grad-evals/iter) need not win ESS/second — a `tan()` CDF-inversion wins ESS/iteration but loses
iterations/second to transcendental cost (three-way tie ~2500 vs ~3500). The metric is the alternate
knob: for a well-identified but anisotropic posterior a diagonal/dense mass matrix rescales the
geometry that step-size-only adaptation cannot.

**Conditions.** Normal hierarchy (complementarity exact for conjugate normal); per-level assessment;
half-normal/infinity-suppressing τ prior; dense-metric reach is limited to global *linear* correlation
(intrinsic curvature still needs reparameterization).

**Tier.** 🟢 established — subsumes `cp-ncp-complementary-failure-regimes-data-richness-governs`,
`cauchy-nuts-geometry-scale-mixture-fix`, `best-geometry-does-not-imply-best-ess-per-second`; plus
supported `forum-c18` (offset/multiplier), `forum-c219` (Gamma→LogNormal), `forum-c225` (metric
adaptation).

**Sources.** betanalpha:hierarchical_modeling · betanalpha:factor_modeling · betanalpha:fitting_the_cauchy ·
mc-stan:20712 · mc-stan:37076 · mc-stan:1017 · mc-stan:38465 · mc-stan:9638 · mc-stan:19997 · pyro:259

---

### C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifiability, collinearity, heavy-tailed sparsity priors, and dense GPs need marginalization, a regularizing slab, orthogonalization, or a redesign 🟢
*[→ full entry](../claims/CC-geometry-sampling/C5.md)*

**Statement.** When the pathological geometry lives in the *likelihood* rather than in a prior scale
— an underdetermined/collinear design, a sparsity prior whose tails escape, or a dense GP that doesn't
scale — there is no algebraic scale to non-center, so the CP/NCP toolkit does not apply; the fix is to
change the *model representation* (marginalize the latent field, cap the tails with a slab, QR the
predictors, or swap in a low-rank/state-space approximation), and tuning the sampler harder never works.

**Nuance.** In N<M or perfectly-collinear regression, σ couples to the degenerate plane of
equally-fitting slopes and the ridge narrows as σ→0 into a funnel — NCP can't decouple it (only a
strongly informative lower-bounded σ prior regularizes it); near-collinear predictors (x, x² for
uncentered positive x) form a narrow ridge costing >1,000,000 grad-evals until centered/QR-orthogonalized.
Sparsity priors fail structurally: the classic horseshoe's unbounded local scales let relevant slopes
diffuse arbitrarily (138 divergences, 25% tree-depth saturation, E-BFMI<0.12) — a *geometry* signal
not fixable by adapt_delta/max_treedepth — while the Finnish/regularized slab (a Student-t cap on
escaped slopes) eliminates the divergences, saturation, and E-BFMI pathology at once; the Laplace/LASSO
prior instead over-shrinks relevant and under-concentrates irrelevant slopes (soft failure: E-BFMI
0.028–0.058, R̂>1.1). For GPs, dense O(N³)/O(N²) makes exact HMC OOM beyond ~1000 points (replace with
HSGP low-rank or a Matérn state-space form), and latent-field/σ funnels are removed by *analytically
marginalizing* the field (`multi_normal(0, K + σ²I) — or multi_normal_cholesky(0, L) with L = cholesky_decompose(K + σ²I)`), not by a zero-avoiding σ prior.

**Conditions.** Gradient samplers; standard Gaussian/collinear observational model, M>N sparse
regression, or dense-kernel latent GP; the marginalize/approximate routes carry their own
applicability limits (kernel class, input dimension, likelihood family).

**Tier.** 🟢 established — subsumes `collinearity-ridge-hmc-inefficiency`, `exact-collinearity-sigma-funnel`,
`casestudy-horseshoe-without-slab-fails-under-non-identified-likelihood`,
`casestudy-horseshoe-diagnostics-are-geometry-signal-not-tuning-deficit`,
`casestudy-finnish-horseshoe-slab-regularizes-relevant-slopes-and-identifies-posterior`,
`casestudy-laplace-prior-produces-dichotomous-failure`; plus supported `forum-c25` (GP marginalize),
`forum-c150` (dense GP does not scale).

**Sources.** betanalpha:qr_regression · betanalpha:taylor_models · betanalpha:bayes_sparse_regression ·
betanalpha:underdetermined_linear_regression · mc-stan:26425 · mc-stan:3517 · mc-stan:11661

---

### C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradient samplers' native reach — marginalize it out, reparameterize to a smooth unconstrained space, or add a surrogate; never hard-reject 🟢
*[→ full entry](../claims/CC-geometry-sampling/C6.md)*

**Statement.** HMC/NUTS needs an (almost-everywhere) smooth log-density over a connected typical set,
so any structure that is discrete, disconnected, or has a moving support wall must be transformed
before sampling — discrete latents marginalized out, constraints encoded as unconstrained bijections,
and intrinsically multimodal/partition-based structure either marginalized or handled with a surrogate;
enforcing a constraint by hard-rejecting to `-inf` is the canonical anti-pattern.

**Nuance.** Marginalizing discrete component assignments (`log_sum_exp`) is both Rao-Blackwell-superior
and the only continuous-sampler-tractable path; but marginalization does not cure everything — when
mixture components overlap (<~2σ) the K! label-switching non-identifiability *becomes continuous* (a
'bowtie' ridge in (μ₁,μ₂) rotating with the weight) → very low n_eff with *no* divergences, and the
ordering constraint fails. Hard walls fail hardest: `target += -inf`/`reject()` gives a gradient-free
cliff → all-divergent transitions, R̂≫1, tiny ESS; a parameter-dependent support endpoint (GEV, ξ<0)
makes 90–97% of transitions diverge; the correct fix is a bijection to unconstrained space (built-in
`<lower>`/`<upper>`, simplex/stick-breaking/affine). `*_rng` inside the model block is compile-time
banned because it makes the differentiated target non-deterministic. And some targets are structurally
hostile: gradient PPLs are not discrete-PGM toolkits (no BP/junction-tree/structure-learning), tree /
hard-threshold models are piecewise-constant, and Bayesian-NN weight posteriors carry a combinatorial
permutation/sign mode set layered on funnels — none of which HMC characterizes in a naive
parameterization.

**Conditions.** Gradient samplers (HMC/NUTS, and analogous reparameterization in PyMC/NumPyro/BlackJAX);
the marginalize route requires finite enumerable discrete states; does not apply to rejection/reflecting
samplers that natively handle hard walls.

**Tier.** 🟢 established — subsumes `casestudy-marginalize-discrete-assignments-before-sampling`,
`casestudy-overlapping-components-produce-continuous-non-identifiability`,
`casestudy-component-overlap-creates-continuous-non-identifiability-bowtie`; plus supported `forum-c111`
(reparameterize not reject), `forum-c134` (moving support boundary), `forum-c13` (deterministic model
block), `forum-c321` (discrete/partition models), `forum-c248` (PPL ≠ PGM), `forum-c287` (Bayesian NN),
`forum-c21` (init failed = constraint left support).

**Sources.** betanalpha:mixture_models · betanalpha:identifying_mixture_models · mc-stan:38573 ·
mc-stan:40694 · mc-stan:23805 · mc-stan:10296 · mc-stan:3583 · mc-stan:11795 · mc-stan:22038 ·
mc-stan:3884 · mc-stan:3277 · mc-stan:1399 · pymc:5619 · pymc:3845 · pymc:11674 · pymc:16104 ·
pymc:7160 · pymc:9994 · pymc:8805

---

### C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctness, warmup/metric adaptation, and differentiable/JIT-able linear algebra — whose failures masquerade as (or get blamed on) the geometry 🟢
*[→ full entry](../claims/CC-geometry-sampling/C7.md)*

**Statement.** A large class of "sampler" failures are not posterior geometry at all but the substrate:
a finite log-density does not imply a finite gradient; an init-method error usually signals
misspecification, not a bad seed; a VI fit can be a fine *initializer* while being a poor *posterior*;
and the differentiable, JIT-able linear algebra under the model has its own correctness-and-performance
traps (precision, sparse layout, custom primitives, trace bottlenecks, compute-bound scaling) that
surface as divergences, stuck chains, or wrong answers.

**Nuance.** Debug the gradient channel, not just the value — "Gradient not finite" fires while
`log_prob` is finite through at least four routes. Init failures ("mass matrix zeros on the diagonal",
"bad initial energy", "-inf logp") are geometry/misspecification tells, and the init method
(jitter+adapt_diag / adapt_full / ADVI-init) is a robustness/scaling tradeoff; a Pathfinder/forward-KL
VI fit is zero-forcing (underestimates hyperparameter variance) so never a final posterior, yet lands a
point in the typical-set bulk that seeds warmup — and the typical set is best defined as
log p ≈ E[log p] (it can contain the mode in moderate d; the "donut excludes the mode" picture is safe
only in high d). The linear-algebra layer: sparse log-det *gradients* need float64 (JVP error 8.8e-4→8.5e-13)
even when the primal looks right; `ad.defjvp` can't share an expensive Cholesky across tangents (use a
manual `value_and_jvp`); a JIT-able differentiable sparse Cholesky needs a custom primitive (pure-Python
`vmap`/`fori_loop`/`scan`/`tree_map` all fail on ragged shapes) with `def_impl` as the non-JAX seam and
a COO-with-monotonic-counter + scipy CSC workaround (~150×); Eigen CCS block assembly is column-major as
a *silent correctness* (not just cache) constraint; CNF trace log-det is the O(d²) bottleneck (Hutchinson
or structured f); and GPU offload of dense Cholesky/solve is PCIe/memory-bound (10–30× cap, not FLOP-proportional).

**Conditions.** Autodiff-backed PPLs (Stan, JAX/BlackJAX, PyMC, NumPyro); several linear-algebra items
are JAX-version- and library-specific (e.g. JAX ~0.3.x, Eigen CCS, Stan-Math); the state-space "O(1)
filter" caveat is that only the *state* recursion is online, never the hyperparameter posterior.

**Tier.** 🟢 established — subsumes `cholesky-log-det-gradient-requires-float64`,
`def-impl-body-receives-concrete-arrays`, `custom-primitive-only-viable-sparse-cholesky-path`,
`coo-accumulation-with-direct-counter-breaks-xla-indirection`,
`column-major-ccs-is-dual-performance-correctness-constraint`, `eigen-ccs-block-assembly-requires-manual-interleaving`,
`cnf-trace-log-det-bottleneck`, `cnf-dual-direction-same-field`, `cnf-information-desert`; plus supported
`ad-defjvp-blocks-primal-sharing`, `forum-c254` (gradient ≠ value), `forum-c221` (init methods),
`forum-c294` (VI-as-initializer), `forum-c319` (NaN-ELBO init), `forum-c215` (typical set),
`forum-c146` (GPU memory-bound), `forum-c279` (filter vs hyperparameter posterior); and candidate
`forum-c286` (⚪, custom-`_lpdf` caching).

**Sources.** dansblog:derivatives · dansblog:sparse4 · dansblog:sparse-cholesky3 · dansblog:sparse7 ·
dansblog:blocks · dansblog:diffusion · mc-stan:17174 · mc-stan:34960 · mc-stan:5816 · mc-stan:9813 ·
mc-stan:25130 · mc-stan:9136 · mc-stan:17113 · mc-stan:12835 · mc-stan:24425 · pymc:451 · pymc:9728 ·
pymc:5917 · pymc:17654 · pymc:17575 · pymc:17628 · pyro:254

---

---

### C8 · The VI approximating family sets the uncertainty structure — mean-field (factorized q) is axis-aligned and overconfident; full-rank restores a dense covariance at O(d²) cost 🟢
*[→ full entry](../claims/CC-geometry-sampling/C8.md)*

**Statement.** Mean-field VI (a factorized q) ignores all posterior correlations → axis-aligned,
overconfident, variance-underestimating uncertainty; full-rank VI restores a dense covariance at O(d²)
cost. This is the VI analogue of the diagonal-vs-dense mass-matrix choice (RP10/RP11), one level up in
the approximating family: the mean-field/full-rank switch acts on the covariance of the *variational
posterior* rather than on the sampler's metric.

**Nuance.** PyMC exposes the choice directly as `method='advi'` (mean-field) vs `method='fullrank_advi'`
(full-rank). The failure of mean-field is the same anisotropy story as the diagonal-metric failure a
sampler hits on a correlated posterior — a factorized q cannot represent off-diagonal covariance, so
correlated posteriors come out axis-aligned and too narrow. Compounds with the reverse-KL zero-forcing
underestimation already noted for VI on this page (ST5): a mean-field ELBO fit is variance-underestimating
on two counts (objective and family).

**Conditions.** VI (ADVI family); the O(d²) storage/compute cost of the full-rank dense covariance bites
in high dimension — the same dense-vs-diagonal tradeoff that governs the metric choice in RP10/RP11.

**Tier.** 🟢 established (source: pymc-labs L1, human-curated) — VI approximating-family covariance
structure (mean-field vs full-rank).

**Sources.** pymc-labs:python-analytics-skills

---

### C9 · Minibatch VI must rescale every subsampled term by N/b, or the ELBO is biased 🟡
*[→ full entry](../claims/CC-geometry-sampling/C9.md)*

**Statement.** In stochastic/minibatch variational inference, subsampling b of N datapoints under-counts each per-datapoint log-probability term — the likelihood AND any per-datapoint local latents (e.g. hierarchical group-level effects) — so the subsampled ELBO is an unbiased estimator of the full-data ELBO only if each such term is rescaled by N/b (or the PPL's plate/subsample machinery, which scales automatically). Omitting the correction — treating VI like frequentist minibatched SGD — leaves the fixed-size prior competing against a fractional likelihood, silently biasing the objective and the posterior.

**Nuance.** A mid-level principle consolidated (2026-07-02) from the practical recs it governs on the hierarchical-multilevel page (J1, J2, governed cross-page); see the recs below for the concrete instances and conditions.

**Conditions.** As per the governed recs.

**Tier.** 🟡 (maintainer-gated 2026-07-02: approved; moved from hierarchical-multilevel — an inference-method nuance, not a multilevel-model property).

**Sources.** pyro:3041 · pyro:895 · pyro:8826

## Practical — what works / what doesn't (comprehensive, SITUATION-indexed)

*81 recs (34 ✓ / 46 ✗, plus 1 bidirectional). These are indexed by DIAGNOSTIC SITUATION/SYMPTOM, not
by model — the search key is "I'm seeing X, what does it mean / what do I do." `efficacy` is the
benchmark-shaped slot `{divergences, min_ess, ess_per_sec, rmse, coverage}`, filled ONLY from a metric
present in the input, else `pending` (energy metrics like E-BFMI, and cost metrics like grad-evals/iter,
have no slot and are recorded in `why`). Attached `moves` are the diagnostic "how"; single-witness moves
are kept as the searchable tail.*

### Divergences appear

**✗ DV1** · when divergences appear on a hierarchical/scale model → treating them as a code bug and hunting the program does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/DV1.md)*
- why: divergent transitions signal failed geometric ergodicity in a neighborhood → estimators biased at finite N; the fix is geometry (reparameterize/marginalize), not debugging.
- conditions: HMC/NUTS only — the energy-error check is absent in Metropolis-Hastings/Gibbs.
- tier: 🟢 · source: divergences_and_bias, pystan_workflow, rstan_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Treat divergences as a posterior-geometry problem: look at the induced posterior geometry / pairs plot rather than hunting for a code bug" · "Locate the divergences: pairs-plot the offending parameters and highlight divergent transitions"

**✓ DV2** · when divergences appear → pairs-plotting the offending parameters and checking whether they **cluster** vs scatter works to localize the bottleneck. *[→ entry](../recs/CC-geometry-sampling/DV2.md)*
- why: clustering at a boundary/funnel-neck is a true positive that names the geometric bottleneck; count alone is insufficient.
- conditions: needs scatter visualization in parameter space; the analyst chooses which parameters to examine.
- tier: 🟢 · source: rstan_workflow, divergences_and_bias
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Locate the divergences: pairs-plot the offending parameters and highlight divergent transitions" · "Look at the ENSEMBLE of divergent draws rather than individual points" · "Add treedepth to the pairs plot and isolate divergent draws with anomalously LOW treedepth"

**✓ DV3** · when divergences **cluster at small τ / an abrupt boundary** in the non-divergent cloud → reading them as true-positive funnel-neck geometry works. *[→ entry](../recs/CC-geometry-sampling/DV3.md)*
- why: eight-schools shows divergent transitions at log(τ)<0 with a sharp lower boundary the sampler cannot penetrate → identifies the CP parameterization failure.
- conditions: prior suspicion about a specific model component makes the search cheaper.
- tier: 🟢 · source: rstan_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Localize with targeted pairs plots: each group param against its own hyper-mean and hyper-sd" · "Locate the hierarchical scale parameter that a coordinate could funnel into"

**✗ DV4** · when divergences **scatter uniformly** like non-divergent draws → treating each as THE pathology location does **NOT** work (false positives / pure numerical error). *[→ entry](../recs/CC-geometry-sampling/DV4.md)*
- why: uniform scatter is step-size-too-large numerical error; these vanish under an adapt_delta escalation, unlike clustered true positives.
- conditions: distinguish only by cluster analysis + the adapt_delta probe.
- tier: 🟢 · source: rstan_workflow, divergences_and_bias
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- pragmatic anchor (pymc-L1): a **<0.1% randomly-scattered** divergence rate is often treated as acceptable in practice — an operational threshold for this "false-positive scatter" case. The strict counter-stance (Betancourt: investigate *any* divergence for bias) still holds when scatter can't be confirmed; the split is pragmatic-tolerant vs strict-investigate.
- moves: "Correct the knob direction: raise adapt_delta ONLY for divergences; otherwise LOWER it so the adapted stepsize stays large enough to move" · "Look at the ENSEMBLE of divergent draws rather than individual points"

**✓ DV5** · when unsure whether divergences are true vs false positive → the **adapt_delta escalation probe** works to classify them. *[→ entry](../recs/CC-geometry-sampling/DV5.md)*
- why: false-positive divergences (numerical error) vanish completely near adapt_delta=1; true-positive geometry failures persist.
- conditions: requires a RANGE of adapt_delta, not a single value; HMC/NUTS.
- tier: 🟢 · source: divergences_and_bias
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Build a funnel and dial its dimension; raise adapt_delta to suppress divergences and watch which diagnostic survives" · "Correct the knob direction: raise adapt_delta ONLY for divergences"

**✓ DV6** · when the divergence count stays **flat across adapt_delta 0.85→0.99** → diagnosing true geometric non-ergodicity and reparameterizing (NCP) works. *[→ entry](../recs/CC-geometry-sampling/DV6.md)*
- why: a flat count as step size shrinks is the fingerprint that no step-size reduction restores geometric ergodicity for the centered parameterization.
- conditions: 10k post-warmup, single chain, weakly-informed CP (8 groups, σ_n up to 28).
- tier: 🟢 · source: divergences_and_bias
- efficacy: {divergences: ~0 (0.80, false neg), ~295 (0.85), ~315 (0.90), ~235 (0.95), ~255 (0.99) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run the model on the shared dataset, inspect adapt_delta sensitivity, and read the geometry against a known case study" · "Identify the centered hierarchical parameterization as the root cause and prescribe non-centered reparameterization"

**✗ DV7** · when **near-zero divergences at the LARGEST step size** (adapt_delta≈0.80) → reading it as "resolved" does **NOT** work (false negative). *[→ entry](../recs/CC-geometry-sampling/DV7.md)*
- why: a low count at the largest step size can mean the chain never entered the funnel, not that the funnel is resolved.
- conditions: must be compared against a swept range; single adapt_delta cannot distinguish ergodic from non-ergodic.
- tier: 🟢 · source: divergences_and_bias
- efficacy: {divergences: ~0 at adapt_delta=0.80 (false negative) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Correct the knob direction: raise adapt_delta ONLY for divergences; otherwise LOWER it" · "Manually decrease the stepsize below what adaptation chose, post-warmup"

**✓ DV8** · when divergences appear **even in a prior-only run** (no likelihood) → the origin is the prior / reject()-abuse / heavy-tailed positive scale — the prior-only test localizes it, works. *[→ entry](../recs/CC-geometry-sampling/DV8.md)*
- why: running the prior model without the likelihood isolates whether the funnel is prior-induced or reject()-induced.
- conditions: reject() and likelihood must be structurally separable; most acute for vague/heavy-tailed priors on positive scale/precision parameters.
- tier: 🟢 · source: mc-stan:10759, mc-stan:18100, mc-stan:24267
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Locate where the funnel-forming parameter actually enters the program (likelihood/transformed-params vs generated quantities)" · "Set the interpretation policy for divergence counts before chasing them"

**✗ DV9** · when a chain **freezes intermittently in a funnel neck** (sticky excursions) → relying on those excursions to self-correct on a finite run does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/DV9.md)*
- why: frozen excursions are the only ASYMPTOTIC bias correction, but on finite runs they produce oscillating signed bias and declining ESS-per-iteration — the MCMC CLT needs the geometric ergodicity the pinch breaks.
- conditions: curvature high relative to step length; single-chain context (Eight Schools CP, 10k iterations).
- tier: 🟢 · source: divergences_and_bias, markov_chain_monte_carlo
- efficacy: {divergences: pending · min_ess: declining ESS-per-iteration (oscillating running mean) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Set the interpretation policy for divergence counts before chasing them — separate 'predictive metric looks fine' from 'posterior is unbiased'" · "Manually decrease the stepsize below what adaptation chose, post-warmup"

**✗ DV10** · when a **true funnel** produces divergences → raising adapt_delta to suppress the count does **NOT** cure the exploration failure. *[→ entry](../recs/CC-geometry-sampling/DV10.md)*
- why: it merely probes slightly deeper into the neck while still truncating it; posterior bias persists. Only reparameterization removes the curvature.
- conditions: source confirmed as true funnel geometry by the escalation test (divergences persist, don't vanish completely).
- tier: 🟢 · source: hierarchical_modeling, rstan_workflow
- efficacy: {divergences: Neal K=1 funnel 225/4000 (5.6%) → 6/4000 (0.15%) at adapt_delta=0.999; Eight Schools CP 82 (0.8) → 25 (0.9), does not vanish · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Correct the knob direction: raise adapt_delta ONLY for divergences" · "Identify the centered hierarchical parameterization as the root cause and prescribe non-centered reparameterization"

### Zero divergences, but suspicious

**✗ ZD1** · when **zero divergences in an underdetermined regression** (N<M) → concluding correct exploration does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/ZD1.md)*
- why: the underdetermined likelihood pushes σ toward zero into a funnel (the extra parameters let residuals shrink to ~0), but the data soften that σ→0 tip just enough to keep the divergence count at zero, yet E-FMI=0.028, 74.5% tree-depth saturation, R̂=2.38 on lp__ — the absence of divergences is not a near-miss but actively misleading.
- conditions: N=100, M=200 slopes; weakly-informative priors; default max_treedepth=10; 4 chains, 4000 post-warmup.
- tier: 🟢 · source: underdetermined_linear_regression
- efficacy: {divergences: 0 · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Set the interpretation policy for divergence counts before chasing them — separate 'predictive metric fine' from 'posterior unbiased'" · "Read out the actual E-BFMI value (not just the boolean warning) and validate inference against ground truth via simulation"

**✗ ZD2** · when **zero divergences + clean E-BFMI + no tree-depth saturation** in a multimodal posterior → concluding convergence does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/ZD2.md)*
- why: NUTS explores whichever mode it started in; inter-mode barriers are log-density valleys, not geometry kinks, so they never produce divergences. Only split-R̂ ≫ 1 and multi-chain scatter reveal the missed modes.
- conditions: modes separated by near-zero-density regions; each mode locally benign; chains at different modes.
- tier: 🟢 · source: identifying_mixture_models
- efficacy: {divergences: clean/pass · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Simulate a dataset from the model with known/recovered parameters and refit; check whether divergences reproduce" · "Use a multivariate / all-parameter view to surface the joint structure and rank candidate parameters"

**✓ ZD3** · when a **global funnel is present but divergences lag** → reading E-FMI (below 0.2) as the earlier warning works. *[→ entry](../recs/CC-geometry-sampling/ZD3.md)*
- why: energy-level exploration is impaired before divergences accumulate to diagnostic levels.
- conditions: global (non-localized) single top-level scale; chain-specific — only chains near the neck trigger it.
- tier: 🟢 · source: hierarchical_modeling
- efficacy: {divergences: 2/4000 (K=9 pure funnel) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read out the actual E-BFMI value (not just the boolean warning)" · "Locate the hierarchical scale parameter that a coordinate could funnel into"

### Tree-depth saturation

**✓ TD1** · when tree-depth saturates **without divergences and with normal E-FMI** → reading it as non-identifiability / an elongated ridge (not a max_treedepth deficit) works. *[→ entry](../recs/CC-geometry-sampling/TD1.md)*
- why: saturation without divergences means the correlation length exceeds 2^max_treedepth leapfrog steps; ordinal ridge (no anchor) gives R̂~2.3 / n_eff~0.00073 / ~97% saturation for ALL params, single-parameter wandering ~1.95 / ~0.00075 / ~87% for the one c[k].
- conditions: E-FMI normal rules out funnel/curvature; ordinal logistic/probit shown.
- tier: 🟢 · source: ordinal_regression
- efficacy: {divergences: 0 (without divergences) · min_ess: n_eff ~0.00073 (ridge, all params) / ~0.00075 (single param) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "interpret deep-tree saturation as a correlation / non-identifiability signature, not a tuning issue" · "Treat max_treedepth saturation as a (capped) trajectory-length warning, raise max_depth until saturation stops, and refuse to ignore any R-hat > 1.1"

**✗ TD2** · when tree-depth saturates from a **correlation-length / non-identifiability ridge** → raising max_treedepth alone to "fix" it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/TD2.md)*
- why: longer trajectories don't remove the ridge; the posterior still wanders a non-identified / near-unit-correlated surface.
- conditions: ridge non-identifiability (missing anchor) or near-unit neighbor correlation.
- tier: 🟢 · source: ordinal_regression, brownian_bridge
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Treat max_treedepth saturation as a (capped) trajectory-length warning, raise max_depth until saturation stops, and refuse to ignore any R-hat > 1.1" · "interpret deep-tree saturation as a correlation / non-identifiability signature"

**✓ TD3** · when tree-depth saturates in a **fine-grid discretized Markov chain** (CP, near-unit neighbor correlation) → NCP (sample i.i.d. innovations, reconstruct states deterministically) resolves it, works. *[→ entry](../recs/CC-geometry-sampling/TD3.md)*
- why: CP imposes near-unit correlations between neighboring states → an elongated ridge; NCP decorrelates them.
- conditions: N ≥ several hundred states, short increments, observations sparse relative to N.
- tier: 🟢 · source: brownian_bridge
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize the group-level effects to non-centered form (gamma_raw ~ std_normal…)" · "Verify the reparameterized geometry is decoupled"

**✓ TD4** · when **Cauchy tail quantiles matter** → raising max_treedepth to 20 to let trajectories reach U-turns deep in the tails works (at high cost). *[→ entry](../recs/CC-geometry-sampling/TD4.md)*
- why: NUTS is geometrically correct but the tail trajectories are so long that max_treedepth=20 is load-bearing.
- conditions: prior-dominated Cauchy; NUTS (static HMC fails categorically); ~2000 grad-evals/iter at depth 20.
- tier: 🟢 · source: fitting_the_cauchy
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — median ~2000 gradient evals/iteration at max_treedepth=20 (cost, no slot)
- moves: "Reframe runtime in terms of gradient evaluations: inspect leapfrog steps per iteration rather than wall-clock" · "Perturb the sampler controls (max_treedepth, adapt_delta) and watch whether 'cleanness' is stable"

**✗ TD5** · when reading **Cauchy tail quantiles at default max_treedepth=10** → trusting them does **NOT** work (silent downward bias). *[→ entry](../recs/CC-geometry-sampling/TD5.md)*
- why: tail-visiting trajectories are silently truncated — no divergence, no saturation warning — biasing tail quantiles downward.
- conditions: prior-dominated Cauchy; default depth 10; product of N=50 independent Cauchy variates tested.
- tier: 🟢 · source: fitting_the_cauchy
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a minimal heavy-tailed 1-D target and read the diagnostic triple (divergences / E-BFMI / R-hat / treedepth)" · "Perturb the sampler controls (max_treedepth, adapt_delta)"

### E-BFMI / E-FMI signals

**✗ EF1** · when **E-FMI passes but the funnel is localized** (per-latent-pair) → concluding good geometry does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/EF1.md)*
- why: each narrow neck contributes a diluted share of total energy variance; the more contexts, the more diluted → E-FMI becomes an increasingly unreliable funnel detector as the model scales. Divergence counts stay primary.
- conditions: hierarchical factor / scale-mixture / horseshoe with per-context or per-observation scales.
- tier: 🟢 · source: factor_modeling, modeling_sparsity
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Triage the warning hierarchy: read which diagnostic dominates (E-BFMI vs divergences vs treedepth)" · "Plot one or a handful of local parameters against the shared hierarchical scale parameter they depend on"

**✗ EF2** · when **E-FMI passes** → concluding no posterior degeneracy does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/EF2.md)*
- why: E-FMI is insensitive to flat directions, continuous/discrete concentration on a lower-dim surface, and multimodality — regardless of how severe R̂/divergences/treedepth are; it detects only incoherent diffusive energy exploration.
- conditions: additive/multiplicative flat priors, mixture label-switching / unidentified components.
- tier: 🟢 · source: identifiability
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — flat additive prior: R̂=1.35 for b, 60% treedepth saturation, E-FMI clean (no slot)
- moves: "Triage the warning hierarchy: read which diagnostic dominates, and cross-check that a non-HMC fit succeeds" · "Use a multivariate / all-parameter view to surface the joint structure"

**✓ EF3** · when a **single global scale funnels but divergences lag** → treating E-FMI < 0.2 as an early-warning obstruction signal works. *[→ entry](../recs/CC-geometry-sampling/EF3.md)*
- why: energy-level exploration is impaired before divergences accumulate.
- conditions: global (non-localized) funnel; chain-specific — only chains near the neck trigger.
- tier: 🟢 · source: hierarchical_modeling
- efficacy: {divergences: 2/4000 (K=9) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — E-FMI 0.134/0.160 (no slot)
- moves: "Read out the actual E-BFMI value (not just the boolean warning)" · "Locate the hierarchical scale parameter that a coordinate could funnel into"

**✗ EF4** · when **E-BFMI > 1** → treating it as a pathology does **NOT** work (benign artifact). *[→ entry](../recs/CC-geometry-sampling/EF4.md)*
- why: on low-dimensional / simple targets the marginal energy is sharply bounded below while conditional energy changes are not → a variance-ratio artifact; E-(B)FMI carries no calibrated upper interpretation.
- conditions: low-dim/simple targets (e.g. mean of iid Gaussian); diminishes as dimension grows.
- tier: 🟡 · source: mc-stan:28554
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read out the actual E-BFMI value (not just the boolean warning)" · "Calibrate severity and consult the canonical divergence reference before tuning"

**✓ EF5** · when applying the **0.2 E-BFMI threshold** → treating it as a rough empirical guideline (not a calibrated law) works as the correct stance. *[→ entry](../recs/CC-geometry-sampling/EF5.md)*
- why: the diagnostic's author labels 0.2 a "very rough recommendation" subject to revision; Stan's console output and the check_energy utility threshold can even disagree on the same fit.
- conditions: Betancourt's own qualifier at the time of the case studies.
- tier: 🟡 · source: pystan_workflow / rstan_workflow (named in the claim's nuance; input `sources` array is empty)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Calibrate severity and consult the canonical divergence reference before tuning"

### Reparameterization & metric choice

**✓ RP1** · when **per-group data are sparse / the prior dominates** → non-centered parameterization (NCP) works. *[→ entry](../recs/CC-geometry-sampling/RP1.md)*
- why: relocates the τ-coupling into θ=μ+τ·θ̃, decoupling the scale from the sampling geometry; removes the CP funnel's divergences.
- conditions: normal hierarchy; half-normal/infinity-suppressing τ prior; the advantage reverses under dense data.
- tier: 🟢 · source: hierarchical_modeling, factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Identify the centered hierarchical parameterization as the root cause and prescribe non-centered reparameterization" · "Reframe the funnel as a sampler-geometry problem: NCP is equivalent to Riemannian/second-order HMC" · "Verify the reparameterized geometry is decoupled"

**✗ RP2** · when **per-group data are dense / the likelihood dominates** → NCP does **NOT** work (inverted funnel). *[→ entry](../recs/CC-geometry-sampling/RP2.md)*
- why: fixing θ̃ enforces the hyperbolic constraint η_k·τ=const in the likelihood → an inverted funnel that worsens as the likelihood narrows; use CP here.
- conditions: dense per-group data; mirror image of CP's failure.
- tier: 🟢 · source: hierarchical_modeling, factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a centered parameterization for strongly-informed upsilon — per-element parameterization choice" · "Diagnose WHERE the funnel lives: subject↔population (reparameterizable) vs a funnel between population hyperparameters"

**✓ RP3** · when **levels within one model differ in data richness** → parameterizing per-level (mixed CP/NCP) works. *[→ entry](../recs/CC-geometry-sampling/RP3.md)*
- why: neither monolithic choice is safe under imbalance; center the data-rich levels, non-center the sparse ones.
- conditions: per-level assessment required; multiple levels in the same model can need different parameterizations.
- tier: 🟢 · source: hierarchical_modeling, factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a centered parameterization for strongly-informed upsilon (keep non-centered for weakly-informed ones)" · "Locate the hierarchical scale parameter that a coordinate could funnel into"

**✗ RP4** · when using **Stan's offset/multiplier sugar with a σ that can reach 0** → assuming it equals a hand-written NCP does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/RP4.md)*
- why: the +1/σ log(σ)-Jacobian gradient and the −1/σ normal_lpdf gradient come from different autodiff sources → catastrophic cancellation → permanently stuck at the σ→0 boundary.
- conditions: high-dimensional random-effect vectors; σ initialized or drifting very small (default Uniform(−2,2) init).
- tier: 🟡 · source: mc-stan:20712
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reproduce the built-in transform by hand to make the internal geometry observable" · "Rule out floating-point precision as the driver of step-size collapse"

**✓ RP5** · when **NCP is needed** → hand-writing `x_raw ~ std_normal(); x = μ + σ·x_raw` (not the built-in sugar) works. *[→ entry](../recs/CC-geometry-sampling/RP5.md)*
- why: the hand-rolled form avoids the offset/multiplier gradient-cancellation trap while encoding the identical posterior.
- conditions: hierarchical/random-effect scale that can approach zero.
- tier: 🟡 · source: mc-stan:20712
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize the group-level effects to non-centered form (gamma_raw ~ std_normal…)"

**✗ RP6** · when a **Gamma / Inverse-Gamma prior on a latent positive vector funnels** → reparameterizing the Gamma itself does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/RP6.md)*
- why: the Gamma has no cheap differentiable inverse-CDF in the shape and no offset/multiplier non-centering → it stays effectively centered and keeps its funnel.
- conditions: estimated shape/rate hyperpriors; weakly-informative / small-data regime where the neck is actually visited.
- tier: 🟡 · source: mc-stan:37076, mc-stan:1017, mc-stan:38465
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Add priors on the scale hyperparameters; escalate from wide weakly-informative to genuinely informative (lighter tails than Cauchy)" · "Change the model rather than the sampler: reparameterize the offending term, and/or add prior information"

**✓ RP7** · when a **Gamma-prior latent vector funnels** → substituting a LogNormal (or an informative zero-avoiding prior) works. *[→ entry](../recs/CC-geometry-sampling/RP7.md)*
- why: LogNormal admits the log-scale non-centering the Gamma resists.
- conditions: a log-scale shape for the latent is acceptable; else mean-shape reparam + tail-placement + a zero-avoiding prior.
- tier: 🟡 · source: mc-stan:37076, mc-stan:1017, mc-stan:38465
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Change the model rather than the sampler: reparameterize the offending term, and/or add prior information" · "Constrain the offending tails — tighten the relevant priors, and/or keep the parameter in log/unconstrained space throughout"

**✓ RP8** · when a **Cauchy/half-Cauchy prior in the prior-dominated regime** forces ~2000 grad-evals/iter → a Gamma or Inverse-Gamma **scale-mixture-of-Gaussians** reparameterization compacts the geometry, works. *[→ entry](../recs/CC-geometry-sampling/RP8.md)*
- why: the scale-mixture turns heavy-tailed contours into compact near-ellipsoidal ones — the gain is purely geometric.
- conditions: NUTS; the tangent trick applies specifically to a Cauchy/half-Cauchy on a `lower=0` scale/variance; data-rich settings may not need it.
- tier: 🟢 · source: mc-stan:9638, mc-stan:19997
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — grad-evals/iter ~2000 nominal → 15–31 (Gamma) / 7–15 (Inv-Gamma) (cost, no slot)
- moves: "Reframe runtime in terms of gradient evaluations: inspect leapfrog steps per iteration" · "Change the model rather than the sampler: reparameterize the offending term"

**✗ RP9** · when choosing a parameterization by **"best geometry"** (fewest grad-evals/iter) → assuming it wins ESS/second does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/RP9.md)*
- why: ESS/sec = (iterations/sec) × (ESS/iter); the tan()-CDF-inversion form wins ESS/iteration but loses iterations/second to transcendental cost → a three-way tie.
- conditions: CPU execution; transcendental function cost drives the result; the shortcut fails whenever per-step cost differences are non-negligible.
- tier: 🟢 · source: fitting_the_cauchy
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: ~2500 (tan / Alt 3) vs ~3500 (Inv-Gamma) · rmse: pending · coverage: pending}
- moves: "Try the cheap, non-structural fixes first (sampler kwargs, compile mode) and observe whether the speed picture moves"

**✓ RP10** · when a posterior is **well-identified but strongly anisotropic** and step-size-only adaptation collapses (accept≈0) → mass-matrix (metric) adaptation rescales the geometry, works. *[→ entry](../recs/CC-geometry-sampling/RP10.md)*
- why: dual-averaging picks ONE global step size — too large for the tight direction (rejections/divergences), too small for the loose one; a diagonal/dense metric fixes the scale heterogeneity.
- conditions: identity/fixed-metric symptom; another metric-adapting library succeeds on the same model.
- tier: 🟡 · source: pyro:259
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Examine the spread of inverse-mass-matrix entries and convert to implied per-parameter posterior SDs to test for scale heterogeneity" · "Try a dense (full) mass matrix as an alternative to reparameterization"

**✓ RP11** · when you must distinguish **"the metric can't capture the correlation" from "geometry is intrinsically curved"** → trying a dense (full) mass matrix works as the discriminator. *[→ entry](../recs/CC-geometry-sampling/RP11.md)*
- why: if a dense metric fixes it, the problem was global linear correlation; if not, it is intrinsic curvature needing reparameterization.
- conditions: dense-metric reach is limited to global linear correlation; the dense-vs-diagonal tradeoff bites for strongly correlated / high-dim parameters.
- tier: 🟡 · source: pymc:451, pymc:9728, pymc:5917
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a dense (full) mass matrix as an alternative to reparameterization, isolating 'metric can't capture the correlation' from 'geometry is intrinsically curved'" · "Reason about dense-metric reach versus the actual geometry"

### Likelihood-induced funnels, non-identifiability & collinearity

**✗ LF1** · when the **funnel lives in the likelihood** (underdetermined/collinear regression, σ-funnel) → NCP does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/LF1.md)*
- why: there is no prior scale to algebraically decouple; σ couples to the degenerate plane of equally-fitting slopes and the ridge narrows as σ→0.
- conditions: N<M+1 or perfectly-correlated covariates; the σ prior does not truncate the funnel from below.
- tier: 🟢 · source: taylor_models, underdetermined_linear_regression
- efficacy: {divergences: 0 (underdetermined N=100/M=200, softened tip) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose WHERE the funnel lives: distinguish a subject↔population funnel (reparameterizable) from a funnel between population hyperparameters" · "separate likelihood from posterior and write out both log-posteriors term by term"

**✓ LF2** · when covariates are **near-collinear** (x, x² for uncentered positive x) → centering / orthogonalizing via QR before fitting works. *[→ entry](../recs/CC-geometry-sampling/LF2.md)*
- why: the joint slope posterior collapses onto a narrow elongated ridge → HMC needs tiny steps + very long trajectories (>1M grad-evals); QR removes the correlation.
- conditions: uncentered predictors; likelihood-induced (weak prior); the posterior is identified (true param on the ridge) — purely computational.
- tier: 🟢 · source: qr_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — over 1,000,000 gradient evaluations reported (cost, no slot)
- moves: "Recommend QR decomposition of the predictor matrix: regress on Q, recover raw coefficients via R⁻¹" · "Inspect bivariate (pairs/ShinyStan) plots, especially intercept-vs-slope within and across groups, for ridges/funnels"

**✗ LF3** · when covariates are **left uncentered before a polynomial/nonlinear expansion** → HMC on the resulting ridge does **NOT** work (massive inefficiency). *[→ entry](../recs/CC-geometry-sampling/LF3.md)*
- why: the near-1D manifold spans a wide range the sampler must resolve fully in every trajectory.
- conditions: direction-preserving transforms of uncentered predictors.
- tier: 🟢 · source: qr_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize: move the removed column-mean content out of the basis and into the intercept's prior" · "Recommend QR decomposition of the predictor matrix"

**✗ LF4** · when **N<M+1 or perfectly-collinear covariates create a σ-funnel** → a weak/uninformative σ prior does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/LF4.md)*
- why: the degenerate ridge width narrows as σ→0, creating a funnel the likelihood cannot close.
- conditions: a strongly informative lower-bounded σ prior could regularize the geometry.
- tier: 🟢 · source: taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Constrain the offending tails — tighten the relevant priors" · "Add priors on the scale hyperparameters; escalate to genuinely informative"

### Sparsity priors (horseshoe / Laplace)

**✗ SP1** · when using a **classic horseshoe** (unbounded local scales) under a non-identified likelihood (M>N) → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/SP1.md)*
- why: unbounded λ lets relevant slopes diffuse arbitrarily large → bimodal/funnel τ geometry → E-BFMI collapse; relevant slopes are left under-regularized (their heavy tails escape, so their posteriors fail to concentrate) despite correct qualitative sparsity.
- conditions: M>N collinear design; tau_0=σ default (ignores N and m_0); NCP already applied.
- tier: 🟢 · source: bayes_sparse_regression
- efficacy: {divergences: 138 (adapt_delta 0.99, max_treedepth 15) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — 25% treedepth saturation, E-BFMI<0.12 (no slot)
- moves: "Constrain the offending tails — tighten the relevant priors, and/or keep the parameter in log/unconstrained space throughout" · "Localize the divergences in parameter space and look for pathological geometry"

**✗ SP2** · when a **horseshoe shows E-BFMI collapse + divergences** → raising adapt_delta/max_treedepth to fix it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/SP2.md)*
- why: these are geometry signals (heavy-tailed τ/λ funnel near zero), not tuning deficits; adapt_delta=0.99 & max_treedepth=15 still yield 138 divergences.
- conditions: classic horseshoe, non-identified likelihood, non-centered parameterization already applied.
- tier: 🟢 · source: bayes_sparse_regression
- efficacy: {divergences: 138 (persist at adapt_delta 0.99, max_treedepth 15) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Calibrate severity and consult the canonical divergence reference before tuning" · "Change the model rather than the sampler: reparameterize the offending term, and/or add prior information"

**✓ SP3** · when a **horseshoe is non-identified** → adding the Finnish/regularized slab (a Student-t cap on large slopes) works. *[→ entry](../recs/CC-geometry-sampling/SP3.md)*
- why: the slab caps escaped slopes at ~s·few without touching the spike → eliminates divergences, tree-depth saturation, and the E-BFMI pathology; accurate narrow posteriors for both relevant and irrelevant slopes.
- conditions: calibrate slab_scale (s~3–5 for slopes ~10) and slab_df; NCP of β and τ (τ non-centered relative to σ).
- tier: 🟢 · source: bayes_sparse_regression
- efficacy: {divergences: ~0 (pathology eliminated) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Change the model rather than the sampler: add prior information" · "Reparameterize the group-level effects to non-centered form"

**✗ SP4** · when using the **Laplace prior** (Bayesian LASSO) for simultaneous sparsity → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/SP4.md)*
- why: the uniform tail above λ competes with the spike below → over-shrinks relevant slopes and under-concentrates irrelevant ones (a dichotomous soft failure).
- conditions: M>N; Laplace scale ~ σ=1; collinear unit-variance design.
- tier: 🟢 · source: bayes_sparse_regression
- efficacy: {divergences: ~0 (passes except E-BFMI) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — E-BFMI 0.028–0.058 on all 4 chains, R̂>1.1 for σ and lp__ (no slot)
- moves: "Read out the actual E-BFMI value (not just the boolean warning)" · "Take the divergences seriously and refit; re-examine HMC diagnostics (ESS, Rhat) per-threshold"

### Gaussian-process scaling & latent fields

**✗ GP1** · when fitting a **dense exact GP beyond a few hundred–~1000 points** with HMC → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/GP1.md)*
- why: each gradient costs O(N³) (kernel Cholesky) and O(N²) memory → OOM or 0% progress; more data makes the matrix bigger, tuning the sampler doesn't help.
- conditions: latent-GP with a dense kernel matrix, N more than a few hundred, full Bayesian sampling.
- tier: 🟡 · source: mc-stan:3517, mc-stan:11661
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "reframe slowness as a divergence/geometry problem and reduce to a minimal reproducer" · "Change the model rather than the sampler"

**✓ GP2** · when a **GP is too large** → replacing it with a low-rank basis-function (HSGP) or a state-space/Markov (Matérn) representation works. *[→ entry](../recs/CC-geometry-sampling/GP2.md)*
- why: it changes the GP representation rather than tuning the sampler.
- conditions: basis-function route assumes a smooth stationary kernel + centered/bounded inputs; state-space route needs low-dim (1D, time-like) ordered inputs + a Matérn kernel (not squared-exponential); Laplace-marginalize a non-Gaussian likelihood.
- tier: 🟡 · source: mc-stan:3517, mc-stan:11661
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Attack GP hyperparameter non-identifiability via marginalization / reparameterization rather than priors alone" · "Change the model rather than the sampler"

**✓ GP3** · when a **latent-Gaussian/GP regression shows divergences concentrated at small σ** → analytically marginalizing the latent field (`y ~ multi_normal_cholesky(0, K+σ²I)`) works. *[→ entry](../recs/CC-geometry-sampling/GP3.md)*
- why: the pathology is the joint neck of the non-centered latent η with σ; integrating out η (and the intercept) removes it — more reliable than a zero-avoiding σ prior.
- conditions: Gaussian (or Laplace-approximable) likelihood; N small enough for a dense N×N Cholesky per iteration.
- tier: 🟡 · source: mc-stan:26425
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Localize the divergence source: separate kernel-hyperparameter non-identifiability from geometry by toggling which hyperparameter is sampled" · "Attack GP hyperparameter non-identifiability via marginalization / reparameterization rather than priors alone"

**✗ GP4** · when **GP divergences localize at small σ** → a zero-avoiding prior on σ alone does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/GP4.md)*
- why: pairs plots correctly localize to small σ, tempting a boundary-avoiding prior, but in practice it did not remove the divergences — the η–σ geometry is the cause.
- conditions: non-centered latent field coupled to the noise scale.
- tier: 🟡 · source: mc-stan:26425
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Test the zero-avoiding-prior remedy empirically: sweep the strength/location of the boundary-avoiding prior on sigma and tabulate divergence counts" · "Localize the divergence source"

### Discrete, multimodal & parameter-dependent-support structure

**✓ DM1** · when a model has **discrete component-assignment variables z** → marginalizing them out analytically (`log_sum_exp`) before sampling works. *[→ entry](../recs/CC-geometry-sampling/DM1.md)*
- why: HMC can't move in discrete space; the marginalized likelihood is a smooth convex combination, and Rao-Blackwell guarantees lower-variance estimates.
- conditions: continuous sampler (HMC/NUTS); components share a family enabling analytic marginalization.
- tier: 🟢 · source: mixture_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Marginalize the discrete latent variables: sum the joint density over all admissible values of the discrete states" · "Diagnose the failed marginalization attempt: ask whether it failed to IMPLEMENT vs implemented-but-wrong-results"

**✓ DM2** · when **mixture components are well-separated** (>~2–3 σ) → an ordering constraint selects one of the K! modes, works. *[→ entry](../recs/CC-geometry-sampling/DM2.md)*
- why: separated modes are distinct point clusters; ordering picks one.
- conditions: separation large enough that components don't continuously re-arrange.
- tier: 🟢 · source: identifying_mixture_models, mixture_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Simulate a dataset from the model with known/recovered parameters and refit"

**✗ DM3** · when **mixture components overlap** (<~1.5–2 σ) → the ordering constraint does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/DM3.md)*
- why: components continuously re-arrange to yield similar likelihoods → a 'bowtie' / curved ridge in (μ₁,μ₂) that rotates with the mixture weight → very low n_eff with NO divergences.
- conditions: mixture weight θ jointly inferred; K over-specified worsens it; ridge persists with or without the ordering constraint.
- tier: 🟢 · source: identifying_mixture_models, mixture_models
- efficacy: {divergences: 0 (no divergences) · min_ess: very low n_eff · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Use a multivariate / all-parameter view to surface the joint structure and rank candidate parameters" · "interpret deep-tree saturation as a correlation / non-identifiability signature"

**✗ DM4** · when a posterior is **multimodal with well-separated modes** → hard-rejecting constraints or trusting single-chain cleanliness does **NOT** work; use split-R̂ + multi-chain scatter. *[→ entry](../recs/CC-geometry-sampling/DM4.md)*
- why: within-mode diagnostics (divergences, E-BFMI, treedepth) all pass; only cross-chain comparison sees the missed modes.
- conditions: modes separated by near-zero density; chains at different modes.
- tier: 🟢 · source: identifying_mixture_models
- efficacy: {divergences: clean/pass · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — split-R̂ ≫ 1 (no slot)
- moves: "Simulate a dataset from the model with known/recovered parameters and refit; check whether divergences reproduce"

**✗ DM5** · when constraints are enforced by **hard-rejecting out-of-bounds points** (`target += -inf` / `reject()`) → it does **NOT** work under HMC. *[→ entry](../recs/CC-geometry-sampling/DM5.md)*
- why: a -inf cliff has no usable gradient → the Hamiltonian is not conserved → all-divergent transitions, R̂≫1, tiny ESS (looks like a sampler failure but is a coding choice).
- conditions: gradient samplers that map to unconstrained space; constraints on the PARAMETERS (not data).
- tier: 🟡 · source: mc-stan:38573
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read sampler diagnostics (divergences) and re-run with a higher target_accept to force a smaller step size near the hard boundary" · "Check whether the proposed value can leave the parameter's valid range — locate the constraint the sampler can violate"

**✓ DM6** · when parameters have **inequality/ordering/support constraints** → reparameterizing to an unconstrained space (built-in `<lower>`/`<upper>`, simplex/stick-breaking/affine bijections) works. *[→ entry](../recs/CC-geometry-sampling/DM6.md)*
- why: a smooth bijection keeps the log-density differentiable everywhere the leapfrog evaluates it.
- conditions: simple bounds → built-ins; coupled constraints (ordering, sum-to-bound, linear combinations) → a custom bijective transform.
- tier: 🟡 · source: mc-stan:38573
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose the constrained-parameter Jacobian: Stan optimizes on the UNCONSTRAINED scale — the target carries a change-of-variables term for lower-bounded params" · "Remove the flat region by eliminating the hard clip — reparametrize onto the constrained support instead"

**✗ DM7** · when a distribution's **support boundary depends on the parameters** (GEV with ξ<0) → the naive (μ,σ,ξ) parametrization does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/DM7.md)*
- why: the sampled endpoint moves under the sampler → a shifting wall → extreme curvature and near-total divergences even with standardization and non-centering.
- conditions: free-bound truncation / finite-support families; gradient samplers.
- tier: 🟡 · source: mc-stan:40694
- efficacy: {divergences: 90–97% (naive parametrization) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read sampler diagnostics (divergences) and re-run with a higher target_accept near the hard boundary" · "Check whether the proposed value can leave the parameter's valid range"

**✗ DM8** · when **`*_rng` is called inside the Stan model / transformed-parameters block** → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/DM8.md)*
- why: HMC differentiates a single deterministic unnormalized log-density; randomness makes the target non-deterministic and breaks leapfrog — `*_rng` is compile-time banned outside `transformed data` / `generated quantities`.
- conditions: any Stan HMC/NUTS model wanting to simulate/subsample inside the likelihood or port an `observe()`-style program.
- tier: 🟡 · source: mc-stan:23805, mc-stan:10296, mc-stan:3583
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the model graph for completeness before any sampler tuning: trace whether every term is defined" · "Compare the suspect log-density against a trusted reference implementation"

**✗ DM9** · when the generative model has **hard partitions / threshold splits** (trees) or a **sharply multimodal** parameter (raw-sinusoid frequency) → naive direct HMC does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/DM9.md)*
- why: hard thresholds make the log-density piecewise-constant (non-differentiable); sharp multimodality disconnects the typical set — the leapfrog integrator can't traverse either.
- conditions: gradient samplers; exception when the discrete structure can be exactly marginalized, or a strong prior / FFT-init collapses the multimodality.
- tier: 🟡 · source: mc-stan:11795, mc-stan:22038, mc-stan:3884
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Marginalize the discrete latent variables" · "Change the model rather than the sampler: reparameterize the offending term"

**✓ DM10** · when **discrete latent structure can be summed** (finite mixture, HMM) → marginalizing it (`hmm_marginal` / `log_sum_exp`) to restore differentiability works. *[→ entry](../recs/CC-geometry-sampling/DM10.md)*
- why: summing over admissible discrete states yields a smooth density HMC can differentiate (also Rao-Blackwell).
- conditions: finite, enumerable discrete states.
- tier: 🟡 · source: mc-stan:11795, mc-stan:22038, mc-stan:3884 (corroborates mixture_models)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Marginalize the discrete latent variables: sum the joint density over all admissible values of the discrete states"

**✗ DM11** · when treating a **gradient PPL (PyMC/Stan) as a discrete-PGM toolkit** → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/DM11.md)*
- why: these build one differentiable computational DAG solved by HMC/NUTS — no loopy BP, junction-tree, or structure learning; CPT/topology mental models map poorly.
- conditions: discrete Bayes-net background; CPTs over discretized parents; structure learning over adjacency matrices.
- tier: 🟡 · source: pymc:5619, pymc:3845, pymc:11674
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the model graph for completeness before any sampler tuning"

**✗ DM12** · when fitting a **Bayesian neural-network weight posterior** with HMC/NUTS or ADVI → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/DM12.md)*
- why: hidden-unit permutation + sign/aliasing symmetries give a combinatorial mode set (worse than K!), layered on funnel geometry; the sampler explores one basin and never characterizes the target.
- conditions: multilayer nets with weight-space symmetry; milder for a single linear/logistic layer; less relevant when only point predictions are needed.
- tier: 🟡 · source: mc-stan:3277, mc-stan:1399, pymc:8805
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "isolate by aggressively simplifying the model and inspecting per-parameter diagnostics" · "Use a multivariate / all-parameter view to surface the joint structure"

### Startup — initialization, gradient & support errors

**✗ ST1** · when **"Initial evaluation of model at starting point failed" / -inf logp** fires → forcing a new starting point does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/ST1.md)*
- why: the -inf is a logp (not a parameter value): a constrained quantity (σ≤0, a Beta shape ≤0, data outside support) left its support at the default start; a new start won't fix the structural cause.
- conditions: constrained quantity is a deterministic function of unconstrained latents/covariates (heteroskedastic/distributional regression, GLM shape params).
- tier: 🟡 · source: pymc:16104, pymc:7160, pymc:9994
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Confirm the failure is real and characterize it: look at the pairs plot and count divergences / mean treedepth at default settings" · "Diagnose the constrained-parameter Jacobian: change-of-variables term for lower-bounded params"

**✗ ST2** · when **"Gradient at the initial value is not finite"** but log_prob evaluates fine → assuming the value check suffices does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/ST2.md)*
- why: HMC depends entirely on the gradient, which can be NaN/Inf/wrong while the value is finite (≥4 distinct routes); debug the gradient channel (grad_log_prob / JVP) to find which parameter's gradient breaks.
- conditions: autodiff or externally supplied gradients; low acceptance across all step sizes.
- tier: 🟡 · source: mc-stan:5816, mc-stan:9813, mc-stan:25130
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation" · "Rule out floating-point precision as the driver of step-size collapse"

**✗ ST3** · when an **init-method failure** fires ("mass matrix zeros on the diagonal" / "bad initial energy" / NaN at start) → treating it as merely a bad start does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/ST3.md)*
- why: it usually signals model misspecification or pathological geometry; the init method (jitter+adapt_diag / adapt_full / ADVI-init) is a robustness/scaling tradeoff, not a free knob.
- conditions: PyMC NUTS; hierarchical / weakly-identified models; dense-vs-diagonal matters when parameters are strongly correlated.
- tier: 🟡 · source: pymc:451, pymc:9728, pymc:5917
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a dense (full) mass matrix as an alternative to reparameterization" · "Examine the spread of inverse-mass-matrix entries to test for scale heterogeneity"

**✓ ST4** · when **warmup adaptation is the bottleneck** → seeding HMC with a Pathfinder/VI init (even a poor posterior) works. *[→ entry](../recs/CC-geometry-sampling/ST4.md)*
- why: initialization and posterior-approximation are decoupled objectives — a variance-underestimating fit still lands a point in the bulk of the typical set.
- conditions: large nonlinear/hierarchical models with slow adaptation; low value when a dispersed default init already mixes.
- tier: 🟡 · source: mc-stan:34960
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Decouple the expensive warmup/metric estimation from production sampling by saving and reusing the adapted metric + step-size" · "Make adaptation actually run by shrinking the warmup adaptation schedule, then read back the adapted metric"

**✗ ST5** · when using a **Pathfinder / reverse-KL (ELBO) VI fit as the POSTERIOR** → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/ST5.md)*
- why: reverse-KL (the ELBO objective) is zero-forcing / mode-seeking → underestimates posterior variance and can badly miss hierarchical hyperparameters; it is useful only as an initializer.
- conditions: hierarchical models especially.
- tier: 🟡 · source: mc-stan:34960
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read out the actual E-BFMI value and validate inference against ground truth via simulation"

**✓ ST6** · when SVI on a **Bayesian NN/RNN gives a NaN ELBO at the first iteration** → shrinking the initial variational locs/scales works. *[→ entry](../recs/CC-geometry-sampling/ST6.md)*
- why: wide randn-seeded locs/scales make softplus(scale) and summed Normal log-probs overflow to NaN before any gradient step; it's an init/numerics problem, not a model bug.
- conditions: mean-field SVI; recurrent architectures (GRU/RNN/LSTM) compound log-probs over timesteps.
- tier: 🟡 · source: pyro:254
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Rule out floating-point precision as the driver of step-size collapse" · "Equalize and pin the starting point to isolate initialization effects"

**✓ ST7** · when reasoning about **where to start / why the mode is a bad target** → using the near-E[log p] definition of the typical set (not "a donut that always excludes the mode") works. *[→ entry](../recs/CC-geometry-sampling/ST7.md)*
- why: at moderate dimension the typical set can still contain the mode, and it is not invariant under nonlinear reparameterization; the clean donut picture is safe only in high dimension.
- conditions: moderate d (~10); under CP↔NCP / log-exp transforms.
- tier: 🟡 · source: mc-stan:17174
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Equalize and pin the starting point to isolate initialization effects"


**⚪ ST8** · when **step-size adaptation "crashes" (step size spirals toward 0) during warmup** on a model with a discontinuous log-density → reading it as a machinery-layer symptom of model *structure* (not a bad `adapt_delta`) works — and note that the acceptance statistic (`accept_stat`, the "acceptance ratio" of NUTS) that adaptation drives toward `adapt_delta` is itself a design choice, not a law. *[→ entry](../recs/CC-geometry-sampling/ST8.md)*
- why: the current target averages the hypothetical Metropolis acceptance probability uniformly over each trajectory, so at a symmetric discontinuity (`x[1]>0 ? 0 : -10`) the statistic sits (per betanalpha, "probably") near 0.5 for *every* step size → dual averaging keeps shrinking the step size with no gain (a "fatal spiral"); the discontinuity invalidates the smooth statistic↔cost relationship the adaptation assumes.
- conditions: HMC/NUTS dual-averaging step-size adaptation; log-density with a hard branch/jump (a C6 discontinuity); Stan's current uniform-average target. The reverted "Boltzmann-weighted" target (stan#2836) gives lower-energy-error points higher weight, so it tunes for one side and *avoids the crash* — but per betanalpha this is **not a cure**: neither target guarantees any behavior at a discontinuity, the trajectories still under-explore the jump, and multinomial sampling may merely mask it on this small problem.
- tier: ⚪ · source: mc-stan:22752
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- both positions (why stan#2836 was reverted): nhuurre — reverted "simply because the devs couldn't agree if it had been tested adequately" plus a release deadline; "no concrete problems were known." betanalpha — that is "not the full story," a developer-*governance* breakdown, stressing "no problems were ever suggested, let alone demonstrated" — the change was theory-motivated and empirically verified. Both agree no technical defect was ever shown; they differ on the completeness/framing of the reversal.
- moves: "Reproduce with a minimal discontinuous target (`x ~ std_normal(); target += (x[1]>0) ? 0 : -10`) and watch the adapted step size collapse during warmup" · "Read a warmup step-size collapse as a possible model-structure (discontinuity) signal — scan the log-density for hard branches / `reject()` / jumps before blaming `adapt_delta`"

### Slow / stalling / scaling

**✗ SC1** · when a fit **stalls or runs pathologically slowly** → parallelization (map_rect/reduce_sum/MPI/more cores) as the FIRST move does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/SC1.md)*
- why: parallelism cuts cost per gradient by at most a constant; effective-samples-per-gradient is set by geometry alone. A stuck model is usually misspecified/non-identified/over-parameterized.
- conditions: stalls in warmup / super-linear runtime; once well-specified & conditioned, reduce_sum/map_rect IS the right tool.
- tier: 🟡 · source: mc-stan:14303, mc-stan:14300
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe persistent slowness as a diagnostic signal — short cheap runs and posterior inspection of parameter correlations" · "Reframe via the folk theorem: treat the slowdown as a geometry/identifiability symptom, isolate by building up complexity one layer at a time"

**✓ SC2** · when a fit is **slow** → reframing it as a geometry/identifiability symptom (short cheap runs, inspect parameter correlations, build complexity one layer at a time) works. *[→ entry](../recs/CC-geometry-sampling/SC2.md)*
- why: the folk theorem — computational trouble signals a model problem; a minimal reproducer localizes it.
- conditions: general; pairs plots in the space the sampler actually works in.
- tier: 🟡 · source: mc-stan:14303, mc-stan:14300
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "reframe slowness as a divergence/geometry problem and reduce to a minimal reproducer" · "isolate by aggressively simplifying the model and inspecting per-parameter diagnostics" · "incrementally add complexity back, one block at a time, watching diagnostics at each step"

**✗ SC3** · when **vectorizing a computation "for its own sake"** to speed Stan → it does **NOT** work as the primary lever. *[→ entry](../recs/CC-geometry-sampling/SC3.md)*
- why: vectorization only reduces the number of autodiff variables; the dominant levers in order are (1) posterior geometry, (2) #autodiff variables, then (3) specialized vectorized functions.
- conditions: loop-vs-vectorized likelihoods, factor-indexed predictors, reduce_sum slicing.
- tier: 🟡 · source: mc-stan:510, mc-stan:20567, mc-stan:16486
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe runtime in terms of gradient evaluations: inspect leapfrog steps per iteration rather than wall-clock"

**✓ SC4** · when a **custom `_lpdf` recomputes an expensive data-independent term** (integrate_1d, ODE, big linear algebra) once per observation → vectorizing the `_lpdf` to compute it once per leapfrog step works. *[→ entry](../recs/CC-geometry-sampling/SC4.md)*
- why: Stan does not cache/memoize across per-obs `~` calls; the data-independent term is repeated N× per gradient evaluation.
- conditions: term depends on parameters but not the individual data point; keep the `~` sampling-statement form.
- tier: ⚪ · source: mc-stan:24425
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Change the model rather than the sampler: reparameterize the offending term"

**✗ SC5** · when **offloading dense Cholesky / triangular-solve / GLM to GPU** expecting a FLOP-proportional speedup → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/SC5.md)*
- why: these ops are memory- and PCIe-bandwidth-bound in a sampler (small-to-moderate matrices round-tripped each leapfrog step); empirical speedups cap at ~10–30× despite >10× theoretical FLOPS.
- conditions: fp64 required; the matrix op is the bottleneck and data round-trips each gradient evaluation.
- tier: 🟡 · source: mc-stan:9136, mc-stan:17113, mc-stan:12835
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe runtime in terms of gradient evaluations" · "Try the cheap, non-structural fixes first (sampler kwargs, compile mode)"

**✗ SC6** · when expecting an **online O(1) Kalman/particle filter step to update the hyperparameter POSTERIOR** → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/SC6.md)*
- why: the recursion propagates the latent-state distribution only for FROZEN hyperparameters; the deep-parameter posterior is tied to the exact dataset and needs re-inference on new data.
- conditions: state-space models; linear-Gaussian exact / EKF-particle approx for states, never the hyperparameters.
- tier: 🟡 · source: pymc:17654, pymc:17575, pymc:17628
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Decouple the expensive warmup/metric estimation from production sampling by saving and reusing the adapted metric + step-size"

### Implementation — differentiable / JIT-able linear algebra

**✗ IM1** · when computing **sparse log-determinant gradients in float32** → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/IM1.md)*
- why: the log-det JVP (partial-inverse + trace) accumulates rounding error → JVP error ~8.8e-4 in float32 vs ~8.5e-13 in float64, while the PRIMAL log-det can look correct in both; enable jax_enable_x64.
- conditions: log-det path specifically (the triangular-solve JVP is fine to ~1e-7 in float32); error scales with problem size.
- tier: 🟢 · source: dansblog:derivatives
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — JVP error 8.8e-4 (f32) → 8.5e-13 (f64) (no slot)
- moves: "Rule out floating-point precision as the driver of step-size collapse" · "Compare the suspect log-density against a trusted reference implementation"

**✗ IM2** · when an **expensive primal (Cholesky) must be shared across multiple tangents** via `ad.defjvp`/`defjvp2` → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/IM2.md)*
- why: defjvp registers separate per-argument JVPs each repeating the forward computation; the manual `(arg_values, arg_tangents) -> (primal, jvp)` value_and_jvp pattern returns both in one call so an O(n³) factorization runs once.
- conditions: only when the primal is expensive and reused; for cheap primals defjvp is simpler and better.
- tier: 🟡 · source: dansblog:derivatives
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation"

**✓ IM3** · when a **JAX primitive needs to call non-JAX code** (scipy/Fortran/C++) → putting it in `def_impl` (which receives concrete numpy-duck-typed arrays) works. *[→ entry](../recs/CC-geometry-sampling/IM3.md)*
- why: `def_impl` is not traced — a stable seam for non-JAX kernels; but `def_abstract_eval` must still work on ShapedArray, and JIT/vmap/grad rules are added separately (else `jit` fails at trace time).
- conditions: eager-mode only until the transformation rules are registered.
- tier: 🟢 · source: dansblog:sparse4
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation"

**✗ IM4** · when building a **JIT-compilable differentiable sparse Cholesky via pure-Python JAX idioms** (vmap/fori_loop/scan/lax.map/tree_map) → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/IM4.md)*
- why: value-dependent ragged column shapes break vmap/scan/fori_loop without heavy padding, and tree_map compile times explode above n≈20; the only viable path is a custom JAX primitive wrapping a compiled XLA kernel with manual JIT/VJP(/batching) rules.
- conditions: as of JAX ~0.3.x (2022); stated as personal failure, not universal impossibility.
- tier: 🟢 · source: dansblog:sparse-cholesky3
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation"

**✓ IM5** · when a **JAX sparse algorithm needs doubly-indirect scatter** (col_ptr[node] as write index) → accumulating (col,row) COO pairs with a monotonic integer counter, then sort + CSC via scipy outside JAX, works (~150×). *[→ entry](../recs/CC-geometry-sampling/IM5.md)*
- why: single-level direct addressing (`index[k].at[counter].set(val)`) avoids the double indirection XLA can't handle; hand the sort/CSC to scipy.
- conditions: symbolic (structural) phase only; nnz static (recompile per sparsity pattern); needs scipy, not GPU-portable.
- tier: 🟢 · source: dansblog:sparse7
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — ~150× speedup at n=4000 (no slot)
- moves: "Compare the suspect log-density against a trusted reference implementation"

**✗ IM6** · when passing **row-major dense blocks into Eigen CCS (column-major) block assembly** → it does **NOT** work. *[→ entry](../recs/CC-geometry-sampling/IM6.md)*
- why: the interleaving loop is defined relative to column traversal, so row-major input silently produces an incorrect CCS layout (not merely cache misses); require_* macros check type identity, not storage order.
- conditions: Eigen SparseMatrix CCS; mixed sparse/dense blocks; no compile/runtime guard on storage order.
- tier: 🟢 · source: dansblog:blocks
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation"

**✓/✗ IM7** · when **assembling a 2×2 block-structured sparse matrix in Eigen** → manual column-by-column CCS interleaving (~100 lines of raw-pointer construction) **works**; triplet (insert-then-compress) construction does **NOT** (destroys the column-sorted CCS invariant and is slower). *[→ entry](../recs/CC-geometry-sampling/IM7.md)*
- why: Eigen exposes no higher-level mixed sparse/dense block-assembly API; the three CCS arrays (outer, inner, val) must be walked column by column.
- conditions: lower-triangle-only symmetric storage; header-only Eigen expression-template context.
- tier: 🟢 · source: dansblog:blocks
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation"

**✗ IM8** · when computing a **CNF's log-det trace `tr(df/dx)` by naive autodiff** → it does **NOT** scale. *[→ entry](../recs/CC-geometry-sampling/IM8.md)*
- why: autodiff computes each Jacobian row separately → d backward passes → O(d²); the Hutchinson estimator needs one JVP (O(d)) but adds variance ∝ the Jacobian's Frobenius norm, and structured f (masked-autoregressive/triangular) gives an analytic trace.
- conditions: general unconstrained f; Hutchinson variance dominates for ill-conditioned / high-norm Jacobians.
- tier: 🟢 · source: dansblog:diffusion
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reduce scope: make the model sample correctly WITHOUT the flow before reintroducing it"

**✓ IM9** · when you need **both the forward (training) and reverse (sampling) map of a CNF** → learning one vector field f works (the same f drives both directions; reversibility is free). *[→ entry](../recs/CC-geometry-sampling/IM9.md)*
- why: solving the ODE backward with the terminal condition gives the inverse from the same f (Picard-Lindelöf for Lipschitz f); no need to commit to modeling T or T⁻¹.
- conditions: ODE well-posed in both directions; does not remove the trace bottleneck or the information desert.
- tier: 🟢 · source: dansblog:diffusion
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reduce scope: make the model sample correctly WITHOUT the flow before reintroducing it"

**✗ IM10** · when a **CNF's vector field f is constrained only at the two endpoints** → learning it is unnecessarily hard (the "information desert"). *[→ entry](../recs/CC-geometry-sampling/IM10.md)*
- why: f can freestyle in the interior with no intermediate distributional constraints; structural penalties (kinetic energy, Jacobian Frobenius norm) are the only mitigation and lack a clean Bayesian-prior analogue.
- conditions: general unconstrained f; masked-autoregressive architectures mitigate but don't eliminate.
- tier: 🟢 · source: dansblog:diffusion
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "incrementally add complexity back, one block at a time, watching diagnostics at each step"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
divergences_and_bias · rstan_workflow · pystan_workflow · hierarchical_modeling · factor_modeling ·
markov_chain_monte_carlo · fitting_the_cauchy · mixture_models · identifying_mixture_models ·
bayes_sparse_regression · ordinal_regression · brownian_bridge · qr_regression · taylor_models ·
underdetermined_linear_regression · identifiability · modeling_sparsity

**Dan Simpson blog** (`dansblog:<slug>` → `https://dansblog.netlify.app/posts/…`):
derivatives (`2022-05-20-to-catch-a-derivative…`) · sparse4 (`2022-05-18-sparse4-some-primatives`) ·
sparse-cholesky3 (`2022-05-14-jax-ing-a-sparse-cholesky-factorisation-part-3…`) ·
sparse7 (`2022-11-27-sparse7`) · blocks (`2024-09-04-block-matrices`) · diffusion (`2023-01-30-diffusion`)

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pymc:N` → `https://discourse.pymc.io/t/…/N`;
`pyro:N` → `https://forum.pyro.ai/t/…/N`).

### Variational approximation

**✓ VI1** · when you want faster, more stable VI convergence than stochastic ADVI → deterministic ADVI (DADVI) works. *[→ entry](../recs/CC-geometry-sampling/VI1.md)*
- why: DADVI fixes the Monte-Carlo sample set used to estimate the ELBO so the gradient is deterministic, removing MC gradient noise → faster, more stable VI convergence than stochastic ADVI (Giordano et al.).
- conditions: VI approximation; PyMC entry point `pymc_extras.fit(method='dadvi')`. DADVI still optimizes the ELBO (reverse-KL), so the ST5 zero-forcing caveat holds — a VI initializer/approximation, not a drop-in final posterior.
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

### Sampler backend selection

**✓ BK1** · when choosing a PyMC NUTS backend → selecting from the nutpie / numpyro / pymc menu works — a constant-factor cost lever, never a geometry fix. *[→ entry](../recs/CC-geometry-sampling/BK1.md)*
- why: backend choice moves cost-per-gradient by a constant factor, never ESS-per-gradient — geometry is backend-invariant (per C1). nutpie (Rust, PyMC 6 default, best mass-matrix adaptation, ~2–5× faster than pure-Python NUTS, CPU); numpyro (JAX, GPU, `nuts={'chain_method':'vectorized'}` runs all chains as one batched program); pymc (pure-Python fallback, needed for compound steps).
- conditions: set via `pm.sample(nuts_sampler=...)`; nutpie supports scan/AR/GARCH11/HSGP/Mixture/DensityDist, so a "complex model" is not a reason to downgrade the backend.
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — nutpie ~2–5× faster than pure-Python NUTS on HSGP models (speedup factor, no slot)
