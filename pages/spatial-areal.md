# Spatial & areal models (CAR / ICAR / BYM, GMRFs, spatial GPs)

## Claims (the *why* — mid-level, ~3–5)

*Five mid-level principles synthesized from 7 granular claims. Tier is the best-supported of the
granular claims each subsumes. Source short-ids resolve to URLs in the Source key at the bottom.*

### C1 · Precision, not covariance, is the working representation for structured spatial models — and it has an exact boundary 🟢

**Statement.** For latent-Gaussian spatial models the sparse *precision* matrix Q(θ) — not the
covariance Σ — is the mandatory working parameterization, because it is what keeps the model
tractable; but the framework has a hard architectural boundary: some kernels (notably the RBF /
squared-exponential) cannot be represented inside it at all.

**Nuance.** Two facts define the framework. (i) The inverse of a connected sparse precision is
*generically dense*, so working in covariance form destroys all sparsity and collapses O(n^1.5)
sparse-Cholesky cost to O(n^3) — precision-form is mechanistic, not stylistic — and it is defeated in
exactly one model-class case: a *dense* design matrix Z (subset-of-regressors / predictive-process
GPs with global inducing points), where AᵀW⁻¹A goes dense regardless of how sparse Q(θ) is, because
each observation then depends on O(n) latents. (ii) The RBF kernel is architecturally excluded by two
concurrent, *exact* obstacles: f(ω)⁻¹ ∝ exp(|ω|²/2) is not a polynomial (Theorem 3 rules out the
Markov property), and C₀^∞(T) is not dense in the RBF RKHS (paths infinitely smooth, RKHS norm too
strong → the conjugate GP does not exist, blocking Theorem 1). No reparameterization inside SPDE/FEM
removes either; RBF-like speedups must come from inducing points or random Fourier features, *outside*
the Markov framework.

**Conditions.** Sparse Q (LMEs, AR, ICAR, splines, Markovian GPs) with a design matrix of ≤O(√n)
nonzeros per row; boundary cases are dense Z (predictive-process GP) and the RBF kernel.

**Tier.** 🟢 established (subsumes `precision-parameterization-mechanistically-necessary-for-sparsity`,
`rbf-not-markovian-architectural-failure`).

**Sources.** dansblog:lme · dansblog:sparse7 · dansblog:markov

---

### C2 · The GMRF precision parameterization silently decouples its scalar τ from every quantity you can actually elicit or evaluate 🟢

**Statement.** In CAR/GMRF models built from a precision Q, the scalar τ is neither the inverse
marginal variance nor a self-contained scale: the marginal variance of xⱼ is τ⁻¹[Q⁻¹]ⱼⱼ (never
uniformly 1, graph-dependent), and when Q is rank-deficient *by design* the log-density's normalizing
constant needs a generalized log-determinant — get either wrong and inference is *silently biased*,
not loudly broken.

**Nuance.** Two distinct parameterization gaps. (i) A prior placed on τ as if it were an "inverse
variance" is miscalibrated, because the practitioner-elicitable quantity is the marginal SD
τ^{-1/2}[Q⁻¹]ⱼⱼ^{1/2}; the correction is graph-specific — for a first-order random walk on a J-node
lattice, τ scales as J (precision) or 1/J (variance) under lattice refinement. (ii) For ICAR / BYM /
intrinsic-smoothing-spline components Q is rank-deficient by construction (its null space deliberately
encodes the mean / connected-component constants the prior places on *differences*, not absolutes),
so a naïve log|Q(θ)| evaluates to −∞; the correct term is the generalized determinant τ^{((m−d)/2)}
with d = nullity of Q = number of connected components and m = number of vertices. Omit it and τ is
biased with no error thrown.

**Conditions.** Non-trivially structured Q (graph Laplacian, not a scalar×I); the mechanism (2) is
*distinct* from the general "τ prior matters in hierarchies" point — it is purely a parameterization
gap. For the log-det, d must be known & fixed at construction; none of this applies to positive-definite
Q (standard LMEs, AR(p) with |ρ|<1).

**Tier.** 🟢 established (subsumes `gmrf-precision-parameter-does-not-equal-inverse-marginal-variance`,
`singular-precision-requires-generalized-logdet`).

**Sources.** dansblog:cheat · dansblog:lme

---

