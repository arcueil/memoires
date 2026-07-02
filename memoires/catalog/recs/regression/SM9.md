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

- [✗ CC-model-evaluation H1 · when computing a **Bayes factor on an estimation-prior fit** (e.g. rst](../../recs/CC-model-evaluation/H1.md) `0.85`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.85`
- [✗ gaussian-process EB1 · for **setting a GP prior scale from a pre-fit to the same data** → **e](../../recs/gaussian-process/EB1.md) `0.84`
- [CC-model-evaluation C6 · Hypothesis tests and single-number summaries (Bayes factors, R², varia](../../claims/CC-model-evaluation/C6.md) `0.84`
