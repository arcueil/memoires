# ✗ DG1 · for **nonlinearly-correlated component covariates** → reading **curvature in a conditional retrodictive quantile plot** 

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C2 · Linear (and polynomial) regression is a *local Taylor approximation* — validity ](../../claims/regression/C2.md)

**✗ DG1**  · for **nonlinearly-correlated component covariates** → reading **curvature in a conditional
retrodictive quantile plot** (vs one covariate) as model misfit does **NOT** work (projection
artifact).
- why: the marginal conditional mean E[y|Δx₁] absorbs β₂·E[Δx₂|Δx₁], nonlinear in Δx₁ whenever the covariates are nonlinearly correlated — even with a perfectly linear, calibrated model.
- conditions: M≥2 covariates; two nonlinearly-correlated; the check projects one covariate at a time with a bin-median summary.
- tier: 🟢 · source: [betanalpha:taylor_models](https://betanalpha.github.io/assets/case_studies/taylor_models.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Separate the plotting/marginalization artifact from the actual fit before diagnosing further" · "Push the prior through the model and audit the data for covariate combinations"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation B2 · when a **conditional retrodictive quantile plot shows curvature** and ](../../recs/CC-model-evaluation/B2.md) `0.97`
- [✗ CC-model-evaluation A4 · when a **conditional-only retrodictive check passes** (covariates fixe](../../recs/CC-model-evaluation/A4.md) `0.85`
- [✗ CC-model-evaluation F6 · when summarizing a **nonlinear function f(θ)** (covariance→correlation](../../recs/CC-model-evaluation/F6.md) `0.84`
- [✗ CC-model-evaluation A5 · when **prediction targets fall outside the training covariate support*](../../recs/CC-model-evaluation/A5.md) `0.83`
