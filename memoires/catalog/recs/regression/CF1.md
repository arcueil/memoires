# ✗ CF1 · for a **causal/interventional target** → treating regression as a general-purpose model does **NOT** work (it is a narro

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C1 · Regression is a narrow special case of variate–covariate modeling — confounding ](../../claims/regression/C1.md)

**✗ CF1**  · for a **causal/interventional target** → treating regression as a general-purpose model
does **NOT** work (it is a narrow special case of variate–covariate modeling).
- why: regression assumes a location-based conditional model, no confounder (no ψ in both π(y|x) and π(x)), and homogeneous configuration — most applications violate at least one.
- conditions: causal/counterfactual claims; concern weakens in pure-predictive settings where x varies similarly in future.
- tier: 🟢 · source: [betanalpha:variate_covariate_modeling](https://betanalpha.github.io/assets/case_studies/variate_covariate_modeling.html), [betanalpha:generative_modeling](https://betanalpha.github.io/assets/case_studies/generative_modeling.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Answer the interpretation question, then pivot to whether the estimate is trustworthy given the design" · "separate likelihood from posterior and write out both log-posteriors term by term"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ measurement-error-missing A2 · for that designed experiment → **explicitly modeling the censoring/sel](../../recs/measurement-error-missing/A2.md) `0.80`
- [✗ hierarchical-multilevel D1 · for a **hierarchical/varying-effects regression** → placing a zero-cen](../../recs/hierarchical-multilevel/D1.md) `0.80`
- [✗ CC-model-evaluation E4 · when **x is stochastic (uncontrolled) but you treat it as a fixed cova](../../recs/CC-model-evaluation/E4.md) `0.80`
- [✗ hierarchical-multilevel G2 · for a **mixed-effects model** → assuming a single **"Bayesian R²"** do](../../recs/hierarchical-multilevel/G2.md) `0.80`
