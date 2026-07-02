# ✗ SM1 · for **uncertainty in a predicted outcome** → using **`posterior_epred`/`posterior_linpred`** as if it were the predictiv

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✗ SM1**  · for **uncertainty in a predicted outcome** → using **`posterior_epred`/`posterior_linpred`**
as if it were the predictive distribution does **NOT** work (too narrow).
- why: epred/linpred are the per-draw conditional MEAN (parameter uncertainty only); they omit the likelihood's residual noise, so an RMSE built from them is far too narrow.
- conditions: any GLM/hierarchical fit with residual noise; gap vanishes only in the noiseless case; mind scale= for non-identity links; AR/time-series may need the full series.
- tier: 🟡 · source: [mc-stan:28502](https://discourse.mc-stan.org/t/expected-value-of-posterior-vs-posterior-of-expected-value-with-epred/28502), [mc-stan:13293](https://discourse.mc-stan.org/t/bayesian-rmse/13293), [mc-stan:12240](https://discourse.mc-stan.org/t/how-to-draw-posterior-samples-with-a-different-covariate-value-other-than-the-intercept/12240)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate: epred vs predict" · "Reframe the estimand: prediction conditional on sampled REs vs integrating them out"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ CC-model-evaluation F4 · when you need **full predictive uncertainty** → **`posterior_predict`*](../../recs/CC-model-evaluation/F4.md) `0.86`
- [✓ hierarchical-multilevel G3 · for **marginal effects/predictions** from random-slope or correlated-R](../../recs/hierarchical-multilevel/G3.md) `0.85`
- [✗ CC-model-evaluation F3 · when computing **predictive RMSE / intervals** → differencing data aga](../../recs/CC-model-evaluation/F3.md) `0.84`
- [✗ CC-model-evaluation F10 · when a **constraint is imposed via `pm.Potential`** (e.g. −inf outside](../../recs/CC-model-evaluation/F10.md) `0.84`
