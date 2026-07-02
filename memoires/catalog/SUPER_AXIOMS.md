# Super-axioms — the apex (the leanest *why*)
*7 grand principles over the 87 mid-level claims (6 data-clustered from the original 76 + SA7 added when the pymc-labs merge supplied sources for the workflow/elicitation gap). Each subsumes a cluster of mid-level claims below it.*

### SA1 · The model is the object of inference; computation only certifies faithfulness to it
Every posterior is conditional on a chosen model — prior × likelihood — and that choice is a substantive, non-neutral commitment, not a neutral default: there are no non-informative priors, a prior acts on the model's internal (link/transform) scale rather than the natural quantity, and the generative structure of the likelihood fixes which questions are even answerable. Because a model's geometry and its answerable set are properties *of that model*, clean computation (zero divergences, R̂≈1, adequate ESS) certifies only that the sampler faithfully represents the model — never that the model captures the data-generating process, and some misspecification is invisible even to predictive checks. Adequacy must therefore be judged model-ward, derived and predictive quantities must be pushed through the full generative process before summarizing, and any link to a population or causal estimand requires extra-Bayesian structure the fit cannot supply.
**Subsumes:**
- [CC-geometry-sampling C1](claims/CC-geometry-sampling/C1.md) · Geometry belongs to the *model*, not the sampler
- [CC-geometry-sampling C7](claims/CC-geometry-sampling/C7.md) · Beneath geometry sits a *machinery* layer whose failures masquerade as geometry
- [CC-priors-identifiability C3](claims/CC-priors-identifiability/C3.md) · "Non-informative" priors are a myth; the weakly-informative alternative is deliberate scale/shape/tail engineering
- [CC-priors-identifiability C4](claims/CC-priors-identifiability/C4.md) · A prior lives on the model's *internal* (parameterized) scale, not the natural scale
- [CC-priors-identifiability C7](claims/CC-priors-identifiability/C7.md) · Parameters are "polite fictions"; linking a posterior to a population/causal estimand needs extra-Bayesian structure
- [CC-model-evaluation C1](claims/CC-model-evaluation/C1.md) · Clean computation certifies the sampler, not the model — evaluation must go model-ward
- [CC-model-evaluation C3](claims/CC-model-evaluation/C3.md) · Generative structure fixes what the posterior can answer, independent of fit quality
- [CC-model-evaluation C4](claims/CC-model-evaluation/C4.md) · Predictive/derived quantities must be built by pushing each posterior draw through the full generative process
- [CC-model-evaluation C6](claims/CC-model-evaluation/C6.md) · Hypothesis tests and single-number summaries (Bayes factors, R², variance partitions) are prior-fragile or definition-dependent
- [mixture C5](claims/mixture/C5.md) · Where the mixture lives dictates how you treat it — marginalize the assignment, decompose the observation
- [time-series-state-space C3](claims/time-series-state-space/C3.md) · Discrete latent states must be marginalized out
- [measurement-error-missing C3](claims/measurement-error-missing/C3.md) · The Bayesian repair for non-ignorable selection is to model the randomization and impute via the posterior predictive
- [regression C6](claims/regression/C6.md) · BART models an unknown regression function as a sum of m weak, regularized trees — a nonparametric mean with no kernel or basis to choose
- [time-series-state-space C6](claims/time-series-state-space/C6.md) · A structural time series decomposes additively into interpretable latent components (trend/seasonal/noise), each with its own state-noise scale
- [measurement-error-missing C6](claims/measurement-error-missing/C6.md) · Censoring and truncation are distinct likelihood treatments — censoring integrates tail mass at the bound (CDF, N fixed), truncation renormalizes by P(in-bounds) (N varies)
- [regression C7](claims/regression/C7.md) · Match the observation model to the data's generative structure, not it
- [time-series-state-space C7](claims/time-series-state-space/C7.md) · Time-varying volatility is a first-class modeling target — give the co
- [measurement-error-missing C7](claims/measurement-error-missing/C7.md) · Inference and decision are separate stages — turning a solved posterio