### C4 · Identifying additive spatial effects requires a sum-to-zero constraint — and the naïve constraint is itself a mis-scaled prior 🟡

**Statement.** ICAR/BYM/CAR spatial effects (like ANOVA codings and log-simplex weights) are
non-identified up to a constant shift and need an explicit centering / sum-to-zero constraint, but the
textbook soft and hard forms *silently distort the prior* unless corrected by the number of
constrained elements N.

**Nuance.** Both naïve forms are mis-scaled. (i) A soft constraint sum(x) ~ normal(0, s) constrains
the *sum*, whereas the quantity you actually want bounded near zero is the *mean* = sum/N — so the
correct scale is s·N; an under-scaled soft constraint produces divergent transitions and R̂ up to 15,
while the N-corrected scale converges. (ii) A hard sum-to-zero implemented as an exact linear map from
N−1 iid raw params to N constrained params (Fraser 1951 / zero_sum_vector) needs its free-component
prior corrected by 1/√(1−1/N). Soft-vs-hard efficiency is geometry- and data-specific (hard can be
faster *or* slower — check empirically); the hard-constraint advantage is most pronounced on
*connected* ICAR/BYM graphs, while disconnected graphs / islands require *per-component* constraints.
Separately, a missing areal unit should be handled by *partial pooling*, not by the naïve missing-data
move.

**Conditions.** Any vector of additive effects non-identified up to a shift, with identifiability
enforced by centering in a gradient-based sampler (Stan/HMC/NUTS): categorical/ANOVA codings,
ICAR/CAR/BYM/BYM2 effects, log-simplex weights, IRT effects. The N-factor matters most at large N or
when comparing scales across different N; disconnected graphs need per-component constraints.

**Tier.** 🟡 supported (subsumes `merged-1-non-identified-additive-effects-categorical-anova-…`).

**Sources.** mc-stan:3884 · mc-stan:1382 · mc-stan:26215

---

### C5 · Spatial autocorrelation is not only an outcome nuisance — SA in a *covariate* silently overstates coefficient confidence 🟡

**Statement.** When a *regression covariate* (not just the outcome) is spatially autocorrelated, the
posterior for its coefficient becomes overconfident — its posterior SD shrinks and interval coverage
falls well below nominal — and this is a genuine information deficit, not a sampler artifact.

**Nuance.** Spatial autocorrelation inflates the covariate's variance with what is effectively
*duplicate* information, so its effective sample size is smaller than n. Because the extra spread
carries no new information, the coefficient posterior contracts around a point and its credible
intervals lose coverage — you become confident about a value that is not actually well-identified.
Bayesian and frequentist estimators respond *identically*, and the effect grows both with the strength
of the covariate's SA and with how much its spatial pattern aligns with the outcome's spatial trend.
Areal CAR/ICAR/BYM and continuous-domain GP models are both affected.

**Conditions.** Regression (linear or GLM) on spatially or spatio-temporally indexed data where one or
more covariates exhibit spatial autocorrelation.

**Tier.** 🟡 supported (subsumes `forum-c118-spatial-autocorrelation-in-regression-covariates`).

**Sources.** mc-stan:17266 · mc-stan:24567 · mc-stan:15654

---

## Practical — what works / what doesn't (comprehensive, bidirectional)

*26 recs (8 ✓ / 18 ✗). `efficacy` is the benchmark-shaped slot `{divergences, min_ess, ess_per_sec,
rmse, coverage}` — filled only from a metric present in the input, else `pending`. Attached `moves`
are the diagnostic "how". Almost every move in this class is single-witness (n_threads=1) → recs
resting on a move alone are tiered ⚪ and kept as the searchable tail; recs grounded in a claim keep
the claim's tier.*

### Precision vs covariance parameterization

**✓ S1** · for a latent-Gaussian spatial model y = Au + ε, u ~ N(0, Q(θ)⁻¹) with a **sparse structured
precision** (ICAR, CAR, Markovian GP, splines, AR) → **parameterize via the precision matrix Q(θ)**,
not the covariance Σ(θ). works.
- why: the inverse of a connected sparse matrix is generically dense; covariance form destroys all sparsity, collapsing O(n^1.5) sparse-Cholesky cost to O(n^3).
- conditions: Q(θ) sparse; design matrix Z has ≤O(√n) nonzeros per row; no analytic marginalization producing dense precision rows.
- tier: 🟢 · source: dansblog:lme, dansblog:sparse7
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: sparse-Cholesky O(n^1.5) vs dense O(n^3) (asymptotic cost, not benchmarked) · rmse: pending · coverage: pending}
- moves: "Classify the problem and locate it in the literature before touching code" · "Specify a controlled benchmark matrix isolating the parameterization from the AD/implementation backend" · "Benchmark new vs built-in on independent hardware, sweeping matrix dimension N"

