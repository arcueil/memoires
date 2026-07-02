# Gaussian processes & latent-Gaussian models

## Claims (the *why* — mid-level, ~3–5)

*Five mid-level principles synthesized from 38 granular claims. Tier is the best-supported of the
granular claims each subsumes. Source short-ids resolve to URLs in the Source key at the bottom.*

### C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — the marginal likelihood is a ridge with flat plateaus, so principled priors are load-bearing, not optional 🟢

**Statement.** Length scale ℓ (ρ) and marginal SD σ (α) enter the likelihood only through the *shape*
of the covariance, which finite noisy data constrains poorly: under fixed-domain (infill) asymptotics
only the microergodic combination σ²/ℓ^(2ν) is consistently estimable, the EQ marginal likelihood has
two structurally distinct flat plateaus, and maximum marginal likelihood is consequently seed-dependent
and structurally inadequate — so the prior actively *resolves the geometry*, it does not merely
regularize.

**Nuance.** The two EQ plateaus have different mechanisms and need different fixes: the *large-ρ*
plateau is an experimental-design ceiling (data cannot distinguish correlation lengths above the maximum
observed distance → ρ drifts to ∞); the *small-ρ* plateau is an interpolation degeneracy with
*threshold* character (below the minimum inter-point spacing the GP threads exactly through the points).
Because it is threshold-shaped, only a strongly zero-suppressing prior — inverse-gamma, equivalently the
PC/Frechet(d/2) prior which *is* inverse-gamma in 2D — cuts the small-ρ plateau; a half-normal cannot.
Identifiability is asymmetric: the long-range regime is uninformative but *low-risk* (inference
insensitive there), the short-range regime is uninformative *and high-risk* (over-fitting). Marginals
mislead — both ℓ and σ marginals can be wide while σ²/ℓ is tightly pinned, so the correct diagnostic is
the 2-D *joint* (ℓ,σ) ridge, not either marginal. Reference priors reproduce the ridge (mass near ℓ=0)
rather than resolving it, at ~8.5× wall time. Using the covariate span to set ρ-prior bounds is
principled *only* when the design was itself length-scale-motivated — retrofitting bounds to observed
data is circular. ARD length scales are so weakly informed (markedly worse under a Bernoulli likelihood)
that ARD is unreliable for variable selection; the naive finite-MVN PC prior is incoherent (depends on
observation locations); and ν should generally be *fixed*, not inferred.

**Conditions.** EQ / Matérn (isotropic) kernels, d≤3, inferred hyperparameters; fixed-domain regime;
sharpest under non-Gaussian (Bernoulli) likelihoods and full-interaction ARD in moderate dimension.

**Tier.** 🟢 established (subsumes `gp-eq-dual-plateau-degeneracy`, `matern-non-identifiability-fixed-domain`,
`gp-mml-structurally-inadequate`, `gp-marginal-posterior-ridge-diagnostic`,
`invgamma-required-for-gp-length-scale-prior`, `pc-prior-matern-ell-frechet-from-spectral-kl`,
`gp-reference-prior-reproduces-ridge-not-resolves`, `gp-prior-bound-requires-domain-expertise-not-data`;
plus supported `gp-length-scale-prior-data-spacing-asymmetry`, `forum-c314` ARD; candidate
`naive-mvn-pc-prior-for-gp-is-incoherent` ⚪, `matern-nu-should-be-fixed` ⚪, `forum-c147` priorsense ⚪).

**Sources.** betanalpha:gaussian_processes · betanalpha:some_containment_prior_models · dansblog:priors5 ·
dansblog:cheat · mc-stan:35930 · mc-stan:29945

---

### C2 · The GP latent field is a high-dimensional funnel — whiten it (NCP Cholesky) or marginalize it out; the centered form fails *invisibly* 🟢

**Statement.** The correlated latent field f is a banana/funnel geometry that HMC cannot traverse in the
centered parameterization — and it fails *silently* (no divergences, no tree-depth saturation, just
extreme E-FMI and huge R̂); the two working responses are the non-centered Cholesky whitening
f = L·f̃ with f̃ ~ N(0,I), or analytically marginalizing the field so MCMC runs only on the
low-dimensional hyperparameters.

**Nuance.** NCP whitening is *necessary* for HMC to work and *sufficient* to clear the geometry when
hyperparameters are fixed and the likelihood is relatively diffuse — regardless of observation model
(Gaussian or Poisson log-link) — because it lets a diagonal mass matrix approximate the posterior without
full Hessian information. Marginalization is the deeper move for latent-Gaussian models y = Au + ε,
u ~ N(0,Q(θ)⁻¹): via p(θ|y) ∝ p(y,u,θ)/p(u|y,θ) you run MCMC on θ only (funnel-free regardless of
dim u) then draw u|y,θ analytically. With a Gaussian likelihood linear in the latent, the NCP
conditional p(f̃|θ,y) is *exactly* Gaussian by conjugacy, so a Laplace-marginalizing sampler is exact —
but only for that combination; non-Gaussian likelihoods reintroduce genuine Laplace approximation error.
Two traps: divergences localized at small σ tempt a zero-avoiding prior on σ that does *not* remove them
(the pathology is the joint η–σ geometry, cured by marginalizing the field); and the inner L-BFGS mode
solve behind a Laplace marginal has a convergence *floor* (default maxiter=30 ≪ the O(κ/m)≈260 the
condition number demands), and silent non-convergence inflates the hyperparameter-level Hessian
18–54× and collapses the sampler step size up to 670×.

**Conditions.** Latent-GP / latent-Gaussian models, HMC/NUTS; NCP result demonstrated with fixed
hyperparameters and squared-exponential kernel; marginalization needs Q(θ) closed-form and a
Gaussian (exact) or Laplace-approximable (non-Gaussian) likelihood; float32 needs positive jitter
(~1e-4) in the Cholesky.

**Tier.** 🟢 established (subsumes `hmc-diagnostic-blindspots`,
`ncp-gp-cholesky-whitening-necessary-and-sufficient-diffuse-likelihood`,
`latent-gaussian-marginalization-strategy`, `merged-48` exact-Gaussian-conditional,
`worklog-laplace-marginal-lbfgs-convergence-floor`; plus supported `forum-c25` marginalize-latent-field).

**Sources.** betanalpha:gaussian_processes · betanalpha:identifiability · mc-stan:26425 · mc-stan:2172 ·
mc-stan:6178 · pymc:16147

---

### C3 · An exact dense GP does not scale — the fix is a *structured* representation (low-rank basis or sparse precision), never harder sampler tuning 🟢

**Statement.** A dense-covariance GP costs O(N³) time and O(N²) memory per gradient (Cholesky of the
N×N kernel), so beyond a few hundred–1000 points HMC OOMs or stalls; more data only makes the matrix
bigger — the remedy is to change the GP *representation* (Hilbert-space low-rank basis, or a sparse
*precision* Markov/SPDE form), and for sparse precision you parameterize Q(θ) not Σ(θ) because the
inverse of a connected sparse matrix is generically dense.