### SA2 · A conditional model answers a population or causal question only through its variate–covariate coupling
"Regression" names a narrow structure — a location-based conditional variate model with no parameter shared with the covariate-generating process and a homogeneous configuration across observations — so its load-bearing failures (confounding, non-ignorable selection/missingness, a spatially autocorrelated covariate) are properties of the *coupling* between the conditional and covariate processes, not of any single component, and are invisible to every within-model check. Which variable is modeled and which is conditioned on is a deliberate, application-driven partition rather than a matter of generative priority, and the reported estimand — conditional vs marginal, latent vs response scale, per-draw vs averaged — is itself a choice with no single right number. Even the model's own geometry can mislead: ridges in the linear predictor split into look-alike but mechanistically opposite regimes (non-identifiability, cured only by a regularizing prior, vs ill-conditioning, cured by a coordinate transform).
**Subsumes:**
- [regression C1](claims/regression/C1.md) · Regression is a narrow special case of variate–covariate modeling — confounding is *parameter coupling*, invisible to internal checks
- [regression C3](claims/regression/C3.md) · Ridges/funnels in the linear predictor split into two look-alike regimes with opposite fixes (non-identifiability vs ill-conditioning)
- [regression C5](claims/regression/C5.md) · Derived quantities, predictions, and effect summaries are definition- and estimand-dependent
- [spatial-areal C5](claims/spatial-areal/C5.md) · Spatial autocorrelation in a *covariate* (not just the outcome) silently overstates coefficient confidence
- [measurement-error-missing C2](claims/measurement-error-missing/C2.md) · Missingness/selection correlated with the outcome process is non-ignorable — reintroduces confounding, breaks √n-consistency
- [measurement-error-missing C4](claims/measurement-error-missing/C4.md) · The variate/covariate partition is set by which component goes missing in the application, not by generative priority

### SA3 · A prior's scale is a design quantity; sparse regularization is concentration, not selection
A prior's informativeness — above all its scale — is not a free constant but a design-dependent quantity that must be calibrated to the experiment (N, number of covariates, expected effect structure) through several mechanistically independent channels; there is no scale-free default, and scaling to the design is principled, not cheating. Scale-mixture (sparse/shrinkage) priors are the canonical case: Bayesian sparsity is the *full posterior* concentrating near the sparse region, never a point-estimate selection, so it needs two distinct design-calibrated scales — a tight inner core and an escaping outer tail — plus a downstream decision rule, and for a scale-mixture *prior* the centered-vs-non-centered choice per parameter is set by where its likelihood concentrates. The funnel geometry such priors induce is intrinsic, a signal to diagnose rather than a knob (adapt_delta, treedepth) to turn up, and sparse models are built by disciplined nested expansion under valid warmup, not by force.
**Subsumes:**
- [CC-geometry-sampling C5](claims/CC-geometry-sampling/C5.md) · Likelihood-induced funnels have *no reparameterization analogue* — marginalize, regularizing slab, orthogonalize, or redesign
- [CC-priors-identifiability C5](claims/CC-priors-identifiability/C5.md) · Scaling a prior to the experimental design is principled, not cheating (GP length scales the sharpest case)
- [mixture C6](claims/mixture/C6.md) · A mixture can be a *prior*, not a likelihood — per-component parameterization by likelihood location
- [sparse-shrinkage C1](claims/sparse-shrinkage/C1.md) · Bayesian sparsity is posterior concentration, not selection — always needs a downstream decision rule
- [sparse-shrinkage C2](claims/sparse-shrinkage/C2.md) · A sparse prior needs two scales — every single-scale prior compromises and fails one side
- [sparse-shrinkage C3](claims/sparse-shrinkage/C3.md) · The global scale is a design-dependent quantity — calibrate to (N, M, expected sparsity)
- [sparse-shrinkage C4](claims/sparse-shrinkage/C4.md) · Sparsity pathology is intrinsic funnel geometry — diagnostics are signals to read, not knobs to turn
- [sparse-shrinkage C5](claims/sparse-shrinkage/C5.md) · Build sparse models by nested expansion under valid warmup — fix geometry before scaling
- [sparse-shrinkage C6](claims/sparse-shrinkage/C6.md) · Spike-and-slab is the gold standard for EXACT zeros — a discrete inclusion indicator builds the selection decision into the prior
- [sparse-shrinkage C7](claims/sparse-shrinkage/C7.md) · R2D2 puts the prior on variance explained (R²) — the total-variance budget as a named, off-the-shelf method

