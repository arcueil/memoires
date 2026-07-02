# ✓ CF2 · for a variate–covariate model with **no confounding parameter** → **dropping the marginal covariate model** works (the d

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C1 · Regression is a narrow special case of variate–covariate modeling — confounding ](../../claims/regression/C1.md)

**✓ CF2**  · for a variate–covariate model with **no confounding parameter** → **dropping the marginal
covariate model** works (the decoupling theorem: η factorizes from γ).
- why: with ψ absent, π(η,γ|y,x)=π(η|y,x)·π(γ|x); learning η needs no covariate model, and predictions are correct however arbitrarily x is distributed.
- conditions: no parameter appears in both the conditional-variate and marginal-covariate models; homogeneous η across observations.
- tier: 🟢 · source: [betanalpha:variate_covariate_modeling](https://betanalpha.github.io/assets/case_studies/variate_covariate_modeling.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "separate likelihood from posterior and write out both log-posteriors term by term" · "Answer the interpretation question, then pivot to whether the estimate is trustworthy given the design"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability P2 · when **you treat confounding as a property fixable inside one model co](../../recs/CC-priors-identifiability/P2.md) `0.86`
- [✓/✗ measurement-error-missing F1 · for a **bivariate (or joint) model where one component can go missing*](../../recs/measurement-error-missing/F1.md) `0.83`
- [✗ CC-model-evaluation A4 · when a **conditional-only retrodictive check passes** (covariates fixe](../../recs/CC-model-evaluation/A4.md) `0.83`
- [measurement-error-missing C4 · The variate/covariate partition is defined by which component goes mis](../../claims/measurement-error-missing/C4.md) `0.83`
