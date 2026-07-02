# New RECS from pymc-L1 (39)

### Concrete default weakly-informative prior MENU per parameter type
*📐 portable*

Add a rec 'starter weakly-informative defaults (standardized scale)': coefficients N(0,1) (standardized linear) / N(0,2.5) (logistic/log-odds, allows OR~0.01-100); intercepts N(0,2.5) or domain-centered on original scale; scale params HalfNormal(1) or HalfStudentT(nu=3-4); probabilities Beta(1,1)/Beta(2,2) or logit-Normal(0,1.5); rates Gamma/LogNormal; StudentT(nu=3-7) coefficients for outlier robustness. Our catalog explains why vague fails and how to engineer tails, but never gives the constructive default table. Cross-ref C3. Fold biostat(log-OR/log-HR)/econ(elasticity/treatment)/physics(LogNormal+constraint) domain examples in as instances.

---
### Laplace / Lasso shrinkage prior
*📐 portable*

Add rec under sparse regression: Laplace(0,b) gives continuous shrinkage (tall mode at 0, thick tails) but shrinks even LARGE coefficients (contrast horseshoe, which lets large signals escape). Simpler/better-behaved than horseshoe when full sparsity isn't required. We currently only carry horseshoe/Finnish-horseshoe (W3, C1).

---
### Spike-and-slab prior
*📐 portable*

Add rec: discrete-mixture spike-and-slab (Bernoulli inclusion x diffuse slab) is the 'gold-standard' for genuine variable selection / EXACT zeros, but computationally demanding (discrete latent). Complements C1 ('horseshoe never yields exact zeros; Bayesian sparsity is a whole-posterior property') and W7 (projection-predictive selection as the removal decision). We name projection-pred but not spike-slab.

---
### R2D2 prior (prior induced on R^2 / variance explained)
*📐 portable*

Add rec concretizing our recurring move 'put the scale on TOTAL model variance' (W1/W2/C1): the R2D2 prior places an interpretable Beta-style prior directly on R^2 and distributes it across coefficients. This IS the total-variance-budgeting idea as a named, usable method. Library-note: pymc_extras.R2D2M2CP(output_sigma, input_sigma, r2, r2_std, dims) (X must be centered). Turns our abstract move into an off-the-shelf tool.

---
### HSGPPeriodic for periodic/seasonal structure (stochastic-resonator basis; 1D only; period must be fixed or tightly-prior'd; no boundary param)
*📐 portable*

New rec: scalable representation of periodic/seasonal components. HSGP cannot represent the periodic kernel at all; a separate low-rank scheme (PyMC HSGPPeriodic, m basis funcs) is needed. Conditions: 1D input only, known/near-fixed period. We currently cover state-space Matern (S3) and additive Fourier 'seasonal frequencies' as an aliasing example (A1) but never the actual periodic scalable-GP method.

---
### Heteroscedastic GP: input-dependent noise via a second GP on log sigma(x)
*📐 portable*

New rec (portable modeling pattern we lack): model input-dependent observation noise by putting a second (HS)GP on log-noise, sigma = exp(f_log_noise), then y ~ Normal(f_mean, sigma). Two GPs, exp link guarantees positivity.

---
### Mixture of regressions (latent-class regression: each component has its own alpha_k, beta_k, sigma_k)
*📐 portable*

Add a model rec: mixture-of-regressions for unknown subgroups with different covariate-outcome relationships — component k = Normal(alpha_k + beta_k*x, sigma_k), combined under w~Dirichlet. Same K! label-switching caveats (order on alpha or beta). Portable model class the catalog currently lacks.

---
### Post-hoc relabeling / Stephens algorithm as an identification strategy when in-model ordering is unnatural
*📐 portable*

Add a rec under 'Breaking the K! labeling degeneracy' as a third route alongside B1/B3/O3: relabel draws post-hoc — per draw, argsort component-indexed vars by a chosen component parameter and take_along_axis; for overlapping/ambiguous cases use the decision-theoretic Stephens algorithm (R `label.switching`). Complements B1 ordering; distinct method we don't currently name.