### SA4 · Posterior geometry and identifiability are structural; only re-representing the model cures them
The pathologies that stall gradient-based sampling — funnels, symmetry-induced multimodality, non-identifiability, unscalable dense covariance — are structural properties of the model's parameterization and likelihood, not defects of the sampler, so they are never cured by more tuning, cores, or iterations, and getting them wrong silently biases the posterior. The only cures are structural re-representations matched to the *specific* pathology: reparameterization (centered/non-centered chosen per level and per family), marginalizing discrete or conjugate-Gaussian latents (which strictly dominates non-centering), exact identifying constraints, or a structured low-rank / sparse-precision form — and each such device is itself a modeling decision that can be target-preserving or can silently change the model. Identifiability is a binary asymptotic property, but the *degeneracy* of the realized posterior is what actually bites, so priors must regularize, not merely permit.
**Subsumes:**
- [CC-geometry-sampling C4](claims/CC-geometry-sampling/C4.md) · Reparameterization is the primary geometry fix — regime-dependent, family-specific, not free; the metric is complementary
- [CC-geometry-sampling C6](claims/CC-geometry-sampling/C6.md) · Discrete/multimodal/moving-support structure is outside gradient samplers' reach — marginalize, reparameterize, or surrogate; never hard-reject
- [CC-priors-identifiability C1](claims/CC-priors-identifiability/C1.md) · Identifiability is binary and asymptotic; degeneracy is what bites — the prior must *regularize*, not merely permit
- [CC-priors-identifiability C2](claims/CC-priors-identifiability/C2.md) · Likelihood symmetries create structural, data-invariant multimodality — break the symmetry in the *model*
- [CC-priors-identifiability C6](claims/CC-priors-identifiability/C6.md) · The device that *breaks* a non-identifiability is itself a modeling decision — some exact, others silently change the model
- [CC-convergence-diagnostics C4](claims/CC-convergence-diagnostics/C4.md) · Two orthogonal axes — mixing (R̂) and tail-integrability (k̂); the expectand decides what is estimable
- [regression C2](claims/regression/C2.md) · Linear/polynomial regression is a *local Taylor approximation* — validity bounded by covariate support
- [hierarchical-multilevel C1](claims/hierarchical-multilevel/C1.md) · Hierarchical funnel geometry is intrinsic and load-bearing — sampler tuning can't cure it
- [hierarchical-multilevel C2](claims/hierarchical-multilevel/C2.md) · CP and NCP are exactly complementary and data-dependent — parameterize per-level
- [hierarchical-multilevel C3](claims/hierarchical-multilevel/C3.md) · With few groups the pathology moves up to the population scale τ, whose weakly-informed prior is load-bearing
- [hierarchical-multilevel C4](claims/hierarchical-multilevel/C4.md) · Partial pooling is the structural payoff — shrinkage artifacts are features, not bugs
- [hierarchical-multilevel C5](claims/hierarchical-multilevel/C5.md) · Hierarchical structure is riddled with identifiability degeneracies priors don't neutrally fix
- [mixture C1](claims/mixture/C1.md) · Label switching is a structural K! multimodality — a theorem, not a sampler failure
- [mixture C3](claims/mixture/C3.md) · The two fixes divide by exactness — ordering constraints provably exact; symmetry-breaking priors regime-dependent
- [mixture C4](claims/mixture/C4.md) · Overlapping components are a *second*, continuous non-identifiability that ordering does not cure
- [gaussian-process C1](claims/gaussian-process/C1.md) · GP covariance hyperparameters are only weakly/partially identified — principled priors are load-bearing
- [gaussian-process C2](claims/gaussian-process/C2.md) · The GP latent field is a high-dimensional funnel — whiten (NCP Cholesky) or marginalize; centered fails invisibly
- [gaussian-process C3](claims/gaussian-process/C3.md) · An exact dense GP does not scale — the fix is a *structured* representation, not harder sampler tuning
- [gaussian-process C4](claims/gaussian-process/C4.md) · A GP admits a sparse-precision (SPDE/FEM) form iff it is Markov — an exact spectral/RKHS property RBF lacks
- [gaussian-process C5](claims/gaussian-process/C5.md) · A GP is non-parametric — prediction/decomposition require explicit conditioning on the training data
- [time-series-state-space C1](claims/time-series-state-space/C1.md) · A discretized latent-state chain is a hierarchical-normal geometry problem — parameterize per-state, per-factorization
- [spatial-areal C1](claims/spatial-areal/C1.md) · Precision, not covariance, is the working representation for structured spatial models — with an exact boundary
- [spatial-areal C2](claims/spatial-areal/C2.md) · The GMRF precision parameterization silently decouples scalar τ from every elicitable quantity
- [spatial-areal C4](claims/spatial-areal/C4.md) · Identifying additive spatial effects requires a sum-to-zero constraint — the naïve constraint is a mis-scaled prior
- [latent-factor C3](claims/latent-factor/C3.md) · For correlated multi-category/compositional data, put the dependence in the model via correlated latent rates
- [latent-factor C4](claims/latent-factor/C4.md) · For latent-Gaussian models, marginalizing the latent field strictly dominates non-centering
- [ode-dynamical C1](claims/ode-dynamical/C1.md) · Continuous-time generative flows: reversibility is free, interior-time supervision is the scarce resource
- [ode-dynamical C3](claims/ode-dynamical/C3.md) · Dynamical-system inference is riddled with structural near-identifiabilities only physics/informative priors resolve