**✗ S2** · for the same model when the **design matrix Z is dense** (subset-of-regressors /
predictive-process GP with global inducing points) → precision-form parameterization does **NOT**
recover the sparse advantage.
- why: AᵀW⁻¹A becomes dense regardless of how sparse Q(θ) is, because each observation depends on O(n) latent variables → back to O(n^3).
- conditions: dense Z (global inducing points); analytical marginalization of Gaussian priors on covariates that produce dense precision rows.
- tier: 🟢 · source: dansblog:sparse7, dansblog:lme
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Correct the dot-product covariance usage: beta is integrated OUT analytically, not kept as parameters; scale by the prior SD"

### GMRF τ and design-scaled priors

**✗ T1** · for a **CAR/GMRF model parameterized through precision Q** → interpreting the scalar τ as
the inverse **marginal** variance and putting a prior directly on it does **NOT** work.
- why: the marginal variance of xⱼ is τ⁻¹[Q⁻¹]ⱼⱼ, and [Q⁻¹]ⱼⱼ is never uniformly 1 and depends on graph structure → a τ prior ignoring [Q⁻¹]ⱼⱼ is miscalibrated (elicitable marginal SD is τ^{-1/2}[Q⁻¹]ⱼⱼ^{1/2}).
- conditions: Q non-trivially structured (graph Laplacian, not scalar×I); scaling law: first-order RW on a J-node lattice, τ ∝ J (precision) / 1/J (variance) under refinement.
- tier: 🟢 · source: dansblog:cheat
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Simulate from the prior (prior predictive) to inspect the induced individual-level distribution" · "Tighten the hierarchical scale prior and re-fit, checking the induced prior is now flat-ish on [0,1]" · "Make the prior's role explicit: the ICAR encodes the cross-scale extrapolation assumption"

**✓ T2** · for the same model → **elicit the prior on the marginal SD** (τ^{-1/2}[Q⁻¹]ⱼⱼ^{1/2}) and
**scale τ to the graph / lattice refinement** works.
- why: closes the parameterization gap between Q (a precision) and the practitioner-elicitable marginal standard deviation.
- conditions: known graph structure / [Q⁻¹]ⱼⱼ; lattice-refinement scaling τ ∝ J for a first-order RW.
- tier: 🟢 · source: dansblog:cheat
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Simulate from the prior (prior predictive) to inspect the induced individual-level distribution" · "Tighten the hierarchical scale prior and re-fit, checking the induced prior is now flat-ish on [0,1]"

**✗ T3** · for choosing a **prior scale in a scale-mixture / structured spatial model** → a
**design-independent "default" scale** does **NOT** work.
- why: prior scaling is design-dependent through ≥3 mechanistically independent channels — (1) a priori mass on sparse signals enters via the downstream decision process, (2) the GMRF precision-vs-marginal-SD gap, (3) the GP design-matrix norm — so no single scale is universal.
- conditions: the prior parameterization mediates between a parameter and observables in a design-dependent way (graph topology, data spacing, design-matrix norm); mechanism (1) is derived for a simple threshold decision.
- tier: 🟢 · source: dansblog:cheat
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe: decouple prior specification from the selection decision; do not encode selection in the prior" · "Make the prior's role explicit: the ICAR encodes the cross-scale extrapolation assumption" · "Simulate from the prior (prior predictive) to inspect the induced individual-level distribution"

### Rank-deficient precision & disconnected graphs