---
### Choosing number of components K via LOO-CV/az.compare, and the caution that LOO is unreliable for mixtures (high Pareto k) → fall back to K-fold CV + domain knowledge
*📐 portable*

Add a rec: select K by comparing models with LOO/elpd (az.compare), BUT LOO is frequently unreliable for mixtures — high Pareto k because removing one point can shift a whole component — so use K-fold CV as fallback and constrain K with domain knowledge. Catalog has zero model-selection-for-K content; this is a real gap and a genuine threshold/pitfall.

---
### GARCH / conditional-volatility (time-varying variance) models
*📐 portable*

New model class entirely absent from the page: conditional heteroskedasticity / stochastic volatility. Rec: model returns with time-varying variance sigma^2_t = omega + alpha*eps^2_{t-1} + beta*sigma^2_{t-1} (GARCH(1,1)); PyMC pm.GARCH11(omega, alpha_1, beta_1, initial_vol); priors omega~HalfNormal, alpha~Beta(2,5), beta~Beta(5,2) with approximate stationarity alpha+beta<1. Also a GAPS.md candidate -- volatility modeling is a genuine source gap.

---
### Seasonality encodings: Fourier basis vs sum-to-zero dummies, with n_terms heuristic
*📐 portable*

New rec: encode seasonality with a Fourier basis (K sin/cos harmonics at the period) -- smooth, cheap, handles non-integer periods (365.25) and stacked multi-seasonality (weekly+yearly bases summed). Heuristic: n_terms <= period/2 (Nyquist), usually far fewer; more terms = more flexible but overfit. Contrast with the interpretable dummy alternative: one effect per season under a sum-to-zero identifiability constraint (concatenate([raw, -raw.sum()])), which needs integer periods. Seasonality is wholly absent from the catalog.

---
### GP time-series: temporal kernels, kernel composition, HSGP scaling
*📐 portable*

New rec: GP prior over time as a nonparametric TS model. Matern52 for smooth trends; compose kernels as structural decomposition -- cov_trend (long-lengthscale Matern) + locally-periodic seasonality (Periodic x Matern-decay). Scaling: exact Latent GP is O(T^3); switch to HSGP (Hilbert-space approx, m basis fns, boundary factor c) for T > ~500 (concrete pymc threshold; pymc_specific part). Forecast via gp.conditional(Xnew). Kernel composition = additive/multiplicative structure, the GP analogue of the STS decomposition above.

---
### Divergence -> cause -> fix decision table (funnel/boundary/scattered/constraint), headlined by non-centered parameterization
*📐 portable*

Add a remediation rec. Our page treats divergences ONLY as a signal (B3/B7 note they are silent on label switching) and never says what to DO. Draft: 'Read the divergence pattern, then fix' - funnel at low sigma (centered hierarchical) -> non-centered param (alpha = mu + sigma*z, z~N(0,1)); divergences clustered at a boundary (diffuse scale prior HalfCauchy/Uniform) -> weakly-informative HalfNormal/Exponential; scattered randomly -> raise target_accept 0.8->0.95; hard constraint -> reparameterize/soften. Non-centered for Neal's funnel is the single highest-value missing item. Likely belongs to a geometry/reparameterization page too.

---
### Mixture label-switching FIX = ordering constraint
*📐 portable*

We DETECT label switching thoroughly (C2, B3, B7) but give zero remediation. Add rec: break exchangeability with an ordered transform on mixture locations/weights (pm.Ordered / ordered constraint), or accept it and relabel in post-processing. External expert closes our detection-only gap.

---
### Robust likelihood for outliers / poor posterior-predictive fit
*📐 portable*

Rec: when observed data falls outside the posterior-predictive envelope, the cause->fix map is missing predictor -> add covariate; wrong family -> change likelihood; missing structure -> add hierarchy; outliers -> swap Normal->StudentT (robust likelihood). Portable, absent from our page.

---
### LOO model comparison and the elpd_diff-vs-dse decision rule
*📐 portable*

