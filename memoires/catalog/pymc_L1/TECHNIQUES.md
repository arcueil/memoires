# TECHNIQUES / API layer from pymc-L1 (68)

### InverseGamma(eps,eps) as a hierarchical-variance default is a trap
*📐 portable*

Enrich E3 (currently presents Gamma-vs-InverseGamma tail-suppression neutrally): add the practical corollary that IG(0.01,0.01) as a variance prior is surprisingly informative near zero and pushes the variance posterior AWAY from zero even when groups are truly identical (it is exactly E3's 'IG suppresses the lower tail' applied where you WANT mass at 0). Prefer HalfNormal/HalfStudentT for hierarchical variance components. Classic Gelman-2006 point; we imply it but never state the pitfall.

---
### LKJ eta semantics for correlation matrices
*📐 portable*

Enrich the correlation-prior handling (K3 uses 'lkj-at-identity' / LKJ(eta=1) but never documents the knob): eta=1 uniform over valid correlation matrices; eta>1 concentrates toward identity (expects weaker correlations); eta<1 favors extreme correlations. PyMC: pm.LKJCholeskyCov(eta=..., sd_dist=...). Gives readers the actual tuning dial behind our LKJ-based fixes.

---
### PyMC prior-workflow API tooling
*🔧 PyMC-specific*

Add a PyMC library-note attaching APIs to our recurring generic moves: prior-predictive check = pm.sample_prior_predictive(draws) + az.plot_ppc_dist(group='prior_predictive'); prior-data-conflict / sensitivity = az.plot_prior_posterior + power-scaling; coords/dims in pm.Model(coords=...) for readable per-parameter prior specs; LKJCholeskyCov / R2D2M2CP as above. Our catalog names these moves abstractly but never the PyMC entry points.

---
### HSGP m/c/L selection thresholds + approx_hsgp_hyperparams helper + the m-c coupling
*🔧 PyMC-specific*

Fill S2's vague 'degrades near boundaries and for very small length scales' with actionable numbers: c tables (interp 1.2-1.5; modest extrap 1.5-2.0; significant 2.0-4.0; c<1.2 pinches basis to zero at edges), m tables (very smooth 10-20; moderate 20-40; wiggly 40-80; highly variable 80+), the key insight that raising c REQUIRES raising m to hold approximation quality, and pm.gp.hsgp_approx.approx_hsgp_hyperparams(x_range, lengthscale_range, cov_func) as a starting-point heuristic (its outputs are minimums, verify with prior predictive).

---
### HSGP kernel algebra: sums of stationary kernels supported, products (modulation) NOT supported
*🔧 PyMC-specific*

Add to S2 conditions: under HSGP additive kernel combos work (cov_smooth + cov_rough), but product kernels are unsupported -- emulate modulation with separate GPs added together, or fall back to a full GP. Also: HSGP requires a kernel exposing power_spectral_density (ExpQuad, Matern52/32/12); Periodic and non-stationary kernels excluded.

---
### HSGP approximation-quality diagnostics: Gram-matrix comparison (K_true vs Phi diag(psd^2) Phi^T via gp.prior_linearized), subsampled exact-GP ground truth, prior-predictive of HSGP function draws
*🔧 PyMC-specific*

Concrete PyMC 'how' for our existing S2 move 'monitor reconstruction error of the kernel online': K_true = cov(X).eval(); phi, sqrt_psd = gp.prior_linearized(X); K_approx = phi @ diag(sqrt_psd**2) @ phi.T; imshow both. Plus: fit an exact pm.gp.Marginal on a random subset (<=300 pts) as ground truth and compare hyperparameter posteriors. prior_linearized also exposes phi/sqrt_psd for custom linearized models.

---
### drop_first=True: the first HSGP basis vector is ~constant and aliases with an explicit intercept, hurting sampling/identifiability
*🔧 PyMC-specific*

Concrete instance + one-line fix for our A1/A2 additive-aliasing claim: when the model already contains an intercept (or a parametric mean), set pm.gp.HSGP(..., drop_first=True) so the near-constant first basis function doesn't compete with the intercept (symptom: first HSGP coefficient poorly identified in trace plots). A named PyMC knob realizing the a+b degeneracy fix.

---
### Matern52 as default over ExpQuad for numerical stability; ExpQuad spectral density underflows at large length scales
*📐 portable*

Practical numerical reason (distinct from our C4/M2 Markovianity argument) to prefer Matern-5/2 to squared-exponential in HSGP/low-rank fits: ExpQuad's spectral density decays exponentially fast so large length scales cause underflow; Matern52 has heavier spectral tails -> more numerically stable, with realistic once/twice-differentiable smoothness. Also: add WhiteNoise(1e-6) jitter for Cholesky stability (aligns with our C2 float32-jitter note, different magnitude).

---
### Mechanism: HSGP basis functions are independent of kernel hyperparameters -> precomputed once -> cheap to sample and to compose additively with other model components
*📐 portable*

Adds a 'why' to C3/S2 'structured low-rank basis': because the Hilbert-space basis vectors don't depend on (ell, eta), the model reduces to a linear combination of fixed basis vectors -- this is precisely why HSGP samples fast AND slots cleanly into larger models (trend + seasonality + parametric mean), which our synthesis states as a benefit without the mechanism.

---
### Tooling: nutpie NUTS backend ~2-5x faster on HSGP models; scale amplitude prior to outcome (HalfNormal(2*y_std))
*🔧 PyMC-specific*

Minor library-note: pm.sample(nuts_sampler='nutpie') gives ~2-5x speedup on HSGP models (relevant to our ess_per_sec slots), and a concrete weakly-informative amplitude prior scaled to data: eta = HalfNormal(2*y.std()).

---
### PyMC mixture-building API: pm.NormalMixture / pm.Mixture, Dirichlet(np.ones(K)) weights, heterogeneous comp_dists (Normal+StudentT)
*🔧 PyMC-specific*

Library-note for C5/M1: pm.NormalMixture(w,mu,sigma) and pm.Mixture(w,comp_dists) build the ALREADY-marginalized likelihood automatically (the log_sum_exp of M1); weights via Dirichlet(a=np.ones(K)); comp_dists may mix distributional families (Normal+StudentT) — heterogeneous-family mixtures are identifiable (no K! symmetry, cf. C1's 'identical families' condition).

---
### PyMC ordering-constraint API: transforms.ordered vs pt.sort Deterministic
*🔧 PyMC-specific*

Library-note for B1: implement the exact ordering via transform=pm.distributions.transforms.ordered on the component-mean Normal (proper bijective transform, correct implied prior). Add a nuance the pymc file misses: pt.sort as a Deterministic distorts the implied prior and is not a clean bijection — prefer the ordered transform.

---
### pymc-extras MarginalMixture(dist=[...], support_idxs=z) for marginalizing an explicit Categorical z while enabling recovery
*🔧 PyMC-specific*

Library-note for M3: pymc_extras.MarginalMixture marginalizes an explicit Categorical z (support_idxs) yet keeps its identity for post-hoc recovery — the PyMC route to M3's data-conditioned E[z|theta,y].

---
### Label-switching detection via ArviZ rank plots (should be uniform, not bimodal) and pair plots (symmetric clusters)
*🔧 PyMC-specific*

Add moves to D1-D3: az.plot_rank should be per-chain uniform (bimodal ⇒ switching); az.plot_pair on component means shows symmetric/reflected clusters. Concrete ArviZ realization of our 'multi-chain scatter + split-R̂' detector.

---
### Built-in PyMC time-series distributions (pm.AR / pm.GaussianRandomWalk / pm.GARCH11)
*🔧 PyMC-specific*

Add a library-note cataloguing PyMC's built-in TS RVs, usable as prior or observed: pm.AR(rho=[...] order-p, constant=True puts intercept as first rho element, init_dist, sigma); pm.GaussianRandomWalk(mu=drift, sigma, steps=T-1, init_dist); pm.GARCH11(omega, alpha_1, beta_1, initial_vol). These hand HMC a differentiable latent chain directly (no manual scan). Our page discusses the GEOMETRY of such chains (P1/P2) but never names the API that builds them.

---
### Stationary initial condition via init_dist (AR-with-intercept)
*🔧 PyMC-specific*

Our A2 requires the stationary initial condition Normal(mu, sigma/sqrt(1-delta^2)). PyMC-specific how: init_dist=pm.Normal.dist(c/(1-rho), sd) on pm.AR, with c/(1-rho) = stationary mean. CAUTION worth recording: the pymc example sets the init SD to plain `sigma`, NOT the stationary sigma/sqrt(1-rho^2) that A2/Nickell-bias fix demand -- so their example gets the mean right but under-specifies the initial variance. Reinforces A2 (they get the mean stationary but flub the variance).

---
### Out-of-sample forecasting mechanics (pm.Data swap, manual chain extension, gp.conditional)
*🔧 PyMC-specific*

Add a library-note on the practical forecasting how, complementing our F-series (filter/smoother): wrap covariates in pm.Data (mutable) and set new values before sample_posterior_predictive; SHARP EDGE -- extending a latent GaussianRandomWalk/AR beyond the training window is NOT automatic and needs explicit manual extension (the pymc file flags this as 'careful handling'). GP forecasting is clean by contrast: gp.conditional('f_future', Xnew=t_future) then sample_posterior_predictive.

---
### Concrete operational convergence-threshold table (R-hat/ESS/divergences)
*📐 portable*

Our page deliberately avoids simple gates, but a first-pass operational table complements the blind-spot claims: R-hat <1.01 good / <1.05 ok / >1.05 investigate; ESS bulk&tail >400 / >100 / <100; divergences 0 / <0.1% random / >0.1% or clustered. Note the MCSE/SD<5% row is NOT independent - MCSE/SD = 1/sqrt(ESS), so <5% is algebraically ESS>400.

---
### PyMC log_likelihood API for LOO-CV
*🔧 PyMC-specific*

Library-note: PyMC v6 / ArviZ 1.x does NOT accept a top-level compute_log_likelihood= on pm.sample; request via pm.sample(idata_kwargs={'log_likelihood': True}) or compute post-hoc with pm.compute_log_likelihood(idata) before az.loo.

---
### az.plot_khat requires the LOO object, not idata
*🔧 PyMC-specific*

Library-note gotcha: az.plot_khat(idata) raises 'Incorrect khat data input'; must pass the LOO object first: loo = az.loo(idata, pointwise=True); az.plot_khat(loo).

---
### ArviZ quick-diagnostic recipe (check_sampling helper)
*🔧 PyMC-specific*

Operationalizes C6's 'read the per-parameter table, not the collapsed top-line.' A reusable az.summary-based check: count sample_stats['diverging'] (DataTree access in ArviZ 1.1), flag r_hat>1.01 and ess_bulk|ess_tail<400, and default-exclude auxiliary '~offset'/'~raw' vars. Concrete companion to our F-series false-alarm guidance (which also says: exclude zero-variance/deterministic quantities from automated checks).

---
### Parameter vs observation shape mismatch: group param is shape (K,), likelihood is size N; index-expand via alpha[group_idx]
*🔧 PyMC-specific*

PyMC library-note: log-likelihood sums over the N observations, so likelihood size is ALWAYS N (never K groups). Map group params to obs with pd.factorize(col, sort=True) -> group_idx and coords/dims, then mu = alpha[group_idx]. Common misconception: 'shrinking' the likelihood to K.

---
### 'Initial evaluation failed / -inf logp': distinguish structural support-violation from jitter noise; debug API
*🔧 PyMC-specific*

Enrich ST1: our ST1 says 'a new start won't fix it' — but that is the STRUCTURAL case only. Add Cause-2: default jitter+adapt_diag can push an otherwise-valid constrained param outside support -> here a start DOES fix it (init='adapt_diag' to drop jitter, set initvals=, or init='advi+adapt_diag'). Debug with model.point_logps() and model.debug(). Guards ST1 from over-application.

---
### Hard clip -> zero-gradient region; use softplus or naturally-constrained distributions
*🔧 PyMC-specific*

Enrich DM6/C6: pm.math.clip / hard constraints create exactly-zero-gradient flat regions -> divergences. Replace with pm.math.softplus (smooth R->R+), or use a naturally-positive distribution (HalfNormal/LogNormal) instead of clipping to positive. Our catalog mentions 'remove the hard clip' but not the softplus substitute.

---
### Python if/else is traced once at graph-build time
*🔧 PyMC-specific*

PyMC/PPL library-note: a Python if/else on a random variable is evaluated ONCE at model construction, not per-draw. Use pt.switch(cond,a,b), pytensor.ifelse.ifelse for branching, or pytensor.scan for iterative/loop logic that depends on RVs. Analogous to our DM8 (*_rng banned in model block) but a distinct trap.

---
### Sampling priors from a model with discrete latents
*🔧 PyMC-specific*

PyMC library-note: to draw priors from a model containing discrete latents, use pm.sample_prior_predictive (exact ancestral sampling), NOT pm.sample (MCMC mixes poorly on discrete priors).

---
### pm.Data containers for out-of-sample prediction, shape tracking, recompilation avoidance
*🔧 PyMC-specific*

PyMC library-note: static numpy arrays are baked into the graph. Wrap inputs in pm.Data and use pm.set_data({...}) to predict / re-fit across datasets without recompiling. The likelihood shape= must track the container (shape=X.shape[0]) or predictions won't resize.

---
### Consistent factorization across train/test splits; independent per-level indices
*🔧 PyMC-specific*

PyMC library-note: factorizing train and test separately produces inconsistent group->code maps ('group 0' differs). Use pd.Categorical on the full frame + .cat.codes so codes are stable across splits. For nested hierarchies use independent pd.factorize per level (avoid MultiIndex).

---
### Multicollinearity detection thresholds (condition number, VIF) + prediction-vs-interpretation nuance
*📐 portable*

Enrich LF2/LF3: add PRE-fit collinearity detection to the QR story — np.linalg.cond(X) > ~30, or VIF > 5-10, flags multicollinearity before the ridge appears. Decision nuance: if prediction (not coefficient interpretation) is the goal, collinearity may be harmless — don't interpret individual coefficients. Our catalog has the geometry (ridge/QR) but not the detection thresholds.

---
### PyMC performance handles: HSGP API, avoid saving large Deterministics, model.profile()
*🔧 PyMC-specific*

PyMC library-notes attaching to GP2 and SC: (1) low-rank GP via pm.gp.HSGP(m=[...], c=...); (2) avoid pm.Deterministic on n_obs x n_draws intermediates (memory blowup) — recompute in posterior_predictive; (3) profile with model.profile(model.logp()) and a grad-profile to operationalize our SC 'reframe runtime as gradient evaluations' move.

---
### PyMC 6+ / ArviZ API deprecations
*🔧 PyMC-specific*

PyMC/ArviZ library-notes (catalog hygiene, low statistical value): variable name may not equal its own dim label (ValueError in PyMC 6+); pm.MutableData/ConstantData removed -> pm.Data (mutable by default); az.plot_ppc_dist uses num_samples=, not num_pp_samples=.

---
### PyMC NUTS backend selection menu (nutpie / numpyro / pymc)
*🔧 PyMC-specific*

Add a backend-selection library-note under C1: nutpie (Rust, PyMC6 default, best mass-matrix adaptation, ~2-5x faster than pure-Python NUTS, CPU) / numpyro (JAX, GPU, `nuts={'chain_method':'vectorized'}` runs all chains as one batched program) / pymc (pure-Python fallback, needed for compound steps). Frame per C1: backend choice moves cost-per-gradient by a constant factor, never ESS-per-gradient (geometry is backend-invariant). Note nutpie supports scan/AR/GARCH11/HSGP/Mixture/DensityDist, so 'complex model' is not a reason to downgrade backend. We have the C1 principle but zero concrete backend guidance.

---
### DADVI — deterministic ADVI (fixed MC sample set removes ELBO gradient noise)
*📐 portable*

New technique: 'Deterministic ADVI fixes the Monte-Carlo sample set used to estimate the ELBO so the gradient is deterministic, removing MC gradient noise → faster, more stable VI convergence than stochastic ADVI.' Portable method (Giordano et al.); PyMC entry point `pymc_extras.fit(method='dadvi')`. Absent from our page (we only have ST4/ST5 on VI-as-initializer).

---
### Pathfinder mechanism (quasi-Newton / L-BFGS-path VI, multi-path)
*📐 portable*

Enrich ST4/ST5 (which name Pathfinder but don't say what it is): add the mechanism — 'Pathfinder traces the L-BFGS optimization path from a random init toward the mode, fits a Gaussian at each iterate, and (multi-path: `num_paths`) importance-resamples across the best-ELBO iterates. This is why it is seconds-fast and lands a point in the typical-set bulk — the exact property ST4 relies on.' `maxcor` = L-BFGS history.

---
### Compound-step samplers (NUTS + discrete kernel) as the fallback when discrete latents can't be marginalized
*🔧 PyMC-specific*

Enrich C6 / DM1 / DM10. Our stance is 'discrete is outside gradient samplers' reach — marginalize.' Add that PyMC (unlike Stan) natively supports compound-step sampling: assign discrete latents a discrete kernel (Metropolis/CategoricalGibbs) while NUTS handles the continuous block. Marginalization is still preferred (Rao-Blackwell), but compound-step is the native path when marginalization is infeasible. A method our catalog currently omits.

---
### adapt_delta ↔ target_accept / max_treedepth ↔ max_tree_depth naming cross-walk
*🔧 PyMC-specific*

Small library-note so PyMC users match our Stan-named DV/TD recs: Stan `adapt_delta` = PyMC `target_accept` (default 0.8), Stan `max_treedepth` = PyMC `max_tree_depth`. The pymc file's actual advice ('increase target_accept for difficult posteriors') is a shallow subset of our DV5/DV10 (raise ONLY for divergences; never cures a true funnel) — principle already covered, only the alias is missing.

---
### idata_kwargs log_likelihood=True required at sample time for LOO-CV/LOO-PIT
*🔧 PyMC-specific*

Low-priority library-note (out of scope for the geometry page — belongs to a model-checking/comparison page; see GAPS 'decision/model-checking' gap): pointwise log-likelihood is NOT stored by default; you must pass `idata_kwargs={'log_likelihood': True}` to `pm.sample()` to later run LOO-CV/LOO-PIT.

---
### nutpie backend requires pm.compute_log_likelihood before az.compare / LOO
*🔧 PyMC-specific*

Draft library-note attached near G1/G-series: 'PyMC's nutpie sampler does not store the pointwise log-likelihood by default; call pm.compute_log_likelihood(idata, model=...) for each model before az.compare / az.loo, or the comparison silently lacks the log_likelihood group.' Complements G1 ('lp__/target is not the pointwise log-lik') with the concrete PyMC/nutpie gotcha and API.

---
### 89% ETI as the ArviZ 1.1 default interval
*🔧 PyMC-specific*

Draft library-note: 'ArviZ 1.1 defaults to an 89% equal-tailed interval (ETI) — not 94%/95%, and ETI not HDI; report interval width and type explicitly since the default changed.' Concrete threshold/default absent from the catalog.

---
### Compressed NetCDF persistence of large idata (DataTree)
*🔧 PyMC-specific*

Draft library-note: 'persist idata early (save results.nc after the first good fit); in ArviZ 1.1 idata is a DataTree (groups via dict syntax), and idata.to_netcdf(engine="h5netcdf", encoding={var:{"zlib":True,"complevel":4}}) cuts file size 50–80%.' Pure tooling, low statistical value but concrete API.

---
### PyMC do-calculus API: pm.do (graph surgery, replace var with constant, sever upstream edges) vs pm.observe (add data, var stays stochastic, structure intact)
*🔧 PyMC-specific*

Add library-note under regression.md causal section: 'PyMC exposes structural-causal graph surgery directly. `with pm.do(model, {x: v})` replaces x's distribution with a constant and severs its incoming edges -> samples P(rest | do(x=v)); `with pm.observe(model, {y: v})` conditions without breaking structure -> P(rest | y=v). Interventions can be composed (`pm.do` then `pm.observe`) for counterfactual-style queries P(y | do(x), z).' This is the concrete API realization of CF6's controlled-vs-uncontrolled distinction, which our catalog states only in Betancourt's vocabulary.

---
### ATE as an interventional contrast E[Y|do(T=1)] - E[Y|do(T=0)]
*📐 portable*

Add technique/move under C5 (estimands): 'the average treatment effect is a named estimand = E[Y|do(T=1)] - E[Y|do(T=0)], computed as the difference of two interventional predictive means (two pm.do runs), NOT E[Y|T=1]-E[Y|T=0] on the observed data.' C5 covers estimand-dependence and marginal-effect order-of-operations generally, but does not name the ATE or its do-contrast construction.

---
### Custom likelihoods/priors: pm.DensityDist / pm.CustomDist
*🔧 PyMC-specific*

Library-note: pm.DensityDist(name, *params, logp=fn, observed=...) wraps an arbitrary logp TENSOR (not a Python float) as a likelihood; pm.CustomDist does the same for priors. Params pass positionally to logp. Pass random=fn(rng,size)->samples to enable sample_prior_predictive / sample_posterior_predictive; without it predictive sampling is unavailable. Cross-ref caveat: their illustrative horseshoe CustomDist (lines 396-416) uses the classic unbounded-local-scale form our SP1/SP3 flag as failing under a non-identified likelihood — prefer the regularized/Finnish slab.

---
### pm.Potential API + its three cautions
*🔧 PyMC-specific*

Library-note: pm.Potential(name, expr) adds an arbitrary term to the model logp (soft constraints, penalties, soft prior correlations, manual Jacobians). Three cautions worth recording: (1) Potentials affect logp only -> invisible to prior/posterior predictive sampling; (2) use for parameter constraints, not observed-data likelihoods (use DensityDist there); (3) strong negative potentials can produce improper posteriors.

---
### Manual change-of-variables Jacobian via pm.Potential
*🔧 PyMC-specific*

Enriches DM6's 'diagnose the constrained-parameter Jacobian' move with the PyMC how: when hand-rolling a transform (e.g. sigma = pt.exp(log_sigma) as a Deterministic), the change-of-variables term is NOT auto-added — insert pm.Potential('jac', log_sigma) (log|d sigma/d log_sigma| = log_sigma). Built-in transformed distributions add this automatically; only manual Deterministic transforms need the explicit Potential.

---
### Verify a custom logp integrates to 1
*📐 portable*

New technique (portable; catalog assumes correct densities): validate any hand-written custom density by numerically integrating exp(logp) over its support (scipy.integrate.quad) and asserting approx 1 — a cheap correctness gate before inference. PyMC how: compile the logp tensor via pytensor.function first. Complements the gradient-finiteness check (value-correctness vs gradient-correctness).

---
### Sum-to-zero & soft-penalty constraints for additive non-identifiability
*📐 portable*

Enriches EF2 (additive flat-direction non-identifiability that E-FMI is blind to): the standard fix for intercept<->group-effect additive degeneracy is a sum-to-zero constraint — hard via centering (alpha = alpha_raw - alpha_raw.mean(), or pm.ZeroSumNormal), or soft via pm.Potential(-k*(sum)^2). Add caveat: soft QUADRATIC penalties (soft ordering, soft sum-to-zero) introduce a stiff direction -> scale heterogeneity/anisotropy that RP10's dense metric or reparameterization must then absorb, so a hard bijection/ZeroSumNormal is usually preferable under NUTS.

---
### BART regularization knobs: number of trees m and the depth-penalizing tree prior
*📐 portable*

Draft technique `bart-tree-count-and-depth-prior`: the sum-of-trees prior keeps trees shallow via P(node splits at depth d)=alpha*(1+d)^(-beta), defaults alpha=0.95, beta=2 (raise alpha / lower beta => deeper trees). m is the bias/variance dial: m=50 default, 100-200 = smoother fit + more compute, 20-30 = faster but underfits. This is the BART analogue of GP length-scale/variance tuning — the mechanism the catalog covers for GPs but has no equivalent for tree ensembles.

---
### BART interpretability tooling: variable importance (inclusion-freq vs backward) and PDP/ICE
*🔧 PyMC-specific*

Draft library-note: `pmb.compute_variable_importance(idata, X, method='VI'|'backward')` + `pmb.plot_variable_importance`; `pmb.plot_pdp(idata, X, Y, var_idx=[...], xs_interval='quantiles')` for 1D/2D partial dependence and `pmb.plot_ice(...)` for individual conditional expectation. VI = tree inclusion frequency (cheap); backward = elimination importance (costlier, often better). Mechanistically distinct from — but overlaps in purpose with — our projpred selection and marginal-effects material (regression C5); worth cross-linking, not merging.

---
### pymc_bart API details: split_prior and out-of-sample set_data
*🔧 PyMC-specific*

Draft library-note: bias which features are split on via `split_prior` (length-n_features weight vector; None = uniform). Out-of-sample prediction requires `pmb.set_data({'mu': X_new})` inside the model context before `sample_posterior_predictive` — a fitted BART is not a callable function, exactly the 'a fitted GP is not a callable, out-of-sample requires explicit conditioning' caveat already stated in regression C5. So the PRINCIPLE is covered (GP); only the pymc_bart mechanics are new.

---
### pm.Censored / pm.Truncated wrappers; right/left/interval censoring taxonomy; detection limits
*🔧 PyMC-specific*

Complements our custom block/interval-censored likelihood rec (I1) with the built-in continuous case. Library-note: PyMC wraps any dist via pm.Censored(dist=Normal.dist(...), lower=, upper=) and pm.Truncated(dist=..., lower=, upper=); per-obs bounds via np.where arrays. Left-censoring encodes detection limits (value recorded at threshold, a measurement-process instance of C1); right-censoring encodes survival follow-up cutoff; interval-censoring via lower/upper arrays.

---
### PyMC ordinal API (OrderedLogistic/OrderedProbit, ordered transform, cutpoint init)
*🔧 PyMC-specific*

Library-note: pm.OrderedLogistic(eta=, cutpoints=) / pm.OrderedProbit; enforce ordering with transform=pm.distributions.transforms.ordered on the cutpoint Normal (shape K-1). Seed cutpoint mus with np.linspace(-2,2,K-1) to aid initialization / avoid label degeneracy.

---
### Targeted test-statistic PPC (posterior-predictive p-value) + grouped/stratified PPC
*📐 portable*

C1/A2 say 'the check must probe the direction of model space relevant to the goal' but give no concrete method. Add technique: define a targeted statistic T(y) (zero-fraction for zero-inflation, tail-fraction/max for heavy tails, skew), compute T on observed and on every posterior-predictive draw, overlay observed vs the predictive histogram (posterior-predictive p-value). Also stratified PPC (az.plot_ppc_dist(..., cols=['group'])) to catch per-subgroup misfit an aggregate PPC hides. Turns the abstract 'probe the relevant direction' into an executable check.

---
### Residual-vs-fitted pattern reading (funnel/curvature/clusters)
*📐 portable*

Add residual-vs-fitted as a criticism technique: funnel→heteroscedasticity, curvature→missing nonlinear term, clusters→missing grouping structure. BUT gate it with B1: in a partial-pooling model a residual-vs-fitted SLOPE is a mechanical shrinkage artifact, not misspecification — so the funnel/curve/cluster reading is valid for fixed-effect residual structure, and the pymc guide's naive residual heuristics must NOT be applied to shrinkage-induced slope. (External source is naive here; our B1 is the correct refinement.)

---
### Concrete convergence thresholds: R-hat / ess_bulk / ess_tail / mcse_mean
*📐 portable*

Catalog states 'R̂≈1, adequate ESS' abstractly; add the concrete table: R̂ <1.01 good / <1.05 acceptable / >1.05 investigate; ess_bulk AND ess_tail >400 good / >100 acceptable / <100 investigate (tail ESS specifically gates credible-interval reliability); mcse_mean <5% of SD good / <10% acceptable. CAVEAT: convergence thresholds likely already live on the computation/geometry diagnostics page (corpus is ~91% diagnostics per GAPS.md) — verify there before adding to avoid duplication; if present, only the ess_bulk-vs-ess_tail split is the additive nuance.

---
### Energy-plot (E-BFMI) reading for HMC/NUTS health
*🔧 PyMC-specific*

A1/C1 name 'healthy E-BFMI' but never say how to read it. Add: az.plot_energy — overlapping marginal-energy vs energy-transition distributions = good exploration; large gap = poor exploration / difficult geometry; long marginal-energy tails = heavy-tailed posterior. Key value: catches failures R̂ and ESS miss, e.g. a sampler exploring only one mode of a multimodal posterior. Concretizes the E-BFMI term already used in the claims.

---
### Deep-convergence plots: rank plots + ESS-evolution/quantile/local
*🔧 PyMC-specific*

Add: plot_rank (uniform ranks per chain; more sensitive than trace plots — modern rank-normalized check); plot_ess_evolution (linear growth = healthy, plateau = mixing capped, more draws won't help); plot_ess kind='quantile'/'local' (low tail-quantile ESS = unreliable CIs; a sharp ESS dip at one quantile = possible multimodality). Likely overlaps the diagnostics page; verify — the quantile/local-ESS→multimodality read is the additive bit.

---
### Divergence acceptability rule + parameter-space localization
*🔧 PyMC-specific*

Catalog uses divergences=0 in efficacy slots but gives no acceptability rule. Add: 0 ideal; <0.1% AND randomly scattered = often acceptable; >0.1% OR clustered = do not trust. The random-vs-clustered distinction is the actionable part. Localize with az.plot_pair(var_names=[...], divergences=True) to see where they concentrate (e.g. the funnel neck) — directly supports the existing funnel-geometry pattern.

---
### Concrete comparison thresholds: Pareto-k buckets + az.compare elpd_diff rule
*📐 portable*

Pin G6/G7/G8's abstract rules to numbers: Pareto-k buckets <0.5 good / 0.5–0.7 ok / 0.7–1.0 bad / >1.0 very bad; az.compare decision rule |elpd_diff|<4 → indistinguishable, |elpd_diff|<dse → not significant, |elpd_diff|>4 AND |elpd_diff/dse|>2 → meaningful. Guard: G6 holds k is INFLUENCE not misspecification, so pymc's 'k>1.0 = likely misspecification' is only the triage endpoint (via p_loo-vs-p), not the meaning of k — keep our framing.

---
### ArviZ 1.1 API surface + LOO utility family (DataTree, renamed plots, waic removed)
*🔧 PyMC-specific*

Our moves reference 'arviz' generically. Add a library-note pinning ArviZ 1.1: idata is a DataTree (bracket access idata['posterior'], .children not .groups(), map_over_datasets not .map()); plots renamed (plot_trace_dist, plot_ppc_dist, plot_ess_evolution); az.summary/plot_dist use ci_prob/ci_kind (default 89% ETI); az.waic REMOVED → az.loo only (reinforces D3's WAIC→LOO move); LOO family loo_pit, loo_moment_match, reloo, loo_kfold, loo_subsample (large data), loo_r2, loo_metrics (RMSE/MAE), loo_expectations — these are the concrete API names behind G5/G7 (kfold/moment-match/reloo) and H4/H5 (Bayesian R²).

---
### 'Which plot when' question→function lookup + plot_elpd pointwise comparison
*🔧 PyMC-specific*

Adopt the compact question→ArviZ-call index as a library-note mapping our diagnostic situations to calls: converged?→plot_trace_dist/plot_rank; divergences?→plot_pair(divergences=True); ESS?→plot_ess_evolution; mixing?→plot_autocorr; HMC health?→plot_energy; fit?→plot_ppc_dist; calibration?→plot_loo_pit; estimates?→plot_dist; group effects?→plot_forest; best model?→plot_compare; influential pts?→plot_khat. Also add plot_elpd (pointwise elpd differences) as the tool to identify WHICH observations drive a model comparison — currently absent from the G-section.

---
### Subsampling LOO for large N (n > ~10k)
*📐 portable*

Our comparison-mechanics section (G) has no scalability entry. Add: for large datasets, exact PSIS-LOO over all points is costly; azs.loo_subsample(dt, observations=1000) estimates elpd from a subsample (difference-estimator, Magnusson et al.). Portable method; ArviZ API noted.

---
### 4-bucket Pareto-k threshold table (0.5 / 0.7 / 1.0)
*📐 portable*

Our G6/G7 use only the single 0.7 gate. Enrich with the granular table: k<0.5 reliable; 0.5-0.7 marginal (usable, less accurate); 0.7-1.0 unreliable (moment-match / k-fold); k>1.0 PSIS fails entirely (must k-fold). Add the caveat that modern PSIS uses a sample-size-dependent threshold min(1-1/log10(S), 0.7) and this fixed table is the classic form.

---
### ArviZ 1.1 / PyMC-6 core LOO + compare API surface
*🔧 PyMC-specific*

Add a library-note: PyMC 6 returns xarray DataTree; ArviZ split into arviz_stats (azs) / arviz_plots (azp), DataTree-first; az.waic REMOVED -> LOO only (matches our D3 WAIC->LOO preference). Calls: azs.loo(dt) / dt.azstats.loo(); azs.loo_moment_match; azs.loo_kfold(dt, K=10); azs.reloo(dt, loo, model=...); azs.compare({name: dt}) with ic=/scale= dropped (LOO-only). compare() gains diag_elpd (per-model pareto-k issues) and diag_diff (small-data / practically-equivalent flags) columns. Plots: azp.plot_khat, plot_compare, plot_elpd, plot_loo_pit. Default CI = 0.89 ETI (ci_prob= / ci_kind=; low-level hdi() uses prob=).

---
### arviz_stats LOO-weighted predictive-metric functions
*🔧 PyMC-specific*

Add a library-note (all need posterior_predictive + log_likelihood groups): azs.loo_expectations(dt, kind='mean'|'var'|'quantile') = LOO-weighted per-obs expectations; azs.loo_metrics(dt, kind='rmse'|'mae') -> cross-ref F3 (LOO RMSE is the honest out-of-sample version, includes residual noise); azs.loo_score(dt, score_func='crps'|'log') -> cross-ref G13 (CRPS / proper scores); azs.loo_r2(dt) = LOO Bayesian R2 -> cross-ref H4/H5 and CARRY OVER our caveats (R2 is definition- and observation-model-dependent; the pymc skill presents loo_r2 without them).

---
### pm.find_constrained_prior — solve dist params so `mass` falls in [lower, upper]
*🔧 PyMC-specific*

Library-note: pm.find_constrained_prior(dist, lower, upper, mass, init_guess) returns params implementing 'I'm 95% sure X is between A and B' (Normal/LogNormal/Gamma/Beta patterns given). This is the concrete PyMC tool for our abstract 'containment-prior tuning requires a numerical solver' (C3) — we describe the principle but name no API. IMPORTANT cross-link to our E6 caveat: for families without closed-form CDF the solver output is only an *initialization* and can be ~10x off exact (our gamma example alpha=5.06 guess vs 45.6 exact), and a shape parameter sampled inside the model makes the inverse-CDF AD ill-conditioned (slow/biased HMC). So flag find_constrained_prior as fixed-parameter tuning only.

---
### PreliZ elicitation toolkit (roulette, quartile, predictive_finder, maxent)
*🔧 PyMC-specific*

Library-note for PreliZ (pz), a dedicated elicitation library we never reference: (1) pz.roulette(x_min,x_max,nrows) interactive chip-and-bin allocation -> fitted dist; (2) pz.quartile(family,q1,q2,q3) fit from expert quartiles; (3) pz.predictive_finder(model, target) elicits priors by reasoning about *observable* predictions ('when x=5, y is typically 10-30') — this is a ready-made PyMC tool for C4's 'push the prior forward to the interpretable quantity and check it there' workflow; (4) pz.maxent (see maxent claim). New tooling for the elicitation gap.

---
### Prior sensitivity analysis workflow (multi-prior refit + posterior contraction + power-scaling sweep)
*📐 portable*

Enrich: our power-scaling appears only as scattered single-purpose moves (W6 mixture weight, X5 spline nuisance coefficients) with no named general workflow. Add a technique that elevates it: (a) refit under original / wider / different-family (StudentT) priors and compare with az.plot_forest — congruent posteriors = data-driven/robust, divergent = report as prior-sensitive; (b) report prior->posterior *contraction* as the informativeness metric (strong contraction = data informative) — a named concept we lack; (c) systematic version: scale the prior log-density by alpha over [0.5, 0.75, 1.0, 1.25, 1.5] (power-scaling), stability across alpha = robust. We invoke power-scaling but never define the alpha-sweep mechanism or the contraction metric.
