# ✗ SM6 · for **summarizing fit with a single "Bayesian R²"** → assuming one definition does **NOT** work.

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✗ SM6**  · for **summarizing fit with a single "Bayesian R²"** → assuming one definition does **NOT**
work.
- why: residual-based (brms/rstantools: Var(pred)/(Var(pred)+Var(pred−y))) and model-based (rstanarm: Var(pred)/(Var(pred)+σ²)) disagree in magnitude AND can reverse the conditional>marginal ordering for mixed models.
- conditions: hierarchical/mixed models; the ordering reversal is specific to the RE variance term; the two coincide for ordinary linear regression.
- tier: 🟡 · source: [mc-stan:20461](https://discourse.mc-stan.org/t/bayes-r2-and-conditioning-on-random-effects/20461)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Reframe the estimand: conditional vs marginal"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel G2 · for a **mixed-effects model** → assuming a single **"Bayesian R²"** do](../../recs/hierarchical-multilevel/G2.md) `0.96`
- [✗ CC-model-evaluation H4 · when reporting a **single "Bayesian R²"** for a mixed model → does **N](../../recs/CC-model-evaluation/H4.md) `0.96`
- [✓ hierarchical-multilevel G3 · for **marginal effects/predictions** from random-slope or correlated-R](../../recs/hierarchical-multilevel/G3.md) `0.84`
- [✗ CC-model-evaluation H5 · when **comparing Bayesian R² across likelihood families** (binomial vs](../../recs/CC-model-evaluation/H5.md) `0.82`
