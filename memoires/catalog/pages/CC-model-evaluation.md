# Cross-cutting: Model evaluation — is the fit trustworthy, is the model adequate, and is the comparison honest?

*A computation-diagnostics area that applies across ALL models. The unit of organization here is the
**diagnostic situation/symptom**, not the model class: the claims spine holds the durable distinctions
about what evaluation can and cannot certify; the practical layer is a symptom-indexed catalogue of
what to read into a given signal and what conclusions do NOT follow from it.*

## Claims (the *why* — mid-level)

*Seven mid-level principles synthesized from 60 granular claims. Tier is the best-supported of the
granular claims each subsumes. Source short-ids resolve to URLs in the Source key at the bottom.*

### C1 · Clean computation certifies the sampler, not the model — evaluation must go model-ward, and some misspecification is invisible even to predictive checks 🟢
*[→ full entry](../claims/CC-model-evaluation/C1.md)*

**Statement.** A faithfully-explored posterior can be confidently wrong. Zero divergences, R̂≈1,
adequate ESS and healthy E-BFMI certify only that the *computation* faithfully represents the *model*;
they say nothing about whether the model captures the data-generating process. Model misspecification
that leaves the posterior geometry regular (unimodal, no funnels, no hard boundaries) is sampled
cleanly and must be caught downstream — by posterior-predictive / retrodictive checks — and even those
have structural blind spots.

**Nuance.** Several distinct failure shapes share this root. A likelihood-family error (Poisson fit to
overdispersed counts), a structural error (a Brownian-motion prior that is silent about a known
terminal boundary), and a numerical-discretization error (Euler–Maruyama, error O(Δt²) in mean and
O(Δt) in scale) all produce clean diagnostics while the posterior is wrong. Retrodictive checks are
the corrective, but a *conditional-only* retrodictive check (covariates fixed, only variates
simulated) is blind to a missing/misspecified marginal-covariate model and to confounding — all four
binned panels can pass while a confounded treatment effect is on the *wrong sign*. Extrapolation
failure (prediction targets outside training covariate support) is structurally undetectable by NUTS
diagnostics AND marginal AND conditional retrodictive checks — the only guard is visually inspecting
train-vs-target covariate overlap. And two *benign* signals mimic misspecification: a positive
residuals-vs-fitted slope is a mechanical shrinkage artifact, and curvature in a conditional
retrodictive quantile plot with correlated covariates is a projection artifact — neither is a bad
model. Conversely, disagreement of a shared parameter's posterior across independent
sources/subsets *is* a near-conclusive misspecification detector.

**Conditions.** Applies when the misspecified model retains regular geometry (pathology that also
distorts geometry would be caught by the sampler); the corrective checks must be chosen to probe the
relevant direction of model space, decided before opening the data.

**Tier.** 🟢 established (subsumes `clean-hmc-diagnostics-insufficient-for-model-validity`,
`brownian-motion-vs-bridge-model-misspecification`, `linear-regression-is-a-local-taylor-approximation`,
`extrapolation-failure-structurally-undetectable-by-internal-checks`,
`conditional-retrodictive-check-blind-to-covariate-model-failure-and-co`, `confounding-sign-reversal`,
`correlated-covariates-artifact-in-conditional-retrodictive-plots`,
`haunted-residual-vs-fitted-is-shrinkage-not-misspecification`,
`cross-source-subset-comparison-as-model-failure-detector`, `four-gate-workflow-ordering`,
`nested-model-expansion-overfitting-protection`).

**Sources.** betanalpha:general_taylor_models · betanalpha:stochastic_differential_equations ·
betanalpha:survival_modeling · betanalpha:brownian_bridge · betanalpha:taylor_models ·
betanalpha:variate_covariate_modeling · betanalpha:falling · betanalpha:principled_bayesian_workflow ·
dansblog:monkey

---

### C2 · All models are misspecified; adequacy is goal-relative ("good enough"), and asymptotic / relative certificates carry hidden conditions 🟢
*[→ full entry](../claims/CC-model-evaluation/C2.md)*

**Statement.** In practice the true process π† lies outside the observational model S — this is the
rule, not the exception — yet inference is still useful provided S contains a configuration that
captures the structure of π† *relevant to the inferential goals*. The operative standard is
**M-good-enough**, not M-closed (truth ∈ S) nor M-open (any misfit tolerable): arbitrarily large
*irrelevant* misfit is acceptable so long as the *relevant* misfit is small.

**Nuance.** The corollaries reshape what a "certificate" means. Asymptotic frequentist intervals
(MLE + Fisher information) carry a hidden double jeopardy: they need the model to contain π† AND N
large enough for the CLT — but as N grows it resolves the very misspecification that was invisible at
small N, so the two conditions may never hold together (worst for coarse/homogeneous models on
heterogeneous data). Frequentism itself is not a rival inference framework but a *calibration*
procedure — it evaluates the worst-case expected utility of an estimator across configuration space,
it does not say which configurations are plausible. And KL-based comparison scores (AIC, BIC, DIC,
WAIC, LOO, Bayes factors) are all instances of the same relative predictive score −E_π†[log π_pred]:
mathematically valid only for *ranking* models against each other, providing no absolute scale for
single-model adequacy and structurally inadequate for model *criticism*.

**Conditions.** Which directions of model space are "relevant" is a domain judgment made before the
data are examined; relative use of KL scores is valid within each method's assumptions; the asymptotic
tension is acute only for coarse approximations.

**Tier.** 🟢 established (subsumes `misspecification-is-universal-yet-inference-remains-useful`,
`m-good-enough-relevant-irrelevant-misfit`, `asymptotic-frequentist-trap`,
`frequentism-is-calibration-not-inference`, `kl-based-scores-are-relative-not-absolute`).

**Sources.** betanalpha:modeling_and_inference · betanalpha:principled_bayesian_workflow

---

### C3 · Generative structure — likelihood family, narrative decomposition, confounding, which variables are stochastic, how each datum enters — fixes what the posterior can answer, independent of fit quality 🟢
*[→ full entry](../claims/CC-model-evaluation/C3.md)*

**Statement.** The observational model's *structure* determines the set of answerable questions before
any sampling happens. The likelihood family is a modeling decision driven by the outcome's
support/domain and a generative story for how the data arose — not by matching the data histogram's
shape; any distribution whose (possibly unnormalized) log-density you can write is a legitimate
likelihood.

**Nuance.** "Generative" conflates two independently-variable properties: *procedurally* generative
(admits ancestral/pushforward sampling) and *narratively* generative (the conditional decomposition
mirrors the data-generating story); only the latter licenses causal reading, and improper priors block
procedural generativity while leaving narrative structure intact. A controlled experiment (x fixed by
design) and an uncontrolled one (x stochastic) can be mathematically identical as conditionals for
y|x yet support different interventional conclusions — treating a stochastic x as a fixed covariate
silently forfeits causal validity, and ignored confounding can *reverse the sign* of a causal
parameter. A joint narratively-generative model over realized and hypothetical processes yields
coherent predictions for unobserved outcomes that a sequential "posterior-as-prior" hand-off cannot.
When the outcome is *derived* (a difference, a change score, a summary of finer events) the reliable
fix for a shape misfit is to model the underlying primitives, not to reach for a heavier-tailed family
on the summary. Two structural traps recur: spatial autocorrelation in a *covariate* injects duplicate
information that makes its coefficient overconfident (coverage below nominal); and imputing a missing
*response* then re-fitting double-counts the data (a missing response carries no extra information),
whereas imputing a missing *covariate* is legitimate because it enters two relationships. Weighting an
observation means multiplying its *log*-likelihood by w (pseudo-count semantics) — not adding log(w),
and not the variance-rescaling of `varIdent`.

**Conditions.** Matters most for causal/counterfactual claims and for out-of-sample or unobserved-
configuration prediction; the unnormalized-logp freedom is specific to gradient/MCMC inference that
needs no normalized density.

**Tier.** 🟢 established (subsumes `generative-model-procedural-vs-narrative-distinction`,
`controlled-vs-uncontrolled-experiment-require-different-models`,
`joint-narratively-generative-model-enables-unobserved-process-predicti`; plus supported
`forum-c209` likelihood-choice, `forum-c242` model-the-primitive, `forum-c118` spatial-covariate-
overconfidence, `forum-c354` impute-response-double-counts, `merged-7` weights-multiply-loglik).

**Sources.** betanalpha:generative_modeling · mc-stan:17266 · mc-stan:24567 · mc-stan:15654 ·
mc-stan:21644 · mc-stan:5135 · mc-stan:16152 · mc-stan:4278 · mc-stan:7589 · mc-stan:39096 ·
mc-stan:17283 · pymc:2961 · pymc:307 · pymc:17348 · pymc:12450

---

### C4 · Predictive and derived quantities must be built by pushing each posterior draw through the full generative/observation process and summarizing AFTER the nonlinear step 🟡
*[→ full entry](../claims/CC-model-evaluation/C4.md)*

**Statement.** The correct predictive/derived object is obtained by applying the transform *inside*
each posterior draw and summarizing the resulting ensemble; averaging or conditioning in the wrong
order silently biases the answer. A posterior predictive must be drawn through the observation-level
RNG so it carries BOTH parameter uncertainty (including the noise scale σ) and the irreducible
observation noise — plugging in the linear predictor / conditional mean gives an object that is too
narrow.