**Nuance.** The two structured routes have different domains: the basis-function (HSGP) approximation
needs a smooth stationary kernel and roughly centered/bounded inputs (it degrades near boundaries and for
very small length scales); the state-space/Markov route needs low-dimensional (typically 1-D, time-like)
ordered inputs and a Matérn-class kernel — it does *not* apply to the squared-exponential. Precision
parameterization is a mechanistic prerequisite for sparsity (working in covariance form destroys it and
collapses O(n^1.5) to O(n³)), but its advantage itself collapses when the design matrix is dense
(subset-of-regressors / global-inducing-point predictive processes make AᵀW⁻¹A dense regardless of Q).
Given a sparse Cholesky L, the Takahashi recursions recover exactly the entries of Q⁻¹ at Q's own
nonzeros — all you need for marginal variances, score functions, and generated quantities — in O(nnz(L))
(recursion order column n−1→0 is mandatory), though that partial inverse has no reverse-mode AD
specialization. In JAX, sparse Cholesky is user-hostile: fill-in makes nnz(L) unknown until symbolic
factorization runs, forcing L_nse to be pre-declared a static argument.

**Conditions.** Latent-GP / latent-Gaussian models fit with full Bayesian sampling; low-rank route for
smooth stationary kernels; sparse-precision route for Markovian kernels with a sparse design matrix.

