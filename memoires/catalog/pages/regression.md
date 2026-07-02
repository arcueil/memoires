# Regression models (linear / GLM / GP / ordinal)

## Claims (the *why* — mid-level, ~3–5)

*Five mid-level principles synthesized from 60 granular claims. Tier is the best-supported
of the granular claims each subsumes. Source short-ids resolve to URLs at the bottom of the page.*

### C1 · Regression is a narrow special case of variate–covariate modeling — confounding is *parameter coupling*, and it is invisible to every internal check 🟢
*[→ full entry](../claims/regression/C1.md)*

**Statement.** "Regression" names a restrictive structure — a location-based conditional variate
model, *no* parameter shared with the covariate-generating process, and a homogeneous configuration
across observations — so its central failure, confounding, is not a property of the data or of any
one model component but of the *coupling* between the conditional variate model and the marginal
covariate model.

**Nuance.** Betancourt's formal definition is sharper than "common cause": a parameter ψ is a
confounder exactly when it appears in *both* π(y|x,η,ψ) and π(x|γ,ψ) — which covers selection,
shared physical resources, and mobility mechanisms. The payoff is a *decoupling theorem*: when ψ is
absent, π(η,γ|y,x)=π(η|y,x)·π(γ|x), so learning η needs no covariate model and prediction is correct
however arbitrarily x is distributed — but when ψ is present, a conditional-only model absorbs
between-context covariate heterogeneity into the treatment effect and can *flip the sign* of a causal
estimate. The lethal part is undetectability: zero divergences, passing NUTS diagnostics, passing
marginal *and* conditional retrodictive checks all coexist with a wrong-signed effect, because those
checks are conditioned on the observed covariates the model was fit to. Randomization only helps to
the degree it is implemented — dropout/censoring correlated with the variate process reintroduces
confounders — and propensity scores / do-calculus are approximate compensations, not replacements for
building the marginal covariate model.

**Conditions.** Causal/interventional or counterfactual targets; the concern weakens in
pure-predictive settings where x varies similarly in the future; matters most when misspecification
operates through parameter reassignment (no visible distributional misfit).

**Tier.** 🟢 established (subsumes `regression-is-a-narrow-special-case-of-variate-covariate-modeling`,
`variate-covariate-decoupling-theorem`, `confounding-as-parameter-coupling`,
`confounding-sign-reversal`, `controlled-vs-uncontrolled-experiment-require-different-models`,
`designed-experiment-confounding-from-imperfect-implementation`,
`conditional-retrodictive-check-blind-to-covariate-model-failure-and-co`,
`retrodictive-checks-also-fail-for-confounded-extrapolation`;
plus `propensity-scores-and-do-calculus-as-workarounds` ⚪).

**Sources.** betanalpha:variate_covariate_modeling · betanalpha:generative_modeling

---

### C2 · Linear (and polynomial) regression is a *local Taylor approximation* — validity is bounded by covariate support, and extrapolation failure is structurally undetectable 🟢
*[→ full entry](../claims/regression/C2.md)*

**Statement.** A linear model is not a global truth but a first-order Taylor expansion of an unknown
location function about a baseline x₀, valid only inside a neighborhood U; its adequacy is governed by
whether the covariate distribution — at *both* training and prediction time — stays inside U, not by
how straight the scatter plot looks.

**Nuance.** Clean NUTS diagnostics (zero divergences, good E-FMI, good R̂) are fully compatible with
order-of-magnitude parameter-recovery failure when the model is misspecified by *order*. Two
consequences follow. (1) Parameterization is semantic: only covariate *perturbations* Δx=x−x₀ give
each coefficient an unambiguous differential meaning (α=f(x₀), β₁=f′(x₀), β₂=½f″(x₀)); with raw x the
intercept conflates function and derivative values, and extremity-threshold priors are impossible to
elicit — and because the functional output is a *sum* of terms scaled by (x−x₀)ⁱ, per-coefficient
bounds do not bound the aggregate, so a prior pushforward check is mandatory, not optional. (2)
Extrapolation to non-overlapping covariate regions is invisible to *every* internal check — NUTS
diagnostics, marginal and conditional retrodictive checks all pass, and higher-order Taylor models do
not rescue it; the only guard is visual inspection against held-out covariates. Usefully, a
*second*-order model turns regression into a Bayesian Newton's method (posterior over the extremum
x*=−½J₂⁻¹J₁+x₀), and overlapping multifactor models let you predict genuinely unobserved
configurations by additively reconstructing from separately-estimated main effects and lower-order
interactions.

**Conditions.** Covariate range wider than U, or a true function with non-negligible higher-order
derivatives; specific to local/Taylor bases — does not extend to global basis expansions or GPs with
appropriate kernels.

**Tier.** 🟢 established (subsumes `linear-regression-is-a-local-taylor-approximation`,
`perturbation-parameterization-decouples-parameter-interpretation`, `prior-aggregation-not-additive`,
`second-order-taylor-regression-as-bayesian-newtons-method`,
`extrapolation-failure-structurally-undetectable-by-internal-checks`,
`overlapping-factor-model-enables-unobserved-configuration-prediction`,
`residual-shape-as-missing-structure-fingerprint`,
`correlated-covariates-artifact-in-conditional-retrodictive-plots`; plus supported `forum-c213`
extrapolation-fan).

**Sources.** betanalpha:taylor_models · betanalpha:general_taylor_models · betanalpha:factor_modeling ·
betanalpha:falling · pymc:5824

---

### C3 · Ridges and funnels in the *linear predictor* split into two look-alike regimes with opposite fixes: non-identifiability needs a regularizing prior (no sampler cure); computational ill-conditioning needs a coordinate transform 🟢
*[→ full entry](../claims/regression/C3.md)*

**Statement.** Collinear and underdetermined regressions both present as elongated ridges / σ-funnels
with the same surface symptoms (huge trajectories, tree-depth saturation, low E-BFMI), but they are
mechanistically opposite: an **identified-but-ill-conditioned** posterior is a *computational* problem
fixed by transforming coordinates (centering + QR), whereas a **non-identified** likelihood (M>N,
rank-deficient design) is fixed only by an informative prior that *regularizes* the scale — no
reparameterization, sampler variant, or tuning knob resolves it.

**Nuance.** On the computational side, near-collinear covariates (e.g. x and x² for uncentered
positive x) collapse the *identified* posterior onto a near-1D ridge that forces >10⁶ gradient
evaluations; QR decorrelation applies to any GLM and preserves the target exactly (its Jacobian
depends only on the data, so beta=R⁻¹·betã recovers the original posterior), but **centering before
the decomposition is the operative step** (~1.8× uncentered → ~9.7× centered), and QR is useless when
the correlation is *prior*-induced rather than likelihood-induced. On the identifiability side, when
M>N the likelihood is non-identified and a flat/wide prior yields an *astronomically* diffuse
posterior (all diagnostics fail at once); the classic horseshoe fails here because unbounded local
scales let the non-identifiability propagate through heavy tails; a narrow WIP fixes sampling but
*silently biases* — relevant slopes shrink and σ inflates ~10× to absorb the signal, which makes the
**σ posterior a free sentinel** for prior misspecification. The underdetermined-regression funnel
lives in the Gaussian *likelihood* y~N(Xβ,σ), so NCP has no analogue; zero divergences can be
actively misleading (data soften the funnel tip while E-FMI collapses to ~0.03); and raising
max_treedepth resolves *mixing* but not the E-BFMI failure — the two have different origins.
Tree-depth saturation without divergences (E-FMI normal) is itself the canonical *non-identifiability*
signal, not a cue to raise max_treedepth.

**Conditions.** Linear predictor with collinear or rank-deficient design; HMC/NUTS; the
computational-vs-identifiability split is the load-bearing diagnostic call. Underdetermined-regression
geometry was flagged as an open research problem (Dec 2018).

**Tier.** 🟢 established (subsumes `casestudy-non-identified-likelihood-requires-prior-to-identify-posterior`,
`casestudy-horseshoe-without-slab-fails-under-non-identified-likelihood`,
`casestudy-narrow-wip-biases-relevant-slopes-and-inflates-sigma`,
`casestudy-sigma-posterior-is-a-sentinel-for-prior-misspecification-in-sparse-reg`,
`underdetermined-regression-likelihood-funnel`, `ncp-does-not-fix-likelihood-induced-funnel`,
`divergence-absence-misleads-in-underdetermined-regression-funnel`,
`treedepth-expansion-resolves-mixing-not-ebfmi-in-underdetermined-regre`, `exact-collinearity-sigma-funnel`,
`collinearity-ridge-hmc-inefficiency`, `qr-applies-to-any-glm`, `qr-centering-is-the-decisive-step`,
`qr-reparameterization-preserves-inference-target`, `casestudy-tree-depth-saturation-as-geometry-signal`;
plus supported `underdetermined-regression-posterior-geometry-is-open-research`,
`qr-fails-under-prior-induced-correlation`, `forum-c15` location-non-id, `forum-c118` covariate-SA,
`forum-c25` latent-GP-funnel).

