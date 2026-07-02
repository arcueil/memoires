# ✗ CF6 · for **controlled-vs-uncontrolled** experiments → treating a **stochastic covariate as a fixed design covariate** does **

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C1 · Regression is a narrow special case of variate–covariate modeling — confounding ](../../claims/regression/C1.md)

**✗ CF6**  · for **controlled-vs-uncontrolled** experiments → treating a **stochastic covariate as a
fixed design covariate** does **NOT** work for intervention conclusions.
- why: the two models can be mathematically equivalent as conditional models for y|x, but only the controlled model supports causal intervention; the uncontrolled one requires modeling π(x|θ) explicitly.
- conditions: causal/counterfactual claims; smaller practical difference in pure-predictive settings.
- tier: 🟢 · source: [betanalpha:generative_modeling](https://betanalpha.github.io/assets/case_studies/generative_modeling.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Answer the interpretation question, then pivot to whether the estimate is trustworthy given the design" · "Reframe the estimand"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation E4 · when **x is stochastic (uncontrolled) but you treat it as a fixed cova](../../recs/CC-model-evaluation/E4.md) `0.86`
- [✓ measurement-error-missing A2 · for that designed experiment → **explicitly modeling the censoring/sel](../../recs/measurement-error-missing/A2.md) `0.80`
- [✗ measurement-error-missing A1 · for a randomized/designed experiment with **dropout, censoring, or non](../../recs/measurement-error-missing/A1.md) `0.80`
- [✗ CC-model-evaluation A4 · when a **conditional-only retrodictive check passes** (covariates fixe](../../recs/CC-model-evaluation/A4.md) `0.79`


## Technique (pymc-labs)

**PyMC do-calculus API: pm.do (graph surgery) vs pm.observe (add data, structure intact)** — 'PyMC exposes structural-causal graph surgery directly. `with pm.do(model, {x: v})` replaces x's distribution with a constant and severs its incoming edges -> samples P(rest | do(x=v)); `with pm.observe(model, {y: v})` conditions without breaking structure -> P(rest | y=v). Interventions can be composed (`pm.do` then `pm.observe`) for counterfactual-style queries P(y | do(x), z).' The concrete API realization of CF6's controlled-vs-uncontrolled distinction.
*Source: [pymc-labs:causal](https://github.com/pymc-labs/python-analytics-skills)*
