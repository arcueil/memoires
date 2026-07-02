# ✓ LS1 · for an **outcome that is a proportion k/n** → model the **underlying counts** with a binomial / beta-binomial (logit lin

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

*No governing claim in the current spine — an honest gap signal (see data/unassigned_recs.json).*

**✓ LS1**  · for an **outcome that is a proportion k/n** → model the **underlying counts** with a
binomial / beta-binomial (logit link, nonlinear mean on p) rather than the proportion as continuous.
- why: aggregating to a proportion discards the denominator n that carries each observation's precision (1/2 and 50/100 both become 0.5, yet are very different evidence).
- conditions: n recoverable; use beta-binomial under overdispersion; beta/ZI-beta fallback only if n is genuinely unknown.
- tier: 🟡 · source: [mc-stan:24915](https://discourse.mc-stan.org/t/non-linear-distribution-with-some-zeros-in-data/24915), [mc-stan:12228](https://discourse.mc-stan.org/t/trying-to-fit-my-costumised-logistic-function/12228)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Trial boundary-capable likelihoods and judge each against the data's generating mechanism (one process vs separate inflation)" · "Audit the generated Stan code and the family/link, then triage by swapping to a simpler likelihood"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel H2 · for **per-observation-RE** models → **integrate out the random effect*](../../recs/hierarchical-multilevel/H2.md) `0.82`
- [✓/✗ hierarchical-multilevel F8 · for **marginalizing a sum of independent binomial** latent counts agai](../../recs/hierarchical-multilevel/F8.md) `0.82`
- [✗ measurement-error-missing I2 · for **turning a solved censored inference into an action** → using a f](../../recs/measurement-error-missing/I2.md) `0.81`
- [✓/✗ mixture Z4 · for **marginalizing a sum of independent binomial latent counts agains](../../recs/mixture/Z4.md) `0.81`