**Nuance.** The distinction between the conditional mean and the full predictive is load-bearing:
`posterior_epred/linpred` return E[y|x,θ] per draw (parameter uncertainty only), `posterior_predict`
adds residual noise; differencing data against epred yields an RMSE distribution that is far too
narrow. The auto-widening "bow-tie" extrapolation fan reflects parameter uncertainty only and
under-estimates true predictive uncertainty (it cannot see model-form error outside the data). Jensen's
inequality forbids transforming the posterior mean — f(E[θ]) ≠ E[f(θ)] — so covariance→correlation,
matrix inverse, eigen-decompositions, and any nonlinear summary must be computed per draw. A
marginalized discrete latent is recovered as the *data-conditioned* membership E[z|θ,y], not E[z|θ].
Marginal effects from random-slope models must be derived per draw and averaged over the empirical
covariate/RE distribution *before* summarizing (AME ≠ MEM). A constraint imposed via `pm.Potential`
enters the inference logp but is *ignored by predictive sampling*. GP prediction at new inputs cannot
reuse the generic condition-on-latents-then-feed-new-X pattern (`Predictive`, `set_data`) — it
silently returns the prior; you must explicitly re-evaluate the cross-covariance and apply the analytic
posterior-predictive equations. Substantive answers usually live in posterior-predictive functionals
and plotted effects, not the raw parameter table (splines, dispersion φ, latent correlations have no
direct reading); a factor's effect must be marginalized over its levels, not read off the reference
level; and a difference between conditions must be a formal contrast, not inferred from overlap of two
marginal credible intervals.

**Conditions.** Applies whenever a summary is a nonlinear function of the sampled parameters or of
simulated/predicted quantities; collapses to a single number only for affine transforms and the
degenerate noiseless case.

**Tier.** 🟡 supported (subsumes `forum-c133` predict-through-RNG, `forum-c54` epred-vs-predict,
`forum-c213` extrapolation-fan-underestimates, `forum-c474` apply-f-per-draw, `forum-c53`
recover-marginalized-latent, `forum-c335` marginal-effect-order-of-ops, `forum-c421` potential-ignored-
by-predictive, `forum-c273` gp-predictive-collapses-to-prior, `forum-c471` gp-needs-conditioning,
`forum-c217` interpret-via-functionals, `forum-c20` marginalize-over-levels, `forum-c183`
contrast-not-interval-overlap, `forum-c187` mrp-poststratification-frame).

**Sources.** mc-stan:3169 · mc-stan:31832 · mc-stan:28502 · mc-stan:13293 · mc-stan:12240 ·
mc-stan:23944 · mc-stan:6910 · mc-stan:22488 · mc-stan:24172 · mc-stan:3914 · mc-stan:11531 ·
mc-stan:22426 · mc-stan:34470 · mc-stan:16703 · mc-stan:5323 · mc-stan:19673 · mc-stan:33728 ·
mc-stan:16891 · mc-stan:5442 · mc-stan:13028 · mc-stan:37666 · pymc:5824 · pymc:4537 · pymc:10937 ·
pymc:14280 · pymc:11887 · pymc:6229 · pymc:1299 · pyro:3868

---

### C5 · Predictive model comparison ranks (never certifies), demands the correctly-factorized pointwise likelihood, and breaks when effective parameters approach N 🟢
*[→ full entry](../claims/CC-model-evaluation/C5.md)*

**Statement.** Cross-validated predictive scores compare models; they do not validate one. A
comparison is decisive only when `elpd_diff` is large relative to `se_diff` AND the absolute
`elpd_diff` is itself non-trivial (the canonical `elpd_diff=−0.5, se_diff=0.1` — ratio 5 — is still
negligible), and the SE is optimistic at small n or under misspecification. The machinery is
construction-sensitive at every step.

**Nuance.** The pointwise log-likelihood fed to LOO/WAIC must be recomputed in generated quantities as
a vector with one term per CV unit *at the granularity where the likelihood factorizes* — never read
off `lp__`/`target`, and leave-one-row LOO is the wrong unit when dropping a row leaves the rest
conditionally dependent (time-series/HMM/state-space). elpd itself is a log-sum-exp over draws within
each held-out unit, minus log S, *then* summed over units — a global `mean(exp())` over the flattened
S×n matrix is wrong. With ~one random effect per observation (effective params ≈ N), each point
predicts itself so exact LOO is uninformative and PSIS is unreliable; integrate the RE out (conjugate
mixing) or use grouped K-fold. A per-observation Pareto-k > 0.7 flags a *highly influential* held-out
unit (triage via the p_loo-vs-p tree), not a sampler-convergence problem. Stacking weights answer a
different question than the elpd ranking — they reward each model's *marginal* contribution to the
ensemble, so weight-order and elpd-order legitimately disagree; to realize a stacked model you pool
predictive *draws* in proportion to weights, you do not average parameters. For selection, refitting
each submodel and keeping the LOO-best overfits the CV estimate; use projection-predictive selection —
but its forward-search path minimizes predictive KL and does not respect statistical marginality, so
it is not an interpretable formula. And coverage-fraction (CVG) is an ill-defined interval score
(conflates multiple-testing with a single calibration statement); the proper Interval Score subsumes
it. A fitted posterior can even be updated for modest new data by PSIS-reweighting the old draws
instead of refitting — validity governed by how far the posterior moves, gated by Pareto-k.

**Conditions.** Applies to any predictive comparison from pointwise log-lik draws (LOO, k-fold, LOGO,
leave-future-out); the small-numbers and SE-optimism caveats bite at small n or under misspecification;
non-exchangeable structure (hierarchical/temporal/spatial) makes the CV-unit and SE-scaling choices
consequential.

**Tier.** 🟢 established (subsumes `cvg-metric-is-ill-defined-and-int-is-the-correct-replacement`;
plus supported `forum-c101` pointwise-loglik-factorization, `forum-c36` elpd-aggregation,
`forum-c475` per-obs-RE-breaks-LOO, `merged-8` pareto-k-is-influence, `forum-c466` elpd-diff-
decisiveness, `forum-c290` stacking-weights-vs-elpd, `forum-c218` stack-predictive-distributions,
`merged-6` projpred-not-refit, `forum-c458` projpred-ignores-marginality, `forum-c426`
psis-posterior-update).

**Sources.** dansblog:barry-gibb · mc-stan:32502 · mc-stan:11993 · mc-stan:37577 · mc-stan:3570 ·
mc-stan:5207 · mc-stan:34693 · mc-stan:12335 · mc-stan:30254 · mc-stan:36639 · mc-stan:3446 ·
mc-stan:22048 · mc-stan:1628 · mc-stan:16300 · mc-stan:3417 · mc-stan:6774 · mc-stan:10869 ·
mc-stan:18602 · mc-stan:21390 · mc-stan:12866 · mc-stan:18721 · mc-stan:28952 · mc-stan:14893 ·
mc-stan:40885 · mc-stan:18954 · mc-stan:37196 · pymc:4658 · pymc:13751 · pymc:8256

---

### C6 · Hypothesis tests and single-number summaries (Bayes factors, R², variance partitions) are prior-fragile or definition-dependent — prefer an estimation/predictive framing 🟡
*[→ full entry](../claims/CC-model-evaluation/C6.md)*

**Statement.** Bayes-factor / marginal-likelihood testing is a distinct instrument from both
estimation and predictive comparison: a BF is a contest between the two models' *prior* predictive
distributions, so it is acutely sensitive to parameter priors in a way ordinary posterior estimation
is not — priors chosen to be reasonable for estimation are generally not appropriate for BFs, and any
improper prior leaves the BF undefined.

