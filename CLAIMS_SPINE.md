# The claims spine — mid-level abstract principles (the reviewable *why*)

*82 mid-level principles — the original 72 + 10 gap-fillers merged from the pymc-labs peer-L1 (Box's-loop, maxent, VI families, censored/truncated, BART, structural-TS…). Apex: `SUPER_AXIOMS.md`. 🟢 established · 🟡 supported · ⚪ candidate.*


## Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)

- **C1 · Geometry belongs to the *model*, not the sampler — knobs and hardware mitigate cost, only re-specification cures, and the failure is silent bias 🟢**
  <br>Posterior geometry is a property of the model (prior × likelihood), so it cannot be turned off with sampler knobs, more cores, or vectorization: parallelization and vectorization lower *cost per gradient*, never *effective-samples-per-gradient*, which geometry alone sets — and a geometry the sampler can't resolve doesn't merely run slow, 
- **C2 · Divergences are read by *location* and *origin*, not count — and their *absence* is not a clean bill of health 🟢**
  <br>A divergent transition signals failed geometric ergodicity in a neighborhood (hence finite-N bias), which makes divergences the primary single-chain HMC diagnostic — but the count is nearly useless on its own: what matters is *where* divergences concentrate, *whether* they survive an `adapt_delta` sweep, and *what* their origin is; conver
- **C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth saturation, E-FMI, and divergences each detect a *different* pathology, and each carries a calibration caveat 🟢**
  <br>Tree-depth saturation, the energy diagnostic (E-BFMI/E-FMI), and divergences respond to mechanically distinct failure modes; reading one as a proxy for another — or treating any threshold as a calibrated law — misdiagnoses the geometry.
- **C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, family-specific, and not free, and the metric is the complementary lever 🟢**
  <br>Reparameterizing to decouple a scale from the sampling geometry is the first-line cure, but there is no universal choice: centered (CP) and non-centered (NCP) forms have *exactly complementary* failure regimes set by per-group data richness, the transform must be chosen per level and per distribution family, the "best geometry" is not alw
- **C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifiability, collinearity, heavy-tailed sparsity priors, and dense GPs need marginalization, a regularizing slab, orthogonalization, or a redesign 🟢**
  <br>When the pathological geometry lives in the *likelihood* rather than in a prior scale — an underdetermined/collinear design, a sparsity prior whose tails escape, or a dense GP that doesn't scale — there is no algebraic scale to non-center, so the CP/NCP toolkit does not apply; the fix is to change the *model representation* (marginalize t
- **C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradient samplers' native reach — marginalize it out, reparameterize to a smooth unconstrained space, or add a surrogate; never hard-reject 🟢**
  <br>HMC/NUTS needs an (almost-everywhere) smooth log-density over a connected typical set, so any structure that is discrete, disconnected, or has a moving support wall must be transformed before sampling — discrete latents marginalized out, constraints encoded as unconstrained bijections, and intrinsically multimodal/partition-based structur
- **C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctness, warmup/metric adaptation, and differentiable/JIT-able linear algebra — whose failures masquerade as (or get blamed on) the geometry 🟢**
  <br>A large class of "sampler" failures are not posterior geometry at all but the substrate: a finite log-density does not imply a finite gradient; an init-method error usually signals misspecification, not a bad seed; a VI fit can be a fine *initializer* while being a poor *posterior*; and the differentiable, JIT-able linear algebra under th
- **C8 · The VI approximating family sets the uncertainty structure — mean-field (factorized q) is axis-aligned and overconfident; full-rank restores a dense covariance at O(d²) cost 🟢**
  <br>Mean-field VI (a factorized q) ignores all posterior correlations → axis-aligned, overconfident, variance-underestimating uncertainty; full-rank VI restores a dense covariance at O(d²) cost. This is the VI analogue of the diagonal-vs-dense mass-matrix choice (RP10/RP11), one level up in the approximating family: the mean-field/full-rank s

## Cross-cutting: priors, identifiability & degeneracy

- **C1 · Identifiability is binary and asymptotic; degeneracy is what bites — and the prior must *regularize*, not merely *permit* 🟢**
  <br>Identifiability is a binary, asymptotic property of the observational model (do two distinct parameter values give different sampling distributions), whereas **degeneracy** — how uniformly a *realized* posterior concentrates — is the preasymptotic quantity that actually governs inference. An identified model can be severely degenerate on 
- **C2 · Likelihood symmetries create structural, data-invariant multimodality — you must break the symmetry in the *model* 🟢**
  <br>When the likelihood is invariant under a transform of the parameters — relabeling components (K! modes), sign flips of factor loadings, rotation/reflection of a latent space, a joint shift of a location against a set of offsets, or splitting an observable into additive latent pieces — the posterior is structurally multimodal (or a continu
- **C3 · "Non-informative" priors are a myth; the weakly-informative alternative is deliberate scale/shape/tail engineering 🟢**
  <br>Flat, improper, and diffuse-but-proper priors are not non-informative — they actively bias the posterior toward extreme values and can wreck sampling. The operative choice is always a *weakly-informative* prior whose scale, shape, and tails are chosen on purpose, because each choice has distinct — and sometimes silent — failure modes.
- **C4 · A prior lives on the model's *internal* (parameterized) scale, not the natural scale — push it forward and check it there 🟢**
  <br>A prior is a statement on the model's internal parameterization — the link/log scale, a precision matrix, a basis-coefficient space, a non-centered z-scale — not on the natural quantity you have intuitions about. The only reliable specification workflow is to *push the prior forward* to the interpretable quantity and inspect it there.
- **C5 · Scaling a prior to the experimental design is principled, not cheating — and GP length scales are the sharpest, design-bounded case 🟢**
  <br>There are at least three *mechanistically independent* reasons a principled Bayesian must scale a prior to the design — placing a-priori mass on sparse signals (via the downstream decision), the gap between a GMRF precision parameterization and the elicitable marginal SD, and data-spacing limits on GP length-scale identifiability. GP leng
- **C6 · The device you use to *break* a non-identifiability is itself a modeling decision — some are exact, others silently change the model 🟢**
  <br>Breaking a non-identifiability is never free. Some devices are exact and target-preserving (an ordering constraint for permutation-invariant estimands; a non-centered fully-exchangeable form for a location non-identifiability); others silently change the generative model or fail to do what they appear to (a hard sum-to-zero constraint, a 
- **C7 · Parameters are "polite fictions"; linking a posterior to a population or causal estimand needs extra-Bayesian structure 🟢**
  <br>Within a Bayesian model, parameters are "polite fictions" for describing data; linking a posterior to a *population* or *causal* estimand always requires extra-Bayesian structure — an exchangeability assumption, a known sampling/selection mechanism, or an explicit coupling model for confounding — and that structure is a modeling commitmen
- **C8 · Maximum-entropy priors are the least-committal distribution given elicited constraints — "least-informative" means *given the constraints*, not flat 🟢**
  <br>Given constraints — bounds plus a probability mass, or a set of moments — the maximum-entropy distribution is the unique least-committal choice consistent with them. It is constructed, not chosen by feel: `pz.maxent(family, lower, upper, mass)` (PreliZ) returns the member of a chosen family that spreads probability as widely as possible s
- **C9 · Prior-data conflict is a diagnosable post-fit situation — fix the prior, not the sampler 🟢**
  <br>A posterior piled against a prior boundary, a prior that disagrees with the posterior, divergences concentrated near prior boundaries, or low ESS on a single parameter all point to

## Cross-cutting: Model evaluation — is the fit trustworthy, is the model adequate, and is the comparison honest?

- **C1 · Clean computation certifies the sampler, not the model — evaluation must go model-ward, and some misspecification is invisible even to predictive checks 🟢**
  <br>A faithfully-explored posterior can be confidently wrong. Zero divergences, R̂≈1, adequate ESS and healthy E-BFMI certify only that the *computation* faithfully represents the *model*; they say nothing about whether the model captures the data-generating process. Model misspecification that leaves the posterior geometry regular (unimodal,
- **C2 · All models are misspecified; adequacy is goal-relative ("good enough"), and asymptotic / relative certificates carry hidden conditions 🟢**
  <br>In practice the true process π† lies outside the observational model S — this is the rule, not the exception — yet inference is still useful provided S contains a configuration that captures the structure of π† *relevant to the inferential goals*. The operative standard is
- **C3 · Generative structure — likelihood family, narrative decomposition, confounding, which variables are stochastic, how each datum enters — fixes what the posterior can answer, independent of fit quality 🟢**
  <br>The observational model's *structure* determines the set of answerable questions before any sampling happens. The likelihood family is a modeling decision driven by the outcome's support/domain and a generative story for how the data arose — not by matching the data histogram's shape; any distribution whose (possibly unnormalized) log-den
- **C4 · Predictive and derived quantities must be built by pushing each posterior draw through the full generative/observation process and summarizing AFTER the nonlinear step 🟡**
  <br>The correct predictive/derived object is obtained by applying the transform *inside* each posterior draw and summarizing the resulting ensemble; averaging or conditioning in the wrong order silently biases the answer. A posterior predictive must be drawn through the observation-level RNG so it carries BOTH parameter uncertainty (including
- **C5 · Predictive model comparison ranks (never certifies), demands the correctly-factorized pointwise likelihood, and breaks when effective parameters approach N 🟢**
  <br>Cross-validated predictive scores compare models; they do not validate one. A comparison is decisive only when `elpd_diff` is large relative to `se_diff` AND the absolute `elpd_diff` is itself non-trivial (the canonical `elpd_diff=−0.5, se_diff=0.1` — ratio 5 — is still negligible), and the SE is optimistic at small n or under misspecific
- **C6 · Hypothesis tests and single-number summaries (Bayes factors, R², variance partitions) are prior-fragile or definition-dependent — prefer an estimation/predictive framing 🟡**
  <br>Bayes-factor / marginal-likelihood testing is a distinct instrument from both estimation and predictive comparison: a BF is a contest between the two models' *prior* predictive distributions, so it is acutely sensitive to parameter priors in a way ordinary posterior estimation is not — priors chosen to be reasonable for estimation are gen
- **C7 · The evaluation apparatus is itself fallible — diagnostics are noisy Monte-Carlo estimates, published proofs and benchmarks carry errors and design choices, and numerical primitives impose hard constraints 🟢**
  <br>The tools used to evaluate a model must themselves be sense-checked. A PSIS k̂ read to gate a VI guide (or an importance-sampling step) is a *random variable*, not a fixed property of the fit: repeated calls on the same data and guide spread by O(0.1–0.4) (e.g. −0.16 to +0.25 at 1000 particles), so a single call near the k≈0.7 threshold i
- **C8 · Model building is Box's loop — start simplest, let each posterior-predictive misfit motivate adding exactly ONE component, and understand a complex model only relative to the simpler ones it nests 🟢**
  <br>Model building is iterative, not a single fit. Start from the simplest plausible model and let each posterior-predictive misfit motivate adding exactly ONE component at a time; a complex model is understood only relative to the simpler models it nests, and computational problems are far easier to localize in a simple model than in a fully
- **C9 · A model with no observed likelihood factor is a pure generative DAG — draw its prior by exact ancestral (forward) sampling, never by running MCMC on the unconditioned model 🟢**
  <br>A model with no observed likelihood factor is a pure generative DAG. Draw from its prior by ancestral (forward) sampling in dependency order — this is exact and O(1) per draw. Never draw the prior by running a full sampler: MCMC on an unconditioned model is slow and mixes poorly, most acutely for discrete latents, which HMC cannot move th

## Cross-cutting: Convergence & Monte-Carlo reliability diagnostics

- **C1 · Convergence is not stationarity — a trustworthy error bar needs geometric ergodicity, expectand integrability, *and* equilibration 🟢**
  <br>MCMC estimators are only *asymptotically* consistent; a valid finite-sample error bar (a usable MCMC-SE) requires a Markov-chain CLT for the *specific* expectand, which stationarity / irreducibility / aperiodicity do **not** guarantee — it additionally needs geometric ergodicity and sufficient expectand integrability (E[f⁴] finite), and e
- **C2 · Diagnostics are necessary-not-sufficient and structurally blind to what the chain never sampled 🟢**
  <br>Every generic diagnostic (trace plots, R̂, split-R̂, Geweke, ESS, divergences, E-BFMI, tree-depth) is a *necessary* condition for equilibrium, never a *sufficient* one: a chain stuck in one mode, confined by a reducibility barrier, or consistently wrong in the same way across all chains reproduces every signature of success. And the whole
- **C3 · Multiple overdispersed chains are the structural guard — "burn-in / discard the bad chains" is actively harmful 🟢**
  <br>Because the blind spots of C2 close only when chains disagree, running *multiple* chains from genuinely *overdispersed* initializations is mandatory, not optional; and the industrial "burn-in" analogy — discard the chains that misbehaved, keep the survivors — is actively harmful, because one pathological chain invalidates the *entire* ens
- **C4 · Two orthogonal axes — mixing (R̂) and tail-integrability (k̂) — and the expectand decides what is estimable at all 🟢**
  <br>R̂ and k̂ are sensitive to *orthogonal* failure modes and both are required: split-R̂ catches mixing failure (reducibility, metastability) while k̂ catches integrability failure (heavy tails of the pushforward f∗π); neither alone suffices. And whether a quantity is Monte-Carlo estimable at all is a property of the *expectand*, not the cha
- **C5 · ESS is a property of the *function*, and its estimators fail exactly when the sampler struggles most — thinning never buys ESS 🟢**
  <br>Effective sample size is a property of a particular expectand evaluated on the chain, not of the chain itself (the same chain can have high ESS for one function and catastrophically low ESS for another), and the standard ESS/n_eff estimators are least trustworthy precisely in the struggling regime — they systematically *overestimate*. Thi
- **C6 · "Convergence" alarms can be diagnostic-plumbing artifacts, not just non-convergence — read the per-parameter table, and build gates that can't silently pass 🟢**
  <br>R̂/n_eff/ESS alarms are not always non-convergence — several common ones are arithmetic or plumbing artifacts, so an alarm is a prompt to look, not a verdict: a zero-variance saved quantity yields 0/0 → NaN R̂/n_eff; a transient warmup exception is numerical underflow; run-to-run posterior drift can be unseeded *data*, not the sampler; an
- **C7 · Approximation-based inference (IS, VI, perturbed MCMC) carries its own reliability diagnostics 🟢**
  <br>When the estimator is not exact MCMC, the reliability question changes shape: importance sampling needs *typical-set overlap* (finite ratio variance is necessary but nowhere near sufficient); VI's ELBO is a noisy objective whose convergence is not mean convergence; and "approximate MCMC" splits into three qualitatively distinct regimes wi

## Regression models (linear / GLM / GP / ordinal)

- **C1 · Regression is a narrow special case of variate–covariate modeling — confounding is *parameter coupling*, and it is invisible to every internal check 🟢**
  <br>"Regression" names a restrictive structure — a location-based conditional variate model, *no* parameter shared with the covariate-generating process, and a homogeneous configuration across observations — so its central failure, confounding, is not a property of the data or of any one model component but of the *coupling* between the condi
- **C2 · Linear (and polynomial) regression is a *local Taylor approximation* — validity is bounded by covariate support, and extrapolation failure is structurally undetectable 🟢**
  <br>A linear model is not a global truth but a first-order Taylor expansion of an unknown location function about a baseline x₀, valid only inside a neighborhood U; its adequacy is governed by whether the covariate distribution — at *both* training and prediction time — stays inside U, not by how straight the scatter plot looks.
- **C3 · Ridges and funnels in the *linear predictor* split into two look-alike regimes with opposite fixes: non-identifiability needs a regularizing prior (no sampler cure); computational ill-conditioning needs a coordinate transform 🟢**
  <br>Collinear and underdetermined regressions both present as elongated ridges / σ-funnels with the same surface symptoms (huge trajectories, tree-depth saturation, low E-BFMI), but they are mechanistically opposite: an **identified-but-ill-conditioned** posterior is a *computational* problem fixed by transforming coordinates (centering + QR)
- **C5 · Derived quantities, predictions, and effect summaries are definition- and estimand-dependent — there is no single right number 🟡**
  <br>Once a regression is fit, the reported quantity is a *choice*: expectation vs full predictive, conditional vs marginal, per-draw vs averaged, response scale vs latent scale — and these choices disagree (sometimes reverse ordering), so the estimand and the posterior-summary primitive must be fixed deliberately, not left to a default helper
- **C6 · BART models an unknown regression function as a sum of m weak, regularized trees — a nonparametric mean with no kernel or basis to choose 🟢**
  <br>Bayesian Additive Regression Trees (BART) model an unknown regression function as a sum of m regularized decision trees under a Bayesian prior that keeps each individual tree a *weak* learner — a nonparametric alternative to GPs/splines that captures nonlinearities and interactions automatically, with no kernel or basis to choose.

## Hierarchical / multilevel models

- **C1 · Hierarchical geometry is intrinsic and load-bearing — sampler tuning can't cure it 🟢**
  <br>The funnel in (θ, log τ) space is a property of the *model* (the product of the prior and the per-group likelihood), not of the sampler, so it cannot be fixed by turning sampler knobs, adding cores, or collapsing to a point estimate; and getting it wrong is not merely slow — it *silently biases* the recovered posterior.
- **C2 · CP and NCP are exactly complementary and data-dependent — parameterize per-level, not monolithically 🟢**
  <br>Centered (CP) and non-centered (NCP) parameterizations have *complementary* failure regimes governed by per-group data richness: CP funnels when data are weak and the prior dominates; NCP inverts-funnels when data are dense and the likelihood dominates. Neither monolithic choice is universally safe — the correct parameterization is chosen
- **C3 · With few groups the pathology moves up to the population scale τ, whose weakly-informed prior is load-bearing 🟢**
  <br>τ (the between-group SD) is informed only by the *scatter of group means*, so far less data flows to it than to likelihood-linked parameters; with few groups or few observations per group its prior becomes load-bearing — it actively shapes both the inference *and* the funnel geometry.
- **C4 · Partial pooling is the structural payoff — and its shrinkage artifacts are features, not bugs 🟢**
  <br>The defining feature of a multilevel model is that τ is *learned from data* rather than fixed, so groups borrow strength (shrink together when similar, separate when different); this is a real predictive and inferential win over no-pooling, and the visible consequences of shrinkage must not be mistaken for misspecification.
- **C5 · Hierarchical structure is riddled with identifiability degeneracies that priors don't neutrally fix and derived summaries don't resolve uniquely 🟢**
  <br>Multilevel structure creates location and decomposition non-identifiabilities that a prior only *softens*, and downstream quantities (ICC, R², marginal effects, "signal") are definition- and scale-dependent — there is no single right number.

## Mixture models (finite mixtures, label switching, zero-inflation)

- **C1 · Label switching is a structural K! multimodality — a theorem, not a sampler failure 🟢**
  <br>When mixture components share a distributional family and priors are exchangeable, the posterior is *exactly* invariant to all K! permutations of the component labels, so it has exactly K! isolated modes of equal mass; this is a property of the *model's* posterior geometry, not a convergence bug that longer runs, better inits, or sampler 
- **C3 · The two fixes divide by exactness — ordering constraints are provably exact; symmetry-breaking priors are regime-dependent 🟢**
  <br>For scalar component parameters, an ordering constraint (e.g. μ₁ < μ₂) is a *mathematically exact* resolution: it selects one of the K! symmetric "pyramid" regions and yields identical expectations to the full posterior for any permutation-invariant estimand. Non-exchangeable (asymmetric) mean priors instead try to *break* the symmetry, a
- **C4 · Overlapping components are a *second*, continuous non-identifiability that ordering does not cure 🟢**
  <br>When components are insufficiently separated (overlap within ~1–2 σ), the discrete K! label-switching degeneracy transforms into a *continuous* non-identifiability — an elongated, curved "bowtie" ridge in (μ₁, μ₂) space whose orientation rotates with the mixture weight θ — that produces very low n_eff *without any divergences* and that th
- **C5 · Where the mixture lives dictates how you treat it — marginalize the assignment, decompose the observation 🟢**
  <br>The discrete structure of a mixture must be handled *explicitly and placement-appropriately*: in the *likelihood*, marginalize the component-assignment variables z out analytically (log_sum_exp) before sampling — it is required for gradient samplers and strictly Rao-Blackwell-better — then reconstruct z's posterior *data-conditioned* if y
- **C6 · A mixture can be a *prior*, not a likelihood — then the rule is per-component parameterization by likelihood location 🟢**
  <br>When the mixture is a *prior* (a scale-mixture of normals: two-component sparsity prior, horseshoe, Laplace), the optimal centered-vs-non-centered choice for each individual parameter is set by *where its likelihood concentrates* relative to the inner-core scale τ₁ — not by how many observations inform it (the N_k heuristic that works for

## Gaussian processes & latent-Gaussian models

- **C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — the marginal likelihood is a ridge with flat plateaus, so principled priors are load-bearing, not optional 🟢**
  <br>Length scale ℓ (ρ) and marginal SD σ (α) enter the likelihood only through the *shape* of the covariance, which finite noisy data constrains poorly: under fixed-domain (infill) asymptotics only the microergodic combination σ²/ℓ^(2ν) is consistently estimable, the EQ marginal likelihood has two structurally distinct flat plateaus, and maxi
- **C2 · The GP latent field is a high-dimensional funnel — whiten it (NCP Cholesky) or marginalize it out; the centered form fails *invisibly* 🟢**
  <br>The correlated latent field f is a banana/funnel geometry that HMC cannot traverse in the centered parameterization — and it fails *silently* (no divergences, no tree-depth saturation, just extreme E-FMI and huge R̂); the two working responses are the non-centered Cholesky whitening f = L·f̃ with f̃ ~ N(0,I), or analytically marginalizing
- **C3 · An exact dense GP does not scale — the fix is a *structured* representation (low-rank basis or sparse precision), never harder sampler tuning 🟢**
  <br>A dense-covariance GP costs O(N³) time and O(N²) memory per gradient (Cholesky of the N×N kernel), so beyond a few hundred–1000 points HMC OOMs or stalls; more data only makes the matrix bigger — the remedy is to change the GP *representation* (Hilbert-space low-rank basis, or a sparse *precision* Markov/SPDE form), and for sparse precisi
- **C4 · Sparsity is not a numerical trick — a GP admits a sparse-precision (SPDE/FEM) form iff it is Markov, which is an exact spectral/RKHS property that RBF structurally lacks 🟢**
  <br>A GP has the Markov property iff its RKHS inner product is *local* (disjoint-support functions orthogonal), equivalently — for stationary GPs — iff the inverse spectral density f(ω)⁻¹ is a non-negative symmetric polynomial; Matérn kernels satisfy this and the squared-exponential (RBF) does not, and that failure is *architectural*, not fix
- **C5 · A GP is non-parametric — prediction and structural decomposition require *explicit conditioning on the training data*; the generic "sample latents, feed new X" pattern silently returns the prior 🟢**
  <br>A fitted GP is not a callable function of hyperparameters: the predictive at new inputs X* depends on the *full joint posterior of the latent function over the training inputs together with the training data*, so reusing the standard parametric predictive pattern (numpyro/pyro `Predictive`, `pm.set_data` on a Latent GP) silently collapses

## Time-series & state-space models

- **C1 · A discretized latent-state chain is a hierarchical-normal geometry problem — parameterize per-state and per-factorization, not globally 🟢**
  <br>A discretized latent-state chain (SDE, Markov chain, Brownian bridge) is structurally a normal hierarchical model with N groups of size 1, so its HMC geometry obeys the same CP/NCP logic — but the correct choice is *per-state* (CP for likelihood-pinned observed states, NCP for prior-only unobserved states) and, within NCP, *per-factorizat
- **C2 · A clean-running sampler faithfully represents its model — clean diagnostics validate the sampler, not the model 🟢**
  <br>A clean-running sampler faithfully represents whatever model it was given, so clean HMC diagnostics validate the *sampler*, not the *model* — a misspecification that is silent about a known constraint (e.g., a Brownian-motion prior used where a terminal boundary condition is known) passes with zero divergences and zero tree-depth saturati
- **C3 · Discrete latent states must be marginalized out — then the dominant failure is log-scale zeros in the marginal likelihood 🟡**
  <br>Gradient samplers cannot move a discrete latent-state sequence, so the working strategy is to marginalize the states out via the forward algorithm into an exact, smooth, differentiable likelihood — after which the dominant remaining failure mode is *numerical*: structural zeros in the transition/emission matrices become log(0) = −∞ and th
- **C4 · Divergence *location*, not count, is the primary triage signal — state-space models have geometrically explicable structural boundaries 🟢**
  <br>When divergences breach a tolerance gate, their *location* in parameter space is the primary diagnostic, not their count: divergences that cluster tightly (~75–90 %) at a geometrically explicable structural boundary — canonically the AR(1) unit-root region φ→1 where the stationary variance σ²/(1−φ²) blows up — while all other diagnostics 
- **C5 · The recursion is conditional — respect what it conditions on (initial condition; frozen-model filter) 🟡**
  <br>Time-series inference goes wrong when the conditioning structure of the recursion is mishandled in two recurring ways: conditioning the AR recursion on the first observation as if it were *exogenous* biases the autoregressive coefficient (a Bayesian Nickell bias), and treating the cheap online filter recursion as if it also updated the *h
- **C6 · A structural time series decomposes additively into interpretable latent components (trend / seasonal / noise), each with its own state-noise scale, fit jointly 🟢**
  <br>A structural time series (the BSTS/STS paradigm) decomposes additively into interpretable latent components — a level/trend term (a random walk, or a local-linear-trend where the level's drift is itself a random-walk slope), a seasonal term, and observation noise — each carrying its own state-noise scale and all fit jointly.

## Spatial & areal models (CAR / ICAR / BYM, GMRFs, spatial GPs)

- **C1 · Precision, not covariance, is the working representation for structured spatial models — and it has an exact boundary 🟢**
  <br>For latent-Gaussian spatial models the sparse *precision* matrix Q(θ) — not the covariance Σ — is the mandatory working parameterization, because it is what keeps the model tractable; but the framework has a hard architectural boundary: some kernels (notably the RBF / squared-exponential) cannot be represented inside it at all.
- **C2 · The GMRF precision parameterization silently decouples its scalar τ from every quantity you can actually elicit or evaluate 🟢**
  <br>In CAR/GMRF models built from a precision Q, the scalar τ is neither the inverse marginal variance nor a self-contained scale: the marginal variance of xⱼ is τ⁻¹[Q⁻¹]ⱼⱼ (never uniformly 1, graph-dependent), and when Q is rank-deficient *by design* the log-density's normalizing constant needs a generalized log-determinant — get either wron
- **C4 · Identifying additive spatial effects requires a sum-to-zero constraint — and the naïve constraint is itself a mis-scaled prior 🟡**
  <br>ICAR/BYM/CAR spatial effects (like ANOVA codings and log-simplex weights) are non-identified up to a constant shift and need an explicit centering / sum-to-zero constraint, but the textbook soft and hard forms *silently distort the prior* unless corrected by the number of constrained elements N.
- **C5 · Spatial autocorrelation is not only an outcome nuisance — SA in a *covariate* silently overstates coefficient confidence 🟡**
  <br>When a *regression covariate* (not just the outcome) is spatially autocorrelated, the posterior for its coefficient becomes overconfident — its posterior SD shrinks and interval coverage falls well below nominal — and this is a genuine information deficit, not a sampler artifact.

## Latent-factor models (factor analysis / SEM / IRT / PPCA / latent-Gaussian)

- **C2 · When an observable is a many-to-one (additive) combination of latent components, the decomposition is generically non-identified — only the aggregate is informed 🟡**
  <br>If an observed quantity is the sum (or other many-to-one combination) of two or more latent additive components that each carry their own free parameters — e.g. observed response time rt = rt₁ + rt₂ in a non-compensatory IRT / response-time model — the data inform only the sum, so the component split is non-identified.
- **C3 · For correlated multi-category / compositional data, put the dependence in the model via correlated latent rates — independent per-category likelihoods discard the structural dependence 🟡**
  <br>For vectors of counts/proportions across K>2 mutually-dependent categories, model the categories *jointly* — a multivariate-normal prior on the latent *log*-rates with an LKJ/Cholesky covariance feeding per-category likelihoods, or a Dirichlet-multinomial — rather than fitting independent per-category likelihoods.
- **C4 · For latent-Gaussian models, marginalizing the latent field strictly dominates non-centering — it removes the funnel rather than reshaping it 🟢**
  <br>The joint posterior p(u,θ|y) of a latent-Gaussian model almost always has funnel geometry — the conditional variance of u given θ shrinks as θ varies — which forces aggressive non-centered reparameterization (NCP) for joint HMC/NUTS; for the conjugate Gaussian latent class, analytic marginalization of u is *strictly stronger* than NCP: it

## ODE / dynamical-system models (mechanistic ODE likelihoods, SDEs, and continuous-time generative flows)

- **C1 · Continuous-time generative flows: the vector field's reversibility is free, but interior-time supervision is the real scarce resource 🟢**
  <br>In ODE/SDE-based generative models a *single* learned vector field f governs the whole transport, so structural properties of f — not architectural choices — set the tradeoffs: reversibility comes for free (the same f runs forward for training and backward for sampling, with no need to commit to modeling T or T⁻¹), but f is unconstrained 
- **C2 · Bayesian inference through an ODE likelihood: per-iteration cost is parameter-dependent, so solver accuracy is a tuned dimension managed jointly with sampling 🟡**
  <br>When the likelihood requires a numerical ODE/dynamical-system solve, the cost of a single HMC iteration depends on the current parameter draw (unlike regression), so accuracy and sampler fidelity must be managed *jointly*; the robust strategy is to sample with a cheap/low-accuracy solver and importance-sample (PSIS) back to the true poste
- **C3 · Dynamical-system inference is riddled with structural near-identifiabilities that only physics or informative priors resolve 🟢**
  <br>In both deterministic-ODE and SDE inference, distinct parameters routinely collapse onto a single identifiable combination — g and k onto the terminal-velocity ratio mg/k, measurement noise σ and diffusion amplitude τ onto one observed-variance budget — leaving a posterior ridge the data cannot break; resolving it by an informative prior 

## Measurement-error & missing-data models

- **C1 · The observational model is the theoretical model convolved with the measurement response — censoring, binning, and contamination are structural, not nuisance 🟢**
  <br>What you fit is never the theoretical model itself but the theoretical model passed through the measurement process, so ignoring censoring (continuous energies arriving as binned counts), contamination (a background process mixed with signal), or extra zero-inflation mechanisms yields a biased observational model whose parameters are *not
- **C2 · Missingness/selection correlated with the outcome process is non-ignorable — it reintroduces confounding in a confounder-free design and can break Bayesian √n-consistency 🟢**
  <br>A randomized or otherwise designed experiment suppresses confounding only to the degree the design is *implemented*; dropout, censoring, or non-compliance that is correlated with the variate-generating process makes the observed covariate distribution a biased subset of the designed one, reintroducing confounders — and in the survey/strat
- **C3 · The Bayesian repair for non-ignorable selection is to model the randomization mechanism and impute the complete sample via the posterior predictive — recovering the design-based (Horvitz–Thompson) estimator without leaving the Bayesian frame 🟢**
  <br>You do not have to abandon Bayesian principles to get √n-consistent population-mean estimation under adversarial selection: fit the standard model, then ask what the *complete-sample* mean would have been under hypothetical realizations of the randomization, and answer with the posterior predictive — which recovers the Horvitz–Thompson es
- **C4 · The variate/covariate partition is defined by which component goes missing in the application, not by generative priority — the same joint factors two ways into different conditional models 🟢**
  <br>Which variable is the "variate" (modeled conditionally) and which is the "covariate" (conditioned on) is an *application* decision driven by which component is prone to missingness in the deployment context — not by which was generated first or has narrative generative priority; the same joint distribution can be correctly decomposed in t
- **C5 · Imputation adds information (and cost) only when the missing variable carries it — impute covariates (two relationships), never re-condition on a noisy or already-fitted value, and mask the log-probability when you only need the observed-data likelihood 🟡**
  <br>Whether imputing a missing value helps depends on how that variable enters the model: a missing *covariate* figures in two relationships (predictor of the outcome and response of its own submodel) so imputing it is legitimate, whereas imputing a missing *response* and re-fitting double-counts the data; and conditioning on a *noisy* observ
- **C6 · Censoring and truncation are distinct likelihood treatments — censoring integrates the tail mass at the bound (a CDF term, N fixed); truncation renormalizes the density by P(in-bounds) (N varies); picking the wrong one biases parameters 🟢**
  <br>Censoring and truncation are two different measurement processes with two different likelihoods, not interchangeable labels. Under **censoring** the out-of-bound values ARE in the dataset — recorded at the bound — so the likelihood integrates the tail mass at the bound (a CDF term) and the sample size is fixed. Under **truncation** the ou

## Sparse regression & shrinkage priors

- **C1 · Bayesian sparsity is posterior concentration, not selection — so it always needs a downstream decision rule 🟢**
  <br>Bayesian sparsity is a property of the *full posterior* concentrating near the sparse region of parameter space, not a point-estimate decision that forces coefficients to exactly zero (frequentist sparsity); and because every continuous scale-mixture-of-normals prior induces only a *logarithmic* spike at zero — not a true spike-and-slab —
- **C2 · A sparse prior needs two scales — every single-scale prior compromises and fails one side 🟢**
  <br>A well-specified sparse prior needs two *distinct* scales — a tight inner-core scale that regularizes the majority of coefficients toward zero and an explicit outer-expanse scale that lets a few escape unconstrained — so any single-scale prior (Normal, Laplace, Cauchy, classic horseshoe) must compromise between shrinking small slopes and 
- **C3 · The global scale is a design-dependent quantity — calibrate it to (N, M, expected sparsity) 🟢**
  <br>In local-global (scale-mixture) sparse priors the global scale is not a free constant but a *design-dependent* quantity: it must be calibrated jointly to N observations, M covariates, and the expected number of relevant effects m_0; a fixed global scale is effectively non-informative about sparsity regardless of dimension.
- **C4 · Sparsity pathology is intrinsic funnel geometry — diagnostics are signals to read, not knobs to turn 🟢**
  <br>The sampling pathology of sparse priors is *intrinsic funnel geometry*, not a tuning deficit — so the divergences, E-BFMI collapse, and tree-depth saturation they produce are geometry signals to be read, not knobs (adapt_delta, max_treedepth) to be turned up.
- **C5 · Build sparse models by nested expansion under valid warmup — fix geometry before scaling 🟢**
  <br>Sparse models are built and scaled by discipline, not force: each iteration should *strictly nest* the previous (recovered when new parameters → 0, with priors concentrated near zero), warmup is valid only if the full chain would already satisfy the MCMC CLT, and a stalled fit is a geometry problem to diagnose — not a workload to parallel
- **C6 · Spike-and-slab is the gold standard for EXACT zeros — it builds the selection decision into the prior via a discrete indicator 🟢**
  <br>A discrete-mixture spike-and-slab prior — a Bernoulli inclusion indicator times a diffuse slab — is the gold-standard prior for genuine variable selection / *exact* zeros. Unlike every continuous shrinkage prior, the inclusion indicator puts literal probability mass on a coefficient being exactly zero, so the removal decision is baked int
- **C7 · R2D2 puts the prior on variance explained (R²) — the total-variance budget as a named, off-the-shelf method 🟢**
  <br>The R2D2 prior places an interpretable Beta-style prior directly on R² (the proportion of variance explained) and then distributes that variance budget across the coefficients — turning the recurring "put the scale on TOTAL model variance" move into a single named, usable prior instead of an abstract principle.
