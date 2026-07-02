# ✗ SM2 · for **reproducing structural features** (e.g. the zero spike) of a **hurdle/zero-inflated** model → **`fitted()`-type ou

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✗ SM2**  · for **reproducing structural features** (e.g. the zero spike) of a **hurdle/zero-inflated**
model → **`fitted()`-type output** (conditional mean) does **NOT** work; use **`predict()`-type**
(posterior predictive).
- why: fitted gives E[y|x] with the zero-inflation already averaged in (smooth, no spike); only the posterior predictive reproduces the discrete/structural features.
- conditions: hurdle/ZI/mixture models; the expectation-vs-predictive point is framework-general; the hu/zi reversed-sign convention is brms-specific.
- tier: 🟡 · source: [mc-stan:16736](https://discourse.mc-stan.org/t/need-help-understanding-hurdle-hurdle-gamma-models-using-brms/16736), [mc-stan:6128](https://discourse.mc-stan.org/t/interpreting-logistic-regression-coefficients-from-hurdle-gamma-brm-models-and-bernoulli-brm-models/6128), [mc-stan:23910](https://discourse.mc-stan.org/t/interpret-hurdle-coefficients-in-brms/23910)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Trial boundary-capable likelihoods and judge each against the data's generating mechanism"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ mixture Z2 · for **hurdle / zero-inflated models** → reading **`fitted`-type output](../../recs/mixture/Z2.md) `0.94`
- [✗ sparse-shrinkage P4 · for **prediction** with unlabeled future observations → a **single-sca](../../recs/sparse-shrinkage/P4.md) `0.85`
- [✗ ode-dynamical Q1 · for **supplying a prior scale by pre-fitting the data** (empirical-Bay](../../recs/ode-dynamical/Q1.md) `0.83`
- [✓ sparse-shrinkage P5 · for **prediction** → a **two-scale prior** (mixture of two normals / r](../../recs/sparse-shrinkage/P5.md) `0.83`
