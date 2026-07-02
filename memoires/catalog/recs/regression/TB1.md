# ✓ TB1 · for a **limited / corner outcome piled at a bound** (expenditure, hours worked, demand censored at 0) → **Tobit** (a Nor

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C7 · Match the observation model to the data's generative structure, not its surface ](../../claims/regression/C7.md)

**✓ TB1**  · for a **limited / corner outcome piled at a bound** (expenditure, hours worked, demand
censored at 0) → **Tobit** (a Normal likelihood wrapped in censoring at the bound) works; an ordinary
Gaussian does **NOT**.
- why: Tobit = a linear model with a Normal likelihood wrapped in censoring at the bound,
`pm.Censored(pm.Normal.dist(mu=X.b, sigma), lower=0)`; fitting an ordinary Gaussian ignores the point
mass at the bound and **biases the slope**.
- conditions: outcome censored/piled at a known bound (e.g. 0); the mass at the bound is a censoring
artifact of one process, not a separate zero-generating process (contrast HZ1's hurdle/ZI split).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ measurement-error-missing M1 · for **limited/corner outcomes piled at a bound** (expenditure, hours w](../../recs/measurement-error-missing/M1.md) `0.95`
- [✗ measurement-error-missing I2 · for **turning a solved censored inference into an action** → using a f](../../recs/measurement-error-missing/I2.md) `0.81`
- [✗ mixture M4 · for **benchmarking a marginalized/enumerated sampler against a discret](../../recs/mixture/M4.md) `0.80`
- [✓/✗ hierarchical-multilevel F8 · for **marginalizing a sum of independent binomial** latent counts agai](../../recs/hierarchical-multilevel/F8.md) `0.79`