**Tier.** 🟢 established (subsumes `precision-parameterization-mechanistically-necessary-for-sparsity`,
`partial-inverse-via-takahashi-recursion`, `sparse-cholesky-l-nse-must-be-static-argument`; plus supported
`forum-c150` dense-GP-doesn't-scale; candidate `no-ad-derivative-for-partial-inverse` ⚪).

**Sources.** dansblog:lme · dansblog:sparse7 · dansblog:partial-inverse · dansblog:catch-derivative ·
dansblog:sparse4 · mc-stan:3517 · mc-stan:11661

---

### C4 · Sparsity is not a numerical trick — a GP admits a sparse-precision (SPDE/FEM) form iff it is Markov, which is an exact spectral/RKHS property that RBF structurally lacks 🟢

**Statement.** A GP has the Markov property iff its RKHS inner product is *local* (disjoint-support
functions orthogonal), equivalently — for stationary GPs — iff the inverse spectral density f(ω)⁻¹ is a
non-negative symmetric polynomial; Matérn kernels satisfy this and the squared-exponential (RBF) does
not, and that failure is *architectural*, not fixable by reparameterization within the SPDE framework.

**Nuance.** When the RKHS is local, Peetre's theorem *forces* C⁻¹ to be a symmetric elliptic
differential operator — the differential-operator character is a structural consequence, not an SPDE
convenience assumption. Sparse precision then requires *two* simultaneous ingredients: RKHS locality
(zeroes Q_ij for disjoint-support basis functions) *and* compact-support basis functions (so most pairs
are disjoint) — neither alone yields sparsity. RBF fails on two counts at once: f(ω)⁻¹ ~ exp(|ω|²/2) is
not a polynomial (no Markov property), and C₀^∞ is not dense in the RBF RKHS (no conjugate GP, so even
the characterizing theory does not apply). A genuine advantage of the RKHS/SPDE route is that it extends
to manifolds (e.g. the sphere) by defining C^(−1/2) in local coordinates, avoiding the search for new
positive-definite covariance functions on each geometry.

**Conditions.** Stationary GPs on ℝ^d (weak/second-order Markov); conjugate GP must exist; FEM needs a
compact-support (piecewise-linear tent) basis; manifold extension needs a Laplace–Beltrami operator and
a mesh.

**Tier.** 🟢 established (subsumes `markov-iff-rkhs-local`, `stationary-gp-markov-iff-spectral-polynomial`,
`markov-precision-operator-peetre`, `rbf-not-markovian-architectural-failure`,
`spde-fem-sparsity-requires-both-ingredients`; plus supported `rkhs-markov-approach-generalizes-to-manifolds`).

**Sources.** dansblog:markov

---

### C5 · A GP is non-parametric — prediction and structural decomposition require *explicit conditioning on the training data*; the generic "sample latents, feed new X" pattern silently returns the prior 🟢

**Statement.** A fitted GP is not a callable function of hyperparameters: the predictive at new inputs
X* depends on the *full joint posterior of the latent function over the training inputs together with the
training data*, so reusing the standard parametric predictive pattern (numpyro/pyro `Predictive`,
`pm.set_data` on a Latent GP) silently collapses toward the prior with no error — you must re-evaluate
the cross-covariance K(X_train,X*) and apply the analytic GP posterior-predictive equations; and the same
non-parametric flexibility means additive component decompositions *alias* unless their scales are pinned.

**Nuance.** The out-of-sample step is separate from the fit: recompute K(X_train,X*) and K(X*,X*) from
the *same* kernel/hyperparameters and condition on the training observations (PyMC `gp.conditional` /
`gp.predict`; Stan / hand-written MVN with the analytic posterior); this does *not* apply to parametric
GP approximations (HSGP) or ordinary regression, where `set_data`/`Predictive` are valid. On the
structural side, any two additive components that can represent the same functional behavior are
exchangeable (the canonical y=a+b degeneracy — increase a, decrease b, y unchanged) and no amount of data
resolves it, producing degenerate/multimodal/stiff posteriors unless the priors concentrate each
component on a *unique, non-overlapping* scale; the stiffness worsens as more series/time points share a
tightly-constrained component. Two applications where the structured GP is the *win*: modeling structured
between-group variation with a GP (or shared RE) on the *intercept* sharpens a contrast (A/B test) that a
noise-only model leaves smeared across "difference" and "noise"; and a structured GP prior over a stratum
index *rescues √n-consistency* (Robins–Ritov) where an iid/exchangeable prior fails. Splines are a
cautionary cousin: interpretable only *locally*, their global prior pushforward is surprisingly wild, and
GP interpretability does not transfer to most spline models.

**Conditions.** Any exact/latent GP where X* ≠ X_train; additive-decomposition degeneracy needs
overlapping function classes with data-inferred component hyperparameters; contrast/consistency wins need
the structure to be genuinely present (predictive checks reveal when it is not).

**Tier.** 🟢 established (subsumes `additive-gp-components-require-nonoverlapping-length-scale-priors`;
plus supported `forum-c273` predict-can't-reuse-Predictive, `forum-c471` fitted-GP-not-callable,
`forum-c443` splines-local-only, `forum-c472` structured-shared-component; candidate
`rr-structured-prior-rescues-consistency` ⚪).

**Sources.** mc-stan:8028 · mc-stan:16891 · mc-stan:5442 · mc-stan:24759 · mc-stan:34721 · mc-stan:26490 ·
mc-stan:39288 · pymc:16375 · pymc:11887 · pymc:6229 · pymc:1299 · pymc:6235 · pyro:3868 · dansblog:robins-ritov

---

## Practical — what works / what doesn't (comprehensive, bidirectional)

*53 recs (25 ✓ / 26 ✗, plus 2 bidirectional). `efficacy` is the benchmark-shaped slot
`{divergences, min_ess, ess_per_sec, rmse, coverage}` — filled only from a metric present in the input,
else `pending`. Attached `moves` are the diagnostic "how"; single-witness (n_threads=1) moves are tiered
⚪ and kept as the searchable tail.*

### Hyperparameter priors & identifiability

**✓ HP1** · for an **EQ / Matérn GP length scale** where the design is length-scale-sensitive → an
**inverse-gamma (quantile-elicited) prior** works.
- why: its strong suppression toward zero matches the *threshold* character of the small-ρ interpolation degeneracy; a half-normal does not.
- conditions: EQ kernel with inferred ρ; covariate-span bounds are approximate unless the design was deliberately chosen for the relevant length scales.
- tier: 🟢 · source: betanalpha:gaussian_processes, betanalpha:some_containment_prior_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Tighten hyperparameter priors using GP-specific prior guidance"

**✗ HP2** · for an **EQ length scale** → a **half-normal / light-tailed** prior does **NOT** work.
- why: N⁺(0, 20/3)-type priors suppress the large-ρ plateau but leave the small-ρ (interpolation) plateau exposed, so ρ can collapse below the minimum spacing.
- conditions: EQ kernel; two simultaneous flat regions in the marginal likelihood.
- tier: 🟢 · source: betanalpha:gaussian_processes, betanalpha:some_containment_prior_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reconsider/retract: separate the GP's variance component (magnitude) from its correlation component (length-scale)"

**✓ HP3** · for a **Matérn length scale in d≤3** → the **PC prior = Frechet(d/2)** (exactly inverse-gamma
in 2D) works.
- why: derived from a spectral KL approximation whose integral converges iff d≤3; PC distance d(ℓ) ∝ ℓ^(−d/2) is domain-independent, unlike a naive finite-MVN construction.
- conditions: stationary Matérn, fixed ν, bounded domain, d≤3; the Gamma-on-κ result is squared-exponential-only, not Matérn.
- tier: 🟢 · source: dansblog:priors5
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Set the PC-prior scale by eliciting a tail probability P(ρ < ρ₀)=α on the length scale, and confirm the d≤3 convergence condition before trusting the construction"

**✗ HP4** · for **EQ GP hyperparameters** → **maximum marginal likelihood (MML) without a prior** does
**NOT** work.
- why: the marginal likelihood has multiple flat plateaus with vanishing gradients, so MML is seed-dependent, converging to qualitatively different solutions — not numerical noise but distinct plateau regions.
- conditions: EQ kernel, inference over (ρ, α); multiple degeneracy plateaus present.
- tier: 🟢 · source: betanalpha:gaussian_processes
- efficacy: {divergences: n/a · min_ess: n/a · ess_per_sec: pending · rmse: two MML optima — seed 5838298 → ρ=1.14, σ=0.20 vs seed 2384853 → ρ=0.234, σ=2.40 (distinct plateaus, not perturbed local optima) · coverage: pending}
- moves: "Detect the plateau degeneracy by re-running MML from several seeds and checking whether the optima are distinct plateau regions rather than perturbed local optima"

**✗ HP5** · for **GP (σ, ℓ)** in a fixed-domain low-n setting → a **reference prior** does **NOT** work
well.
- why: it structurally reproduces the likelihood ridge in the posterior (substantial mass near ℓ=0) rather than resolving it, and changes form when the likelihood changes (requires Gaussian, no observation noise in the original).
- conditions: Matérn GP d≤3, fixed-domain (infill), Gaussian likelihood.
- tier: 🟢 · source: dansblog:priors5
- efficacy: {divergences: pending · min_ess: lower ESS than PC prior · ess_per_sec: ~8.5× wall time and 2× warmup iterations vs a PC prior · rmse: pending · coverage: posterior mass near ℓ=0 (ridge reproduced)}
- moves: "Compare the reference-prior posterior against a PC-prior fit and check whether posterior mass piles up near ℓ=0 (ridge reproduced rather than resolved)"

**✗ HP6** · for **GP hyperparameter identifiability** → reading only the **marginal posteriors of ℓ and
σ** does **NOT** work.
- why: both marginals can be very wide even when σ²/ℓ (or σ²/ℓ^(2ν)) is tightly determined — the marginal width is not evidence the prior failed to resolve the likelihood.
- conditions: Matérn or EQ GP d≤3, fixed/bounded-domain where the ridge exists.
- tier: 🟢 · source: dansblog:priors5
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Separate the plotting/marginalization artifact from the actual fit before diagnosing further"

**✓ HP7** · for **GP hyperparameter identifiability** → inspecting the **2-D joint posterior of (ℓ, σ)**
works.
- why: an elongated ridge reveals that only the combination is determined; a compact blob shows the prior resolved it. The joint is the correct diagnostic, the marginals are not.
- conditions: d≤3 Matérn/EQ; evaluating whether the prior resolved the ρ/ℓ-vs-σ non-identifiability.
- tier: 🟢 · source: dansblog:priors5
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Search systematically for the right projection / pairs plot — but deductively, not by blind ML search"

**✗ HP8** · for a **GP with ARD** over several covariates → using the **ARD inverse-length-scales for
variable selection** does **NOT** work.
- why: length scales are only weakly informed (worse under a Bernoulli likelihood), so their posteriors stay broad no matter how tight the per-parameter prior; ARD is an unreliable selection mechanism.
- conditions: GP regression with inferred hyperparameters, ARD over several covariates, weakly-informative / non-Gaussian likelihood; most acute for full-interaction EQ kernels in moderate-to-high dimension.
- tier: 🟡 · source: mc-stan:35930
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe: decouple prior specification from the selection decision; do not encode selection in the prior" · "Reconsider/retract: separate the GP's variance component from its correlation component"

**✓ HP9** · for a **designed study** whose sampling was motivated by length-scale knowledge → **setting
ρ-prior bounds from the observed covariate span** works.
- why: the degeneracy thresholds (δx_min, Δx) are properties of the design; using them is principled when the design was chosen *because* of domain knowledge about length scales.
- conditions: designed (non-observational) study.
- tier: 🟢 · source: betanalpha:gaussian_processes
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Correct the semantics of prior predictive checks: check consequences against IMPLICIT DOMAIN EXPERTISE, not against the observed data"

**✗ HP10** · for an **observational (non-designed) GP** → **retrofitting the ρ prior to the data span**
does **NOT** work.
- why: it overfits the prior to the initial data and prematurely constrains future inferences — circular, since the span thresholds are not domain-justified here.
- conditions: observational study; no design-based justification for restricting ρ.
- tier: 🟢 · source: betanalpha:gaussian_processes
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Challenge the necessity of the pre-fit; ask whether prior experiments or first-principles domain reasoning could supply the scale instead"

**✗ HP11** · for a **GP under cross-validation or sequential data collection** → the **naive
finite-MVN PC prior** on ℓ does **NOT** work.
- why: the KL needs log-det(C) and C⁻¹, both of which depend entirely on observation locations, so the prior must change whenever the data changes — a fundamental incoherence (and as costly as a second likelihood evaluation). The σ prior is fine; only the ℓ prior is broken.
- conditions: GP prior derived by treating the GP as a finite MVN; any CV / sequential-update scenario.
- tier: ⚪ candidate · source: dansblog:priors5
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Check whether the prior's normalizing constant (log-det C, C⁻¹) shifts when the observation locations change — refit on a held-out CV fold and confirm the ℓ prior is not location-dependent"

**✗ HP12** · for a **Matérn GP** → **inferring the smoothness ν jointly** does **NOT** work.
- why: ν's derivative is not readily computable (rules out gradient-based MCMC/optimisation), no principled prior exists, and it is severely confounded with σ and ℓ — fix ν at one of {1/2, 3/2, 5/2, …} instead.
- conditions: any Matérn GP under HMC/NUTS/L-BFGS.
- tier: ⚪ candidate · source: dansblog:priors5
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reclassify the parameters before reasoning about priors"

**✗ HP13** · for a **non-centered spline/GP term** flagged by a **power-scaling prior-sensitivity
diagnostic** (priorsense) → treating the flag as real prior-data conflict does **NOT** work.
- why: the per-basis coefficients carry a deliberately fixed N(0,1) prior and are scaled by separately-estimated scale terms — power-scaling that fixed prior is meaningless; assign sensitivity to the focus level, not the nuisance basis coefficients.
- conditions: brms smooths / Hilbert-space GP approximations with fixed standard-normal basis coefficients × estimated scales.
- tier: 🟡 · source: mc-stan:29945
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe prior-improbable posteriors as data-vs-prior conflict, and check the magnitude in the right units (mass vs density)"

**✓/✗ HP14** · for an **R2D2 prior on a GP** → substituting a **pseudo-variance independent of model
parameters** for σ² in the R2D2 scale construction works; using the model σ² directly does **NOT**
(circular dependency).
- why: R2D2 scales the total variance, but coupling that scale to the estimated σ² creates a circular dependency; a fixed pseudo-variance breaks it.
- conditions: applying the R2D2 shrinkage prior to GP variance/length-scale components.
- tier: ⚪ candidate (move-derived "how") · source: mc-stan:35930 (context)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Substitute a PSEUDO-VARIANCE for sigma^2 in the R2D2 scale construction" · "Break the circular dependency by making the pseudo-variance independent of model parameters"

### Sampling geometry & parameterization

**✓ G1** · for a **latent-GP field** with fixed hyperparameters and a relatively **diffuse** likelihood
→ the **non-centered Cholesky whitening** f = L·f̃, f̃ ~ N(0,I) works (necessary *and* sufficient).
- why: it whitens the parameter space so HMC's diagonal mass matrix can approximate the geometry without full Hessian information; resolves the pathology completely in this regime, Gaussian or Poisson log-link.
- conditions: hyperparameters fixed or inferred jointly; likelihood diffuse relative to the GP prior (sparse obs, moderate σ); squared-exponential in the demonstrations.
- tier: 🟢 · source: betanalpha:gaussian_processes
- efficacy: {divergences: 0 (NCP, fixed hyperparameters) · min_ess: reasonable n_eff/R̂ · ess_per_sec: pending · rmse: pending · coverage: zero tree-depth saturations, healthy E-FMI}
- moves: "Apply the non-centered Cholesky whitening f = L·f̃ globally across the whole latent field — do not wait for divergences, since this geometry fails without producing any"

**✗ G2** · for a **high-dimensional GP prior** → the **centered parameterization** does **NOT** work —
and fails *invisibly*.
- why: the prior covariance K is strongly ill-conditioned, so the centered f-posterior is a highly **elongated ellipsoid** the identity (default) mass matrix cannot handle; HMC does not blow up (no divergences, no tree-depth saturation) but the chain crawls — a geometry-class, not a divergence-class, failure. (The non-centered f=Lz whitening *is* the fix — the Cholesky factor decorrelates the ellipsoid; anisotropy, not curvature, is the pathology here.)
- conditions: fixed hyperparameters (ρ, α, σ known), default mass matrix, high-dimensional f-space (N_predict=551 in the case study).
- tier: 🟢 · source: betanalpha:gaussian_processes, betanalpha:identifiability
- efficacy: {divergences: 0 (the trap — none produced) · min_ess: n_eff/iter < 0.001 · ess_per_sec: pending · rmse: pending · coverage: E-FMI as low as 4e-5, R̂ up to 35}
- moves: "Frame the signal before chasing fixes: decide whether saturated treedepth is a validity or an efficiency/geometry problem" · "Read Rhat and ESS (incl. in the unconstrained space) as a localizer, not just a pass/fail gate"

**✓ G3** · for a **latent-Gaussian model** y = Au + ε, u ~ N(0,Q(θ)⁻¹) → **marginalize u and run MCMC
only on θ** works (funnel-free regardless of dim u).
- why: via p(θ|y) ∝ p(y,u,θ)/p(u|y,θ); with a Gaussian likelihood p(u|y,θ) is closed-form, so plug in any u to get an exact marginal for θ, then draw u|y,θ analytically per sample — exact joint samples.
- conditions: Q(θ) closed-form; Gaussian likelihood ⇒ exact, non-Gaussian ⇒ Laplace-approximate.
- tier: 🟢 · source: mc-stan:2172, mc-stan:6178, pymc:16147
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Exploit conjugacy: analytically marginalize the latent field (and intercept) out of the posterior, folding their contributions into the covariance matrix"

**✓/✗ G4** · for a **GP regression** y ~ N(a+f, σ) with **divergences concentrated at small σ** →
**marginalizing the latent field** (to y ~ multi_normal_cholesky(0, chol(K+σ²I))) works; a
**zero-avoiding prior on σ** does **NOT**.
- why: pairs plots correctly localize the divergences to small σ, but the pathology is the joint η–σ neck (weakly-identified N-dim η coupled to σ); integrating out η removes it, whereas the boundary-avoiding prior does not.
- conditions: latent-Gaussian/GP with a Gaussian (or Laplace-approximable) observation model; N small enough that a dense N×N Cholesky per iteration is affordable.
- tier: 🟡 · source: mc-stan:26425
- efficacy: {divergences: pending (zero-avoiding prior fails to remove them; marginalization eliminates them) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Test the zero-avoiding-prior remedy empirically: sweep the strength/location of the boundary-avoiding prior on sigma and tabulate divergence counts" · "Reframe the symptom as suspected non-identifiability rather than a tuning/geometry problem" · "Confirm the pathology is a funnel and locate where the divergences concentrate"

**✓ G5** · for an **NCP GP with a Gaussian likelihood linear in the latent** → a **Laplace-marginalizing
sampler is exact** (not approximate).
- why: with a φ-independent N(0,I) prior on the NCP base and a Gaussian/linear likelihood, p(θ|φ,y) is exactly Gaussian by conjugacy, so the Laplace step introduces no error.
- conditions: NCP base f̃ ~ N(0,I); Gaussian linear likelihood; Cholesky needs jitter (~1e-4), worse under float32; inner L-BFGS must actually converge; pays off when φ-dim ≪ θ-dim.
- tier: 🟢 · source: merged-48 (case study)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Rule out floating-point precision as the driver of step-size collapse"

**✗ G6** · for a **Laplace marginal over a high-dimensional latent** → the **default L-BFGS
maxiter=30** inner solve does **NOT** work.
- why: it is far below the worst-case O(κ/m)≈260 iterations the condition number demands; silent non-convergence corrupts the Hessian used for mass-matrix estimation and breaks dual-averaging step-size adaptation.
- conditions: d≈200, κ≈2600 GP precision; inner mode solve embedded in outer MCMC.
- tier: 🟢 · source: worklog-laplace-marginal-lbfgs-convergence-floor
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: φ-level Hessian inflated 18–54× above true curvature; MCMC step_size collapsed up to 670× · coverage: pending}
- moves: "Read extreme stepsize collapse as a STIFFNESS signal (large, position-varying condition number of the Hessian)" · "Reject the metric/stepsize-floor fix on detailed-balance and dynamical grounds"

**✓ G7** · for that **high-dimensional Laplace inner solve** → raising **L-BFGS maxiter to ~300–500**
works.
- why: matches the O(κ/m) convergence requirement, so the mode solve converges and step-size adaptation succeeds (the limited-memory L-BFGS Hessian is only a low-rank approximation — form the full Hessian at the converged mode for the Laplace covariance).
- conditions: inner mode solve behind a Laplace marginal; budget scales with the inner problem's condition number, not just its dimension.
- tier: 🟢 · source: merged-48, worklog-laplace-marginal-lbfgs-convergence-floor
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Set the inner L-BFGS iteration budget from the problem's condition number (~O(κ/m)), not from its dimension alone"

**✗ G8** · for **frozen/flat GP traces** with a collapsed step size → reading them as **successful
acceptance** does **NOT** work.
- why: flat traces are whole-chain freezing from a leapfrog/Hamiltonian divergence, not proof of acceptance; a step-size *floor* fix violates detailed balance rather than curing the stiffness.
- conditions: extreme position-varying Hessian condition number (stiffness); single-chain diagnostic context.
- tier: ⚪ candidate (single-witness moves) · source: (move-only; corroborates worklog-laplace-marginal-lbfgs-convergence-floor)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Re-examine the raw draws instead of the rendered traceplot" · "Reframe flat traces as whole-chain freezing from leapfrog/Hamiltonian divergence, not as proof of acceptance" · "Derive the exact numerical-freeze condition from the leapfrog position update"

### Warmup adaptation

**✓ W1** · for **multi-chain HMC/NUTS with windowed warmup** → **adaptive warmup driven by
between-chain R̂ and bulk-ESS** works.
- why: stop warmup once all-parameter R̂ < target and bulk-ESS > target; drop the earliest non-stationary windows by picking the window subset that maximizes ESS; pool variance across chains so the mass matrix adapts faster (fewer leapfrog steps).
- conditions: step-size dual-averaging + mass-matrix estimation; multiple chains that genuinely should converge to the same distribution.
- tier: 🟡 · source: mc-stan:12039, mc-stan:12912
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Stop warmup adaptively once all-parameter R̂ < target and bulk-ESS > target, and pick the window subset that maximizes ESS (dropping the earliest non-stationary windows)"

**✗ W2** · for a **chain that was never converging** → **warmup** does **NOT** rescue it.
- why: warmup is valid only if the full chain (including warmup) would have satisfied the MCMC CLT — then removing early states leaves a CLT-valid sub-chain; if the CLT never holds (reducibility, non-ergodic geometry), discarding early states changes nothing.
- conditions: window size chosen so trace plots show no visible initialization influence — a visual criterion, not a fixed fraction.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe flat traces as whole-chain freezing, not as proof of convergence"

**✗ W3** · for a model with **structural non-identifiability between chains** (factor indeterminacy,
sign/reflection, label switching) → **convergence-driven warmup adaptation** does **NOT** work without
first fixing identifiability.
- why: between-chain R̂/ESS are only meaningful when chains genuinely target the same distribution; under structural multimodality they misreport, and the auto-length/window-drop logic breaks.
- conditions: exchangeable mixtures, factor/sign degeneracy; fix identifiability in the model first.
- tier: 🟡 · source: mc-stan:12039, mc-stan:12912
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Fix the identifiability in the model first (ordering / anchoring / sign constraint) before trusting between-chain R̂/ESS to drive warmup adaptation"

### Scaling & sparse computation

**✗ S1** · for an **exact dense GP with N more than a few hundred** → **full-covariance HMC/NUTS** does
**NOT** scale.
- why: each log-density/gradient costs O(N³) (Cholesky of the N×N kernel) and O(N²) memory; discovered when the run OOMs ("cannot allocate vector") or sits at 0%. More data makes the matrix bigger — never "tune the sampler harder".
- conditions: dense kernel matrix, latent GP fit with full Bayesian sampling, N ≳ few hundred–1000.
- tier: 🟡 · source: mc-stan:3517, mc-stan:11661
- efficacy: {divergences: OOM / no advance beyond ~few hundred–1000 points · min_ess: pending · ess_per_sec: O(N³) time, O(N²) memory per gradient · rmse: pending · coverage: pending}
- moves: "Reframe runtime in terms of gradient evaluations: inspect leapfrog steps per iteration and treedepth rather than wall clock" · "Reframe sampling the GP as constructing a matrix square root L of K and drawing u = L z; ask whether L can be built directly at lower cost"

**✓ S2** · for a **large smooth stationary GP** → a **Hilbert-space basis-function (HSGP) low-rank
approximation** works.
- why: replaces the dense GP with a structured low-rank eigenfunction expansion, cutting the per-gradient cost.
- conditions: smooth stationary kernel, inputs roughly centered/bounded; the eigenfunction approximation degrades near domain boundaries and for very small length scales.
- tier: 🟡 · source: mc-stan:3517, mc-stan:11661
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Instrument the approximation: monitor reconstruction error of the kernel online and inspect where it fails" · "Audit the feature-map normalization against the source theorem before trusting it as a GP draw"

**✓ S3** · for **low-dimensional (1-D, time-like) ordered inputs with a Matérn-class kernel** → a
**state-space / Markov (SPDE)** representation works.
- why: the Matérn spectral-polynomial structure admits a sparse-precision Markov form solved in linear time along the ordering.
- conditions: 1-D ordered inputs, Matérn (spectral-polynomial) kernel; does **not** apply to the squared-exponential.
- tier: 🟡 · source: mc-stan:3517, mc-stan:11661
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Exploit the 1-D ordering: reformulate the Matérn GP as a linear-time state-space / sparse-precision Markov model along the input ordering"

**✓ S4** · for a **sparse-precision latent-Gaussian model** → **parameterizing via the precision Q(θ),
not the covariance Σ(θ)** works (mechanistically necessary).
- why: the inverse of a connected sparse matrix is generically dense, so covariance form destroys all sparsity and collapses O(n^1.5) sparse Cholesky to O(n³).
- conditions: sparse prior precision (LMEs, AR, ICAR, splines, Markovian GPs); design matrix Z with ≤ O(√n) nonzeros per row.
- tier: 🟢 · source: dansblog:lme, dansblog:sparse7
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Build the model on the precision Q(θ) directly — never form or invert the dense covariance Σ(θ), which destroys the sparsity"

**✗ S5** · for a **predictive-process / global-inducing-point GP with a dense design matrix** →
precision parameterization does **NOT** preserve sparsity.
- why: with dense Z (subset-of-regressors), AᵀW⁻¹A becomes dense regardless of how sparse Q(θ) is, since each observation depends on O(n) latents.
- conditions: dense design rows / global inducing points; no analytical marginalization that produces dense precision rows.
- tier: 🟢 · source: dansblog:lme, dansblog:sparse7
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Check whether the design matrix Z is dense (global inducing points / subset-of-regressors): if each observation loads on O(n) latents, no precision parameterization can preserve sparsity"

**✓ S6** · for a **sparse SPD precision Q with L already computed** → the **Takahashi recursions** to
recover Q⁻¹ at Q's nonzeros work.
- why: they recover exactly the entries needed for marginal variances, score functions, and generated quantities in O(nnz(L)) — the recursion is self-contained within L's fill pattern.
- conditions: Q sparse and SPD; L computed; only nonzero-position entries needed; recursion order column n−1 → 0 is mandatory (reversing breaks self-containment).
- tier: 🟢 · source: dansblog:partial-inverse, dansblog:catch-derivative
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run the Takahashi recursion in the mandatory column n−1 → 0 order over L's nonzero pattern to recover the needed entries of Q⁻¹ in O(nnz(L))"

**✗ S7** · for **gradient-based hyperparameter inference through the partial inverse** → relying on it
having a **reverse-mode AD specialization** does **NOT** work.
- why: the derivative of the partial inverse w.r.t. Q's hyperparameters needs its own Takahashi-like backward recursion for d(Σ)/dθ, which is not implemented.
- conditions: differentiating through partial_inverse for a Gaussian MLE / gradient descent on the score.
- tier: ⚪ candidate · source: dansblog:partial-inverse
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Derive an exact log-space identity"

**✗ S8** · for **sparse Cholesky in JAX** → relying on **dynamically-shaped output** does **NOT** work.
- why: fill-in makes nnz(L) unknown until symbolic factorization runs on the concrete sparsity pattern, but JAX needs all output shapes statically known at trace time — so L_nse must be pre-declared as a static integer keyword argument (same nse constraint as jax.experimental.sparse).
- conditions: operations whose output nnz depends on fill-in; workaround = run symbolic factorization once eagerly, capture L_nse, pass as static.
- tier: 🟢 · source: dansblog:sparse4, dansblog:catch-derivative
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run the symbolic factorization once eagerly to capture nnz(L), then pass L_nse as a static integer keyword argument so JAX can trace the sparse Cholesky"

### Markov / SPDE kernel structure

**✓ M1** · for a **stationary GP** → a **sparse-precision (SPDE/FEM) representation** works **iff** the
inverse spectral density f(ω)⁻¹ is a non-negative symmetric polynomial (Matérn qualifies).
- why: for stationary GPs the RKHS inner product equals ∫ v̂₁ v̂₂ f(ω)⁻¹ dω, and differential operators are polynomial multiplications in Fourier space (Peetre), so the polynomial condition is exactly the Markov (locality) condition.
- conditions: stationary GP on ℝ^d, conjugate GP exists, weak (second-order) Markov property.
- tier: 🟢 · source: dansblog:markov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Isolate the offending term by ablation"

**✗ M2** · for the **squared-exponential (RBF) kernel** → an **SPDE/FEM sparse representation** does
**NOT** work, and cannot be made to.
- why: two architectural obstacles coincide — f(ω)⁻¹ ~ exp(|ω|²/2) is not a polynomial (Theorem 3 rules out Markov), and C₀^∞ is not dense in the RBF RKHS (no conjugate GP, Theorem 1 fails), so neither the property nor the characterizing theory holds. Alternatives (inducing points, random Fourier features) live outside the SPDE framework.
- conditions: standard squared-exponential/RBF kernel; both failures exact, not tunable.
- tier: 🟢 · source: dansblog:markov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Switch to a Matérn-class kernel if a sparse-precision SPDE/FEM form is required, or use an out-of-SPDE approximation (inducing points, random Fourier features) for the RBF"

**✓ M3** · for a **Markovian GP** → building a **sparse precision Q via FEM** works only with **both**
RKHS locality **and** compact-support basis functions.
- why: Q_ij = ⟨ψ_i, ψ_j⟩ = 0 for disjoint supports (locality), but this only yields a sparse Q if most basis pairs actually have disjoint supports (compact support); a non-Markovian kernel with compact support still gives dense Q, and a Markovian kernel with global basis also does.
- conditions: GP Markovian (RKHS locality); piecewise-linear tent functions on a triangulation; Petrov–Galerkin correction negligible for Matérn but formally needed.
- tier: 🟢 · source: dansblog:markov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Isolate the offending term by ablation"

**✓ M4** · for **GPs on non-Euclidean domains** (e.g. the sphere) → the **RKHS/SPDE characterization
extends via the differential operator C^(−1/2) in local coordinates** — no new positive-definite
covariance functions required.
- why: when locality holds, Peetre's theorem forces C⁻¹ to be a symmetric elliptic differential operator, which is defined intrinsically on a manifold (Laplace–Beltrami); the covariance-function route instead needs domain-specific PD functions for each geometry.
- conditions: manifold supporting a differential-operator characterization + a finite-element mesh; theory stated (footnote) but not fully developed, deferred to Lindgren–Lindström–Rue.
- tier: 🟡 · source: dansblog:markov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Trace the construction back to its primary derivation to confirm it supports the general case"

### Prediction (out-of-sample)

**✗ P1** · for an **exact/latent GP predicting at new inputs X\*** → the **generic parametric predictive
pattern** (numpyro/pyro `Predictive`, `pm.set_data` on a Latent GP, "feed in new X") does **NOT** work.
- why: a GP is non-parametric — the predictive at X* depends on the full joint posterior of the latent function over the *training* inputs together with the training data, not just samples of the hyperparameters; the generic machinery silently returns draws indistinguishable from the prior, with no error.
- conditions: PyMC pm.gp.Latent/Marginal, numpyro/pyro hand-written MVN GP, X* ≠ X_train; does NOT apply to HSGP or ordinary parametric regression.
- tier: 🟡 · source: pyro:3868, pymc:11887, pymc:6229
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: posterior-predictive mean collapses toward the prior · coverage: pending}
- moves: "Inspect the rank/shape of Xnew passed to the GP prediction call" · "Review how the random-variable query point is assembled and shaped before conditional" · "Check whether pm.sample is being re-run on a Model that already had new nodes added (double-counted dimensions)"