### SA5 · Diagnostics falsify; they never certify
Every convergence and HMC diagnostic (R̂, split-R̂, ESS, divergences, E-BFMI, tree-depth) is a *necessary* but never *sufficient* condition for equilibrium: each detects a mechanically distinct pathology, must be read by *location* and *origin* rather than by count or a fixed threshold, and is structurally blind to whatever the chains never visited. A clean read therefore rules out only the failures the diagnostic can see and is not a certificate of correctness — the failure can be entirely diagnostic-silent. The one guard against this shared blind spot is many chains launched from genuinely overdispersed starts, whose disagreement (inflated cross-chain R̂, dispersed scatter) is the only signal that survives when every single-chain diagnostic falls silent.
**Subsumes:**
- [CC-geometry-sampling C2](claims/CC-geometry-sampling/C2.md) · Divergences are read by *location* and *origin*, not count — and their *absence* is not a clean bill of health
- [CC-geometry-sampling C3](claims/CC-geometry-sampling/C3.md) · The diagnostics are distinct fingerprints, not interchangeable — each detects a different pathology, each with a calibration caveat
- [CC-convergence-diagnostics C2](claims/CC-convergence-diagnostics/C2.md) · Diagnostics are necessary-not-sufficient and structurally blind to what the chain never sampled
- [time-series-state-space C4](claims/time-series-state-space/C4.md) · Divergence *location*, not count, is the primary triage signal (geometrically explicable structural boundaries)

