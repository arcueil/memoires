# ✗ CF8 · for **confounded extrapolation** → **posterior retrodictive checks of the training data** do **NOT** work to reveal the 

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C1 · Regression is a narrow special case of variate–covariate modeling — confounding ](../../claims/regression/C1.md)

**✗ CF8**  · for **confounded extrapolation** → **posterior retrodictive checks of the training data**
do **NOT** work to reveal the misspecification.
- why: the conditional model is optimized to fit the observed covariates, so even the standard posterior predictive check passes; the failure shows only against held-out incomplete observations.
- conditions: confounding shifts the covariate distribution between complete/incomplete contexts; checks computed only for the observed (complete) data.
- tier: 🟢 · source: [betanalpha:variate_covariate_modeling](https://betanalpha.github.io/assets/case_studies/variate_covariate_modeling.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a parameter-recovery simulation and compare recovered parameters to truth" · "Answer the interpretation question, then pivot to trustworthiness"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation A4 · when a **conditional-only retrodictive check passes** (covariates fixe](../../recs/CC-model-evaluation/A4.md) `0.90`
- [✗ CC-model-evaluation A5 · when **prediction targets fall outside the training covariate support*](../../recs/CC-model-evaluation/A5.md) `0.88`
- [CC-model-evaluation C1 · Clean computation certifies the sampler, not the model — evaluation mu](../../claims/CC-model-evaluation/C1.md) `0.88`
- [✓ CC-model-evaluation A2 · when you need to **catch misspecification behind clean diagnostics** →](../../recs/CC-model-evaluation/A2.md) `0.85`