**Nuance.** Even after the MCMC has converged, a bridge-sampling BF is unstable across repeated
evaluations (two compounded Monte-Carlo error layers: posterior sampling error plus the bridge
sampler's own error), and stabilizing it needs an order of magnitude more draws than posterior
means/intervals require. The robust alternative for assessing an effect is a directional posterior
probability P(β>0) or a ROPE statement P(|β|<δ) — both stable under default priors — rather than a
point-null BF, which is additionally sensitive to factor coding / reference level. "Bayesian R²" is
not one quantity: a residual-based estimator Var(pred)/(Var(pred)+Var(pred−y)) (brms/rstantools) and a
model-based one Var(pred)/(Var(pred)+σ²) (rstanarm) disagree in magnitude and can *reverse* the
conditional>marginal ordering for mixed models; R² is also observation-model-dependent (a binomial vs
row-expanded Bernoulli likelihood give identical coefficients but different R²), so it is not
comparable across families. And a random intercept that dominates the variance partition (high
ICC/R²) is not a reason to drop it — adding genuinely predictive covariates *reattributes* variance
while total explanatory power rises; dropping it discards the grouping structure and leaves
within-group residual correlation.

**Conditions.** The prior-fragility caveat is specific to point-null Bayes factors and marginal
likelihoods; the R²/variance-partition subtleties are specific to non-identity links and to mixed
models (they vanish for ordinary Gaussian regression).

**Tier.** 🟡 supported (subsumes `forum-c158` bf-prior-sensitivity, `forum-c454` bridge-bf-instability,
`forum-c67` directional-prob-over-point-null-bf, `forum-c342` two-bayesian-r2, `forum-c160`
r2-observation-model-dependent, `forum-c452` do-not-drop-dominant-random-intercept).

**Sources.** mc-stan:2532 · mc-stan:11977 · mc-stan:4469 · mc-stan:4847 · mc-stan:22364 ·
mc-stan:12057 · mc-stan:20461 · mc-stan:7420 · mc-stan:14752 · mc-stan:33187 · mc-stan:33138

---

### C7 · The evaluation apparatus is itself fallible — diagnostics are noisy Monte-Carlo estimates, published proofs and benchmarks carry errors and design choices, and numerical primitives impose hard constraints 🟢
*[→ full entry](../claims/CC-model-evaluation/C7.md)*

**Statement.** The tools used to evaluate a model must themselves be sense-checked. A PSIS k̂ read to
gate a VI guide (or an importance-sampling step) is a *random variable*, not a fixed property of the
fit: repeated calls on the same data and guide spread by O(0.1–0.4) (e.g. −0.16 to +0.25 at 1000
particles), so a single call near the k≈0.7 threshold is an unreliable verdict — its SD shrinks only
~√(particles).

**Nuance.** Published derivations contain errors that propagate into naive implementations — Bickel
(1967)'s E(r²) order-statistic bound is missing a factor S, which flips the bound from bounded to
converging-to-zero ("always sense-check the proofs, even if a famous person did it in the 60s"); and
truncated/Winsorized importance sampling needs *double-sided* Winsorization of the product RH when the
integrand H can be both positive and negative — single-sided WIS/PSIS can fail there. Benchmarks
encode design choices: the most effective available fairness guarantee for a method comparison is to
include an author from each compared team (so each can flag incorrect/suboptimal usage of their
method). And the numerical primitives have correctness/efficiency structure worth knowing: the
log-determinant of a Cholesky-factored SPD matrix is a *free* byproduct (log|Q| = 2·Σ log Lᵢᵢ), not a
separate O(n³) computation (and it decomposes further for block-diagonal Q), while any sparse-matrix
class that lazily caches its Cholesky via a *mutable* flag is architecturally incompatible with JAX
(pytree leaves must be immutable) and Stan (objects must be stateless) — eager computation at
construction resolves it.

**Conditions.** The k̂-noise caveat is acute near the accept/reject threshold at finite particle
counts; the Cholesky-byproduct advantage is most pronounced at large N and ill-conditioned Σ; the
immutability constraint is a hard property of JAX JIT / autodiff and Stan, not a performance tradeoff.

**Tier.** 🟢 established (subsumes `bickel-1967-missing-factor-s-in-order-statistic-bound`,
`double-sided-winsorization-negative-h`, `cholesky-logdet-and-quadratic-form-free-byproduct`,
`jax-pytree-immutability-blocks-lazy-cache-flag`; plus supported `forum-c326` psis-khat-is-noisy,
candidate `multi-author-comparison-design-is-best-available-fairness-guarantee` ⚪).

**Sources.** dansblog:that-psis-proof · dansblog:barry-gibb · dansblog:linear-mixed-effects ·
dansblog:sparse-matrices-4 · betanalpha:probability_densities · pyro:3270

---

---

### C8 · Model building is Box's loop — start simplest, let each posterior-predictive misfit motivate adding exactly ONE component, and understand a complex model only relative to the simpler ones it nests 🟢
*[→ full entry](../claims/CC-model-evaluation/C8.md)*

**Statement.** Model building is iterative, not a single fit. Start from the simplest plausible
model and let each posterior-predictive misfit motivate adding exactly ONE component at a time; a
complex model is understood only relative to the simpler models it nests, and computational problems
are far easier to localize in a simple model than in a fully-specified one. This is the Box's-loop /
Gelman–McElreath build→check→expand cycle.

**Nuance.** Two operating rules follow from the loop. (1) Fit the expansion even when you expect no
gain: a null comparison demonstrates the simpler model is adequate, a positive one identifies real
structure, and the elpd difference itself characterizes the data-generating process — so the
comparison is informative regardless of its outcome. (2) The modeling journey IS the analysis: report
the whole labelled model sequence (Model 1..N) as a table — description / ELPD / elpd_diff / weight —
together with the prior-predictive findings and the posterior-predictive misfits that motivated each
expansion, not just the final parameter table. This is the outer loop that C3's nested shrink-to-zero
expansion (the overfitting-protection mechanism) lives *inside*.

**Conditions.** Which single component to add — and which direction of model space the next
posterior-predictive check probes — is a domain judgment driven by the observed misfit; the
overfitting protection requires each expansion to be nested (previous model recovered at a specific
parameter value), per C3.

**Tier.** 🟢 established (source: pymc-labs L1, human-curated; grounded in the Box's-loop /
Gelman–Vehtari–McElreath 2025, Gelman et al. 2020 workflow).

**Sources.** pymc-labs:workflow.

---

### C9 · A model with no observed likelihood factor is a pure generative DAG — draw its prior by exact ancestral (forward) sampling, never by running MCMC on the unconditioned model 🟢
*[→ full entry](../claims/CC-model-evaluation/C9.md)*

**Statement.** A model with no observed likelihood factor is a pure generative DAG. Draw from its
prior by ancestral (forward) sampling in dependency order — this is exact and O(1) per draw. Never
draw the prior by running a full sampler: MCMC on an unconditioned model is slow and mixes poorly,
most acutely for discrete latents, which HMC cannot move through at all.

**Nuance.** The library entry point is `pm.sample_prior_predictive()` (exact ancestral sampling); the
anti-pattern is calling `pm.sample()` on a model with no observed data ("the MCMC prior-sampling
fallacy"). Forward sampling is the correct engine behind the prior-predictive checks the evaluation
workflow depends on (the gate-1 prior-predictive / A2-style checks): those checks require prior draws,
and ancestral sampling is how you obtain them cheaply and exactly.

**Conditions.** Applies to any model with no observed likelihood factor (prior-only / prior-predictive
draws); the discrete-latent failure of MCMC prior-sampling is the sharpest case.

**Tier.** 🟢 established (source: pymc-labs L1, human-curated).

**Sources.** pymc-labs:workflow.

## Practical — what works / what doesn't (comprehensive, situation-indexed)

*71 recs (24 ✓ / 47 ✗, two of them — E5, H3 — bidirectional), indexed by DIAGNOSTIC SITUATION /
SYMPTOM rather than by model. `efficacy` is
the benchmark-shaped slot `{divergences, min_ess, ess_per_sec, rmse, coverage}`, filled ONLY where the
input states a concrete or clearly-qualitative metric, else `pending`. Attached `moves` are the
diagnostic "how", matched by relevance and quoted from the input move-graph.*

### A · "All my diagnostics are clean" — computation looks fine

**✗ A1** · when **HMC diagnostics are clean** (0 divergences, R̂≈1, adequate ESS, healthy E-BFMI) → *[→ entry](../recs/CC-model-evaluation/A1.md)*
concluding the **posterior inference is valid** does **NOT** work.
- why: clean diagnostics certify that the sampler faithfully explored the *model*; a misspecified likelihood family, structural error, or discretization bias with regular geometry is sampled just as cleanly and is confidently wrong.
- conditions: misspecification that leaves geometry regular (unimodal, no funnels/boundaries); geometry-distorting misspecification would instead be caught.
- tier: 🟢 · source: betanalpha:general_taylor_models, betanalpha:survival_modeling
- efficacy: {divergences: 0 (Poisson-on-overdispersed fit: 0 divergences, nominal R̂, healthy E-BFMI, yet PP envelope misses the heavy tail / excess zeros) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a posterior/predictive plausibility check on the support of the outcome and flag the likelihood misspecification"

**✓ A2** · when you need to **catch misspecification behind clean diagnostics** → **posterior- *[→ entry](../recs/CC-model-evaluation/A2.md)*
predictive / retrodictive checks** are the corrective (they test model adequacy, not computation).
- why: retrodictive checks compare the model's predictive envelope against observed features, exposing the misfit the sampler cannot see.
- conditions: the check must probe the direction of model space relevant to the inferential goal.
- tier: 🟢 · source: betanalpha:general_taylor_models, betanalpha:stochastic_differential_equations
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a posterior/predictive plausibility check on the support of the outcome and flag the likelihood misspecification"

**✗ A3** · when the **sampler runs clean but a known terminal / boundary condition is not encoded** *[→ entry](../recs/CC-model-evaluation/A3.md)*
(Brownian-motion prior where a bridge is needed) → trusting the **posterior trajectories** does **NOT**
work.
- why: a clean-running sampler faithfully represents its model; if the model is silent about the terminal constraint the posterior is wrong by construction, not fixable by the sampler.
- conditions: terminal boundary known and informative; observations concentrated early, leaving the late interval unconstrained.
- tier: 🟢 · source: betanalpha:brownian_bridge
- efficacy: {divergences: 0 (NCP Brownian model: 0 divergences, 0 tree-depth saturations, yet violates the known terminal constraint) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the deterministic forward map (timing/structural definitions) for a sign/continuity bug before blaming the sampler." · "Forward-sample the suspect variable (pm.draw) and/or run prior predictive sampling and inspect support and finiteness."

**✗ A4** · when a **conditional-only retrodictive check passes** (covariates fixed, only variates *[→ entry](../recs/CC-model-evaluation/A4.md)*
simulated) → concluding the **covariate model and treatment effect are correct** does **NOT** work.
- why: the conditional check probes only the observed covariate context; it is blind to a missing/misspecified marginal-covariate model and to confounding, so all panels pass while a confounded effect flips sign.
- conditions: confounding creates between-context heterogeneity large enough to overwhelm the true effect; misspecification operates by parameter reassignment, not visible distributional misfit.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: conditional-only ζ posterior concentrates ~+0.2 to +0.4 (apparent harm) vs true −0.35 (sign reversal) · coverage: all binned retrodictive panels pass while the effect is on the wrong sign}
- moves: "Push the prior through the model (prior predictive) and plot the implied prior on the outcome, AND audit the data for covariate combinations…" · "Run on simulated data and on prior-predictive / increasing-N data and inspect the likelihood/posterior geometry"

**✗ A5** · when **prediction targets fall outside the training covariate support** → relying on *[→ entry](../recs/CC-model-evaluation/A5.md)*
**NUTS diagnostics + marginal + conditional retrodictive checks** to catch extrapolation failure does
**NOT** work.
- why: retrodictive checks evaluate the model only where the local (Taylor) approximation is valid by construction; they emit no signal about regions outside the training covariate support.
- conditions: targets outside covariate support and the true function nonlinear across the gap; specific to local basis expansions (Taylor), not global bases / GPs with suitable kernels.
- tier: 🟢 · source: betanalpha:taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: posterior predictive misses held-out target-region points by a large margin · coverage: pending}
- moves: "Check whether the data span the region that informs the weakly-constrained parameters" · "Run on simulated data and on prior-predictive / increasing-N data and inspect the likelihood/posterior geometry"

**✓ A6** · when you **suspect extrapolation** → **visually inspecting train-vs-target covariate *[→ entry](../recs/CC-model-evaluation/A6.md)*
overlap** works (the only guard).
- why: no internal check fires outside the training support, so overlap must be verified directly.
- conditions: covariate support comparison available for both training and target sets.
- tier: 🟢 · source: betanalpha:taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Check whether the data span the region that informs the weakly-constrained parameters"

**✓ A7** · when a **shared parameter is constrained by two independent sources / subsets** → *[→ entry](../recs/CC-model-evaluation/A7.md)*
**comparing their posteriors** (non-overlap ⇒ misspecification) works as a failure detector.
- why: a joint model that forces consistency amplifies the signal — the constrained parameter can no longer absorb misfit independently, so systematic residuals grow; disagreement is near-conclusive evidence of model, not sampler, failure.
- conditions: multiple exchangeable sources/subsets that should constrain the shared parameter to the same value under the correct model.
- tier: 🟢 · source: betanalpha:falling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Partition which parameters match vs mismatch across the two fits"

### B · A plot looks pathological — artifact or real misfit?

**✗ B1** · when a **residuals-vs-fitted plot shows a positive slope** in a partial-pooling model → *[→ entry](../recs/CC-model-evaluation/B1.md)*
reading it as **misspecification** does **NOT** work (it is a shrinkage artifact).
- why: fitted values for extreme groups are pulled toward the global mean → positive residuals for high-mean groups, negative for low — a mechanical slope even under a correct model.
- conditions: any partial-pooling model; steeper at n_j=1–2 (shrinkage weight →1), attenuates but never vanishes with larger n_j.
- tier: 🟢 · source: dansblog:monkey
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Insist on a proper simulation-based calibration (SBC) before trusting any 'bias' claim: re-draw parameters from the prior AND data from the exactly-matching model…"

**✗ B2** · when a **conditional retrodictive quantile plot shows curvature** and component covariates *[→ entry](../recs/CC-model-evaluation/B2.md)*
are **correlated** → reading it as **nonlinearity / misspecification** does **NOT** work (projection
artifact).
- why: the marginal conditional mean E[y|Δx₁] absorbs β₂·E[Δx₂|Δx₁], which is nonlinear in Δx₁ whenever the correlation is nonlinear — curvature appears with a perfectly linear location function and a calibrated posterior.
- conditions: M≥2 component covariates, at least two nonlinearly correlated, check projects onto one covariate at a time via a bin-median summary.
- tier: 🟢 · source: betanalpha:taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run on simulated data and on prior-predictive / increasing-N data and inspect the likelihood/posterior geometry"

### C · Workflow ordering & iterative model building

**✓ C1** · when planning a Bayesian evaluation → passing the **four gates in order** (domain *[→ entry](../recs/CC-model-evaluation/C1.md)*
expertise → computational faithfulness → inferential adequacy → model adequacy) works.
- why: gates 1–3 rely only on simulated data and are valid *before* the observations are opened; the ordering is load-bearing, not stylistic.
- conditions: SBC computationally feasible; the discipline is most critical for confirmatory analysis.
- tier: 🟢 · source: betanalpha:principled_bayesian_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Correct the semantics of prior predictive checks: check consequences against IMPLICIT DOMAIN EXPERTISE, not against the observed data" · "Run algorithmic-faithfulness checks at the right scope — self-consistency diagnostics on the single fit, and SBC"

**✗ C2** · when you **open the data before the prior-predictive / SBC gates** → treating those steps *[→ entry](../recs/CC-model-evaluation/C2.md)*
as still valid does **NOT** work (they collapse into empirical Bayes).
- why: prior-predictive (gate 1) and SBC (gate 2) must use only simulated data from the prior predictive; exposing them to real observations turns them into forms of empirical Bayes and forfeits their guarantees.
- conditions: confirmatory analysis; purely exploratory work may relax the boundary but then carries overfitting vulnerability.
- tier: 🟢 · source: betanalpha:principled_bayesian_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Name the procedure as empirical-Bayes prior tuning and diagnose WHY it is worse than it looks, invoking the Likelihood Principle" · "Surface and flag post-hoc model selection as a separate, deeper hazard than prior tuning"

**✓ C3** · when **iteratively expanding a model** via posterior retrodictive checks → **nested *[→ entry](../recs/CC-model-evaluation/C3.md)*
expansion with shrink-to-zero (PC-style) priors** on the new parameters works to limit overfitting.
- why: nesting (Θ_i ⊂ Θ_{i+1}, previous model recovered at zero) lets the posterior retreat to the simpler configuration unless the data support the expansion; the worst outcome is wider posteriors.
- conditions: expanded model parameterized so the previous is recovered at a specific value; protection degrades when the likelihood overwhelms the shrinkage prior.
- tier: 🟢 · source: betanalpha:principled_bayesian_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "evaluate cheap patches and reject the ones that change the model" · "isolate the offending term by ablation"

**✗ C4** · when iterating by **replacing (non-nested) models** on the same data → does **NOT** work *[→ entry](../recs/CC-model-evaluation/C4.md)*
(discards the overfitting protection).
- why: replacement throws away the previous model's shrinkage-based protection entirely; only nested expansion keeps it.
- conditions: iterative retrodictive-check loop on one dataset.
- tier: 🟢 · source: betanalpha:principled_bayesian_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Surface and flag post-hoc model selection as a separate, deeper hazard than prior tuning"

### D · "Is my model good enough?" — adequacy, asymptotics, and score scope

**✓ D1** · when asking **"is my model good enough?"** → judging **relevant (goal-specific) misfit and *[→ entry](../recs/CC-model-evaluation/D1.md)*
tolerating irrelevant misfit** (M-good-enough) works.
- why: usefulness needs only a configuration in S that captures the structure of π† relevant to the goals; arbitrarily large irrelevant misfit is acceptable.
- conditions: which directions are "relevant" is a domain judgment made before examining the data.
- tier: 🟢 · source: betanalpha:principled_bayesian_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Anchor the empirical result against established theory and reframe the question as 'why might this specific eval fail to show the expected benefit'"

**✗ D2** · when treating **well-specification (truth ∈ model)** as a prerequisite for useful inference *[→ entry](../recs/CC-model-evaluation/D2.md)*
→ does **NOT** work / is unnecessary.
- why: π† ∉ S is the rule, not the exception; ecological models ignore quantum mechanics and general relativity without loss of inferential value.
- conditions: approximation error of the best element in S must be small for the goals at hand, not for all goals.
- tier: 🟢 · source: betanalpha:modeling_and_inference
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run on simulated data and on prior-predictive / increasing-N data and inspect the likelihood/posterior geometry"

**✗ D3** · when using **AIC / BIC / DIC / WAIC / LOO / Bayes factors to certify a single model's *[→ entry](../recs/CC-model-evaluation/D3.md)*
adequacy** → does **NOT** work (they are relative-only).
- why: all are the same relative predictive score −E_π†[log π_pred]; they rank models against each other but give no absolute scale and are structurally inadequate for model criticism.
- conditions: relative use (ranking two models on the same data under the same assumptions) is valid within each method's assumptions.
- tier: 🟢 · source: betanalpha:principled_bayesian_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Treat the warning as a diagnostic signal, not noise: switch from WAIC to LOO because they are asymptotically equivalent but LOO carries the pareto-k signal" · "Read the headline LOO diagnostics first: compare p_loo against N and against the nominal parameter count"

**✗ D4** · when relying on **asymptotic MLE + Fisher-information intervals as N grows** for a coarse *[→ entry](../recs/CC-model-evaluation/D4.md)*
model → does **NOT** work (double jeopardy).
- why: the asymptotics need the model to contain π† AND N large for the CLT, but growing N resolves the misspecification that was invisible at small N — the two conditions may never hold together.
- conditions: acute for coarse/homogeneous models on heterogeneous data; valid when the model is genuinely well-specified.
- tier: 🟢 · source: betanalpha:modeling_and_inference
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run on simulated data and on prior-predictive / increasing-N data and inspect the likelihood/posterior geometry"

**✗ D5** · when reading a **frequentist procedure as quantifying which parameters are plausible** → *[→ entry](../recs/CC-model-evaluation/D5.md)*
does **NOT** work.
- why: frequentism forbids probability over configuration space; it is a calibration procedure for the worst-case expected utility of an estimator, answering "how bad can this get?" not "which parameters are plausible?"
- conditions: classical frequentism via worst-case expected utility; does not cover bootstrap / simulation-based calibration.
- tier: 🟢 · source: betanalpha:modeling_and_inference
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Anchor the empirical result against established theory and reframe the question as 'why might this specific eval fail to show the expected benefit'"

### E · Choosing the likelihood / generative structure

**✗ E1** · when **choosing the likelihood family by matching the data histogram's shape** → does *[→ entry](../recs/CC-model-evaluation/E1.md)*
**NOT** work.
- why: the observational distribution is a modeling decision from the outcome's support/domain and a generative story (counts→Poisson/NegBin, survival→Weibull/hazard); histogram-matching skips the mechanism.
- conditions: any PPL; the unnormalized-logp freedom (CustomDist/Potential) applies to gradient/MCMC inference that needs no normalized density.
- tier: 🟡 · source: pymc:2961, pymc:307, pymc:17348
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a posterior/predictive plausibility check on the support of the outcome and flag the likelihood misspecification" · "Check likelihood-family / parameterization coherence (acat vs cumulative)"

**✓ E2** · when a **pp_check shows shape misfit and the outcome is a derived / summary quantity** → *[→ entry](../recs/CC-model-evaluation/E2.md)*
**modeling the underlying primitives** works.
- why: the summary's shape is produced by finer structure; respecting the support and modeling the events that generate the summary fixes the cause, not the symptom.
- conditions: the finer-grained observations are available; else the best-supported family for the summary is the pragmatic fallback.
- tier: 🟡 · source: mc-stan:39096, mc-stan:17283
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reduce to the minimal generative model and write out both candidate predictive distributions by hand for y=1 and y=0 cases"

**✗ E3** · when a **pp_check shows shape misfit** → reaching for a **heavier-tailed / skewed family on *[→ entry](../recs/CC-model-evaluation/E3.md)*
the summary variable** does **NOT** work (treats the symptom).
- why: it can match the marginal shape while ignoring the structure that produced it.
- conditions: applies when the response is a derived quantity whose primitives are available.
- tier: 🟡 · source: mc-stan:39096, mc-stan:17283
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a posterior/predictive plausibility check on the support of the outcome and flag the likelihood misspecification"

**✗ E4** · when **x is stochastic (uncontrolled) but you treat it as a fixed covariate** for causal / *[→ entry](../recs/CC-model-evaluation/E4.md)*
counterfactual claims → does **NOT** work.
- why: the controlled model π(y,θ;x) and uncontrolled π(y,x,θ₁,θ₂) can be identical conditionals for y|x, but only the controlled one supports intervention conclusions; the uncontrolled case needs π(x|θ₁) modeled explicitly.
- conditions: most important for causal/counterfactual claims; smaller practical difference in pure prediction where x varies similarly in future.
- tier: 🟢 · source: betanalpha:generative_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reduce to the minimal generative model and write out both candidate predictive distributions by hand for y=1 and y=0 cases"

**✓ E5** · when you need **coherent predictions for an unobserved / hypothetical measurement process** *[→ entry](../recs/CC-model-evaluation/E5.md)*
→ a **joint narratively-generative model** works; a **sequential "posterior-as-prior" hand-off** does
**NOT**.
- why: π(y₂|y₁) falls out of the joint posterior by marginalization; the sequential route needs the intractable marginal π(φ|y₁) in closed form and cannot jointly update shared parameters.
- conditions: the hypothetical process must share at least one component parameter with the realized one; joint cost can be prohibitive for large data (approximations exist but are explicit).
- tier: 🟢 · source: betanalpha:generative_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the problem: distinguish composability of the posterior distribution from composability of posterior computation" · "Add the historical-data likelihood raised to power a_0 as a power prior in the new Stan model"

**✗ E6** · when a **covariate exhibits spatial autocorrelation** → trusting its **coefficient's *[→ entry](../recs/CC-model-evaluation/E6.md)*
credible interval** does **NOT** work (overconfident).
- why: SA inflates the covariate's variance with duplicate information (effective n < n); the coefficient posterior contracts around a point and its intervals lose coverage — Bayesian and frequentist estimators fail identically.
- conditions: regression/GLM on spatially indexed data (CAR/ICAR/BYM or GP); worsens with SA strength and with alignment to the outcome's spatial trend.
- tier: 🟡 · source: mc-stan:17266, mc-stan:24567, mc-stan:15654
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: interval coverage rate drops well below nominal as covariate SA rises}
- moves: "Run on simulated data and on prior-predictive / increasing-N data and inspect the likelihood/posterior geometry"

**✗ E7** · when you **impute a missing RESPONSE and re-fit** on the imputed values → does **NOT** work *[→ entry](../recs/CC-model-evaluation/E7.md)*
(double-counts / conditions twice).
- why: a missing response carries no inferential information beyond what a single joint fit already extracts; feeding imputations back yields meaningless inferences.
- conditions: legitimacy hinges on the role of the missing variable — pure response (single relationship) vs covariate.
- tier: 🟡 · source: mc-stan:21644, mc-stan:5135
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Trace the data-flow in the formula: ask whether the observed dep ever enters depb's likelihood"

**✓ E8** · when a **COVARIATE is missing** → **imputing it** (joint submodel) works. *[→ entry](../recs/CC-model-evaluation/E8.md)*
- why: a covariate enters (at least) two relationships — predictor of the outcome and response in its own submodel — so imputing and using the imputations is valid.
- conditions: continuous covariate via `bf(Y ~ X1*mi(X2)) + bf(X2|mi() ~ …)`; discrete missing covariates need marginalization instead.
- tier: 🟡 · source: mc-stan:5135, pymc:12450
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Iterate through brms mechanisms for a phantom/latent predictor (mi() missing-data trick, multivariate bf() with set_rescor(FALSE), then nlf())"

**✓ E9** · when you want **some observations to count more than others** → **multiplying each *[→ entry](../recs/CC-model-evaluation/E9.md)*
observation's log-likelihood by its weight w** works (pseudo-count semantics).
- why: weights act on the likelihood with pseudo-count semantics (weight N == N duplicate rows), whether hand-written (`target += w*lpdf`) or via `weights(w)`.
- conditions: exact for integer weights, interpolating otherwise; not the varIdent variance-rescaling; survey/design weights raise separate calibration issues.
- tier: 🟡 · source: mc-stan:16152, mc-stan:4278, mc-stan:7589
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "evaluate cheap patches and reject the ones that change the model" · "contrast model block vs generated quantities"

**✗ E10** · when you **add log(w)** (instead of multiplying the log-lik) or expect **varIdent-style *[→ entry](../recs/CC-model-evaluation/E10.md)*
variance weights** → does **NOT** work.
- why: you MULTIPLY log p by w (exponentiating the density); adding log(w) is wrong, and likelihood weights behave nothing like per-group variance weights.
- conditions: use `sigma ~ group` when you actually want group-specific variance.
- tier: 🟡 · source: mc-stan:16152, mc-stan:4278
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "contrast model block vs generated quantities"

### F · Building the predictive / derived quantity (the "how you compute it" family)

**✗ F1** · when **generating a posterior predictive** → plugging in posterior draws of the **linear *[→ entry](../recs/CC-model-evaluation/F1.md)*
predictor / conditional mean** (`y_pred = a+bx`) does **NOT** work.
- why: the fitted linear predictor is E[y|x,θ] and carries only parameter uncertainty; the posterior predictive additionally convolves the observation/sampling distribution (including σ uncertainty), so it is wider.
- conditions: any generative likelihood; the two coincide only for the posterior mean of a point forecast.
- tier: 🟡 · source: mc-stan:3169, mc-stan:31832
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred (expected probability, carries posterior uncertainty in the proportion) vs predict" · "Run prior predictive checks via sample_prior='only' + pp_check()/fitted()…"

**✓ F2** · when generating a posterior predictive → **drawing through the observation-level RNG** *[→ entry](../recs/CC-model-evaluation/F2.md)*
(`normal_rng(mu_i, sigma)`) works.
- why: it propagates both parameter uncertainty and the irreducible observation noise, so the draws match the empirical data's margins.
- conditions: applies to any generative likelihood (GLMs, AR(1), hierarchical).
- tier: 🟡 · source: mc-stan:3169, mc-stan:31832
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict"

**✗ F3** · when computing **predictive RMSE / intervals** → differencing data against *[→ entry](../recs/CC-model-evaluation/F3.md)*
**epred / linpred** does **NOT** work (too narrow).
- why: epred/linpred are the per-draw conditional MEAN, excluding residual noise; differencing y against them omits the irreducible variance and yields an RMSE distribution far too narrow and biased.
- conditions: any likelihood adding residual noise beyond the linear predictor; gap vanishes only in the noiseless case.
- tier: 🟡 · source: mc-stan:28502, mc-stan:13293, mc-stan:12240
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: epred-based RMSE distribution far too narrow (omits residual variance) · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict" · "Compute the true log pointwise predictive density from scratch (average the likelihood over posterior draws per observation, then log and sum)"

**✓ F4** · when you need **full predictive uncertainty** → **`posterior_predict`** (which injects the *[→ entry](../recs/CC-model-evaluation/F4.md)*
likelihood's residual noise) works.
- why: it returns draws from the full posterior predictive distribution, not the conditional mean.
- conditions: mind `scale=` for non-identity links; time-series terms may need the full series.
- tier: 🟡 · source: mc-stan:28502, mc-stan:13293
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict"

**✗ F5** · when **extrapolating a regression** → reading the auto-widening **"bow-tie" fan** as full *[→ entry](../recs/CC-model-evaluation/F5.md)*
predictive uncertainty does **NOT** work.
- why: the fan reflects only slope/intercept (parameter) uncertainty; it systematically under-estimates true predictive uncertainty because it cannot account for model-form misspecification outside the data.
- conditions: extrapolation / sparse interpolation where the functional form is an assumption, not a law.
- tier: 🟡 · source: pymc:5824
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: bow-tie fan under-estimates true predictive uncertainty outside the data}
- moves: "Check whether the data span the region that informs the weakly-constrained parameters"

**✗ F6** · when summarizing a **nonlinear function f(θ)** (covariance→correlation, inverse, eigen, *[→ entry](../recs/CC-model-evaluation/F6.md)*
ratios) → applying **f to the posterior mean** does **NOT** work (Jensen).
- why: f(E[θ]) ≠ E[f(θ)]; `cov2cor(mean(Σ_draws))` is not the posterior of the correlation matrix.
- conditions: any nonlinear post-processing of draws; irrelevant for affine transforms.
- tier: 🟡 · source: mc-stan:23944, mc-stan:6910
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compute the true log pointwise predictive density from scratch (average the likelihood over posterior draws per observation, then log and sum)"

**✓ F7** · when summarizing **f(θ)** → **applying f inside each draw then summarizing** the ensemble *[→ entry](../recs/CC-model-evaluation/F7.md)*
works.
- why: compute C_s = cov2cor(Σ_s) per draw and summarize element-wise, or carry C_s forward into any further nonlinear step.
- conditions: applies to covariance→correlation, precision, decompositions, log/exp, ratios.
- tier: 🟡 · source: mc-stan:23944, mc-stan:6910
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compute the true log pointwise predictive density from scratch (average the likelihood over posterior draws per observation, then log and sum)"

**✓ F8** · when you **marginalized a discrete latent z** out for HMC → recovering its posterior as the *[→ entry](../recs/CC-model-evaluation/F8.md)*
**data-conditioned membership E[z|θ,y]** works; **E[z|θ]** (prior-side) does **NOT**.
- why: marginalizing replaces the target with a data-conditioned mixture; recovery requires Bayes' rule from the same per-component densities, conditioned on both θ AND the observed data.
- conditions: mixture / zero-inflation / change-point / HMM state; exact when components are available in closed form.
- tier: 🟡 · source: mc-stan:22488
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "contrast model block vs generated quantities" · "diagnose the failed implementation against the actual domain of z"

**✓ F9** · when computing **marginal effects from random-slope / correlated-RE models** → deriving the *[→ entry](../recs/CC-model-evaluation/F9.md)*
quantity **per draw and averaging over the empirical covariate/RE distribution BEFORE summarizing**
works.
- why: order of operations is load-bearing — AME (average per-unit predictions) ≠ MEM (average covariates first); nonlinear links make them diverge.
- conditions: nonlinear/non-identity link; summaries formed from posterior draws of derived quantities.
- tier: 🟡 · source: mc-stan:24172, mc-stan:3914, mc-stan:11531
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict"

**✗ F10** · when a **constraint is imposed via `pm.Potential`** (e.g. −inf outside a range) → *[→ entry](../recs/CC-model-evaluation/F10.md)*
expecting **prior/posterior predictive sampling to honor it** does **NOT** work.
- why: a Potential modifies only the inference logp; it is not part of the generative graph, so predictive sampling re-draws the RV unconstrained and produces out-of-range draws / overshooting PPC plots.
- conditions: any constraint expressed via Potential rather than baked into the RV; NUTS/SMC respect it, only forward-sampling ignores it.
- tier: 🟡 · source: pymc:4537, pymc:10937, pymc:14280
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Forward-sample the suspect variable (pm.draw) and/or run prior predictive sampling and inspect support and finiteness." · "evaluate cheap patches and reject the ones that change the model"

**✗ F11** · when **predicting a GP at new inputs X\*** via generic `Predictive` / `set_data` on a *[→ entry](../recs/CC-model-evaluation/F11.md)*
latent GP → does **NOT** work (silently returns the prior).
- why: a GP is non-parametric — the predictive at X* depends on the full joint posterior of the latent function over the TRAINING inputs plus the training data, not just kernel hyperparameters; the generic machinery wrongly factorizes and collapses toward the prior with no error.
- conditions: exact/latent GP where test inputs differ from training; does NOT apply to HSGP or ordinary parametric regression.
- tier: 🟡 · source: pyro:3868, pymc:11887, pymc:6229
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Forward-sample the suspect variable (pm.draw) and/or run prior predictive sampling and inspect support and finiteness." · "Reframe the problem: distinguish composability of the posterior distribution from composability of posterior computation"

**✓ F12** · when **predicting a GP at new inputs** → **explicitly conditioning on the training data** *[→ entry](../recs/CC-model-evaluation/F12.md)*
(recompute cross-covariance K(X_train,X\*), apply the analytic posterior-predictive equations) works.
- why: a GP defines a joint Gaussian over all locations; the fit alone gives nothing at new x — you must condition through the same kernel/hyperparameters.
- conditions: stationary kernel; `gp.conditional`/`gp.predict` in PyMC, explicit equations in Stan.
- tier: 🟡 · source: mc-stan:16891, mc-stan:5442, pymc:1299
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the problem: distinguish composability of the posterior distribution from composability of posterior computation"

**✗ F13** · when interpreting **latent / penalized / transformed parameters from the raw parameter *[→ entry](../recs/CC-model-evaluation/F13.md)*
table** (spline coeffs, dispersion φ, RE correlations) → does **NOT** work.
- why: these have no direct domain meaning; the substantive answer lives in posterior-predictive functionals and plotted effects (interpret the smooth via conditional_smooths, convey φ by sampling the predictive).
- conditions: acute for bounded/skewed outcomes and weak likelihoods where structural params are poorly identified.
- tier: 🟡 · source: mc-stan:22426, mc-stan:34470, mc-stan:16703
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict" · "Clarify the units/semantics of the plot and pick a discrete-appropriate ppc geometry"

**✗ F14** · when reading a **factor's effect off the reference / baseline level** → does **NOT** work. *[→ entry](../recs/CC-model-evaluation/F14.md)*
- why: with default treatment coding the intercept and "conditioned" predictions correspond to the reference category, confounding the factor's effect with whichever level is baseline; marginalize (average) over levels for a population-average effect.
- conditions: categorical predictor under treatment coding; hierarchical factors add a shrinkage-repartition caveat when refitting without the term.
- tier: 🟡 · source: mc-stan:5323, mc-stan:19673
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict"

**✗ F15** · when inferring a **difference between two conditions from overlap of their marginal *[→ entry](../recs/CC-model-evaluation/F15.md)*
credible intervals** → does **NOT** work.
- why: it is the Bayesian counterpart of the overlapping-CI fallacy — two intervals can overlap while the posterior of their *difference* excludes zero; compute the formal contrast and summarize it.
- conditions: most acute when the compared parameters are posteriorly correlated and the model is nonlinear (ordinal/logistic).
- tier: 🟡 · source: mc-stan:33728
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict"

**✓ F16** · when a **strong predictor's population joint distribution is unknown** in MRP → **include *[→ entry](../recs/CC-model-evaluation/F16.md)*
it in the multilevel model** (so it shrinks the varying intercepts) but **do NOT poststratify over
it**; use **MrsP / raking** when only marginals exist.
- why: the predictor still helps inference via shrinkage even though it cannot be a poststratification dimension.
- conditions: MRP for survey/nonresponse/prevalence; raking fallback when the joint is unknown but marginals are available.
- tier: 🟡 · source: mc-stan:13028, mc-stan:37666
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict"

**✗ F17** · when **poststratifying over a covariate whose population joint distribution is unknown** → *[→ entry](../recs/CC-model-evaluation/F17.md)*
does **NOT** work.
- why: poststratification reweights predictions by population cell sizes; a variable with no known N_j cannot be in the frame.
- conditions: choosing poststratification dimensions.
- tier: 🟡 · source: mc-stan:13028, mc-stan:37666
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict"

### G · Model comparison mechanics (LOO / WAIC / stacking / selection)

**✗ G1** · when reading **`lp__` / `target` as the pointwise log-likelihood** for LOO/WAIC → does *[→ entry](../recs/CC-model-evaluation/G1.md)*
**NOT** work.
- why: `target +=` only increments the total log prob; nothing pointwise is saved. Recompute per-unit contributions in generated quantities (cheap: once per iteration, not autodiffed); the droppable-constant rules for the model-block target do NOT transfer.
- conditions: whenever the log_lik vector is assembled by hand.
- tier: 🟡 · source: mc-stan:32502, mc-stan:11993, mc-stan:37577
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "contrast model block vs generated quantities" · "Compute the true log pointwise predictive density from scratch (average the likelihood over posterior draws per observation, then log and sum)"

**✗ G2** · when the **CV unit leaves the rest conditionally dependent** (time-series / HMM / *[→ entry](../recs/CC-model-evaluation/G2.md)*
state-space) → **leave-one-row LOO** does **NOT** work.
- why: PSIS-LOO needs the data conditionally independent at the leave-out granularity; leaving out one row of a dependent series does not leave the rest conditionally independent, so the unit is wrong.
- conditions: choose the CV unit where the likelihood factorizes; use leave-future-out / grouped folds for dependent structure.
- tier: 🟡 · source: mc-stan:11993, mc-stan:37577
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Fall back to brute-force K-fold cross-validation; choose the fold-splitting scheme by the prediction goal"

**✗ G3** · when computing **elpd by a global `mean(exp())` over the flattened S×n matrix** (or in the *[→ entry](../recs/CC-model-evaluation/G3.md)*
raw-likelihood domain) → does **NOT** work.
- why: correct elpd is Σ_i log((1/S)Σ_s p(y_i|θ_s)) — a log-sum-exp over draws *within* each unit (minus log S), THEN summed over units; the global mean collapses the per-point densities.
- conditions: any pointwise-log-lik CV; matters for non-exchangeable data.
- tier: 🟡 · source: mc-stan:3570, mc-stan:5207, mc-stan:34693
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compute the true log pointwise predictive density from scratch (average the likelihood over posterior draws per observation, then log and sum)"

**✗ G4** · when using **exact LOO to assess adding a covariate** in a model with **~one RE per *[→ entry](../recs/CC-model-evaluation/G4.md)*
observation** (effective params ≈ N) → does **NOT** work.
- why: each left-out point's own RE predicts it almost regardless of the covariate, so LOO barely changes; PSIS-LOO is also unreliable (high Pareto-k).
- conditions: OLRE, network meta-analysis, few obs/subject; fine when groups have many observations each.
- tier: 🟡 · source: mc-stan:12335, mc-stan:30254, mc-stan:36639
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read the headline LOO diagnostics first: compare p_loo against N and against the nominal parameter count" · "Compute p_loo and compare it against the actual number of parameters p and the sample size n (the p_loo-vs-p / p-vs-n/5 decision tree)"

**✓ G5** · when you have **per-observation REs** → **integrating out the RE** (conjugate mixing: *[→ entry](../recs/CC-model-evaluation/G5.md)*
Gamma→NegBin, Beta→beta-binomial) or **grouped K-fold** chosen by the prediction goal works.
- why: marginalizing removes the "each point predicts itself" degeneracy; K-fold sidesteps unreliable importance sampling.
- conditions: conjugate mixing form for the integrate-out route; folds matched to the prediction target.
- tier: 🟡 · source: mc-stan:12335, mc-stan:36639
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Fall back to brute-force K-fold cross-validation; choose the fold-splitting scheme by the prediction goal"

**✗ G6** · when a held-out unit has **Pareto-k > 0.7** → treating it as a **sampler / convergence *[→ entry](../recs/CC-model-evaluation/G6.md)*
problem** does **NOT** work.
- why: k measures whether the leave-one-out posterior is close enough to the full-data posterior for importance sampling to bridge them; k>0.7 flags a highly *influential* held-out unit, not mixing and not (by itself) misspecification.
- conditions: PSIS-LOO/WAIC via loo/arviz; acute for hierarchical/latent-variable models and near-one-param-per-obs.
- tier: 🟡 · source: mc-stan:3446, mc-stan:22048, pymc:8256
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect those specific high-khat observations to understand why they are highly influential" · "Check the number of effective posterior draws (ESS) and whether khat is inflated by Monte Carlo variability"

**✓ G7** · when **Pareto-k > 0.7** → **triaging with the p_loo-vs-p decision tree** and then *[→ entry](../recs/CC-model-evaluation/G7.md)*
moment-matching / reloo (exact refit) / K-fold works.
- why: p_loo vs p vs n/5 tells you whether it is influence, flexibility, or misspecification; the fix replaces the failed importance-sampling step with exact computation.
- conditions: moment-matching may be unavailable in some toolchains, leaving reloo or K-fold.
- tier: 🟡 · source: mc-stan:3446, mc-stan:22048
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compute p_loo and compare it against the actual number of parameters p and the sample size n (the p_loo-vs-p / p-vs-n/5 decision tree)" · "Replace the failed importance-sampling step with exact computation, and/or reduce posterior flexibility"

**✗ G8** · when **`elpd_diff` exceeds several `se_diff` but is tiny in absolute terms** → declaring a *[→ entry](../recs/CC-model-evaluation/G8.md)*
winner does **NOT** work.
- why: the SE-ratio rule is necessary but not sufficient — a tiny absolute elpd_diff is negligible even at ratio 5 (canonical `elpd_diff=−0.5, se_diff=0.1` is "insignificant due to the small numbers"); the SE is also optimistic at small n or under misspecification.
- conditions: with large n, good PP checks, all k̂<0.7, apply the standard loo dual gate — a difference is meaningful only if **|elpd_diff| > 4 AND |elpd_diff/se_diff| > 2** (Vehtari et al. convention); the absolute-size gate (not a bespoke ~4–5× ratio) is the operative point here.
- tier: 🟡 · source: mc-stan:1628, mc-stan:16300, mc-stan:3417
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read elpd_diff against its SE and reason about the direction of PSIS-LOO bias"

**✗ G9** · when **stacking / `az.compare` weights disagree with the elpd ranking** → treating it as a *[→ entry](../recs/CC-model-evaluation/G9.md)*
bug does **NOT** work.
- why: stacking weights optimize the AVERAGED model's predictive performance, rewarding each model's MARGINAL contribution; a model that ranks well on elpd but is predictively redundant gets near-zero weight — expected, not a bug.
- conditions: most visible with overlapping/redundant models or when elpd differences are small vs their SE.
- tier: 🟡 · source: pymc:4658, pymc:13751, mc-stan:21390
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the importance-weight distribution via the Pareto k diagnostic for each alternative specification"

**✓ G10** · when **combining models for prediction** → **stacking predictive distributions** (sample *[→ entry](../recs/CC-model-evaluation/G10.md)*
from each model in proportion to its weight and pool) works; **averaging shared-parameter point
estimates** does **NOT**.
- why: stacking combines predictive distributions, not parameter vectors; averaging a shared parameter is meaningful only if it means the same thing across models.
- conditions: average rather than select unless one weight ≈ 1; nested-CV needed for an honest performance estimate of the stacked model.
- tier: 🟡 · source: mc-stan:6774, mc-stan:10869, mc-stan:18602
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the importance-weight distribution via the Pareto k diagnostic for each alternative specification"

**✗ G11** · when **selecting predictors by independently refitting each submodel and keeping the *[→ entry](../recs/CC-model-evaluation/G11.md)*
LOO-best** → does **NOT** work (overfits the CV estimate).
- why: removing terms to improve LOO is itself a search over models; the apparent gain is largely noise and more comparisons overfit CV. Use projection-predictive selection (projpred), where every submodel is a projection of one reference fit.
- conditions: Bayesian regression/GLM(M) feature selection; assumes a sensible full reference model.
- tier: 🟡 · source: mc-stan:12866, mc-stan:18721, mc-stan:28952
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Surface and flag post-hoc model selection as a separate, deeper hazard than prior tuning" · "Inspect the importance-weight distribution via the Pareto k diagnostic for each alternative specification"

**✗ G12** · when reading a **projpred forward-search path as an interpretable model formula** → does *[→ entry](../recs/CC-model-evaluation/G12.md)*
**NOT** work.
- why: the search minimizes predictive KL from the reference model, so it can select an interaction before its main effects; the path does not respect statistical marginality and is not a formula. Constrain the search (formula-aware / `search_terms`) if you need marginality.
- conditions: candidate set contains interactions/smooths/group effects; acute in plain GLM reference models.
- tier: 🟡 · source: mc-stan:14893, mc-stan:40885, mc-stan:18954
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "isolate the offending term by ablation"

**✗ G13** · when **scoring prediction intervals by coverage fraction (CVG)** → does **NOT** work *[→ entry](../recs/CC-model-evaluation/G13.md)*
(ill-defined).
- why: CVG conflates a multiple-testing problem with a single calibration statement and depends on an unspecified asymptotic regime; the Interval Score (INT), a proper scoring rule penalising non-coverage AND lack of sharpness, strictly subsumes it (use CRPS for a full predictive distribution).
- conditions: any benchmark reporting a single CVG scalar across n sites.
- tier: 🟢 · source: dansblog:barry-gibb
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: CVG (coverage fraction) is the ill-defined metric here → replace with the Interval Score}
- moves: "Anchor the empirical result against established theory and reframe the question as 'why might this specific eval fail to show the expected benefit'"