**Sources.** betanalpha:bayes_sparse_regression · betanalpha:underdetermined_linear_regression ·
betanalpha:qr_regression · betanalpha:taylor_models · betanalpha:ordinal_regression · mc-stan:39536 ·
mc-stan:17086 · mc-stan:17266 · mc-stan:26425

---

### C5 · Derived quantities, predictions, and effect summaries are definition- and estimand-dependent — there is no single right number 🟡
*[→ full entry](../claims/regression/C5.md)*

**Statement.** Once a regression is fit, the reported quantity is a *choice*: expectation vs full
predictive, conditional vs marginal, per-draw vs averaged, response scale vs latent scale — and these
choices disagree (sometimes reverse ordering), so the estimand and the posterior-summary primitive must
be fixed deliberately, not left to a default helper.

**Nuance.** `epred`/`linpred` return the conditional *mean* (parameter uncertainty only, systematically
too narrow); `predict` injects residual noise and reproduces discrete/structural features like a
hurdle model's zero spike — differencing y against `epred` omits irreducible variance and gives a
too-narrow RMSE. Order of operations is load-bearing: for marginal effects from random-slope/correlated-
RE models the AME (average per-unit predictions) ≠ the MEM (average covariates first) under a nonlinear
link. "Bayesian R²" has no single definition — residual-based vs model-based estimators disagree in
magnitude *and* can reverse the conditional>marginal ordering for mixed models — and R² is
observation-model-dependent, not comparable across likelihoods even at identical coefficients. A
categorical predictor's effect must be *marginalized* over levels, not read off the reference; a
targeted quantile in ALD regression is the ALD *location*, but default helpers return its offset mean;
effect assessment should prefer a directional posterior probability or ROPE over a prior-fragile
point-null Bayes factor; a broad-prior logistic fit ≈ MLE, so classification-metric gaps are
decision-rule/scoring artifacts. Selection is a decision problem: don't refit-and-remove by LOO (it
overfits CV) — use projection-predictive selection, and don't read projpred's forward path as an
interpretable formula. Prediction targets must specify the estimand: a fitted GP is not a callable
function (out-of-sample requires explicit conditioning), and MRP poststratification is admissible only
over covariates with a known population joint distribution.

**Conditions.** Any post-fit summary, prediction, effect, or selection; most acute under non-identity
links, hierarchical structure, and mixture/hurdle likelihoods; the two R² definitions and
conditional/marginal split coincide for ordinary linear regression.

**Tier.** 🟡 supported (subsumes `forum-c54` epred-vs-predict, `forum-c450` fitted-vs-predict,
`forum-c334` quantile-ALD, `forum-c335` marginal-effects-order, `forum-c20` categorical-marginalize,
`forum-c160` R²-cross-model, `forum-c342` no-single-R², `forum-c67` ROPE-vs-BF, `forum-c280`
logistic-vs-MLE, `merged-6` projpred-vs-refit, `forum-c458` projpred-marginality, `forum-c471`
GP-prediction-conditioning, `forum-c187` MRP-poststratification).

**Sources.** mc-stan:28502 · mc-stan:16736 · mc-stan:8706 · mc-stan:24172 · mc-stan:5323 · mc-stan:7420 ·
mc-stan:20461 · mc-stan:4847 · mc-stan:19240 · mc-stan:12866 · mc-stan:14893 · mc-stan:16891 ·
mc-stan:13028 · pymc:1299

---

---

### C6 · BART models an unknown regression function as a sum of m weak, regularized trees — a nonparametric mean with no kernel or basis to choose 🟢
*[→ full entry](../claims/regression/C6.md)*

**Statement.** Bayesian Additive Regression Trees (BART) model an unknown regression function as a sum
of m regularized decision trees under a Bayesian prior that keeps each individual tree a *weak* learner
— a nonparametric alternative to GPs/splines that captures nonlinearities and interactions
automatically, with no kernel or basis to choose.

**Nuance.** BART slots in as the *mean of any likelihood*: `mu = pmb.BART('mu', X, Y, m=50)`, then
`y ~ any_family(mu, …)`. The number of trees **m** is the regularization knob — the Bayesian prior is
what holds each tree shallow/weak, so the fit is carried by the ensemble *sum*, not by any single tree;
raising m adds capacity while the weak-learner prior guards each component against overfitting. Unlike a
GP (choose a kernel) or a spline (choose a basis), BART requires no such structural choice, which is why
it functions as a general-purpose nonparametric mean.

**Conditions.** Nonparametric mean-function estimation where the functional form is unknown and
interactions matter; fills a tree-ensemble slot the catalog's model taxonomy otherwise lacks (no
kernel/basis choice, in contrast to the GP/spline entries on this page).

**Tier.** 🟢 established (source: pymc-labs L1, human-curated)

**Sources.** pymc-labs:bart

---

---

### C7 · Match the observation model to the data's generative structure, not its surface label 🟢
*[→ full entry](../claims/regression/C7.md)*

**Statement.** The likelihood family, link, and joint/dependence construction are substantive structural commitments dictated by how the data are generated — ordered latent thresholds, a count denominator, a censoring bound, a zero-generating gate vs a mixture, heavy-tailed contamination, a support-respecting link, a tractable joint for correlated margins — never the outcome's surface appearance or a default. Choosing by surface label (the word 'ordered', a raw proportion, a spike at zero, 'correlated outcomes', an identity link) misrepresents the process and biases or breaks inference.

**Nuance.** A mid-level principle consolidated (2026-07-02) from the practical recs it governs on this page (PR4, O1, O4, LS1, LS2, HZ1, TB1, O5, RB1); see the recs below for the concrete instances and conditions.

**Conditions.** As per the governed recs.

**Tier.** 🟢 (new claim; generalizes 9 recs; NOT yet in the human-review packet).

**Sources.** mc-stan:30046 · mc-stan:10728 · mc-stan:10656 · betanalpha:ordinal_regression · pymc-labs:specialized-likelihoods · mc-stan:6508 · mc-stan:19843 · mc-stan:17241

## Practical — what works / what doesn't (comprehensive, bidirectional)

*59 recs (17 ✓ / 37 ✗ / 5 bidirectional), 133 move-attachments. `efficacy` is the benchmark-shaped slot
`{divergences, min_ess, ess_per_sec, rmse, coverage}` — filled from any metric present in the input,
else `pending`; E-BFMI / R̂ / tree-depth-saturation land in the `min_ess` (mixing) slot and gradient-eval
counts in `ess_per_sec` (speed proxy). Attached `moves` are the diagnostic "how", matched by relevance.
Single-witness (n_threads=1) moves promoted to their own rec are tiered ⚪.*

### Under-determined & non-identified designs (M > N)

**✗ U1** · for a regression with **more covariates than observations (M > N)** → **flat or wide *[→ entry](../recs/regression/U1.md)*
Gaussian priors** on the slopes do **NOT** work (non-identified likelihood → catastrophically diffuse
posterior).
- why: the likelihood non-identifiability propagates to an astronomically diffuse posterior; the prior must *actively regularize* the scale, not merely permit it.
- conditions: M>N collinear/underdetermined design; flat or wide (σ=10) Gaussian slope priors.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: pending · min_ess: 100% tree-depth saturation, E-BFMI≈0.05–0.16, near-zero ESS/iter, R̂ up to 13 (wide σ=10: 93% saturation) · ess_per_sec: pending · rmse: posterior intervals span thousands when true slopes are order 10 · coverage: pending}
- moves: "Triage the warning hierarchy: read which diagnostic dominates (E-BFMI vs divergences vs treedepth)" · "Reframe the symptom as suspected non-identifiability rather than a tuning/geometry problem" · "Push the prior through the model (prior predictive) and plot the implied prior on the outcome"

