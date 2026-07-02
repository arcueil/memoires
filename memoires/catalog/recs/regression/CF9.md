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

- [✗ ode-dynamical D1 · for **structural zeros** in the data of a dynamical/count model → trea](../../recs/ode-dynamical/D1.md) `0.80`
- [✗ CC-priors-identifiability P2 · when **you treat confounding as a property fixable inside one model co](../../recs/CC-priors-identifiability/P2.md) `0.80`
- [✓ measurement-error-missing A2 · for that designed experiment → **explicitly modeling the censoring/sel](../../recs/measurement-error-missing/A2.md) `0.80`
- [✗ hierarchical-multilevel D6 · for **multiple correlated random effects** → an "estimate-then-fix-to-](../../recs/hierarchical-multilevel/D6.md) `0.80`