**✓ G14** · when **updating a fitted posterior with a modest amount of new data** → **PSIS-reweighting *[→ entry](../recs/CC-model-evaluation/G14.md)*
the old draws** (old posterior as proposal, new-data likelihood as weights, resample) works — instead
of refitting.
- why: it is importance sampling with the old posterior as proposal — the same machinery loo/PSIS uses; validity is governed by how far the posterior moves, not the raw count of new points.
- conditions: updated posterior must lie within the well-covered support of the old draws; check Pareto-k and refit if it fails.
- tier: 🟡 · source: mc-stan:37196
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Replace the failed importance-sampling step with exact computation, and/or reduce posterior flexibility" · "Enumerate solution families keyed on dimensionality of the unknown and whether to reuse draws or refit"

### H · Bayes factors, R², and testing (scalar summaries)

**✗ H1** · when computing a **Bayes factor on an estimation-prior fit** (e.g. rstanarm defaults) → *[→ entry](../recs/CC-model-evaluation/H1.md)*
does **NOT** work.
- why: a BF is a contest between the two models' PRIOR predictive distributions, so it depends strongly on prior scale even where the posterior/estimation is essentially prior-independent; any improper prior makes the BF undefined.
- conditions: bridgesampling/bayes_factor; bites hardest with diffuse/weakly-informative defaults and nested comparisons; does not apply to predictive comparison.
- tier: 🟡 · source: mc-stan:2532, mc-stan:11977
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Push the prior through the model (prior predictive) and plot the implied prior on the outcome, AND audit the data for covariate combinations…" · "evaluate cheap patches and reject the ones that change the model"