**✓ P2** · for **GP out-of-sample prediction** → explicitly **conditioning on the training data via the
cross-covariance** K(X_train, X\*) + the analytic GP posterior-predictive equations works.
- why: a GP defines a joint Gaussian over function values at *all* inputs; to predict at X* you must recompute K(X_train,X*), K(X*,X*) from the *same* kernel/hyperparameters and condition on the training observations (PyMC gp.conditional/gp.predict; Stan; any GP library where the predictive step is separate from the fit).
- conditions: stationary kernel (RBF/EQ/Matérn); predictions at inputs not in the training set.
- tier: 🟡 · source: pymc:1299, mc-stan:16891, mc-stan:5442
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diff the shape of the observed target y against the GP API contract" · "Request and run a minimal reproducible example with sample data instead of reasoning from transcribed snippets"

### Additive / structural decomposition

**✗ A1** · for an **additive / multi-component signal decomposition** (multi-scale GPs, shared global +
series-specific trends, level + seasonal frequencies) with **overlapping function classes** → inferring
component hyperparameters **without non-overlapping-scale priors** does **NOT** work.
- why: two components that can represent the same functional behavior are exchangeable and alias (the canonical y=a+b degeneracy); the likelihood is invariant to the swap so *no amount of data resolves it*, giving degenerate/multimodal/stiff posteriors, and stiffness worsens as more series/time points share a tightly-constrained component.
- conditions: data-inferred component hyperparameters (length scales, amplitudes, innovation variances, Fourier orders) in overlapping function classes; does not require large N.
- tier: 🟢 · source: mc-stan:8028, pymc:16375
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Examine the JOINT prior on the linear predictor by adding effects and tracking variance growth"