**✗ U2** · for **M>N sparse regression** → the **classic horseshoe** (unbounded local scales, *[→ entry](../recs/regression/U2.md)*
τ~HalfCauchy(0,σ)) does **NOT** work (lets relevant slopes diffuse, funnels in τ).
- why: unbounded local scales let the likelihood's non-identifiability propagate through the heavy tails; relevant slopes diffuse, τ's geometry turns bimodal/funnel, E-BFMI collapses.
- conditions: M>N; classic parameterization β~N(0,τ·λ), λ~HalfCauchy(0,1), τ~HalfCauchy(0,σ); τ₀=σ (ignores N and m₀).
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: 138 · min_ess: 25% tree-depth saturation at max_treedepth=15, E-BFMI<0.12 · ess_per_sec: pending · rmse: relevant slopes diffuse (heavy-tailed local scales left unbounded) · coverage: pending}
- moves: "Triage the warning hierarchy (E-BFMI vs divergences vs treedepth)" · "Test the zero-avoiding-prior remedy empirically: sweep the strength/location and tabulate divergences" · "Run a parameter-recovery simulation: generate data from the known process, refit, compare to truth"

**✗ U3** · for **M>N sparse regression** → a **narrow WIP** (e.g. Normal(0,1)) on all slopes does *[→ entry](../recs/regression/U3.md)*
**NOT** work (HMC-clean but severely biased).
- why: the narrow prior fixes sampling but shrinks the relevant large slopes (true ≈ ±10) to <1 and inflates σ ~10× to absorb the unexplained signal.
- conditions: collinear M>N with a mix of large-signal and near-zero slopes; prior scale ≪ true slope magnitude; inference on σ is part of the analysis.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: 0 (all diagnostics pass) · min_ess: clean · ess_per_sec: pending · rmse: relevant slopes shrunk from ±10 to <1 · coverage: σ biased from true=1 to ~10–12}
- moves: "Visualize the prior→posterior movement of specific coefficients under power-scaling" · "Run a parameter-recovery simulation and compare recovered parameters to truth" · "Push the prior through the model (prior predictive) and plot the implied prior on the outcome"

**✓ U4** · for **M>N sparse regression** → a **correctly-specified sparse prior** (regularized/Finnish *[→ entry](../recs/regression/U4.md)*
horseshoe with τ₀ calibrated to (n,p,expected sparsity k)) works.
- why: the slab bounds the relevant slopes while the global scale is calibrated to expected sparsity, so σ concentrates near truth and spurious slopes shrink.
- conditions: p≫n where sparsity is a modeling goal; a downstream decision process; half-Cauchy-tailed local scales.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression, dansblog:cheat
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: σ concentrates near the true value under a correctly-specified sparse prior · coverage: pending}
- moves: "Test the zero-avoiding-prior remedy empirically: sweep the strength/location and tabulate divergences" · "Run a parameter-recovery simulation" · "Reframe the prior onto the latent linear predictor and put the scale on TOTAL model variance"

**✓/✗ U5** · for the **σ posterior in sparse regression** → reading σ as a **diagnostic sentinel** for *[→ entry](../recs/regression/U5.md)*
prior misspecification works.
- why: over-shrunk slopes dump unexplained signal into σ, so a wildly biased σ (true=1, inferred ~10–11) flags an over-regularizing prior, and a diffuse σ flags non-identification.
- conditions: linear regression with inferred σ; collinear M>N; σ has its own weakly-informative prior.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: narrow-prior σ posterior peaks ~10 vs true=1 · coverage: pending}
- moves: "Triage the warning hierarchy" · "Run a parameter-recovery simulation and compare recovered σ to truth"

**✗ U6** · for **underdetermined linear regression (N<M+1)** → trusting **zero divergences** as a *[→ entry](../recs/regression/U6.md)*
clean-sampling signal does **NOT** work (actively misleading).
- why: the saturated underdetermined likelihood lets the residual shrink toward zero, so the σ-funnel opens toward σ→0 rather than being pinned above it; the sampler saturates tree depth failing to descend the neck instead of diverging in it, so divergences stay at zero while the σ-funnel geometry still wrecks E-BFMI.
- conditions: N=100, M=200; β~N(0,10), α~N(0,2), σ~N⁺(0,2); default max_treedepth=10.
- tier: 🟢 · source: betanalpha:underdetermined_linear_regression
- efficacy: {divergences: 0 (misleading) · min_ess: E-FMI 0.028, 74.5% tree-depth saturation, R̂ 2.38 on lp__ · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Enforce diagnostic ordering before comparing values, then localize the divergences in parameter space" · "Anchor all geometry inspection in the UNCONSTRAINED space where sampling actually happens" · "Triage the warning hierarchy (E-BFMI vs divergences vs treedepth)"

**✗ U7** · for the **underdetermined-regression funnel** → **NCP** (non-centered reparameterization) *[→ entry](../recs/regression/U7.md)*
does **NOT** work.
- why: the funnel lives in the Gaussian likelihood y~N(Xβ,σ), not in a prior scale — no algebraic transform decouples σ from β (unlike τ in a hierarchy).
- conditions: standard Gaussian observational model; funnel from a rank-deficient design acting through the likelihood.
- tier: 🟢 · source: betanalpha:underdetermined_linear_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify whether the distribution to be reparameterized is a likelihood (data) or a hierarchical prior (parameter)" · "Reframe the funnel as a sampler-geometry problem (NCP ≡ Riemannian/second-order HMC) — and recognize it has no likelihood-funnel analogue" · "Re-attribute the divergences to a different geometry pathology and scope it to its own investigation"

**✗/✓ U8** · for the **underdetermined-regression funnel** → raising **max_treedepth (10→15)** partially *[→ entry](../recs/regression/U8.md)*
works: it resolves *mixing* but does **NOT** resolve the E-BFMI failure.
- why: tree-depth saturation = trajectories too short to traverse the slow parallel-to-hyperplane dimension (fixed by depth); low E-BFMI = difficulty switching σ levels (a different, unresolved mechanism).
- conditions: N=100, M=200; depth raised to 15; 4 chains × 4000 post-warmup.
- tier: 🟢 · source: betanalpha:underdetermined_linear_regression
- efficacy: {divergences: pending · min_ess: R̂ clean, ESS reasonable, 0% tree-depth saturation after depth→15 · ess_per_sec: pending · rmse: pending · coverage: E-FMI persists at 0.046–0.076 (all four chains, still <0.2)}
- moves: "Manually decrease the stepsize below what adaptation chose, post-warmup" · "Anchor all geometry inspection in the UNCONSTRAINED space" · "Triage the warning hierarchy (which diagnostic dominates)"

**✓ U9** · for the **underdetermined-regression E-BFMI failure** → a **more informative σ prior** from *[→ entry](../recs/regression/U9.md)*
domain knowledge is the only (partial) remedy.
- why: as of Dec 2018 no reparameterization/sampler/tuning fully resolves it; a tighter σ prior truncates the funnel from below but has limited headroom once the data already constrain σ.
- conditions: N<M+1 Gaussian model; open-research assessment (Dec 2018), possibly outdated by later geometry-aware samplers.
- tier: 🟡 · source: betanalpha:underdetermined_linear_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the symptom as suspected non-identifiability rather than a tuning/geometry problem" · "Triage the warning hierarchy"

**✗ U10** · for **exact collinearity** (N<M+1, or perfectly correlated components sharing a baseline) → *[→ entry](../recs/regression/U10.md)*
leaving σ with an **un-truncated prior** does **NOT** work (σ-funnel).
- why: the degenerate ridge's width narrows as σ→0, creating a funnel; the likelihood collapses onto a non-compact manifold of equally-fitting plane configurations.
- conditions: fewer than M+1 obs for an M-covariate first-order Taylor model, or perfectly correlated components; σ prior does not truncate from below.
- tier: 🟢 · source: betanalpha:taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Confirm the pathology is a funnel and locate where the divergences concentrate" · "Reframe the symptom as suspected non-identifiability"

### Decorrelation / conditioning (identified-but-ill-conditioned geometry)

**✗ Q1** · for **near-collinear covariates** (e.g. x and x² for uncentered positive x) → **naive HMC on *[→ entry](../recs/regression/Q1.md)*
the raw design** does **NOT** work efficiently (elongated ridge, huge trajectories).
- why: the *identified* posterior collapses onto a near-1D elongated ridge; HMC must take tiny steps and very long trajectories to resolve its full length.
- conditions: uncentered covariates before polynomial/nonlinear expansion; weak prior relative to likelihood (ridge is likelihood-induced); posterior is identified — the problem is purely computational.
- tier: 🟢 · source: betanalpha:qr_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: over 1,000,000 gradient evaluations (naive: 1,318,016) · rmse: pending · coverage: pending}
- moves: "Recommend QR decomposition of the predictor matrix: regress on Q, recover raw coefficients via R⁻¹" · "Inspect bivariate (pairs/ShinyStan) plots, intercept-vs-slope, for ridges/funnels" · "Probe local log-convexity by computing the condition number of the inverse Hessian at posterior draws"

