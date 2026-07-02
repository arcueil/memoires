# ✓ LS1 · for an **outcome that is a proportion k/n** → model the **underlying counts** with a binomial / beta-binomial (logit lin

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C7 · Match the observation model to the data's generative structure, not its surface ](../../claims/regression/C7.md)

**✓ LS1**  · for an **outcome that is a proportion k/n** → model the **underlying counts** with a
binomial / beta-binomial (logit link, nonlinear mean on p) rather than the proportion as continuous.
- why: aggregating to a proportion discards the denominator n that carries each observation's precision (1/2 and 50/100 both become 0.5, yet are very different evidence).
- conditions: n recoverable; use beta-binomial under overdispersion; beta/ZI-beta fallback only if n is genuinely unknown.
- tier: 🟡 · source: [mc-stan:24915](https://discourse.mc-stan.org/t/non-linear-distribution-with-some-zeros-in-data/24915), [mc-stan:12228](https://discourse.mc-stan.org/t/trying-to-fit-my-costumised-logistic-function/12228)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Trial boundary-capable likelihoods and judge each against the data's generating mechanism (one process vs separate inflation)" · "Audit the generated Stan code and the family/link, then triage by swapping to a simpler likelihood"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ CC-model-evaluation G5 · when you have **per-observation REs** → **integrating out the RE** (co](../../recs/CC-model-evaluation/G5.md) `0.83`
- [✓ hierarchical-multilevel H2 · for **per-observation-RE** models → **integrate out the random effect*](../../recs/hierarchical-multilevel/H2.md) `0.82`
- [✓/✗ mixture Z4 · for **marginalizing a sum of independent binomial latent counts agains](../../recs/mixture/Z4.md) `0.82`
- [✗ CC-priors-identifiability N4 · when **you use a Beta with a shape parameter < 1** (e.g. Beta(0.5,0.5)](../../recs/CC-priors-identifiability/N4.md) `0.82`
