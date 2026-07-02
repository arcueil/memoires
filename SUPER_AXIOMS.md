# Super-axioms — the apex (the leanest *why*)
*6 grand principles synthesized from the 76 mid-level claims (data-clustered). Each subsumes a cluster of mid-level claims below it.*

### SA1 · The model is the object of inference; computation only certifies faithfulness to it
Every posterior is conditional on a chosen model — prior × likelihood — and that choice is a substantive, non-neutral commitment, not a neutral default: there are no non-informative priors, a prior acts on the model's internal (link/transform) scale rather than the natural quantity, and the generative structure of the likelihood fixes which questions are even answerable. Because a model's geometry and its answerable set are properties *of that model*, clean computation (zero divergences, R̂≈1, adequate ESS) certifies only that the sampler faithfully represents the model — never that the model captures the data-generating process, and some misspecification is invisible even to predictive checks. Adequacy must therefore be judged model-ward, derived and predictive quantities must be pushed through the full generative process before summarizing, and any link to a population or causal estimand requires extra-Bayesian structure the fit cannot supply.
**Subsumes:**
- C1 · Geometry belongs to the *model*, not the sampler
- C7 · Beneath geometry sits a *machinery* layer whose failures masquerade as geometry
- C3 · "Non-informative" priors are a myth; the weakly-informative alternative is deliberate scale/shape/tail engineering
- C4 · A prior lives on the model's *internal* (parameterized) scale, not the natural scale
- C7 · Parameters are "polite fictions"; linking a posterior to a population/causal estimand needs extra-Bayesian structure
- C1 · Clean computation certifies the sampler, not the model — evaluation must go model-ward
- C3 · Generative structure fixes what the posterior can answer, independent of fit quality
- C4 · Predictive/derived quantities must be built by pushing each posterior draw through the full generative process
- C6 · Hypothesis tests and single-number summaries (Bayes factors, R², variance partitions) are prior-fragile or definition-dependent
- C4 · Model specification is load-bearing (no non-informative prior, internal-scale priors, likelihood matches data structure)
- C5 · Where the mixture lives dictates how you treat it — marginalize the assignment, decompose the observation
- C3 · Discrete latent states must be marginalized out
- C3 · The Bayesian repair for non-ignorable selection is to model the randomization and impute via the posterior predictive

### SA2 · A conditional model answers a population or causal question only through its variate–covariate coupling
"Regression" names a narrow structure — a location-based conditional variate model with no parameter shared with the covariate-generating process and a homogeneous configuration across observations — so its load-bearing failures (confounding, non-ignorable selection/missingness, a spatially autocorrelated covariate) are properties of the *coupling* between the conditional and covariate processes, not of any single component, and are invisible to every within-model check. Which variable is modeled and which is conditioned on is a deliberate, application-driven partition rather than a matter of generative priority, and the reported estimand — conditional vs marginal, latent vs response scale, per-draw vs averaged — is itself a choice with no single right number. Even the model's own geometry can mislead: ridges in the linear predictor split into look-alike but mechanistically opposite regimes (non-identifiability, cured only by a regularizing prior, vs ill-conditioning, cured by a coordinate transform).
**Subsumes:**
- C1 · Regression is a narrow special case of variate–covariate modeling — confounding is *parameter coupling*, invisible to internal checks
- C3 · Ridges/funnels in the linear predictor split into two look-alike regimes with opposite fixes (non-identifiability vs ill-conditioning)
- C5 · Derived quantities, predictions, and effect summaries are definition- and estimand-dependent
- C5 · Spatial autocorrelation in a *covariate* (not just the outcome) silently overstates coefficient confidence
- C2 · Missingness/selection correlated with the outcome process is non-ignorable — reintroduces confounding, breaks √n-consistency
- C4 · The variate/covariate partition is set by which component goes missing in the application, not by generative priority