**✓ A2** · for **additive GP components** → **priors that concentrate each component around a unique,
non-overlapping scale** work.
- why: pinning each component to a distinct scale (length scale, Fourier order) breaks the exchangeability and removes the aliasing.
- conditions: additive decomposition where components would otherwise belong to overlapping function classes.
- tier: 🟢 · source: mc-stan:8028, pymc:16375
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Quantify what the proposed prior actually implies (tail probability + simulate draws) and sanity-check against domain plausibility"

### Splines / GAM smooths

**✗ SP1** · for a **Bayesian penalized-spline / GAM smooth** → reasoning about global behavior from the
**default coefficient / wiggliness priors** does **NOT** work.
- why: splines are interpretable only *locally*; sampling functions from the prior pushforward of a common spline model produces surprisingly wild global behavior, and GP interpretability does *not* transfer to most spline models.
- conditions: B-splines, thin-plate, factor smooths (mgcv/brms, PyMC spline regressions) where the user reasons via coefficients or default priors.
- tier: 🟡 · source: mc-stan:24759, mc-stan:34721, pymc:6235
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Examine the JOINT prior on the linear predictor by adding effects and tracking variance growth" · "Quantify what the proposed prior actually implies (simulate draws)"

**✓ SP2** · for a **monotone/shape-constrained smooth** wanted from a linear spline basis → imposing the
**shape constraint on the basis coefficients** works (corollary).
- why: the monotonicity corollary applies whenever a shape constraint is wanted from a linear spline basis — encode it in the coefficients rather than hoping the default prior delivers it.
- conditions: linear spline basis; shape (e.g. monotonicity) constraint desired.
- tier: 🟡 · source: mc-stan:24759
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reclassify the parameters before reasoning about priors — identify which are cut points / simplex / coefficients"