**✓ Q2** · for a **near-collinear (identified) linear predictor** → **centering the design THEN *[→ entry](../recs/regression/Q2.md)*
QR-decorrelating** works (~10× fewer gradient evals).
- why: centering removes the mean-induced correlation the QR-rotated columns still carry; the combined transform yields a nearly isotropic posterior — centering, not QR alone, is the operative mechanism.
- conditions: likelihood dominates prior (weak/diffuse β priors, large N); collinearity induced by non-zero covariate means.
- tier: 🟢 · source: betanalpha:qr_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: gradient evals naive 1,318,016 → uncentered QR 723,018 (~1.8×) → centered QR 136,096 (~9.7× vs naive, ~5.3× vs uncentered) · rmse: pending · coverage: pending}
- moves: "Recommend QR decomposition of the predictor matrix; recover raw coefficients via R⁻¹" · "Inspect bivariate pairs plots, intercept-vs-slope, for ridges/funnels"

**✓ Q3** · for **decorrelating any GLM** → QR is valid for **any linear-predictor model** (any *[→ entry](../recs/regression/Q3.md)*
link/likelihood) and preserves the inference target.
- why: X^Tβ=Q·β̃ factors only the design-matrix block; |det R| depends only on the data (constant in β), so it cancels from posterior ratios and β=R⁻¹β̃ exactly recovers the original posterior.
- conditions: model has a linear predictor X^Tβ+α; the correlation lives in that block, not a hierarchical prior/latent layer; priors placed on β via the back-transform.
- tier: 🟢 · source: betanalpha:qr_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Recommend QR decomposition of the predictor matrix; recover raw coefficients via R⁻¹" · "Generate the brms Stan data + Stan code (make_standata/make_stancode) and read the model block"

**✗ Q4** · for posterior correlation that is **prior-induced** (tight, correlated prior on β) → **QR *[→ entry](../recs/regression/Q4.md)*
decorrelation** does **NOT** work.
- why: QR acts on likelihood geometry; a correlated prior maps through R into correlated β̃-space, so the prior's correlation survives the rotation and overwhelms the decorrelated likelihood.
- conditions: informative, correlated prior on β; N small relative to prior strength (prior dominates likelihood).
- tier: 🟡 · source: betanalpha:qr_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify whether the distribution to be reparameterized is a likelihood (data) or a hierarchical prior (parameter)" · "Inspect bivariate pairs plots for ridges/funnels"

### Priors, scale, and link

**✗ PR1** · for **any regression** → **flat/improper** or **diffuse-but-proper** priors (N(0,1000), *[→ entry](../recs/regression/PR1.md)*
U(−1000,1000)) do **NOT** work as "non-informative" (they push mass to extremes).
- why: flat priors are incompatible with being proper (mass concentrates at infinity via the stereographic projection); diffuse-proper priors replicate this, biasing toward extreme values.
- conditions: pathology scales with prior-scale/likelihood-width ratio; worse in high dimensions; a flat prior approximates a proper one locally only when the likelihood is guaranteed narrow (verify per dataset).
- tier: 🟢 · source: betanalpha:prior_modeling, betanalpha:weakly_informative_shapes
- efficacy: {divergences: pending · min_ess: n_eff(σ) collapses to 821/10000 (N=5, Normal(0,1000)) · ess_per_sec: pending · rmse: (α,β) pushed to ±$15k · coverage: pending}
- moves: "Push the prior through the model (prior predictive) and plot the implied prior on the outcome" · "Run prior predictive checks via sample_prior='only' + pp_check()/fitted()" · "Check that every estimated parameter actually receives a proper prior"

**✗ PR2** · for a regression fit through a **link/transform** (logit, log, log-σ, centered intercept) → *[→ entry](../recs/regression/PR2.md)*
specifying priors on the **natural scale** does **NOT** work (priors are read on the internal scale).
- why: any prior you set is interpreted on the internal (link) scale — a [0,1]-bounded prior under a logit link is incoherent, and a default t(3,0,2.5) can blow up under pushforward.
- conditions: any non-identity link/transform; most acute for default priors and bounded-support priors on unbounded link-scale parameters.
- tier: 🟡 · source: mc-stan:34027, mc-stan:27338, mc-stan:10344
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "State the mechanism: priors go on the (unconstrained, pre-transformation) linear-predictor parameters" · "Reframe: under a non-identity link the coefficient (and its prior) is not interpretable in isolation" · "Run prior predictive checks via sample_prior='only' + pp_check()"

**✓ PR3** · for a **log-link count model** → **eliciting slope priors in log space** from domain *[→ entry](../recs/regression/PR3.md)*
knowledge about proportional changes works.
- why: a unit change in the linear predictor *multiplies* the outcome by exp(β); default Normal(0,1)/Normal(0,100) implies wildly implausible multiplicative effects.
- conditions: log-link models (Poisson, NegBin, log-normal); covariates with meaningful units where experts can bound proportional change.
- tier: 🟢 · source: betanalpha:general_taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Push the prior through the model (prior predictive) and plot the implied prior on the outcome" · "State the mechanism: priors go on the linear-predictor parameters; the link constrains a·x+b" · "Reframe the prior onto the latent linear predictor and put the scale on TOTAL model variance"

**✗ PR4** · for a **positive-support GLM** (Gamma, Weibull, inverse-Gaussian) → an **identity link** *[→ entry](../recs/regression/PR4.md)*
does **NOT** work (initialization rejected).
- why: the identity link lets the (mean-centered) linear predictor go negative at init → negative mean/scale → likelihood undefined → "parameter must be > 0" rejection ("Initialization between (−2,2) failed").
- conditions: likelihood whose location/scale must be strictly positive, with an unconstrained linear predictor; symptom is init/log-prob-at-init rejection, not a mid-sampling divergence.
- tier: 🟡 · source: mc-stan:30046, mc-stan:10728, mc-stan:10656
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the generated Stan code and the family/link, then triage by swapping to a simpler likelihood" · "Generate the brms Stan data + Stan code (make_standata/make_stancode) and read the model block"

**✓ PR5** · for a **high-dimensional scale-mixture (local-global) prior** → calibrating the **global *[→ entry](../recs/regression/PR5.md)*
scale τ jointly to (n, p, expected sparsity k)** works; a fixed τ does **NOT**.
- why: a fixed τ is effectively non-informative about sparsity regardless of dimension; the design-dependence enters through the downstream decision process, not the marginal prior alone.
- conditions: p≫n, sparsity a modeling goal; a downstream decision process (threshold/selection/projection); heavy-enough local tails (half-Cauchy).
- tier: 🟢 · source: dansblog:cheat
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Test the zero-avoiding-prior remedy empirically: sweep the strength/location and tabulate" · "Reframe the prior onto the latent linear predictor and put the scale on TOTAL model variance"

### Local approximation & extrapolation

**✗ T1** · for using a **linear regression as a global model** → treating it as universally valid does *[→ entry](../recs/regression/T1.md)*
**NOT** work (it is only a local first-order Taylor approximation).
- why: adequacy depends on the covariate distribution (train AND predict) staying inside the local neighborhood U; clean NUTS diagnostics coexist with order-of-magnitude parameter-recovery failure.
- conditions: covariate range wider than U; true function has non-negligible higher-order derivatives.
- tier: 🟢 · source: betanalpha:taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe via the folk theorem: treat the slowdown as a geometry/identifiability symptom and build up complexity one layer at a time" · "Push the prior through the model and audit the data for covariate combinations that legitimately extrapolate"

**✓ T2** · for a **Taylor regression** → parameterize on **covariate perturbations Δx=x−x₀** (not raw *[→ entry](../recs/regression/T2.md)*
x) so each coefficient has an unambiguous differential meaning.
- why: only under perturbations do α=f(x₀), β₁=f′(x₀), β₂=½f″(x₀); raw x mixes function and derivative evaluations at all orders, breaking extremity-threshold prior elicitation.
- conditions: Taylor regression of any order; does not apply to global basis expansions or kernel methods.
- tier: 🟢 · source: betanalpha:taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize in terms of data-anchored quantities and put an informative prior on the inflection location" · "State the mechanism: priors go on the linear-predictor parameters"