### SA3 · A prior's scale is a design quantity; sparse regularization is concentration, not selection
A prior's informativeness — above all its scale — is not a free constant but a design-dependent quantity that must be calibrated to the experiment (N, number of covariates, expected effect structure) through several mechanistically independent channels; there is no scale-free default, and scaling to the design is principled, not cheating. Scale-mixture (sparse/shrinkage) priors are the canonical case: Bayesian sparsity is the *full posterior* concentrating near the sparse region, never a point-estimate selection, so it needs two distinct design-calibrated scales — a tight inner core and an escaping outer tail — plus a downstream decision rule, and for a scale-mixture *prior* the centered-vs-non-centered choice per parameter is set by where its likelihood concentrates. The funnel geometry such priors induce is intrinsic, a signal to diagnose rather than a knob (adapt_delta, treedepth) to turn up, and sparse models are built by disciplined nested expansion under valid warmup, not by force.
**Subsumes:**
- C5 · Likelihood-induced funnels have *no reparameterization analogue* — marginalize, regularizing slab, orthogonalize, or redesign
- C5 · Scaling a prior to the experimental design is principled, not cheating (GP length scales the sharpest case)
- C6 · A mixture can be a *prior*, not a likelihood — per-component parameterization by likelihood location
- C3 · Prior scaling is design-dependent through several mechanistically independent channels — no scale-free default
- C1 · Bayesian sparsity is posterior concentration, not selection — always needs a downstream decision rule
- C2 · A sparse prior needs two scales — every single-scale prior compromises and fails one side
- C3 · The global scale is a design-dependent quantity — calibrate to (N, M, expected sparsity)
- C4 · Sparsity pathology is intrinsic funnel geometry — diagnostics are signals to read, not knobs to turn
- C5 · Build sparse models by nested expansion under valid warmup — fix geometry before scaling

### SA4 · Posterior geometry and identifiability are structural; only re-representing the model cures them
The pathologies that stall gradient-based sampling — funnels, symmetry-induced multimodality, non-identifiability, unscalable dense covariance — are structural properties of the model's parameterization and likelihood, not defects of the sampler, so they are never cured by more tuning, cores, or iterations, and getting them wrong silently biases the posterior. The only cures are structural re-representations matched to the *specific* pathology: reparameterization (centered/non-centered chosen per level and per family), marginalizing discrete or conjugate-Gaussian latents (which strictly dominates non-centering), exact identifying constraints, or a structured low-rank / sparse-precision form — and each such device is itself a modeling decision that can be target-preserving or can silently change the model. Identifiability is a binary asymptotic property, but the *degeneracy* of the realized posterior is what actually bites, so priors must regularize, not merely permit.
**Subsumes:**
- C4 · Reparameterization is the primary geometry fix — regime-dependent, family-specific, not free; the metric is complementary
- C6 · Discrete/multimodal/moving-support structure is outside gradient samplers' reach — marginalize, reparameterize, or surrogate; never hard-reject
- C1 · Identifiability is binary and asymptotic; degeneracy is what bites — the prior must *regularize*, not merely permit
- C2 · Likelihood symmetries create structural, data-invariant multimodality — break the symmetry in the *model*
- C6 · The device that *breaks* a non-identifiability is itself a modeling decision — some exact, others silently change the model
- C4 · Two orthogonal axes — mixing (R̂) and tail-integrability (k̂); the expectand decides what is estimable
- C2 · Linear/polynomial regression is a *local Taylor approximation* — validity bounded by covariate support
- C1 · Hierarchical funnel geometry is intrinsic and load-bearing — sampler tuning can't cure it
- C2 · CP and NCP are exactly complementary and data-dependent — parameterize per-level
- C3 · With few groups the pathology moves up to the population scale τ, whose weakly-informed prior is load-bearing
- C4 · Partial pooling is the structural payoff — shrinkage artifacts are features, not bugs
- C5 · Hierarchical structure is riddled with identifiability degeneracies priors don't neutrally fix
- C1 · Label switching is a structural K! multimodality — a theorem, not a sampler failure
- C3 · The two fixes divide by exactness — ordering constraints provably exact; symmetry-breaking priors regime-dependent
- C4 · Overlapping components are a *second*, continuous non-identifiability that ordering does not cure
- C1 · GP covariance hyperparameters are only weakly/partially identified — principled priors are load-bearing
- C2 · The GP latent field is a high-dimensional funnel — whiten (NCP Cholesky) or marginalize; centered fails invisibly
- C3 · An exact dense GP does not scale — the fix is a *structured* representation, not harder sampler tuning
- C4 · A GP admits a sparse-precision (SPDE/FEM) form iff it is Markov — an exact spectral/RKHS property RBF lacks
- C5 · A GP is non-parametric — prediction/decomposition require explicit conditioning on the training data
- C1 · A discretized latent-state chain is a hierarchical-normal geometry problem — parameterize per-state, per-factorization
- C1 · Precision, not covariance, is the working representation for structured spatial models — with an exact boundary
- C2 · The GMRF precision parameterization silently decouples scalar τ from every elicitable quantity
- C4 · Identifying additive spatial effects requires a sum-to-zero constraint — the naïve constraint is a mis-scaled prior
- C1 · Latent-factor likelihoods carry structural invariances (sign, rotation, permutation) — non-identifiability, not slow mixing
- C3 · For correlated multi-category/compositional data, put the dependence in the model via correlated latent rates
- C4 · For latent-Gaussian models, marginalizing the latent field strictly dominates non-centering
- C1 · Continuous-time generative flows: reversibility is free, interior-time supervision is the scarce resource
- C3 · Dynamical-system inference is riddled with structural near-identifiabilities only physics/informative priors resolve