### Applications: contrasts & consistency

**✓ AP1** · for a **grouped / repeated-measures contrast** (A/B test with per-day counts and revenue) →
a **GP or shared RE on the group-level intercept** works (sharpens the effect).
- why: the quantity of interest is the condition difference; without a mechanism to attribute structured day-to-day variation, it gets dispersed across "difference" and "noise", inflating both — a GP on the intercept attributes it.
- conditions: plausible structured (temporal/spatial/grouping) baseline variation; concurrent/parallel design; scales awkwardly to many conditions (A/B/C/…).
- tier: 🟡 · source: mc-stan:26490, mc-stan:39288
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Establish the data-generating context of the estimate before diagnosing the model"

**✗ AP2** · for the **same contrast when between-group variation is genuinely unstructured noise** → a
**GP/shared-intercept** model does **NOT** help.
- why: if there is no real structure to attribute, the GP adds nothing over a simpler noise-only model; predictive checks should reveal this.
- conditions: between-group variation genuinely unstructured; simpler noise-only model adequate.
- tier: 🟡 · source: mc-stan:26490, mc-stan:39288
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Quantify what the proposed prior actually implies and sanity-check against domain plausibility"

**✓ AP3** · for **population-mean estimation under covariate-dependent randomization** (Robins–Ritov) →
a **structured GP prior over the stratum index** recovers √n-consistency.
- why: a smooth GP (or true parametric model) lets unobserved strata be predicted from observed ones *without* using the sampling weights ξ_j — the failure was the high-dimensional iid/exchangeable prior carrying no cross-stratum information.
- conditions: the GP smoothness must genuinely reflect structural regularity in μ_j (not be imposed ad hoc to patch the inconsistency) and be sufficient to predict unobserved strata at the required rate.
- tier: ⚪ candidate · source: dansblog:robins-ritov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Verify the GP smoothness reflects genuine structural regularity in μ_j (sufficient to predict unobserved strata at the required rate), not an ad-hoc smoothness imposed to patch the inconsistency"