**✗ T3** · for a **multi-term Taylor model** → using the **same extremity threshold δ_f per *[→ entry](../recs/regression/T3.md)*
coefficient** and assuming the aggregate stays bounded does **NOT** work.
- why: the functional output is a sum of terms scaled by (x−x₀)ⁱ, so individually-bounded contributions can sum well past any single bound — a prior pushforward check is mandatory.
- conditions: multiple Taylor terms, especially ≥2nd order with shared thresholds across orders.
- tier: 🟢 · source: betanalpha:taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Push the prior through the model (prior predictive) and plot the implied prior on the outcome" · "Run prior predictive checks via sample_prior='only' + pp_check()"

**✓ T4** · for **locating an extremum** of an unknown function → a **second-order Taylor regression *[→ entry](../recs/regression/T4.md)*
(Bayesian Newton's method)** works, giving a posterior over x*=−½J₂⁻¹J₁+x₀.
- why: fitting the 2nd-order model yields a posterior over Hessian J₂ and gradient J₁, propagating localization uncertainty to x*.
- conditions: locally-quadratic function; J₂ invertible (non-degenerate extremum); iterative sampling control; treat x* with suspicion if it extrapolates outside the validated U.
- tier: 🟢 · source: betanalpha:taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize in terms of data-anchored quantities and put an informative prior on the inflection location" · "Reframe via the folk theorem: build up complexity one layer at a time"

**✗ T5** · for **extrapolation to non-overlapping covariate regions** → relying on **any internal *[→ entry](../recs/regression/T5.md)*
check** (NUTS diagnostics, marginal/conditional retrodictive checks) to detect the failure does **NOT**
work.
- why: retrodictive checks evaluate against training covariates where the approximation holds by construction and emit no signal outside training support; higher-order Taylor models do not fix it.
- conditions: prediction targets outside training covariate support; true function nonlinear across the gap; specific to Taylor/local-basis models.
- tier: 🟢 · source: betanalpha:taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Push the prior through the model and audit the data for covariate combinations that legitimately extrapolate" · "Separate the plotting/marginalization artifact from the actual fit before diagnosing further"

**✗ T6** · for a **Bayesian regression predicting outside the observed range** → reading the *[→ entry](../recs/regression/T6.md)*
posterior-predictive **"bow-tie" fan** as calibrated uncertainty does **NOT** work (it under-estimates
true predictive uncertainty).
- why: the fan reflects only slope/intercept (parameter) uncertainty; it cannot account for model-form misspecification outside the data (manually scaling σ with distance is unnecessary for the parameter part).
- conditions: extrapolation beyond the observed predictor range, or sparse interpolation between clusters; the functional form is an assumption, not a physical law.
- tier: 🟡 · source: pymc:5824
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Push the prior through the model and audit for extrapolating covariate combinations" · "Separate the plotting/marginalization artifact from the actual fit before diagnosing further"

**✓ T7** · for predicting a **new (unobserved) factor configuration** in an overlapping multifactor *[→ entry](../recs/regression/T7.md)*
model → **additively reconstructing** from separately-estimated main effects + observed lower-order
interactions works.
- why: the additive residual decomposition lets you sum A9, B5, C3, A9+B5, … estimated from other configurations, with uncertainty propagated; unobserved higher-order interactions stay prior-wide.
- conditions: all individual levels observed in some lower-order configuration; additive approximation reasonable; factor-level assignments stable and the same mechanism applies externally.
- tier: 🟢 · source: betanalpha:factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the estimand: prediction conditional on the sampled groups' random effects vs integrating them out" · "Choose the posterior-summary primitive by which uncertainty must propagate"

### Confounding & variate–covariate modeling

**✗ CF1** · for a **causal/interventional target** → treating regression as a general-purpose model *[→ entry](../recs/regression/CF1.md)*
does **NOT** work (it is a narrow special case of variate–covariate modeling).
- why: regression assumes a location-based conditional model, no confounder (no ψ in both π(y|x) and π(x)), and homogeneous configuration — most applications violate at least one.
- conditions: causal/counterfactual claims; concern weakens in pure-predictive settings where x varies similarly in future.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling, betanalpha:generative_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Answer the interpretation question, then pivot to whether the estimate is trustworthy given the design" · "separate likelihood from posterior and write out both log-posteriors term by term"

**✓ CF2** · for a variate–covariate model with **no confounding parameter** → **dropping the marginal *[→ entry](../recs/regression/CF2.md)*
covariate model** works (the decoupling theorem: η factorizes from γ).
- why: with ψ absent, π(η,γ|y,x)=π(η|y,x)·π(γ|x); learning η needs no covariate model, and predictions are correct however arbitrarily x is distributed.
- conditions: no parameter appears in both the conditional-variate and marginal-covariate models; homogeneous η across observations.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "separate likelihood from posterior and write out both log-posteriors term by term" · "Answer the interpretation question, then pivot to whether the estimate is trustworthy given the design"

**✗ CF3** · for a **confounded design** (ψ in both models) → a **conditional-only model** does **NOT** *[→ entry](../recs/regression/CF3.md)*
work (it can invert the sign of the causal estimate).
- why: the confounded parameter absorbs between-context covariate heterogeneity into the treatment effect; zero divergences and passing retrodictive checks give false reassurance.
- conditions: confounding creates between-context susceptibility/baseline heterogeneity large enough to overwhelm the true effect.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: {divergences: 0 reported (misleading) · min_ess: pending · ess_per_sec: pending · rmse: conditional-only ζ concentrates at +0.2 to +0.4 (apparent harm) vs true −0.35 (protective) · coverage: pending}
- moves: "Answer the interpretation question, then pivot to whether the estimate is trustworthy given the design" · "Run a parameter-recovery simulation: generate data from the known process, refit, compare to truth"

**✗ CF4** · for **detecting** confounding / marginal-covariate-model failure → a **conditional *[→ entry](../recs/regression/CF4.md)*
retrodictive check** (fix covariates, simulate only variates) does **NOT** work (structurally blind).
- why: it probes only the observed covariate context and passes whenever the conditional model fits those covariate values, regardless of a missing/misspecified marginal model or a confounder.
- conditions: confounding via parameter reassignment (no visible distributional misfit); between-context heterogeneity overwhelms the true effect.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a parameter-recovery simulation and compare recovered parameters to truth" · "Answer the interpretation question, then pivot to trustworthiness given the design"

**✗ CF5** · for a **randomized/designed experiment with dropout/censoring** correlated with the outcome *[→ entry](../recs/regression/CF5.md)*
process → assuming the design still suppresses confounding does **NOT** work.
- why: censoring makes the observed covariate distribution a biased subset of the designed one; if censoring depends on the variate mechanism, confounders re-enter even from a confounder-free design.
- conditions: the censoring/dropout mechanism is correlated with the conditional variate process.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Answer the interpretation question, then pivot to trustworthiness given the design" · "Run a parameter-recovery simulation"

**✗ CF6** · for **controlled-vs-uncontrolled** experiments → treating a **stochastic covariate as a *[→ entry](../recs/regression/CF6.md)*
fixed design covariate** does **NOT** work for intervention conclusions.
- why: the two models can be mathematically equivalent as conditional models for y|x, but only the controlled model supports causal intervention; the uncontrolled one requires modeling π(x|θ) explicitly.
- conditions: causal/counterfactual claims; smaller practical difference in pure-predictive settings.
- tier: 🟢 · source: betanalpha:generative_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Answer the interpretation question, then pivot to whether the estimate is trustworthy given the design" · "Reframe the estimand"

**⚪ CF7** · for **compensating** conditional-only models under confounding → **propensity scores / *[→ entry](../recs/regression/CF7.md)*
do-calculus** work only as approximations, not as replacements for the marginal covariate model.
- why: propensity reweighting removes bias "in expectation" under a (often linear/normal) model; do-calculus is closed-form only for linear-normal / partially-nonlinear cases — otherwise fit the marginal model directly.
- conditions: modeling environment flexible enough (e.g. Stan) to build the marginal covariate model.
- tier: ⚪ candidate · source: betanalpha:variate_covariate_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Answer the interpretation question, then pivot to whether the estimate is trustworthy given the design"

**✗ CF8** · for **confounded extrapolation** → **posterior retrodictive checks of the training data** *[→ entry](../recs/regression/CF8.md)*
do **NOT** work to reveal the misspecification.
- why: the conditional model is optimized to fit the observed covariates, so even the standard posterior predictive check passes; the failure shows only against held-out incomplete observations.
- conditions: confounding shifts the covariate distribution between complete/incomplete contexts; checks computed only for the observed (complete) data.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a parameter-recovery simulation and compare recovered parameters to truth" · "Answer the interpretation question, then pivot to trustworthiness"

### Diagnostics — retrodictive artifacts & residual shape

**✗ DG1** · for **nonlinearly-correlated component covariates** → reading **curvature in a conditional *[→ entry](../recs/regression/DG1.md)*
retrodictive quantile plot** (vs one covariate) as model misfit does **NOT** work (projection
artifact).
- why: the marginal conditional mean E[y|Δx₁] absorbs β₂·E[Δx₂|Δx₁], nonlinear in Δx₁ whenever the covariates are nonlinearly correlated — even with a perfectly linear, calibrated model.
- conditions: M≥2 covariates; two nonlinearly-correlated; the check projects one covariate at a time with a bin-median summary.
- tier: 🟢 · source: betanalpha:taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Separate the plotting/marginalization artifact from the actual fit before diagnosing further" · "Push the prior through the model and audit the data for covariate combinations"

**✓ DG2** · for **per-unit posterior-predictive residuals across a covariate** → reading the residual *[→ entry](../recs/regression/DG2.md)*
band's **shape** works to fingerprint the missing structure (flat offset → missing unit-level RE;
arch/dome → missing functional dependence).
- why: coherent displacement/shape across the covariate range (not point-by-point zero-containment) identifies the missing term.
- conditions: repeating-unit structure; residuals plotted per unit vs covariate; evaluate coherence across the full range.
- tier: 🟢 · source: betanalpha:falling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe via the folk theorem: isolate by building up complexity one layer at a time" · "Separate the plotting/marginalization artifact from the actual fit before diagnosing further"

