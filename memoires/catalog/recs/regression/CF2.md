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
- [✓ latent-factor D2 · for a **conjugate latent-Gaussian** model → **analytic marginalization](../../recs/latent-factor/D2.md) `0.82`
- [✓ sparse-shrinkage V4 · for **genuine covariate removal in a hierarchical model** → **handling](../../recs/sparse-shrinkage/V4.md) `0.82`
- [✓/✗ latent-factor D3 · for a latent-Gaussian model → **NCP** works (and is necessary) when th](../../recs/latent-factor/D3.md) `0.82`