Whole model-comparison axis is absent from the catalog. Draft rec: az.compare -> rank/elpd/elpd_diff/dse; rule 'elpd_diff within ~2*dse => models statistically indistinguishable.' Capture with a caveat: Stan-side guidance is often stricter (~4*se), so record the threshold as a soft heuristic, not a hard cutoff. Relates to GAPS 'Decision/utility' apex gap.

---
### Posterior predictive checks + LOO-PIT as the model-adequacy tools
*📐 portable*

C2 explicitly says the sampler diagnostic suite is blind to model misspecification but names no remedy. PPC (plot_ppc, kind=ecdf) and LOO-PIT (plot_loo_pit) are exactly the adequacy checks that fill that hole. GAPS already flags predictive checks as fragmentary; likely a separate model-criticism page rather than this one.

---
### Continuous relaxation of a discrete switch (temperature-controlled sigmoid)
*📐 portable*

Rec: besides marginalization (DM1) and reparameterization (DM6), a discrete switch can be softened with sigmoid((x-thr)/T) (lower T = sharper) so NUTS sees a differentiable density. Note: analytic marginalization is still Rao-Blackwell-superior where available; relaxation is the fallback when enumeration is infeasible.

---
### Prior predictive checking workflow + over-tight-prior link-function saturation
*📐 portable*

New rec (GAPS-flagged 'iterative workflow / prior substance' area): always run pm.sample_prior_predictive BEFORE fitting and confirm implied outcomes are plausible across the FULL predictor range, not just the training range. Specific failure it catches: a too-narrow slope prior + extrapolated X makes sigmoid(X@beta) hit exactly 0/1 -> log(0)=-inf in the likelihood on new data.

---
### Exponential-link overflow in Gamma/Beta models
*📐 portable*

Rec: exp-based links/transforms in Gamma/Beta models can overflow (mu can exceed ~1e20 -> logp overflow). Use softplus instead of exp, or model on the log scale (fit Normal on log y). Numerics sibling to the clip->softplus item.

---
### Concrete start-simple / hierarchical build-up ladders
*📐 portable*

Draft rec: '✓ when starting a model → begin with the simplest structure and add one piece at a time. Grouped data: complete pooling → no pooling → partial pooling → varying slopes → group-level predictors, comparing via LOO at each rung and checking whether the added level reduces between-group variance. Regression: 1–2 key predictors first. Time series: simple trend / random walk before seasonal or AR structure.' Not in the model-evaluation page (may also belong on a hierarchical-models page).

---
### Fit the expansion even when you believe the simpler model suffices — the comparison itself is informative
*📐 portable*

Draft rec: '✓ when deciding whether to add complexity → fit the expanded model and compare even if you expect no gain. A null comparison demonstrates the simpler model is adequate; a positive one identifies real structure; and the elpd difference itself characterizes the data-generating process.' Distinct from C3/C4 (which are about shrink-to-zero prior protection); this is about the value of the negative result.

---
### Report the whole model sequence, not just the final model (model progression table)
*📐 portable*

Draft rec (reporting discipline): 'when reporting → present the labelled model progression (Model 1..N) as a table with description / ELPD / elpd_diff / weight, plus the prior-predictive findings and the PP misfits that motivated each expansion — the modeling journey IS the analysis, not just the final parameter table.' No reporting/communication rec exists in the catalog.

---
### Instrumental variables as an identification strategy under unobserved confounding
*📐 portable*

New rec under SA2: 'for a causal effect with an UNobserved confounder -> a conditional-only (or backdoor) model does NOT identify it; use an instrument Z (Z->X, Z affects Y only through X, Z indep of the confounder) built into the structural model.' Our catalog has zero coverage of IV; only mentioned obliquely in the pymc file ('combine pm.do with appropriate model structure'). Genuine gap in named identification strategies.

---
### Front-door adjustment via a fully-mediating observed mediator
*📐 portable*

New rec under SA2 (sibling to the IV rec): 'when the confounder is unobserved but a fully-mediating mediator M (X->M->Y, no direct X->Y, M unconfounded with Y given X) is observed -> the effect is identified via the front-door criterion; encode it in the structural model rather than conditioning on the confounder.' Absent from our catalog. Could be bundled with IV into one claim on identification strategies when the confounder is unobserved (complements CF2/CF7 which assume the confounder can be modeled directly).