**✗ H2** · when **trusting a bridge-sampling Bayes factor after the MCMC has converged** → does **NOT** *[→ entry](../recs/CC-model-evaluation/H2.md)*
work (unstable).
- why: the estimate carries two compounded MC-error layers (posterior sampling error plus the bridge sampler's own error); posterior convergence is necessary but not sufficient, and stabilizing needs ~10× more draws than posterior means/intervals.
- conditions: acute for hierarchical/random-effects models and point-null tests; N/A for analytic marginal likelihoods.
- tier: 🟡 · source: mc-stan:4469
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Check the number of effective posterior draws (ESS) and whether khat is inflated by Monte Carlo variability"

**✓ H3** · when **assessing whether an effect is non-negligible** → a **directional posterior *[→ entry](../recs/CC-model-evaluation/H3.md)*
probability P(β>0)** or a **ROPE statement P(|β|<δ)** works (robust under default priors); a
**point-null Bayes factor** does **NOT**.
- why: a sharp point null β=0 is degenerate (P(β=0)=0 under any continuous prior) and the BF is strongly prior-dependent and even sensitive to factor coding; directional/ROPE probabilities are stable under default priors.
- conditions: ROPE needs a domain-chosen threshold δ; use orthonormal contrasts to test categorical main effects.
- tier: 🟡 · source: mc-stan:4847, mc-stan:22364, mc-stan:12057
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Anchor the empirical result against established theory and reframe the question as 'why might this specific eval fail to show the expected benefit'" · "Push the prior through the model (prior predictive) and plot the implied prior on the outcome…"

**✗ H4** · when reporting a **single "Bayesian R²"** for a mixed model → does **NOT** work. *[→ entry](../recs/CC-model-evaluation/H4.md)*
- why: residual-based Var(pred)/(Var(pred)+Var(pred−y)) (brms/rstantools) and model-based Var(pred)/(Var(pred)+σ²) (rstanarm) disagree in magnitude AND can reverse the conditional>marginal ordering.
- conditions: reversal is specific to mixed models (the RE variance term); the two coincide for ordinary linear regression.
- tier: 🟡 · source: mc-stan:20461
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict"

**✗ H5** · when **comparing Bayesian R² across likelihood families** (binomial vs row-expanded *[→ entry](../recs/CC-model-evaluation/H5.md)*
Bernoulli, or any two families) → does **NOT** work.
- why: response-scale R² is observation-model-dependent — the same data with identical coefficients give different R² because the residual-variance term and response scale differ; use the latent (McKelvey–Zavoina) scale for cross-model comparison.
- conditions: non-identity link (logit/probit binomial, Bernoulli, ordinal); N/A for Gaussian.
- tier: 🟡 · source: mc-stan:7420, mc-stan:14752, mc-stan:33187
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Check likelihood-family / parameterization coherence (acat vs cumulative)"

**✗ H6** · when a **(1|group) intercept dominates the variance partition** (high ICC / R²) → dropping *[→ entry](../recs/CC-model-evaluation/H6.md)*
it "to free variance for covariates" does **NOT** work.
- why: adding genuinely predictive covariates *reattributes* variance away from the RE while total explanatory power rises; dropping the intercept discards the grouping structure and leaves within-group residual correlation.
- conditions: hierarchical regression with a dominant (1|group) term and few/no covariates.
- tier: 🟡 · source: mc-stan:33138
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "isolate the offending term by ablation"

### I · The evaluation machinery itself (diagnostics, proofs, benchmarks, primitives)

**✗ I1** · when a **single PSIS k̂ call lands near 0.7** (VI-guide / IS gate) → trusting one call does *[→ entry](../recs/CC-model-evaluation/I1.md)*
**NOT** work.
- why: k̂ is computed from a finite sample of importance weights — a random variable, not a fixed property; repeated calls on the same data/guide spread by O(0.1–0.4), its SD shrinking only ~√(particles). Average across calls or raise the particle count.
- conditions: acute when the point estimate is near the accept/reject threshold at low particle count.
- tier: 🟡 · source: pyro:3270
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: k̂ spread −0.16 to +0.25 across repeated calls at 1000 particles on identical data/guide}
- moves: "Check the number of effective posterior draws (ESS) and whether khat is inflated by Monte Carlo variability" · "Audit the ESS/R-hat estimators themselves rather than trusting the reported numbers"