### Ordinal & likelihood-structure matching

**✓ O1** · for **ordinal regression** → construct it as a **censored latent-variable model** (ordered *[→ entry](../recs/regression/O1.md)*
cut points partition a latent space; p_k=Π(c_k)−Π(c_{k-1})) works.
- why: this forces neighboring categories to be more correlated than distant ones; the latent distribution (logistic vs Gaussian) is a computational convenience, compensated by cut-point shifts.
- conditions: K≥2 categories; strictly ordered cut points c₁<…<c_{K-1}; unimodal symmetric latent.
- tier: 🟢 · source: betanalpha:ordinal_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Replace independent normal priors on raw cutpoints with an induced-Dirichlet prior on the implied category probabilities" · "Take the divergences seriously and refit; re-examine HMC diagnostics per-threshold"

**✓/✗ O2** · for a **proper prior predictive in ordinal regression** → an **induced Dirichlet prior on *[→ entry](../recs/regression/O2.md)*
the cut points** works; **flat cut-point priors** (or Gaussian-on-γ without a cut-point prior) do
**NOT**.
- why: only the induced Dirichlet (on the simplex of category probabilities) makes the prior proper and lets you simulate complete ordinal configurations; flat cut-point priors are improper.
- conditions: prior predictive requires a proper prior on all parameters; the induced RNG needs the same anchor φ as the density; demonstrated at N=50, K=5.
- tier: 🟢 · source: betanalpha:ordinal_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Replace independent normal priors on raw cutpoints with an induced-Dirichlet prior on the implied category probabilities" · "Check that every estimated parameter actually receives a proper prior"

