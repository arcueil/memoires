# ✗ CF5 · for a **randomized/designed experiment with dropout/censoring** correlated with the outcome process → assuming the desig

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C1 · Regression is a narrow special case of variate–covariate modeling — confounding ](../../claims/regression/C1.md)

**✗ CF5**  · for a **randomized/designed experiment with dropout/censoring** correlated with the outcome
process → assuming the design still suppresses confounding does **NOT** work.
- why: censoring makes the observed covariate distribution a biased subset of the designed one; if censoring depends on the variate mechanism, confounders re-enter even from a confounder-free design.
- conditions: the censoring/dropout mechanism is correlated with the conditional variate process.
- tier: 🟢 · source: [betanalpha:variate_covariate_modeling](https://betanalpha.github.io/assets/case_studies/variate_covariate_modeling.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Answer the interpretation question, then pivot to trustworthiness given the design" · "Run a parameter-recovery simulation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ measurement-error-missing A1 · for a randomized/designed experiment with **dropout, censoring, or non](../../recs/measurement-error-missing/A1.md) `0.93`
- [✗ CC-priors-identifiability P3 · when **you assume randomization alone suppresses confounding** → does ](../../recs/CC-priors-identifiability/P3.md) `0.90`
- [measurement-error-missing C2 · Missingness/selection correlated with the outcome process is non-ignor](../../claims/measurement-error-missing/C2.md) `0.86`
- [✓ measurement-error-missing A2 · for that designed experiment → **explicitly modeling the censoring/sel](../../recs/measurement-error-missing/A2.md) `0.85`