### SA6 · Every certificate is conditional and quantity-specific, and the evaluation apparatus is itself fallible
An inferential guarantee holds only conditionally and only for a specific quantity: a valid Monte-Carlo error bar requires a chain CLT for *that* expectand (geometric ergodicity plus integrability — stationarity alone does not give it), effective sample size and reliability are properties of the function evaluated rather than of the chain, and predictive comparison *ranks* models rather than certifying any, with its SE breaking as effective parameters approach N. The evaluation apparatus is itself fallible — diagnostics are noisy random variables, proofs and benchmarks carry errors, and "convergence" alarms can be arithmetic or plumbing artifacts — and each approximation regime (importance sampling, VI, perturbed MCMC) carries its own reliability question. The estimate answers the intended quantity only when the model's conditioning and observation structure is honored (initial conditions, measurement-response convolution, imputation accounting, per-iteration solver cost), so multiple overdispersed chains are mandatory and no clean summary number is self-validating.
**Subsumes:**
- [CC-model-evaluation C2](claims/CC-model-evaluation/C2.md) · All models are misspecified; adequacy is goal-relative, and asymptotic/relative certificates carry hidden conditions
- [CC-model-evaluation C5](claims/CC-model-evaluation/C5.md) · Predictive model comparison ranks (never certifies), demands the correct pointwise likelihood, breaks as effective params → N
- [CC-model-evaluation C7](claims/CC-model-evaluation/C7.md) · The evaluation apparatus is itself fallible — diagnostics are noisy MC estimates; proofs/benchmarks carry errors
- [CC-convergence-diagnostics C1](claims/CC-convergence-diagnostics/C1.md) · Convergence is not stationarity — a trustworthy error bar needs geometric ergodicity, expectand integrability, and equilibration
- [CC-convergence-diagnostics C3](claims/CC-convergence-diagnostics/C3.md) · Multiple overdispersed chains are the structural guard — "burn-in / discard the bad chains" is actively harmful
- [CC-convergence-diagnostics C5](claims/CC-convergence-diagnostics/C5.md) · ESS is a property of the *function*, and its estimators fail (overestimate) exactly when the sampler struggles most
- [CC-convergence-diagnostics C6](claims/CC-convergence-diagnostics/C6.md) · "Convergence" alarms can be diagnostic-plumbing artifacts — read the per-parameter table; build gates that can't silently pass
- [CC-convergence-diagnostics C7](claims/CC-convergence-diagnostics/C7.md) · Approximation-based inference (IS, VI, perturbed MCMC) carries its own reliability diagnostics
- [time-series-state-space C2](claims/time-series-state-space/C2.md) · A clean-running sampler faithfully represents its model — clean diagnostics validate the sampler, not the model
- [time-series-state-space C5](claims/time-series-state-space/C5.md) · The recursion is conditional — respect what it conditions on (initial condition; frozen-model filter)
- [latent-factor C2](claims/latent-factor/C2.md) · A many-to-one (additive) combination of latent components is generically non-identified — only the aggregate is informed
- [ode-dynamical C2](claims/ode-dynamical/C2.md) · Bayesian inference through an ODE likelihood — per-iteration cost is parameter-dependent; solver accuracy tuned jointly
- [measurement-error-missing C1](claims/measurement-error-missing/C1.md) · The observational model is the theoretical model convolved with the measurement response — censoring/binning/contamination are structural
- [measurement-error-missing C5](claims/measurement-error-missing/C5.md) · Imputation adds information only when the missing variable carries it — impute covariates, mask the log-probability
- [CC-geometry-sampling C8](claims/CC-geometry-sampling/C8.md) · The VI approximating family sets the uncertainty structure — mean-field is axis-aligned and overconfident; full-rank restores a dense covariance at O(d²) cost
- [CC-model-evaluation C9](claims/CC-model-evaluation/C9.md) · A model with no observed likelihood is a pure generative DAG — draw its prior by exact ancestral (forward) sampling, never by running MCMC on the unconditioned model
- [CC-geometry-sampling C9](claims/CC-geometry-sampling/C9.md) · Minibatch VI must rescale every subsampled term by N/b, or the ELBO is

### SA7 · Bayesian modeling is an iterative practice: build the model up one component at a time, and source each prior from substance
Model building is Box's loop, not a single fit: start from the simplest plausible model and let each posterior-predictive misfit motivate adding exactly ONE component at a time, because a complex model is understood only relative to the simpler models it nests and computational problems are far easier to localize in a simple model. A prior is sourced from substance rather than by feel — given elicited constraints (a bounded interval with a probability mass, or a set of moments), the maximum-entropy distribution is the unique least-committal choice consistent with them, where "least-informative" means least-informative *given the constraints*, not flat. And a prior stays falsifiable after the fit: prior-data conflict — a posterior piled against a prior boundary, a prior that disagrees with the posterior, boundary-concentrated divergences, or single-parameter low ESS — is a diagnosable post-fit situation whose repair is on the prior side (rescale or widen it from domain knowledge, or check the data for errors), never the sampler.
**Subsumes:**
- [CC-model-evaluation C8](claims/CC-model-evaluation/C8.md) · Model building is Box's loop — start simplest, let each posterior-predictive misfit motivate adding exactly ONE component, understand a complex model only relative to the simpler ones it nests
- [CC-priors-identifiability C8](claims/CC-priors-identifiability/C8.md) · Maximum-entropy priors are the least-committal distribution given elicited constraints — "least-informative" means given the constraints, not flat
- [CC-priors-identifiability C9](claims/CC-priors-identifiability/C9.md) · Prior-data conflict is a diagnosable post-fit situation — fix the prior, not the sampler
