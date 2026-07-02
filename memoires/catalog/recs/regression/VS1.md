# ✗ VS1 · for **selecting a smaller predictor set** → refitting each candidate submodel and removing terms that improve LOO/CV doe

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✗ VS1**  · for **selecting a smaller predictor set** → refitting each candidate submodel and removing
terms that improve LOO/CV does **NOT** work (overfits the CV estimate).
- why: removing terms to improve LOO is itself a model search; the apparent improvement is largely noise and can severely degrade out-of-sample performance.
- conditions: GLM(M) selection, predictors large relative to n; assumes a sensible full reference model can be fit.
- tier: 🟡 · source: [mc-stan:12866](https://discourse.mc-stan.org/t/shrinkage-and-feature-selection-in-designed-experiments-using-brms-which-method-to-choose/12866), [mc-stan:18721](https://discourse.mc-stan.org/t/projection-predictive-variable-and-structure-selection-for-glmms-and-gamms/18721), [mc-stan:28952](https://discourse.mc-stan.org/t/variable-selection-with-car-conditional-autoregressive-component-using-the-projpred-package/28952)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read the headline LOO diagnostics first: compare p_loo against N and the nominal parameter count" · "Treat the warning as a diagnostic signal: switch from WAIC to LOO for the pareto-k"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ sparse-shrinkage V1 · for **selecting a smaller predictor set** → **scoring candidate submod](../../recs/sparse-shrinkage/V1.md) `0.98`
- [✗ CC-model-evaluation G11 · when **selecting predictors by independently refitting each submodel a](../../recs/CC-model-evaluation/G11.md) `0.93`
- [✓ sparse-shrinkage V2 · for **selecting a smaller predictor set** → **projection-predictive se](../../recs/sparse-shrinkage/V2.md) `0.85`
- [✗ ode-dynamical Q1 · for **supplying a prior scale by pre-fitting the data** (empirical-Bay](../../recs/ode-dynamical/Q1.md) `0.82`