---
### Simulation-based / likelihood-free inference (ABC via SMC)
*📐 portable*

New method-class we lack entirely (outside this page's HMC/NUTS geometry scope -> likely a new page + a GAPS.md entry). When no tractable likelihood exists but you can simulate: use ABC / SMC-ABC (PyMC pm.Simulator + pm.sample_smc, kernel='metropolis' or 'IMH'; gradient samplers do NOT apply). Compare simulated vs observed via summary statistics + a distance (default = sum of squared diffs); the choice of (ideally sufficient) summaries governs the approximation quality. Add to GAPS.md apex list: 'Likelihood-free / simulation-based inference (ABC, SMC-ABC) — the corpus is entirely gradient-sampler-centric.'

---
### Heteroscedastic regression via a second BART on log-sigma
*📐 portable*

Draft rec (✓): model non-constant variance by putting a SEPARATE BART on the log scale param: `log_sigma = pmb.BART('log_sigma', X, Y, m=20); sigma = exp(log_sigma)` alongside the mean BART. Directly fills the acknowledged real-valued gap #2 in FIELD_GUIDE ('heteroskedasticity / modeling sigma as a function of predictors is absent despite being a first-order concern') — and is a nonparametric alternative to a parametric variance model.

---
### Semiparametric composition: BART mean + parametric/random-effect components
*📐 portable*

Draft rec (✓): compose `mu = X_linear @ beta` (known interpretable linear effects) `+ pmb.BART('nl', X_nonlinear, Y)` (unknown nonlinearity/interactions) `[+ alpha[group_idx]]` (group random effects). Keeps structured, interpretable terms while BART soaks up residual nonlinearity — the tree analogue of the GP-plus-linear-mean additive pattern; the catalog has additive-GP-components claims but nothing for BART+parametric.

---
### Hurdle models + the zero-inflated-vs-hurdle decision rule
*📐 portable*

Absent entirely. New rec: hurdle = one Bernoulli(theta) gate decides zero-vs-positive, a count process TRUNCATED-at-zero generates positives; ALL zeros come from the gate. Choose hurdle when zero means 'event did not occur' (behavioral gate) and positives are 'how many given it occurred'; choose ZI when some zeros are structurally impossible AND the count process can also emit zeros. How (PyMC CustomDist): pos logp = log(theta) + Poisson.logp(y|mu) - log(1 - exp(-mu)) [truncation adjustment]; zero logp = log(1-theta).

---
### Tobit regression (left-censored-at-zero regression)
*📐 portable*

Absent. New rec: for limited/corner outcomes piled at a bound (expenditure, hours worked, demand censored at 0) -> Tobit = linear model with Normal likelihood wrapped in censoring at the bound: pm.Censored(pm.Normal.dist(mu=X.b, sigma), lower=0). Fitting an ordinary Gaussian ignores the point mass at the bound and biases the slope.

---
### Ordinal regression as coarsened-measurement model + cutpoint ordering constraint
*📐 portable*

Absent, but directly on-topic: ordered categorical outcomes (Likert, severity grades) = latent continuous eta=X.b partitioned by K-1 ordered cutpoints, P(Y<=k)=sigmoid(c_k - eta). This is the categorical analog of B2's bin-integration measurement model. Identifiability REQUIRES cutpoint ordering: enforce via an ordered transform, or induce from positive differences (cumsum of HalfNormal diffs, recentered). Logistic vs probit link = two options.

---
### Robust regression via Student-t likelihood (implicit contamination model)
*📐 portable*

C1 gives contamination as an EXPLICIT signal/background mixture; add the implicit-mixture route. New rec: swap Normal->Student-t likelihood to downweight outliers without flagging them (Student-t = infinite scale-mixture of Normals). nu = tail heaviness: nu=1 is Cauchy (very heavy), nu>30 ~ Normal. Priors: Gamma(2,0.1) (mode ~10) weakly-informative; Exponential(1/29)+1 (heavy-tail-leaning) with the +1 offset to keep nu>1 (finite mean); or fix nu~4. Compare vs Normal by LOO (az.compare).

---
### Bayesian quantile regression via asymmetric-Laplace likelihood
*📐 portable*

Absent. New rec: to regress a chosen quantile tau (0.5=median, 0.9=90th pct) instead of the mean -> use the asymmetric Laplace as the likelihood with fixed tau. logp(y)=log(tau(1-tau)/sigma) - z(tau - [z<0]), z=(y-mu)/sigma; mu=X.b. Outlier-robust alternative to mean regression; implement in PyMC via pm.CustomDist.

---
### LOO-PIT calibration diagnostic (leave-one-out PIT uniformity)
*📐 portable*

Add a ✓ rec in section C (model criticism): 'when checking whether the predictive is CALIBRATED (not just shape-matched) → LOO-PIT (az.plot_loo_pit). Uniform/diagonal = well-calibrated; U-shape = underdispersed/overconfident; inverted-U = overdispersed/underconfident; S-curve = systematic bias. More sensitive than a plain PPC because each observation is scored under a fit that EXCLUDES it.' This is a distinct evaluation axis (calibration) from A2's PPC shape-envelope check and is nowhere in the catalog — genuine gap in this page's own territory.

---
### LOO-PIT calibration check (posterior-predictive PIT under LOO weights)
*📐 portable*

Genuinely absent from our evaluation page (we have SBC = prior-side calibration and generic PP checks, but no PIT-based posterior-predictive calibration entry). Add a ✓ rec: when you want to check predictive calibration WITHOUT held-out data → LOO-PIT. Interpretation table: uniform histogram = calibrated; U-shape = underdispersed (predictions too narrow); inverted-U = overdispersed (too wide); skew = systematic bias. API: azp.plot_loo_pit(dt, var_names=[...]).

---
### Pseudo-BMA+ weighting and the stacking / pseudo-BMA+ / equal-weights choice
*📐 portable*

Our G9/G10 cover stacking-vs-elpd-ranking but not the alternative weighting schemes. Add a decision rec: stacking (default; minimizes KL from true predictive to the weighted mixture; best when true model ∉ set); Pseudo-BMA+ (Bayesian-bootstrap of elpd, az.compare(method='BB-pseudo-BMA'); use when you want uncertainty OVER the weights); equal weights (when models encode distinct scientific hypotheses to average over).

---
### Prior strategy decision procedure (route by expert access + scale knowledge)
*📐 portable*

New rec opening a 'Situation: choosing HOW to source a prior (elicitation)' section. Decision tree: expert access & can quantify precisely -> SHELF/PreliZ roulette/quartile; expert but imprecise -> constrained/maxent priors; no expert but know rough scale -> weakly-informative (routes into our existing C3 scale/tail engineering); no scale knowledge -> iterate via prior-predictive check. This is the *routing* layer our catalog lacks entirely (we cover the technical calibration of a prior once chosen, never how to select the sourcing strategy). Directly fills the flagged GAPS.md 'prior elicitation from substance' gap.

---
### SHELF-like expert elicitation protocol (7 steps)
*📐 portable*

New rec: define parameter+units -> establish plausible min/max -> elicit quantiles (25/50/75) -> elicit tail behavior -> fit distribution (find_constrained_prior / pz.quartile) -> validate by showing the fitted dist back to the expert -> close with a prior-predictive check ('do these predictions look realistic?'). Portable structured-elicitation workflow that directly fills the 'prior elicitation from substance' GAP; our catalog has nothing on the expert-interview mechanics.

---
### Translating verbal domain knowledge into a distribution family/parameters
*📐 portable*

New rec (translation table): 'roughly A-B' -> constrained mass=0.90 on [A,B]; 'usually around X, rarely above Y' -> LogNormal/Gamma with median≈X and 95th pct≈Y; 'positive, diminishing for large values' -> HalfNormal / Exponential / HalfCauchy; 'could go either way ~50-50' -> Beta(1,1) or symmetric Normal(0,·); 'no more than X in absolute value' -> TruncatedNormal or Uniform(-X,X). Elicitation-substance heuristics mapping words -> family; complementary to our C3/C4 which assume the family is already chosen.
