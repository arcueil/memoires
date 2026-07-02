# ✓/✗ SM9 · for **comparing a broad-prior Bayesian logistic fit to classical MLE** → expecting a genuine model difference does **NOT

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✓/✗ SM9**  · for **comparing a broad-prior Bayesian logistic fit to classical MLE** → expecting a
genuine model difference does **NOT** work; sanity-check that coefficients coincide and attribute metric
gaps to the **decision rule / scoring**.
- why: with broad priors the posterior mode ≈ MLE, so the fits agree on coefficients; accuracy/sensitivity gaps come from how predicted labels are generated/aggregated, not the model.
- conditions: broad/weakly-informative priors so posterior≈likelihood; does NOT apply when an informative/regularizing prior deliberately shrinks (e.g. under separation).
- tier: 🟡 · source: [mc-stan:19240](https://discourse.mc-stan.org/t/getting-different-results-for-logistic-regression-model/19240)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Run a parameter-recovery simulation and compare point estimates against the MLE"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation F15 · when inferring a **difference between two conditions from overlap of t](../../recs/CC-model-evaluation/F15.md) `0.84`
- [✗ CC-model-evaluation H5 · when **comparing Bayesian R² across likelihood families** (binomial vs](../../recs/CC-model-evaluation/H5.md) `0.83`
- [✓ time-series-state-space S3 · for **deciding whether a clean fit actually reflects a correct model**](../../recs/time-series-state-space/S3.md) `0.83`
- [✗ CC-model-evaluation F3 · when computing **predictive RMSE / intervals** → differencing data aga](../../recs/CC-model-evaluation/F3.md) `0.83`