**✗ R1** · for an **ICAR / BYM / intrinsic-smoothing-spline** component (Q rank-deficient by design) →
naively evaluating **log|Q(θ)|** in the log-density does **NOT** work.
- why: rank-deficient Q has zero eigenvalues → log|Q| = −∞; the correct quantity is the generalized-determinant factor τ^{(m−d)/2} (i.e. ((m−d)/2)·log τ in the log-density), with d = nullity (ICAR graph Laplacian: the number of connected components; higher-order intrinsic smoothers: the polynomial null-space dimension, e.g. d=2 for a cubic/RW2 spline) and m = number of vertices; omitting it silently biases τ (no error thrown).
- conditions: ICAR/BYM/intrinsic splines only; d must be known & fixed at construction; not for positive-definite Q (LMEs, AR(p) with |ρ|<1).
- tier: 🟢 · source: dansblog:lme
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Re-implement the forward map in an independent autodiff framework (JAX / PyTensor) and compare the log-det-Jacobian" · "Code-level root-cause audit of the disconnected-ICAR density implementation by the original author" · "Request and confirm the forward (constrained matrix → unconstrained vector) transform exists, not just the unconstraining direction"

**✗ R2** · for a **disconnected ICAR graph** (islands / multiple components) → applying a **single
global sum-to-zero constraint and a single-component log-det correction** does **NOT** work.
- why: d (the nullity) equals the number of connected components, so each component carries its own free constant → per-component constraints are required and the correct d must enter the generalized determinant.
- conditions: disconnected adjacency (islands); d > 1.
- tier: 🟢 · source: dansblog:lme (+ mc-stan:3884 conditions)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the graph connectivity / edge list directly against the geography" · "Code-level root-cause audit of the disconnected-ICAR density implementation by the original author" · "Differential diagnosis on the non-convergence: separate data-sparsity, parameterization, under-iteration, and an implementation bug as competing causes"

### Sum-to-zero / centering constraints on additive spatial effects

