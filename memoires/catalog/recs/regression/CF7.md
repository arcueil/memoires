# ⚪ CF7 · for **compensating** conditional-only models under confounding → **propensity scores / do-calculus** work only as approx

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C1 · Regression is a narrow special case of variate–covariate modeling — confounding ](../../claims/regression/C1.md)

**⚪ CF7**  · for **compensating** conditional-only models under confounding → **propensity scores /
do-calculus** work only as approximations, not as replacements for the marginal covariate model.
- why: propensity reweighting removes bias "in expectation" under a (often linear/normal) model; do-calculus is closed-form only for linear-normal / partially-nonlinear cases — otherwise fit the marginal model directly.
- conditions: modeling environment flexible enough (e.g. Stan) to build the marginal covariate model.
- tier: ⚪ candidate · source: [betanalpha:variate_covariate_modeling](https://betanalpha.github.io/assets/case_studies/variate_covariate_modeling.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Answer the interpretation question, then pivot to whether the estimate is trustworthy given the design"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ CC-model-evaluation F9 · when computing **marginal effects from random-slope / correlated-RE mo](../../recs/CC-model-evaluation/F9.md) `0.82`
- [✗ CC-model-evaluation A4 · when a **conditional-only retrodictive check passes** (covariates fixe](../../recs/CC-model-evaluation/A4.md) `0.82`
- [✗ CC-model-evaluation F13 · when interpreting **latent / penalized / transformed parameters from t](../../recs/CC-model-evaluation/F13.md) `0.82`
- [✓ hierarchical-multilevel G3 · for **marginal effects/predictions** from random-slope or correlated-R](../../recs/hierarchical-multilevel/G3.md) `0.82`
