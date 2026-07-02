# ✗ SM8 · for **assessing whether a coefficient is non-negligible** → a **point-null Bayes factor** does **NOT** work (strongly pr

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✗ SM8**  · for **assessing whether a coefficient is non-negligible** → a **point-null Bayes factor**
does **NOT** work (strongly prior-dependent); prefer a **directional posterior probability P(β>0)** or a
**ROPE** statement.
- why: under any continuous prior P(β=0)=0, and the point-null BF is sensitive to vague priors and factor coding; directional/ROPE probabilities are robust under default priors.
- conditions: assessing a regression/mixed-model coefficient or contrast; ROPE needs a domain-chosen threshold δ; use orthonormal contrasts for categorical main effects.
- tier: 🟡 · source: [mc-stan:4847](https://discourse.mc-stan.org/t/evidence-ratios-when-using-default-priors/4847), [mc-stan:22364](https://discourse.mc-stan.org/t/bayes-factors-change-depending-on-reference-level/22364), [mc-stan:12057](https://discourse.mc-stan.org/t/bayesian-hypothesis-testing/12057)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the estimand" · "Apply the order-of-operations rule for nonlinear summaries of posterior draws"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ CC-model-evaluation H3 · when **assessing whether an effect is non-negligible** → a **direction](../../recs/CC-model-evaluation/H3.md) `0.96`
- [CC-model-evaluation C6 · Hypothesis tests and single-number summaries (Bayes factors, R², varia](../../claims/CC-model-evaluation/C6.md) `0.85`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.83`
- [✗ CC-priors-identifiability E1 · when **the true value may exceed your chosen scale and you use a light](../../recs/CC-priors-identifiability/E1.md) `0.83`