**✗ I2** · when **reusing Bickel (1967)'s E(r²) order-statistic bound as published** → does **NOT** *[→ entry](../recs/CC-model-evaluation/I2.md)*
work.
- why: the published derivation is missing a factor S, which flips the bound from bounded to converging-to-zero; the corrected bound still yields the needed finite result but the naive one is qualitatively wrong. Sense-check proofs — "even if a famous person did it in the 60s".
- conditions: the E(r_{k:M}²) bound used in the WIS/PSIS convergence proof for Pareto-tailed order statistics.
- tier: 🟢 · source: dansblog:that-psis-proof
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Anchor the empirical result against established theory and reframe the question as 'why might this specific eval fail to show the expected benefit'"

**✗ I3** · when the integrand **H can be both positive and negative** → **single-sided Winsorization of *[→ entry](../recs/CC-model-evaluation/I3.md)*
the importance ratio R** does **NOT** work.
- why: you must Winsorize the *product* RH from both above and below (Griffin 1988's asymptotic normality is specifically for doubly-Winsorized IS); single-sided WIS/PSIS can fail in this regime.
- conditions: H takes both signs in the tail region of R.
- tier: 🟢 · source: dansblog:that-psis-proof
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Replace the failed importance-sampling step with exact computation, and/or reduce posterior flexibility"

**✓ I4** · when **designing a method-comparison benchmark** → **including an author from each compared *[→ entry](../recs/CC-model-evaluation/I4.md)*
team** works (best available fairness guarantee).
- why: it prevents the structural problem of authors understanding some methods better than others and lets each team flag incorrect/suboptimal usage of their method.
- conditions: addresses the understanding-asymmetry failure mode only; problem-scale, likelihood-choice, single-realisation and metric-choice failures are separate.
- tier: ⚪ candidate · source: dansblog:barry-gibb
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the benchmark's engine configuration for handicaps that bias against the conditional/discrete sampler" · "Re-derive the right efficiency metric and check walltime for measurement contamination"

**✓ I5** · when you **need log|Q| for a Cholesky-factored sparse SPD matrix** (marginal-likelihood / *[→ entry](../recs/CC-model-evaluation/I5.md)*
density evaluation) → **reading it off as 2·Σ_i log L_ii** works (free byproduct).
- why: the log-determinant is a byproduct of the Cholesky already computed for the linear solve, not a separate O(n³) computation; for block-diagonal Q it decomposes further into cheap sub-determinants.
- conditions: matrix SPD and already factored; for dense MVN the advantage is largest at large N / ill-conditioned Σ.
- tier: 🟢 · source: dansblog:linear-mixed-effects, betanalpha:probability_densities
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Pick a density-approximation family matched to the parameter geometry"

**✗ I6** · when a **sparse-matrix class lazily caches its Cholesky via a mutable boolean flag** → does *[→ entry](../recs/CC-model-evaluation/I6.md)*
**NOT** work under JAX / Stan.
- why: JAX requires pytree leaves to be immutable and Stan requires stateless objects; a flag that changes value during tracing corrupts the trace. Compute eagerly at construction (or restructure to avoid state-dependent branching).
- conditions: JAX JIT/autodiff or Stan; eager computation fully resolves it for fixed sparsity patterns.
- tier: 🟢 · source: dansblog:sparse-matrices-4
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "evaluate cheap patches and reject the ones that change the model"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
modeling_and_inference · principled_bayesian_workflow · generative_modeling · taylor_models ·
general_taylor_models · variate_covariate_modeling · brownian_bridge · falling ·
stochastic_differential_equations · survival_modeling · probability_densities

**Dan Simpson blog** (`dansblog:<id>` → `https://dansblog.netlify.app/posts/…`):
that-psis-proof · barry-gibb (`barry-gibb-came-fourth-in-a-barry-gibb-look-alike-contest-repost`) ·
linear-mixed-effects (`a-linear-mixed-effects-model`) ·
sparse-matrices-4 (`design-is-my-passion-sparse-matrices-part-four`) ·
monkey (`everybodys-got-something-to-hide-except-me-and-my-monkey`)

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pymc:N` → `https://discourse.pymc.io/t/…/N`;
`pyro:N` → `https://forum.pyro.ai/t/…/N`).

