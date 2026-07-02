# ✗ CF3 · for a **confounded design** (ψ in both models) → a **conditional-only model** does **NOT** work (it can invert the sign 

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C1 · Regression is a narrow special case of variate–covariate modeling — confounding ](../../claims/regression/C1.md)

**✗ CF3**  · for a **confounded design** (ψ in both models) → a **conditional-only model** does **NOT**
work (it can invert the sign of the causal estimate).
- why: the confounded parameter absorbs between-context covariate heterogeneity into the treatment effect; zero divergences and passing retrodictive checks give false reassurance.
- conditions: confounding creates between-context susceptibility/baseline heterogeneity large enough to overwhelm the true effect.
- tier: 🟢 · source: [betanalpha:variate_covariate_modeling](https://betanalpha.github.io/assets/case_studies/variate_covariate_modeling.html)
- efficacy: {divergences: 0 reported (misleading) · min_ess: pending · ess_per_sec: pending · rmse: conditional-only ζ concentrates at +0.2 to +0.4 (apparent harm) vs true −0.35 (protective) · coverage: pending}
- moves: "Answer the interpretation question, then pivot to whether the estimate is trustworthy given the design" · "Run a parameter-recovery simulation: generate data from the known process, refit, compare to truth"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation A4 · when a **conditional-only retrodictive check passes** (covariates fixe](../../recs/CC-model-evaluation/A4.md) `0.88`
- [✗ CC-priors-identifiability P2 · when **you treat confounding as a property fixable inside one model co](../../recs/CC-priors-identifiability/P2.md) `0.87`
- [✗ CC-model-evaluation A5 · when **prediction targets fall outside the training covariate support*](../../recs/CC-model-evaluation/A5.md) `0.81`
- [✗ CC-model-evaluation F14 · when reading a **factor's effect off the reference / baseline level** ](../../recs/CC-model-evaluation/F14.md) `0.81`
