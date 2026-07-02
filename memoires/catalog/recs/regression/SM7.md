# ✗ SM7 · for **comparing Bayesian R² across likelihoods** → treating it as comparable does **NOT** work (observation-model-depend

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✗ SM7**  · for **comparing Bayesian R² across likelihoods** → treating it as comparable does **NOT**
work (observation-model-dependent).
- why: Bayesian/Gelman R² on the response scale is systematically lower for non-Gaussian GLMs; the same data as binomial vs row-expanded Bernoulli give the same coefficients but different R².
- conditions: non-identity link (logit/probit/cumulative); the latent-scale (McKelvey-Zavoina) fix assumes a latent-variable construction; Gaussian models unaffected.
- tier: 🟡 · source: [mc-stan:7420](https://discourse.mc-stan.org/t/bayes-r2-estimation/7420), [mc-stan:14752](https://discourse.mc-stan.org/t/r-2-calculation-for-brm-model-with-cumulative-family-type/14752), [mc-stan:33187](https://discourse.mc-stan.org/t/anova-of-brms-model/33187)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Reframe: under a non-identity link the coefficient (and its prior) is not interpretable in isolation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation H5 · when **comparing Bayesian R² across likelihood families** (binomial vs](../../recs/CC-model-evaluation/H5.md) `0.89`
- [✗ hierarchical-multilevel G2 · for a **mixed-effects model** → assuming a single **"Bayesian R²"** do](../../recs/hierarchical-multilevel/G2.md) `0.87`
- [✗ CC-model-evaluation H4 · when reporting a **single "Bayesian R²"** for a mixed model → does **N](../../recs/CC-model-evaluation/H4.md) `0.86`
- [✗ ode-dynamical Q1 · for **supplying a prior scale by pre-fitting the data** (empirical-Bay](../../recs/ode-dynamical/Q1.md) `0.83`