**✓ G15** · when **comparing candidate models by predictive fit** → running **`az.compare` and reading *[→ entry](../recs/CC-model-evaluation/G15.md)*
its `rank / elpd / elpd_diff / dse` table** works as the decision procedure.
- why: az.compare ranks the models and reports each model's elpd, the elpd difference to the best model (elpd_diff), and the standard error of that difference (dse); the pymc-native decision rule is that models whose elpd_diff falls within ~2·dse are statistically **indistinguishable**, so no winner can be declared among them.
- conditions: treat the threshold as a **soft heuristic, not a hard cutoff** — Stan-side guidance is often stricter (~4·se); this operationalizes the abstract G6/G7/G8 rules and complements G8's dual gate (the ~2·dse indistinguishability band is the pymc-side framing of the same comparison).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ G16** · when **choosing HOW to weight models for a combined predictive** → matching the **weighting *[→ entry](../recs/CC-model-evaluation/G16.md)*
scheme to the goal — stacking (default) / Pseudo-BMA+ / equal weights** works.
- why: stacking is the default — it minimizes the KL from the true predictive to the weighted mixture and is best when the true model is NOT in the candidate set; Pseudo-BMA+ (a Bayesian-bootstrap of elpd, `az.compare(method='BB-pseudo-BMA')`) is the choice when you want uncertainty OVER the weights; equal weights is the choice when the models encode distinct scientific hypotheses you want to average over.
- conditions: extends G9/G10 (which cover stacking-weights-vs-elpd-ranking and pooling predictive draws) with the alternative weighting schemes; the scheme is a modeling decision about what the combination should optimize, not a diagnostic read-off.
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ A8** · when you need to **check whether the predictive is CALIBRATED** (not just shape-matched, and *[→ entry](../recs/CC-model-evaluation/A8.md)*
without held-out data) → **LOO-PIT** (`az.plot_loo_pit`) works.
- why: LOO-PIT scores each observation's predictive PIT under a fit that EXCLUDES that observation, so it is more sensitive than a plain posterior-predictive check; the histogram shape reads out the miscalibration mode directly.
- conditions: interpretation table — uniform / diagonal = well-calibrated; U-shape = underdispersed / overconfident (predictions too narrow); inverted-U = overdispersed / underconfident (too wide); S-curve / skew = systematic bias. A distinct evaluation axis (calibration) from A2's PPC shape-envelope check; API `az.plot_loo_pit` (ArviZ-next `azp.plot_loo_pit(dt, var_names=[...])`).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
