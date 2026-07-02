# ✗ SM3 · for the **predicted value of a targeted quantile** in ALD quantile regression → default **`posterior_epred`/`fitted`** d

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✗ SM3**  · for the **predicted value of a targeted quantile** in ALD quantile regression → default
**`posterior_epred`/`fitted`** does **NOT** work (returns the ALD mean, offset from the quantile).
- why: the ALD's location μ IS the requested quantile, but its mean is offset by the asymmetry whenever quantile≠0.5; default helpers return the mean.
- conditions: quantile regression via the asymmetric-Laplace working likelihood, any non-median quantile; the gap vanishes at 0.5 (symmetric Laplace).
- tier: 🟡 · source: [mc-stan:8706](https://discourse.mc-stan.org/t/interpreting-quantile-parameter-in-brms-quantile-regression/8706), [mc-stan:29686](https://discourse.mc-stan.org/t/setting-the-parameters-for-asym-laplace/29686), [mc-stan:11649](https://discourse.mc-stan.org/t/how-to-get-fitted-values-on-the-response-scale-for-truncated-asym-laplace-models/11649)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Apply the order-of-operations rule for nonlinear summaries of posterior draws"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ ode-dynamical Q1 · for **supplying a prior scale by pre-fitting the data** (empirical-Bay](../../recs/ode-dynamical/Q1.md) `0.81`
- [✓ hierarchical-multilevel G3 · for **marginal effects/predictions** from random-slope or correlated-R](../../recs/hierarchical-multilevel/G3.md) `0.80`
- [✓ time-series-state-space S3 · for **deciding whether a clean fit actually reflects a correct model**](../../recs/time-series-state-space/S3.md) `0.80`
- [✗ spatial-areal T1 · for a **CAR/GMRF model parameterized through precision Q** → interpret](../../recs/spatial-areal/T1.md) `0.80`
