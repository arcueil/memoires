# ✓ CF9 · for a **causal effect with an UNobserved confounder** → an **instrumental variable Z built into the structural model** i

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C1 · Regression is a narrow special case of variate–covariate modeling — confounding ](../../claims/regression/C1.md)

**✓ CF9**  · for a **causal effect with an UNobserved confounder** → an **instrumental variable Z built
into the structural model** identifies it; a conditional-only / backdoor model does **NOT**.
- why: with the confounder unobserved, conditioning cannot block the back-door path; an instrument **Z
(Z→X, Z affects Y only through X, Z independent of the confounder)** supplies the identification when
encoded in the structural model.
- conditions: an unobserved confounder plus a valid instrument satisfying relevance (Z→X), exclusion (Z
affects Y only through X), and independence from the confounder. Complements CF7 (propensity /
do-calculus as approximations) and CF2 (decoupling when there is no confounder).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation E4 · when **x is stochastic (uncontrolled) but you treat it as a fixed cova](../../recs/CC-model-evaluation/E4.md) `0.81`
- [✗ CC-priors-identifiability P2 · when **you treat confounding as a property fixable inside one model co](../../recs/CC-priors-identifiability/P2.md) `0.81`
- [✗ CC-model-evaluation A4 · when a **conditional-only retrodictive check passes** (covariates fixe](../../recs/CC-model-evaluation/A4.md) `0.81`
- [✗ measurement-error-missing A1 · for a randomized/designed experiment with **dropout, censoring, or non](../../recs/measurement-error-missing/A1.md) `0.80`