**✗ O3** · for **ordinal regression showing tree-depth saturation without divergences** → raising *[→ entry](../recs/regression/O3.md)*
**max_treedepth** does **NOT** work (it signals non-identifiability or parameter wandering).
- why: two failure modes — full-ridge non-identifiability from a missing anchor, and single-parameter wandering from a sparse category — both saturate tree depth while E-FMI stays normal (no funnel).
- conditions: ordinal logistic/probit; tree-depth saturation without divergences; E-FMI normal (rules out funnel/curvature).
- tier: 🟢 · source: betanalpha:ordinal_regression
- efficacy: {divergences: 0 · min_ess: ridge: R̂~2.3 for ALL params incl lp__, n_eff~0.00073, ~97% saturation; wandering: R̂~1.95 for the affected c[k] only, n_eff~0.00075, ~87% saturation (other params pass) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Check that every estimated parameter actually receives a proper prior (category intercepts; all elements of length-M vectors)" · "Enforce diagnostic ordering before comparing values, then localize the divergences" · "Reframe the symptom as suspected non-identifiability rather than a tuning/geometry problem"

**✓ O4** · for **"ordered" data generally** → **match the likelihood to the data STRUCTURE**, not the *[→ entry](../recs/regression/O4.md)*
word "ordered".
- why: an ordinal OUTCOME → cumulative/ordinal model; an ordinal PREDICTOR (K≥3) → a monotonic mo() term with a Dirichlet prior on step sizes; rankings → Thurstonian/pairwise; allocations → Dirichlet/compositional.
- conditions: categorical/ranked/allocation responses; cumulative()/ordered_logistic specifies the ordinal LIKELIHOOD and does nothing for an ordinal predictor on the RHS.
- tier: 🟡 · source: mc-stan:6508, mc-stan:19843, mc-stan:17241
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Replace independent normal priors on raw cutpoints with an induced-Dirichlet prior" · "Reframe the estimand"

**✓ LS1** · for an **outcome that is a proportion k/n** → model the **underlying counts** with a *[→ entry](../recs/regression/LS1.md)*
binomial / beta-binomial (logit link, nonlinear mean on p) rather than the proportion as continuous.
- why: aggregating to a proportion discards the denominator n that carries each observation's precision (1/2 and 50/100 both become 0.5, yet are very different evidence).
- conditions: n recoverable; use beta-binomial under overdispersion; beta/ZI-beta fallback only if n is genuinely unknown.
- tier: 🟡 · source: mc-stan:24915, mc-stan:12228
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Trial boundary-capable likelihoods and judge each against the data's generating mechanism (one process vs separate inflation)" · "Audit the generated Stan code and the family/link, then triage by swapping to a simpler likelihood"

**✗ LS2** · for **two outcomes with unequal counts / non-Gaussian families** → a **residual *[→ entry](../recs/regression/LS2.md)*
correlation** (brms `set_rescor(TRUE)`) does **NOT** work.
- why: rescor needs a one-to-one pairing of residuals AND a tractable joint/CDF (Gaussian/Student); unequal-length or non-Gaussian outcomes have no quantity to estimate.
- conditions: multivariate/multi-outcome models; well-defined only for equal-length, paired, all-Gaussian/Student outcomes.
- tier: 🟡 · source: mc-stan:16401, mc-stan:28180
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the generated Stan code and the family/link, then triage by swapping to a simpler likelihood" · "Re-derive the augmented joint likelihood and check whether every margin's contribution is included"

### Derived summaries, estimands & predictions

**✗ SM1** · for **uncertainty in a predicted outcome** → using **`posterior_epred`/`posterior_linpred`** *[→ entry](../recs/regression/SM1.md)*
as if it were the predictive distribution does **NOT** work (too narrow).
- why: epred/linpred are the per-draw conditional MEAN (parameter uncertainty only); they omit the likelihood's residual noise, so an RMSE built from them is far too narrow.
- conditions: any GLM/hierarchical fit with residual noise; gap vanishes only in the noiseless case; mind scale= for non-identity links; AR/time-series may need the full series.
- tier: 🟡 · source: mc-stan:28502, mc-stan:13293, mc-stan:12240
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict" · "Reframe the estimand: prediction conditional on sampled REs vs integrating them out"

**✗ SM2** · for **reproducing structural features** (e.g. the zero spike) of a **hurdle/zero-inflated** *[→ entry](../recs/regression/SM2.md)*
model → **`fitted()`-type output** (conditional mean) does **NOT** work; use **`predict()`-type**
(posterior predictive).
- why: fitted gives E[y|x] with the zero-inflation already averaged in (smooth, no spike); only the posterior predictive reproduces the discrete/structural features.
- conditions: hurdle/ZI/mixture models; the expectation-vs-predictive point is framework-general; the hu/zi reversed-sign convention is brms-specific.
- tier: 🟡 · source: mc-stan:16736, mc-stan:6128, mc-stan:23910
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Trial boundary-capable likelihoods and judge each against the data's generating mechanism"

**✗ SM3** · for the **predicted value of a targeted quantile** in ALD quantile regression → default *[→ entry](../recs/regression/SM3.md)*
**`posterior_epred`/`fitted`** does **NOT** work (returns the ALD mean, offset from the quantile).
- why: the ALD's location μ IS the requested quantile, but its mean is offset by the asymmetry whenever quantile≠0.5; default helpers return the mean.
- conditions: quantile regression via the asymmetric-Laplace working likelihood, any non-median quantile; the gap vanishes at 0.5 (symmetric Laplace).
- tier: 🟡 · source: mc-stan:8706, mc-stan:29686, mc-stan:11649
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Apply the order-of-operations rule for nonlinear summaries of posterior draws"

**✓ SM4** · for **marginal effects/predictions** from multilevel (random-slope / correlated-RE) models → *[→ entry](../recs/regression/SM4.md)*
derive the quantity **per posterior draw and average over the empirical covariate/RE distribution BEFORE
summarizing** works.
- why: order of operations is load-bearing — AME (average per-unit predictions) ≠ MEM (average covariates first); nonlinear links make the two diverge.
- conditions: random slopes/correlated REs; nonlinear/non-identity link; summaries formed from posterior draws of derived quantities.
- tier: 🟡 · source: mc-stan:24172, mc-stan:3914, mc-stan:11531
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Apply the order-of-operations rule for nonlinear summaries of posterior draws" · "Reframe the estimand: prediction conditional on sampled REs vs integrating them out" · "Choose the posterior-summary primitive by which uncertainty must propagate"

**✗ SM5** · for the **effect of a categorical predictor** → reading it off the **reference/baseline *[→ entry](../recs/regression/SM5.md)*
level** does **NOT** work; marginalize over the factor's levels for a population-average effect.
- why: default treatment coding makes the intercept and "conditioned" predictions correspond to the reference category; refitting a reduced model also changes hierarchical shrinkage.
- conditions: categorical/factor predictor; most relevant under treatment coding; the shrinkage caveat applies when the factor is modeled hierarchically.
- tier: 🟡 · source: mc-stan:5323, mc-stan:19673
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Apply the order-of-operations rule for nonlinear summaries of posterior draws" · "Audit the random-effects structure: check whether every term varies within the grouping factor"

**✗ SM6** · for **summarizing fit with a single "Bayesian R²"** → assuming one definition does **NOT** *[→ entry](../recs/regression/SM6.md)*
work.
- why: residual-based (brms/rstantools: Var(pred)/(Var(pred)+Var(pred−y))) and model-based (rstanarm: Var(pred)/(Var(pred)+σ²)) disagree in magnitude AND can reverse the conditional>marginal ordering for mixed models.
- conditions: hierarchical/mixed models; the ordering reversal is specific to the RE variance term; the two coincide for ordinary linear regression.
- tier: 🟡 · source: mc-stan:20461
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Reframe the estimand: conditional vs marginal"

**✗ SM7** · for **comparing Bayesian R² across likelihoods** → treating it as comparable does **NOT** *[→ entry](../recs/regression/SM7.md)*
work (observation-model-dependent).
- why: Bayesian/Gelman R² on the response scale is systematically lower for non-Gaussian GLMs; the same data as binomial vs row-expanded Bernoulli give the same coefficients but different R².
- conditions: non-identity link (logit/probit/cumulative); the latent-scale (McKelvey-Zavoina) fix assumes a latent-variable construction; Gaussian models unaffected.
- tier: 🟡 · source: mc-stan:7420, mc-stan:14752, mc-stan:33187
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Reframe: under a non-identity link the coefficient (and its prior) is not interpretable in isolation"

**✗ SM8** · for **assessing whether a coefficient is non-negligible** → a **point-null Bayes factor** *[→ entry](../recs/regression/SM8.md)*
does **NOT** work (strongly prior-dependent); prefer a **directional posterior probability P(β>0)** or a
**ROPE** statement.
- why: under any continuous prior P(β=0)=0, and the point-null BF is sensitive to vague priors and factor coding; directional/ROPE probabilities are robust under default priors.
- conditions: assessing a regression/mixed-model coefficient or contrast; ROPE needs a domain-chosen threshold δ; use orthonormal contrasts for categorical main effects.
- tier: 🟡 · source: mc-stan:4847, mc-stan:22364, mc-stan:12057
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the estimand" · "Apply the order-of-operations rule for nonlinear summaries of posterior draws"

**✓/✗ SM9** · for **comparing a broad-prior Bayesian logistic fit to classical MLE** → expecting a *[→ entry](../recs/regression/SM9.md)*
genuine model difference does **NOT** work; sanity-check that coefficients coincide and attribute metric
gaps to the **decision rule / scoring**.
- why: with broad priors the posterior mode ≈ MLE, so the fits agree on coefficients; accuracy/sensitivity gaps come from how predicted labels are generated/aggregated, not the model.
- conditions: broad/weakly-informative priors so posterior≈likelihood; does NOT apply when an informative/regularizing prior deliberately shrinks (e.g. under separation).
- tier: 🟡 · source: mc-stan:19240
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Run a parameter-recovery simulation and compare point estimates against the MLE"

**✗/✓ SM10** · for **MRP** → poststratifying over a covariate whose **population joint distribution is *[→ entry](../recs/regression/SM10.md)*
unknown** does **NOT** work; **include it in the multilevel model** (it shrinks the varying intercepts)
but do not poststratify over it; use **MrsP/raking** when only marginals exist.
- why: poststratification reweights model predictions by population cell sizes, so every frame variable needs a known N_j; a sample-only predictor still helps inference via shrinkage.
- conditions: MRP survey/nonresponse adjustment or prevalence estimation; raking fallback when the population joint is unknown but marginals exist.
- tier: 🟡 · source: mc-stan:13028, mc-stan:37666
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the estimand: population target vs sample-conditional" · "Audit the random-effects / design structure"

### Variable / feature selection

**✗ VS1** · for **selecting a smaller predictor set** → refitting each candidate submodel and removing *[→ entry](../recs/regression/VS1.md)*
terms that improve LOO/CV does **NOT** work (overfits the CV estimate).
- why: removing terms to improve LOO is itself a model search; the apparent improvement is largely noise and can severely degrade out-of-sample performance.
- conditions: GLM(M) selection, predictors large relative to n; assumes a sensible full reference model can be fit.
- tier: 🟡 · source: mc-stan:12866, mc-stan:18721, mc-stan:28952
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read the headline LOO diagnostics first: compare p_loo against N and the nominal parameter count" · "Treat the warning as a diagnostic signal: switch from WAIC to LOO for the pareto-k"

**✓ VS2** · for **selecting a smaller predictor set** → fit one good **reference model with a sparsifying *[→ entry](../recs/regression/VS2.md)*
prior and use projection-predictive selection (projpred)** works.
- why: every submodel is a projection of the reference predictive distribution, so it does not overfit CV the way independent refits do.
- conditions: a sensible full reference model; minimal-vs-complete caveat under correlated predictors; Gaussian-surrogate workaround for non-exponential-family reference models on older projpred.
- tier: 🟡 · source: mc-stan:12866, mc-stan:18721, mc-stan:28952
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read the headline LOO diagnostics first" · "Reframe the estimand"

**✗ VS3** · for **reading projpred's forward-search path as an interpretable formula** → does **NOT** *[→ entry](../recs/regression/VS3.md)*
work (it can select an interaction before its main effects).
- why: the search ranks terms by predictive KL-projection, not statistical marginality; the path is not a formula — constrain it (formula-aware / search_terms) for marginality-respecting submodels.
- conditions: candidate set contains interactions/smooths/group effects; most acute in plain-GLM reference models.
- tier: 🟡 · source: mc-stan:14893, mc-stan:40885, mc-stan:18954
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the estimand" · "Read the headline LOO diagnostics first"

### GP & spatial

**✓ GP1** · for a **latent-Gaussian (GP) regression with divergences at small σ** → analytically *[→ entry](../recs/regression/GP1.md)*
**marginalizing the latent field** (integrate out η and the intercept) works better than tweaking the σ
prior.
- why: the pathology is the joint geometry of the non-centered latent field η with σ (a neck/funnel); a zero-avoiding σ prior does not remove it, but integrating out η collapses the model to y~multi_normal_cholesky(0, K+σ²I) over the hyperparameters.
- conditions: Gaussian/Laplace-approximable observation model; N small enough that a dense N×N Cholesky per iteration is affordable.
- tier: 🟡 · source: mc-stan:26425
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Exploit conjugacy: analytically marginalize the latent field (and intercept) out of the posterior" · "Test the zero-avoiding-prior remedy empirically: sweep the strength/location and tabulate divergences" · "Confirm the pathology is a funnel and locate where the divergences concentrate"

**✗ GP2** · for **out-of-sample GP prediction** → treating the fitted GP as a **callable function** does *[→ entry](../recs/regression/GP2.md)*
**NOT** work.
- why: a GP defines a joint Gaussian over ALL inputs; the training fit gives nothing at new x — you must recompute the cross-covariance K(X_train,X_test) from the same kernel and apply the analytic posterior-predictive equations (gp.conditional/gp.predict).
- conditions: stationary-kernel GP regression; predictions at new inputs; PyMC/Stan/any GP library where the predictive step is separate from fitting.
- tier: 🟡 · source: pymc:1299, mc-stan:16891, mc-stan:5442
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "inspect the rank/shape of Xnew passed to the GP prediction call" · "review the GP modelling choice (Latent vs Marginal) and the likelihood/parallelism settings" · "review how the random-variable query point is assembled and shaped before conditional"

**✗ GP3** · for **spatially-autocorrelated regression covariates** → ignoring covariate spatial *[→ entry](../recs/regression/GP3.md)*
autocorrelation does **NOT** work (overconfident coefficients, coverage below nominal).
- why: SA inflates a covariate's variance with duplicate information (effective n < n); the coefficient posterior contracts and its credible intervals lose coverage.
- conditions: regression/GLM on spatially-indexed data with SA covariates (CAR/ICAR/BYM/GP); worst when the covariate's spatial pattern aligns with the outcome's spatial trend.
- tier: 🟡 · source: mc-stan:17266, mc-stan:24567, mc-stan:15654
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: posterior SD shrinks and interval coverage drops below nominal as covariate SA rises}
- moves: "Run a parameter-recovery simulation: generate data from the known process, refit, compare to truth" · "Check identifiability: data volume at the group level and prior scale"

