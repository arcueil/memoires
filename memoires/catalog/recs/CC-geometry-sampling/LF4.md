# ✗ LF4 · when **N<M+1 or perfectly-collinear covariates create a σ-funnel** → a weak/uninformative σ prior does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✗ LF4**  · when **N<M+1 or perfectly-collinear covariates create a σ-funnel** → a weak/uninformative σ prior does **NOT** work.
- why: the degenerate ridge width narrows as σ→0, creating a funnel the likelihood cannot close.
- conditions: a strongly informative lower-bounded σ prior could regularize the geometry.
- tier: 🟢 · source: taylor_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Constrain the offending tails — tighten the relevant priors" · "Add priors on the scale hyperparameters; escalate to genuinely informative"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ regression U10 · for **exact collinearity** (N<M+1, or perfectly correlated components ](../../recs/regression/U10.md) `0.89`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.85`
- [regression C3 · Ridges and funnels in the *linear predictor* split into two look-alike](../../claims/regression/C3.md) `0.81`
- [✓/✗ CC-priors-identifiability G5 · when **you set ρ-prior bounds from the observed covariate span** → wor](../../recs/CC-priors-identifiability/G5.md) `0.81`
