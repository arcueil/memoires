# New portable CLAIMS from pymc-L1 (fill gaps)

### Structural time-series: additive component decomposition (trend / local-linear-trend / seasonal / noise)
*📐 portable*

New claim: a structural time series decomposes additively into interpretable latent components -- level/trend (random walk, or local-linear-trend where level's drift is itself a RW slope), seasonality, and observation noise, each with its own state-noise scale, fit jointly. This BSTS/STS paradigm (and the local-linear-trend building block, level_t = level + cumsum(slope+innov)) is entirely missing; our page treats latent chains only through the CP/NCP geometry lens.

---
### Prior-data conflict as a diagnostic situation (post-fit)
*📐 portable*

New claim/rec (convergence-diagnostics currently has NO prior-conflict situation; GAPS flags prior-substance as thin): posterior piled against a prior boundary, prior!=posterior, divergences concentrated near prior boundaries, or low ESS on a param = prior-data conflict (prior too narrow or on wrong scale). Diagnose via prior/posterior overlay (az.plot_dist_comparison); resolve by rescaling/widening the prior from domain knowledge (or checking data errors) — not by tuning the sampler.

---
### Sample the prior by ancestral/forward sampling, not MCMC (the 'MCMC prior sampling fallacy')
*📐 portable*

New portable claim: 'A model with no observed likelihood factor is a pure generative DAG — draw from its prior by ancestral (forward) sampling in dependency order, which is exact and O(1)-per-draw, never by running a full sampler. MCMC on an unconditioned model is slow and mixes poorly, most acutely for discrete latents HMC cannot move through at all.' Attach a library-note: PyMC `pm.sample_prior_predictive()` (vs the anti-pattern `pm.sample()` with no data). Not currently anywhere in the page; ties tangentially to C6 (discrete hard for HMC) and DV8 (prior-only run).

---
### Mean-field vs full-rank VI approximating family
*📐 portable*

New claim (VI analogue of RP10/RP11's diagonal-vs-dense mass matrix, one level up in the approximating family): 'Mean-field VI (factorized q) ignores all posterior correlations → axis-aligned, overconfident, variance-underestimating uncertainty; full-rank VI restores a dense covariance at O(d^2) cost.' PyMC: `method='advi'` vs `'fullrank_advi'`. Our page never discusses the covariance structure of the VI posterior.

---
### Iterative build→check→expand as the organizing method (Box's loop / Gelman-McElreath workflow)
*📐 portable*

Draft claim: 'Model building is iterative, not a single fit — start from the simplest plausible model and let each posterior-predictive misfit motivate adding exactly ONE component; a complex model is understood only relative to the simpler ones it nests, and computational problems are easier to localize in simple models.' This is the GAPS.md-flagged iterative-model-building apex gap; workflow.md gives a real curated source to ground it (Gelman/Vehtari/McElreath 2025, Gelman et al. 2020). Our closest existing entry is C3 (nested shrink-to-zero expansion) but that is only the overfitting-protection mechanism, not the outer loop.

---
### BART (Bayesian Additive Regression Trees) as a whole model class
*📐 portable*

Draft claim (⚪ single-source): BART models an unknown regression function as a sum of m regularized decision trees under a Bayesian prior that keeps each tree a weak learner, giving a nonparametric alternative to GPs/splines that captures nonlinearities + interactions automatically with no kernel or basis to choose. Used as the mean of any likelihood: `mu = pmb.BART('mu', X, Y, m=50)`. The catalog's structure taxonomy has 10 families (regression/GP/hierarchical/mixture/latent-factor/sparse/spatial/time-series/measurement-error/ode) and NO tree-ensemble slot — this warrants a new nonparametric-regression model page.

---
### Censored vs truncated: distinct likelihood treatments
*📐 portable*

Our page touches selection-truncation of covariates (A2) but never states the likelihood distinction. New claim (portable): censoring = out-of-bound values ARE in the dataset, recorded at the bound -> likelihood integrates the tail mass (a CDF term), sample size fixed. Truncation = out-of-bound values are never observed -> likelihood renormalizes the density by P(in-bounds), sample size varies. Picking the wrong one biases parameters.

---
### Maximum-entropy priors: least-committal distribution subject to elicited constraints
*📐 portable*

New claim (or a nuance bullet under C3). Given constraints (bounds+mass, or moments), the maximum-entropy distribution is the unique least-committal choice consistent with them; PreliZ pz.maxent(family, lower, upper, mass). The maxent PRINCIPLE is entirely absent from our corpus. Reconcile with C3 ('non-informative is a myth'): maxent is NOT a non-informative prior — the *constraints* carry the information, so it is a principled weakly-informative construction; still push it forward (C4) and prior-predictive-check. Worth an explicit note that 'least-informative' here means 'least-informative GIVEN constraints', not flat.