### Hierarchical location non-identifiability in regression

**✗ HL1** · for a **varying-effects regression** → a **zero-centered global intercept AND zero-mean *[→ entry](../recs/regression/HL1.md)*
group effects without a sum-to-zero/pin constraint** does **NOT** work (location non-identified).
- why: a constant shifts freely between the intercept and the group means without changing the likelihood → they trade off and σ_u inflates; exactly one term may carry the overall level.
- conditions: hierarchical/varying-effects models (incl GLM/nonlinear mean); even fully-observed, balanced data.
- tier: 🟡 · source: mc-stan:39536, mc-stan:17086
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the joint posterior of sigma and sd(Intercept) with pairs(fit); look for a degenerate ridge/arc" · "Audit the random-effects structure: check whether every term varies within the grouping factor" · "Recognize the few-groups hierarchical-variance pathology and switch the 2-level factor from random to fixed; compare convergence"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
bayes_sparse_regression · underdetermined_linear_regression · qr_regression · taylor_models ·
general_taylor_models · ordinal_regression · variate_covariate_modeling · generative_modeling ·
factor_modeling · prior_modeling · weakly_informative_shapes · falling

**Dan Simpson blog** (`dansblog:<id>` → `https://dansblog.netlify.app/posts/…`):
cheat (`2021-12-09-why-wont-you-cheat-with-me-repost`)

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pymc:N` → `https://discourse.pymc.io/t/…/N`).

**✓ HZ1** · for **count / semicontinuous data with excess zeros** → choosing between a **hurdle** and a *[→ entry](../recs/regression/HZ1.md)*
**zero-inflated** model by the *zero-generating mechanism* works.
- why: hurdle = one **Bernoulli(theta) gate** decides zero-vs-positive and a count process
**truncated-at-zero** generates the positives, so ALL zeros come from the gate; zero-inflation instead
mixes structural zeros with a count process that can ALSO emit zeros. Choose **hurdle** when a zero means
"the event did not occur" (a behavioral gate) and positives are "how many, given it occurred"; choose
**ZI** when some zeros are structurally impossible AND the count process can also emit zeros.
- conditions: excess-zero count/semicontinuous outcome. PyMC `CustomDist`: positive logp =
`log(theta) + Poisson.logp(y|mu) − log(1 − exp(−mu))` (the `− log(1 − exp(−mu))` is the
truncation adjustment); zero logp = `log(1 − theta)`. Complements SM2 (fitted-vs-predict for
reproducing the zero spike, i.e. the summary side).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ TB1** · for a **limited / corner outcome piled at a bound** (expenditure, hours worked, demand *[→ entry](../recs/regression/TB1.md)*
censored at 0) → **Tobit** (a Normal likelihood wrapped in censoring at the bound) works; an ordinary
Gaussian does **NOT**.
- why: Tobit = a linear model with a Normal likelihood wrapped in censoring at the bound,
`pm.Censored(pm.Normal.dist(mu=X.b, sigma), lower=0)`; fitting an ordinary Gaussian ignores the point
mass at the bound and **biases the slope**.
- conditions: outcome censored/piled at a known bound (e.g. 0); the mass at the bound is a censoring
artifact of one process, not a separate zero-generating process (contrast HZ1's hurdle/ZI split).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ O5** · for **ordered categorical outcomes** (Likert, severity grades) → a **latent continuous *[→ entry](../recs/regression/O5.md)*
eta=X.b partitioned by K−1 ordered cutpoints, with the ordering enforced**, works.
- why: `P(Y≤k) = sigmoid(c_k − eta)` (logistic link; probit is the alternative) — the categorical analog
of a bin-integration measurement model. Identifiability **REQUIRES cutpoint ordering**: enforce it via an
**ordered transform**, or **induce it from positive differences** (cumsum of HalfNormal diffs,
recentered).
- conditions: ordinal outcome with K categories and K−1 cutpoints; logistic vs probit link = two options.
Complements O1/O2 (latent-variable construction and the induced-Dirichlet cutpoint prior) with the PyMC
ordering constructions (ordered transform / cumsum-of-HalfNormal-diffs).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ QR1** · for **regressing a chosen quantile tau** (0.5 = median, 0.9 = 90th pct) **instead of the *[→ entry](../recs/regression/QR1.md)*
mean** → an **asymmetric-Laplace likelihood with fixed tau** works.
- why: `logp(y) = log(tau(1−tau)/sigma) − z·(tau − [z<0])`, with `z = (y−mu)/sigma` and `mu = X.b`; an
outlier-robust alternative to mean regression. Implement in PyMC via `pm.CustomDist`.
- conditions: a targeted quantile rather than the mean; tau fixed. Pairs with SM3 — default
`epred`/`fitted` return the ALD *mean*, which is offset from the targeted quantile whenever tau≠0.5.
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ RB1** · for a **regression with outliers / poor posterior-predictive tail fit** → swapping the *[→ entry](../recs/regression/RB1.md)*
**Normal likelihood for Student-t** (an implicit contamination model) works.
- why: Student-t downweights outliers without flagging them (Student-t = an infinite scale-mixture of
Normals); nu = tail heaviness (nu=1 is Cauchy / very heavy, nu>30 ≈ Normal).
- conditions: nu priors — `Gamma(2, 0.1)` (mode ~10, weakly-informative); `Exponential(1/29)+1`
(heavy-tail-leaning; the `+1` offset keeps nu>1 so the mean stays finite); or fix `nu~4`. Compare vs
Normal by LOO (`az.compare`). Complements C1's *explicit* signal/background contamination mixture with
the *implicit*-mixture route.
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ CF9** · for a **causal effect with an UNobserved confounder** → an **instrumental variable Z built *[→ entry](../recs/regression/CF9.md)*
into the structural model** identifies it; a conditional-only / backdoor model does **NOT**.
- why: with the confounder unobserved, conditioning cannot block the back-door path; an instrument **Z
(Z→X, Z affects Y only through X, Z independent of the confounder)** supplies the identification when
encoded in the structural model.
- conditions: an unobserved confounder plus a valid instrument satisfying relevance (Z→X), exclusion (Z
affects Y only through X), and independence from the confounder. Complements CF7 (propensity /
do-calculus as approximations) and CF2 (decoupling when there is no confounder).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ CF10** · for an **unobserved confounder WITH an observed fully-mediating mediator M** → **front-door *[→ entry](../recs/regression/CF10.md)*
adjustment** identifies the effect.
- why: when M fully mediates (**X→M→Y, no direct X→Y, M unconfounded with Y given X**), the front-door
criterion identifies the X→Y effect through M; encode it in the structural model rather than
conditioning on the unobserved confounder.
- conditions: an unobserved confounder plus an observed mediator M that fully mediates X→Y and is
unconfounded with Y given X. Sibling to CF9 (instrument) — both handle the unobserved-confounder case
that CF7's backdoor/propensity route cannot.
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