**✗ Z1** · for **non-identified additive spatial effects** (ICAR/BYM/CAR effects, ANOVA codings,
log-simplex weights) → a **soft constraint sum(x) ~ normal(0, s)** with the naïve scale does **NOT**
work.
- why: it constrains the *sum*, but the quantity you want bounded near zero is the *mean* = sum/N → the constraint is mis-scaled; the under-scaled soft constraint gives divergent transitions and R̂ up to 15.
- conditions: N constrained elements; the correct scale is s·N (i.e. sum(x) ~ normal(0, s·N)); worst at large N.
- tier: 🟡 · source: mc-stan:3884
- efficacy: {divergences: divergent transitions (under-scaled soft constraint) · min_ess: R̂ up to 15 (severe non-mixing) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the constraint statement and prior placement: is the prior on sum(x) (should be scaled by N to act on the mean)" · "Run a scale sweep: fit the soft model across several orders of magnitude of the constraint SD and tabulate total time, n_eff, Rhat, divergences" · "Derive the implied marginal distribution of the sum-to-zero vector under the naive prior (fit a tiny standalone Stan model)"

**✓ Z2** · for the same effects → the **N-corrected soft constraint sum(x) ~ normal(0, s·N)** works
(converges).
- why: scaling by N makes the prior act on the *mean* (sum/N), the actually-elicitable quantity → convergence where the naïve scale diverged.
- conditions: N constrained elements; the N-factor scales with the number of constrained elements.
- tier: 🟡 · source: mc-stan:3884
- efficacy: {divergences: resolved (N-corrected) · min_ess: converges (R̂ from up to 15 → converged) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a scale sweep: fit the soft model across several orders of magnitude of the constraint SD and tabulate total time, n_eff, Rhat, divergences" · "Audit the constraint statement and prior placement (prior on sum(x) scaled by N to act on the mean)"

**✓ Z3** · for the same effects → a **hard sum-to-zero** via an exact linear map from N−1 iid raw
params to N constrained params (Fraser 1951 / zero_sum_vector), with the **free-component prior
corrected by 1/√(1−1/N)**, works.
- why: exact enforcement plus the 1/√(1−1/N) correction preserves the intended marginal; the hard-constraint advantage is most pronounced on connected ICAR/BYM graphs.
- conditions: soft-vs-hard efficiency is geometry/data-specific (check empirically); disconnected graphs need per-component constraints.
- tier: 🟡 · source: mc-stan:26215, mc-stan:1382, mc-stan:3884
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Adopt an exact linear map from N-1 iid raw params to N sum-to-zero params (QR/Cholesky of the singular covariance, Fraser 1951)" · "Inspect the sampler's view of the unconstrained space: dump diagnostic_file (unconstrained params, momenta, gradients), make pairs plots" · "Audit the constraint statement and prior placement"

**✗ Z4** · for **choosing soft vs hard** sum-to-zero → assuming one is **universally faster** does
**NOT** work.
- why: the soft-vs-hard efficiency comparison is geometry-dependent and model/data-specific — hard can be faster or slower than soft; must be checked empirically.
- conditions: any constrained additive-effect model; graph connectivity modulates the hard-constraint advantage.
- tier: 🟡 · source: mc-stan:3884
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a scale sweep: fit the soft model across several orders of magnitude of the constraint SD and tabulate total time, n_eff, Rhat, divergences" · "Inspect the sampler's view of the unconstrained space: dump diagnostic_file, make pairs plots and param-vs-lp plots"

**✓ Z5** · for a **missing areal unit** (no data in a region) → let the hierarchical / CAR structure
**partial-pool** it (impute from neighbors) works; the naïve missing-data move does **NOT**.
- why: a hierarchical Bayesian areal model borrows strength — a missing area's effect is informed by its neighbors through the CAR/ICAR adjacency, so it should be partially pooled, not dropped.
- conditions: any hierarchical Bayesian areal model with missing units.
- tier: 🟡 · source: mc-stan:3884 (merged-1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Repair the adjacency by adding bridging areal units, then refit and re-diagnose" · "Differential diagnosis on the non-convergence: separate data-sparsity, parameterization, under-iteration, and an implementation bug"

### Kernel choice & Markov/SPDE representability

**✗ K1** · for representing a **squared-exponential (RBF) GP inside the SPDE/FEM** (sparse-precision /
Markov) framework → it does **NOT** work, architecturally.
- why: two exact obstacles coincide — f(ω)⁻¹ ∝ exp(|ω|²/2) is not a polynomial (Theorem 3 rules out the Markov property) and C₀^∞(T) is not dense in the RBF RKHS (paths infinitely smooth, RKHS norm too strong → no conjugate GP, blocking Theorem 1); neither is fixable by tuning or reparameterization.
- conditions: standard RBF/squared-exponential kernel; both failures are exact, not approximate.
- tier: 🟢 · source: dansblog:markov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the model class: recognize RBF-kernel regression is equivalent to a GP with a squared-exponential (ExpQuad) covariance, not a parametric Gaussian" · "Classify the problem and locate it in the literature before touching code"

**✓ K2** · for wanting a **fast RBF-like GP** → use an **inducing-point sparse GP or random Fourier
features** (explicitly *outside* the SPDE/Markov framework) works.
- why: RBF cannot be made Markov within SPDE/FEM, so a valid speedup must come from a different approximation family that does not assume a sparse precision.
- conditions: RBF/squared-exponential target; the approximation must not rely on a sparse precision.
- tier: 🟢 · source: dansblog:markov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the model class: recognize RBF-kernel regression is equivalent to a GP with a squared-exponential (ExpQuad) covariance" · "Classify the problem and locate it in the literature before touching code"

### Spatial autocorrelation consequences

**✗ A1** · for a **regression/GLM on spatially-indexed data where a covariate is spatially
autocorrelated** → trusting the coefficient's **posterior SD / interval coverage** does **NOT** work.
- why: SA in a covariate inflates its variance with effectively duplicate information (effective sample size < n); the extra spread carries no new information, so the coefficient posterior contracts and intervals lose coverage — confident about a value that is not well-identified. Bayesian and frequentist estimators respond identically.
- conditions: linear/GLM on spatial or spatio-temporal data; CAR/ICAR/BYM areal and continuous-domain GP both apply; effect grows with covariate-SA strength and with alignment between the covariate's spatial pattern and the outcome's spatial trend.
- tier: 🟡 · source: mc-stan:17266, mc-stan:24567, mc-stan:15654
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: below nominal — falls as covariate-SA strength rises (coefficient posterior SD shrinks)}
- moves: "Diagnose the implementation as an identifiability + parametrization issue, not just a likelihood choice" · "Quantify the covariate's own spatial autocorrelation and how much its spatial pattern aligns with the outcome's spatial trend — the coefficient's overconfidence grows with both, and its effective sample size is below n" · "Restart from a simpler model and add structure incrementally until it breaks"

### Graph / adjacency diagnostics (searchable move-tail)

**✓ G1** · for a **border discontinuity / artifact in a fitted spatial map** → **interpret it before
reparameterizing** (real signal vs graph artifact), then **inspect and repair the adjacency** works.
- why: a border discontinuity may be a real data signal or a model/graph artifact; check the edge list against geography and repair by adding bridging areal units before re-running.
- conditions: areal model with an adjacency graph; visible border/edge discontinuity.
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Interpret the spatial-map artifact before reparameterizing — is the border discontinuity a real data signal vs a model/graph artifact" · "Inspect the graph connectivity / edge list directly against the geography" · "Repair the adjacency by adding bridging areal units, then refit and re-diagnose"

### GP numerics & prediction (searchable move-tail)

**✗ N1** · for a **spatial GP whose covariance is numerically evaluated only on X_train** →
conditioning prediction on it does **NOT** work (fixed-covariance trap).
- why: a covariance evaluated only at training locations ties the latent vector to those locations, leaving no mechanism to predict at new inputs.
- conditions: GP prediction where the covariance was built once on the training grid.
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose the fixed-covariance trap: a covariance numerically evaluated only on X_train ties the latent vector to training locations, so there is no mechanism to predict" · "Clarify GP semantics: mean function = the value the GP reverts to away from data; predictive uncertainty = both noise and covariance" · "Make lengthscale a hyperparameter (hyper-prior), fit (find_MAP), condition prediction on the fitted point"

**✗ N2** · for a **spatial GP kernel with a sqrt distance on the diagonal** (i==j) → autodiff through
**sqrt(0)** does **NOT** work (NaN gradient).
- why: at i==j the coordinate differences are exactly 0 so the kernel evaluates sqrt(0), whose derivative is undefined; the fix is to skip i==j in the loop (or add jitter).
- conditions: hand-written distance kernel with a sqrt, evaluated at the diagonal, under autodiff.
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Recognize the diagonal special case: at i==j the coordinate differences are exactly 0, so the kernel evaluates sqrt(0); rewrite the loop to skip i==j" · "Build a minimal reprex and inspect the autodiff: print(sqrt(x - x)) in the model block vs same in generated quantities"

**✓ N3** · for a **GP held-out / cross-validation claim** → require an **explicit held-out validation
protocol** using the GP predictive equations works (do not trust in-sample overlays).
- why: interrogate what quantity is actually being plotted versus what was held out; an in-sample fit overlay is not validation.
- conditions: any GP fit whose out-of-sample performance is being asserted.
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Interrogate what quantity is actually being plotted vs what was held out" · "Define and require a held-out validation protocol using the GP predictive equations" · "Read the pp_check overlay as a likelihood-adequacy check: could ANY parameter setting of the current family reproduce the observed y"

### Variance / noise-component identifiability (searchable move-tail)

**✗ V1** · for a **spatial model with a GP/covariance term plus an independent noise term** → assuming
**both variance/noise components are identified** does **NOT** work.
- why: two noise terms can be jointly non-identified; separate numerical-stabilizer (jitter) terms from substantive parameters, check identifiability, and ablate one covariance block at a time to localize the failure.
- conditions: models carrying more than one variance/noise term (e.g. a covariance block plus observational noise plus a jitter).
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Separate numerical-stabilizer terms from substantive model parameters" · "Check identifiability of the two noise terms" · "Ablate the suspect term — remove Sigma_phi (and one-by-one each other covariance term) and re-run to localize the failure to a single block"

### ICAR Poisson disease-mapping specification (searchable move-tail)

**✗ I1** · for an **ICAR Poisson areal (disease-mapping) model** → treating the ICAR nodes **without
pinning their cross-scale interpretation** does **NOT** work.
- why: reason from the generative Poisson-process ideal down to the ICAR discretization — the ICAR encodes a cross-scale extrapolation assumption and its node interpretation must be tied to the research question, else short-range (sub-observation) freedom contaminates the map.
- conditions: ICAR/Poisson areal counts where areal units aggregate an underlying point process.
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reason from the generative (Poisson-process) ideal down to the ICAR discretization" · "Pin down the ICAR-node interpretation, tied to the research question" · "Tune ICAR correlation structure to suppress short-range (sub-observation) freedom"

### Response structure — dissimilarity / multi-membership (searchable move-tail)

**✗ D1** · for regressing a **pairwise dissimilarity response with spatial priors on additive site
intercepts** → it does **NOT** work.
- why: additive intercepts cannot encode a constrained pairwise response (triangle inequality / shared latent); a spatial prior on additive intercepts implies the wrong structure for predicted dissimilarities; multi-membership mm() may also be order-sensitive.
- conditions: dissimilarity / distance-matrix response modeled with per-site additive effects.
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Probe what the response physically IS and whether it inherits a constrained dependency structure (triangle inequality / shared latent)" · "Construct adversarial thought-experiments (all-identical sites; two perfectly-distinct sets; 37-vs-3 split) and trace what additive intercepts can encode" · "Offer two reframings: (a) drop the dissimilarity response and regress the native univariate response on site-level ordination/PCA axes"

### Optimization semantics — MLE vs MAP (searchable move-tail)

**✗ M1** · for **optimizing a constrained-parameter spatial model** → conflating what **MLE vs MAP**
maximizes does **NOT** work.
- why: an unconstrained vs constrained parameter (real μ vs real<lower=0> σ) changes which density the optimizer maximizes — the constraint's Jacobian distinguishes MLE from MAP.
- conditions: point estimation (find_MAP / optimize) on a model with constrained parameters.
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Contrast an unconstrained-parameter model against a constrained-parameter model (real mu vs real<lower=0> sigma)" · "Identify which density each optimization maximizes and map to MLE vs MAP" · "Work the simplest closed-form example explicitly (e.g. real<lower=0> A ~ lognormal(5,2))"

### Selection priors (BKMR) (searchable move-tail)

**✗ B1** · for **BKMR** (recognized as GP regression with an ARD kernel) with a **variable-selection
prior** → an incompatible discrete selection prior does **NOT** work.
- why: classify BKMR as GP-with-ARD before coding; replace the incompatible selection prior with a continuous shrinkage prior; decouple prior specification from the selection decision (do not encode selection in the prior).
- conditions: GP/ARD regression where variable selection is wanted; gradient-based sampler.
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify the method against known model families before coding (recognize BKMR = GP regression with ARD kernel)" · "Replace the incompatible selection prior with a continuous shrinkage prior" · "Reframe: decouple prior specification from the selection decision; do not encode selection in the prior"

### SBC / validation instruments (searchable move-tail)

**✗ X1** · for **validating a spatial sampler with SBC** → trusting a **single scalar uniformity
summary** does **NOT** work.
- why: the chosen uniformity test can be a known-flawed instrument; there is no universal scalar uniformity summary — characterize the multiplicity of deviation modes and bound the scope of the validation claim (empirical vs theoretical).
- conditions: SBC-style calibration checks on a spatial model.
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the diagnostic itself before trusting any pattern in its output; recognize the chosen uniformity test as a known-flawed instrument" · "Reject the search for a universal scalar uniformity summary; characterize the multiplicity of deviation modes instead" · "Bound the scope of the validation claim — empirical (fixed model family) vs theoretical (target-adaptive)"

### Constrained-support divergences — clipping (searchable move-tail)

**✗ C1** · for **divergences caused by a hard clip on a constrained parameter** → keeping the flat
clipped region does **NOT** work.
- why: recover the discarded divergent samples and transform them back to test whether divergent trajectories actually visit the sub-region; remove the flat region by reparametrizing onto the constrained support instead of clipping.
- conditions: a parameter forced onto valid support by a hard clip, producing divergences at the boundary.
- tier: ⚪ candidate (single-witness moves) · source: move-only (n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Recover the discarded divergent samples and transform them back to the clipped parameter to test whether divergent trajectories actually visit the sub-region" · "Remove the flat region by eliminating the hard clip — reparametrize onto the constrained support instead" · "Try the cheap generic knobs but treat their FAILURE as diagnostic, not as a dead end"

---

## Source key

**Dan Simpson blog** (`dansblog:<id>` → `https://dansblog.netlify.app/posts/…`):
cheat (`2021-12-09-why-wont-you-cheat-with-me-repost`) · lme (`2022-03-22-a-linear-mixed-effects-model`) ·
sparse7 (`2022-11-27-sparse7`) · markov (`2023-01-21-markov`)

**Stan forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`):
17266 (spatial-autocorrelation…bayesian-linear-regression) · 24567 (correlated-parameters-in-car-model…) ·
15654 (hierarchical-2d-1d-space-time…gps) · 3884 (test-soft-vs-hard-sum-to-zero-constrain) ·
1382 (ragged-array-of-simplexes) · 26215 (new-stan-data-type-zero-sum-vector)