### Diagnostics (localization & interpretation)

**✓ E1** · for a **GP funnel with divergences** → **pairs-plotting the ENSEMBLE of divergent draws**
(with treedepth overlaid, isolating anomalously low-treedepth divergences) works to localize the
bottleneck.
- why: individual divergent points scatter; the ensemble concentrates at the neck, and low-treedepth divergences mark where the integrator gives up — count alone is insufficient.
- conditions: divergence-producing GP/latent-field geometry; requires scatter visualization and generating enough divergences for resolving power.
- tier: 🟢 · source: betanalpha:gaussian_processes (corroborated by move cluster)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Look at the ENSEMBLE of divergent draws rather than individual points" · "Add treedepth to the pairs plot and isolate divergent draws with anomalously LOW treedepth" · "Generate more divergent transitions / more resolving power before re-plotting"

**✓ E2** · for **locating *where* a divergence occurred** → reporting the trajectory **endpoint weighted
by error-increase AND local posterior density** (not raw error magnitude, not a fixed trajectory point)
works.
- why: the reported divergence coordinate is implementation-dependent; weighting leapfrog steps by both energy-error increase and local density picks the coordinate that actually represents the pathology — validated on the centered-parameterization funnel and a taxonomy of provoked pathologies.
- conditions: NUTS with per-leapfrog energy-error instrumentation; needs a cheap two-point summary that does not corrupt the chain.
- tier: ⚪ candidate (single-witness move cluster) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Select the localization point by weighting trajectory points by error-increase AND local posterior density" · "Instrument the sampler to dump the divergence ENDPOINT and overlay it against the reported starts" · "Validate the diagnostic on benchmark models with KNOWN problem geometry"

