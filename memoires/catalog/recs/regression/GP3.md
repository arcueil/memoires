# ✗ GP3 · for **spatially-autocorrelated regression covariates** → ignoring covariate spatial autocorrelation does **NOT** work (o

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C3 · Ridges and funnels in the *linear predictor* split into two look-alike regimes w](../../claims/regression/C3.md)

**✗ GP3**  · for **spatially-autocorrelated regression covariates** → ignoring covariate spatial
autocorrelation does **NOT** work (overconfident coefficients, coverage below nominal).
- why: SA inflates a covariate's variance with duplicate information (effective n < n); the coefficient posterior contracts and its credible intervals lose coverage.
- conditions: regression/GLM on spatially-indexed data with SA covariates (CAR/ICAR/BYM/GP); worst when the covariate's spatial pattern aligns with the outcome's spatial trend.
- tier: 🟡 · source: [mc-stan:17266](https://discourse.mc-stan.org/t/spatial-autocorrelation-its-consequence-on-bayesian-linear-regression/17266), [mc-stan:24567](https://discourse.mc-stan.org/t/correlated-parameters-in-car-model-for-areal-unit-spatial-data/24567), [mc-stan:15654](https://discourse.mc-stan.org/t/hierarchical-2d-1d-space-time-modelling-using-gps/15654)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: posterior SD shrinks and interval coverage drops below nominal as covariate SA rises}
- moves: "Run a parameter-recovery simulation: generate data from the known process, refit, compare to truth" · "Check identifiability: data volume at the group level and prior scale"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ spatial-areal A1 · for a **regression/GLM on spatially-indexed data where a covariate is ](../../recs/spatial-areal/A1.md) `0.95`
- [✗ CC-model-evaluation E6 · when a **covariate exhibits spatial autocorrelation** → trusting its *](../../recs/CC-model-evaluation/E6.md) `0.95`
- [spatial-areal C5 · Spatial autocorrelation is not only an outcome nuisance — SA in a *cov](../../claims/spatial-areal/C5.md) `0.94`
- [✗ spatial-areal N1 · for a **spatial GP whose covariance is numerically evaluated only on X](../../recs/spatial-areal/N1.md) `0.82`
