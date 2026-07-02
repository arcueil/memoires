# ✓ VS2 · for **selecting a smaller predictor set** → fit one good **reference model with a sparsifying prior and use projection-p

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✓ VS2**  · for **selecting a smaller predictor set** → fit one good **reference model with a sparsifying
prior and use projection-predictive selection (projpred)** works.
- why: every submodel is a projection of the reference predictive distribution, so it does not overfit CV the way independent refits do.
- conditions: a sensible full reference model; minimal-vs-complete caveat under correlated predictors; Gaussian-surrogate workaround for non-exponential-family reference models on older projpred.
- tier: 🟡 · source: [mc-stan:12866](https://discourse.mc-stan.org/t/shrinkage-and-feature-selection-in-designed-experiments-using-brms-which-method-to-choose/12866), [mc-stan:18721](https://discourse.mc-stan.org/t/projection-predictive-variable-and-structure-selection-for-glmms-and-gamms/18721), [mc-stan:28952](https://discourse.mc-stan.org/t/variable-selection-with-car-conditional-autoregressive-component-using-the-projpred-package/28952)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read the headline LOO diagnostics first" · "Reframe the estimand"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ sparse-shrinkage V2 · for **selecting a smaller predictor set** → **projection-predictive se](../../recs/sparse-shrinkage/V2.md) `0.97`
- [✗ CC-model-evaluation G11 · when **selecting predictors by independently refitting each submodel a](../../recs/CC-model-evaluation/G11.md) `0.90`
- [✗ sparse-shrinkage V1 · for **selecting a smaller predictor set** → **scoring candidate submod](../../recs/sparse-shrinkage/V1.md) `0.87`
- [✗ CC-model-evaluation F1 · when **generating a posterior predictive** → plugging in posterior dra](../../recs/CC-model-evaluation/F1.md) `0.85`
