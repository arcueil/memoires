# ✗ SM5 · for the **effect of a categorical predictor** → reading it off the **reference/baseline level** does **NOT** work; margi

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✗ SM5**  · for the **effect of a categorical predictor** → reading it off the **reference/baseline
level** does **NOT** work; marginalize over the factor's levels for a population-average effect.
- why: default treatment coding makes the intercept and "conditioned" predictions correspond to the reference category; refitting a reduced model also changes hierarchical shrinkage.
- conditions: categorical/factor predictor; most relevant under treatment coding; the shrinkage caveat applies when the factor is modeled hierarchically.
- tier: 🟡 · source: [mc-stan:5323](https://discourse.mc-stan.org/t/how-do-i-get-marginal-effects-for-categorical-variables-to-condition-on-an-average-rather-than-a-category/5323), [mc-stan:19673](https://discourse.mc-stan.org/t/overall-test-for-effect-of-factor-similar-to-anova-in-r/19673)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Apply the order-of-operations rule for nonlinear summaries of posterior draws" · "Audit the random-effects structure: check whether every term varies within the grouping factor"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation F14 · when reading a **factor's effect off the reference / baseline level** ](../../recs/CC-model-evaluation/F14.md) `0.88`
- [✓ hierarchical-multilevel G3 · for **marginal effects/predictions** from random-slope or correlated-R](../../recs/hierarchical-multilevel/G3.md) `0.84`
- [✗ ode-dynamical Q1 · for **supplying a prior scale by pre-fitting the data** (empirical-Bay](../../recs/ode-dynamical/Q1.md) `0.82`
- [✗ sparse-shrinkage P4 · for **prediction** with unlabeled future observations → a **single-sca](../../recs/sparse-shrinkage/P4.md) `0.81`
