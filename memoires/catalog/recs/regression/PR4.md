# ✗ PR4 · for a **positive-support GLM** (Gamma, Weibull, inverse-Gaussian) → an **identity link** does **NOT** work (initializati

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C7 · Match the observation model to the data's generative structure, not its surface ](../../claims/regression/C7.md)

**✗ PR4**  · for a **positive-support GLM** (Gamma, Weibull, inverse-Gaussian) → an **identity link**
does **NOT** work (initialization rejected).
- why: the identity link lets the (mean-centered) linear predictor go negative at init → negative mean/scale → likelihood undefined → "parameter must be > 0" rejection ("Initialization between (−2,2) failed").
- conditions: likelihood whose location/scale must be strictly positive, with an unconstrained linear predictor; symptom is init/log-prob-at-init rejection, not a mid-sampling divergence.
- tier: 🟡 · source: [mc-stan:30046](https://discourse.mc-stan.org/t/exception-gamma-lpdf-inverse-scale-parameter-1-is-xxx-but-must-be-positive-finite/30046), [mc-stan:10728](https://discourse.mc-stan.org/t/fitting-gamma-model-with-brms/10728), [mc-stan:10656](https://discourse.mc-stan.org/t/initialization-problems-using-brms-with-weibull-distribution-and-identity-link/10656)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the generated Stan code and the family/link, then triage by swapping to a simpler likelihood" · "Generate the brms Stan data + Stan code (make_standata/make_stancode) and read the model block"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel G1 · for a **GLMM with a non-identity link** (logistic/Poisson/ordinal) → r](../../recs/hierarchical-multilevel/G1.md) `0.82`
- [✗ spatial-areal A1 · for a **regression/GLM on spatially-indexed data where a covariate is ](../../recs/spatial-areal/A1.md) `0.80`
- [✗ gaussian-process HP10 · for an **observational (non-designed) GP** → **retrofitting the ρ prio](../../recs/gaussian-process/HP10.md) `0.80`
- [✓ CC-priors-identifiability E3 · when **you need to suppress a specific tail on a positive parameter** ](../../recs/CC-priors-identifiability/E3.md) `0.80`
