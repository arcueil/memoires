# ✓ SM4 · for **marginal effects/predictions** from multilevel (random-slope / correlated-RE) models → derive the quantity **per p

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✓ SM4**  · for **marginal effects/predictions** from multilevel (random-slope / correlated-RE) models →
derive the quantity **per posterior draw and average over the empirical covariate/RE distribution BEFORE
summarizing** works.
- why: order of operations is load-bearing — AME (average per-unit predictions) ≠ MEM (average covariates first); nonlinear links make the two diverge.
- conditions: random slopes/correlated REs; nonlinear/non-identity link; summaries formed from posterior draws of derived quantities.
- tier: 🟡 · source: [mc-stan:24172](https://discourse.mc-stan.org/t/calculating-average-marginal-effects-in-models-with-random-slopes/24172), [mc-stan:3914](https://discourse.mc-stan.org/t/coef-versus-fixef-and-ranef/3914), [mc-stan:11531](https://discourse.mc-stan.org/t/predict-brmsfit-new-level-in-a-hurdle-model/11531)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Apply the order-of-operations rule for nonlinear summaries of posterior draws" · "Reframe the estimand: prediction conditional on sampled REs vs integrating them out" · "Choose the posterior-summary primitive by which uncertainty must propagate"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel G3 · for **marginal effects/predictions** from random-slope or correlated-R](../../recs/hierarchical-multilevel/G3.md) `0.99`
- [✓ CC-model-evaluation F9 · when computing **marginal effects from random-slope / correlated-RE mo](../../recs/CC-model-evaluation/F9.md) `0.96`
- [✓ hierarchical-multilevel H2 · for **per-observation-RE** models → **integrate out the random effect*](../../recs/hierarchical-multilevel/H2.md) `0.86`
- [CC-model-evaluation C4 · Predictive and derived quantities must be built by pushing each poster](../../claims/CC-model-evaluation/C4.md) `0.85`