**✗ E3** · for a **geometric GP pathology** → cranking **adapt_delta / target_accept to an extreme** to
suppress divergences does **NOT** work.
- why: an extreme target_accept masks rather than removes the pathology — a red flag, not a solution; the surviving diagnostic (E-BFMI) is the one to watch as you dial a funnel's dimension.
- conditions: geometric (non-ergodic) pathology; distinguish masking from removing.
- tier: ⚪ candidate (single-witness moves) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Distinguish masking a pathology from removing it; flag an extreme target_accept as a red flag, not a solution" · "Build a funnel and dial its dimension; raise adapt_delta to suppress divergences and watch which diagnostic survives"

**✗ E4** · for **prior-improbable posteriors on GP terms** → reading them as a **model problem** without
checking units does **NOT** work.
- why: reframe as data-vs-prior conflict and measure the magnitude in the *right units* (mass vs density, posterior-mean distance) — a prior-diverges/posterior-clean asymmetry usually means the data ruled out the high-curvature region, not that the model is broken.
- conditions: prior-sensitivity / power-scaling diagnostics on GP/spline terms.
- tier: 🟡 · source: mc-stan:29945 (context; move cluster)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe prior-improbable posteriors as data-vs-prior conflict, and check the magnitude in the right units" · "Interpret the prior-diverges/posterior-clean asymmetry as the data ruling out the high-curvature region"

### Prior specification & elicitation (searchable tail)

**✗ EB1** · for **setting a GP prior scale from a pre-fit to the same data** → **empirical-Bayes prior
tuning** does **NOT** work.
- why: it violates the Likelihood Principle and is worse than it looks; challenge whether the pre-fit is even necessary — prior experiments or first-principles domain reasoning can often supply the scale, and post-hoc model selection is a still deeper hazard.
- conditions: prior scale elicited from the data being analyzed; check whether the estimate is prior-only or a full fit.
- tier: ⚪ candidate (single-witness moves) · source: (move-only; corroborates dansblog:cheat)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Name the procedure as empirical-Bayes prior tuning and diagnose WHY it is worse than it looks" · "Challenge the necessity of the pre-fit; ask whether prior experiments or domain reasoning could supply the scale" · "Surface and flag post-hoc model selection as a separate, deeper hazard than prior tuning"

**✓ EB2** · for **checking a GP/spline prior** → running a **prior-predictive check against implicit
DOMAIN EXPERTISE** (not against the observed data) works.
- why: prior predictive checks compare the induced consequences to what you know a priori; checking them against the observed data conflates the prior with the likelihood and disentangles measurement-scale (units) from parameter-magnitude (domain belief).
- conditions: any GP/spline prior specification; elicit on whatever scale is intuitive, then rescale.
- tier: ⚪ candidate (single-witness moves) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Correct the semantics of prior predictive checks: check consequences against IMPLICIT DOMAIN EXPERTISE, not against the observed data" · "Disentangle measurement-scale (units) from parameter-magnitude (domain belief)"

**✓ PB1** · for an **intended bimodal / bounded prior** (e.g. Beta) that misbehaves under HMC → swapping
to a **logit-normal controlling location and spread on the unconstrained logit scale** works.
- why: an affine (location-scale) non-centering ports cleanly to the logit scale, controlling location and spread without the Beta's admissibility-boundary geometry (σ² < μ(1−μ)) that blows up the gradient.
- conditions: bounded-support prior specification under a gradient-based sampler; verify on the user's actual (non-toy) model.
- tier: ⚪ candidate (single-witness moves) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Propose swapping Beta for a logit-normal that controls location and spread on the unconstrained logit scale" · "Reparameterize the Beta through a concentration parameter on a logistic-compressed scale instead of through sigma = const/exp(v)" · "Port the concentration/gamma parameterization into the user's actual (non-toy) model and re-check divergences"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
gaussian_processes · identifiability · markov_chain_monte_carlo_basics · some_containment_prior_models

**Dan Simpson blog** (`dansblog:<id>` → `https://dansblog.netlify.app/posts/…`):
priors5 (`2022-09-07-priors5`) · cheat (`why-wont-you-cheat-with-me-repost`) · markov (`2023-01-21-markov`) ·
partial-inverse (`2024-09-05-partial-inverse`) · catch-derivative (`to-catch-a-derivative…`) ·
lme (`a-linear-mixed-effects-model`) · sparse7 (`2022-11-27-sparse7`) · sparse4 (`2022-05-18-sparse4-some-primatives`) ·
robins-ritov (`2022-11-12-robins-ritov`)

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pymc:N` → `https://discourse.pymc.io/t/…/N`;
`pyro:N` → `https://forum.pyro.ai/t/…/N`):
mc-stan:8028 · mc-stan:2172 · mc-stan:3517 · mc-stan:5136 · mc-stan:5442 · mc-stan:6178 · mc-stan:11661 ·
mc-stan:12039 · mc-stan:12912 · mc-stan:16891 · mc-stan:24759 · mc-stan:26425 · mc-stan:26490 · mc-stan:29945 ·
mc-stan:34721 · mc-stan:35930 · mc-stan:39288 · pymc:1299 · pymc:6229 · pymc:6235 · pymc:11887 · pymc:16147 ·
pymc:16375 · pyro:3868

**Case-study / worklog claims** (internal, no public URL): `merged-48` (exact Gaussian conditional under NCP),
`worklog-laplace-marginal-lbfgs-convergence-floor` (L-BFGS convergence floor).