### SA5 · Diagnostics falsify; they never certify
Every convergence and HMC diagnostic (R̂, split-R̂, ESS, divergences, E-BFMI, tree-depth) is a *necessary* but never *sufficient* condition for equilibrium: each detects a mechanically distinct pathology, must be read by *location* and *origin* rather than by count or a fixed threshold, and is structurally blind to whatever the chains never visited. A clean read therefore rules out only the failures the diagnostic can see and is not a certificate of correctness — the failure can be entirely diagnostic-silent. The one guard against this shared blind spot is many chains launched from genuinely overdispersed starts, whose disagreement (inflated cross-chain R̂, dispersed scatter) is the only signal that survives when every single-chain diagnostic falls silent.
**Subsumes:**
- C2 · Divergences are read by *location* and *origin*, not count — and their *absence* is not a clean bill of health
- C3 · The diagnostics are distinct fingerprints, not interchangeable — each detects a different pathology, each with a calibration caveat
- C2 · Diagnostics are necessary-not-sufficient and structurally blind to what the chain never sampled
- C2 · The failure is diagnostic-silent — only cross-chain R̂ and dispersed multi-chain scatter catch it
- C4 · Divergence *location*, not count, is the primary triage signal (geometrically explicable structural boundaries)

### SA6 · Every certificate is conditional and quantity-specific, and the evaluation apparatus is itself fallible
An inferential guarantee holds only conditionally and only for a specific quantity: a valid Monte-Carlo error bar requires a chain CLT for *that* expectand (geometric ergodicity plus integrability — stationarity alone does not give it), effective sample size and reliability are properties of the function evaluated rather than of the chain, and predictive comparison *ranks* models rather than certifying any, with its SE breaking as effective parameters approach N. The evaluation apparatus is itself fallible — diagnostics are noisy random variables, proofs and benchmarks carry errors, and "convergence" alarms can be arithmetic or plumbing artifacts — and each approximation regime (importance sampling, VI, perturbed MCMC) carries its own reliability question. The estimate answers the intended quantity only when the model's conditioning and observation structure is honored (initial conditions, measurement-response convolution, imputation accounting, per-iteration solver cost), so multiple overdispersed chains are mandatory and no clean summary number is self-validating.
**Subsumes:**
- C2 · All models are misspecified; adequacy is goal-relative, and asymptotic/relative certificates carry hidden conditions
- C5 · Predictive model comparison ranks (never certifies), demands the correct pointwise likelihood, breaks as effective params → N
- C7 · The evaluation apparatus is itself fallible — diagnostics are noisy MC estimates; proofs/benchmarks carry errors
- C1 · Convergence is not stationarity — a trustworthy error bar needs geometric ergodicity, expectand integrability, and equilibration
- C3 · Multiple overdispersed chains are the structural guard — "burn-in / discard the bad chains" is actively harmful
- C5 · ESS is a property of the *function*, and its estimators fail (overestimate) exactly when the sampler struggles most
- C6 · "Convergence" alarms can be diagnostic-plumbing artifacts — read the per-parameter table; build gates that can't silently pass
- C7 · Approximation-based inference (IS, VI, perturbed MCMC) carries its own reliability diagnostics
- C2 · A clean-running sampler faithfully represents its model — clean diagnostics validate the sampler, not the model
- C5 · The recursion is conditional — respect what it conditions on (initial condition; frozen-model filter)
- C2 · A many-to-one (additive) combination of latent components is generically non-identified — only the aggregate is informed
- C2 · Bayesian inference through an ODE likelihood — per-iteration cost is parameter-dependent; solver accuracy tuned jointly
- C1 · The observational model is the theoretical model convolved with the measurement response — censoring/binning/contamination are structural
- C5 · Imputation adds information only when the missing variable carries it — impute covariates, mask the log-probability
