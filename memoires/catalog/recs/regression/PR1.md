# ✗ PR1 · for **any regression** → **flat/improper** or **diffuse-but-proper** priors (N(0,1000), U(−1000,1000)) do **NOT** work a

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [CC-priors-identifiability C3 · "Non-informative" priors are a myth; the weakly-informative alternative is delib](../../claims/CC-priors-identifiability/C3.md)

**✗ PR1**  · for **any regression** → **flat/improper** or **diffuse-but-proper** priors (N(0,1000),
U(−1000,1000)) do **NOT** work as "non-informative" (they push mass to extremes).
- why: flat priors are incompatible with being proper (mass concentrates at infinity via the stereographic projection); diffuse-proper priors replicate this, biasing toward extreme values.
- conditions: pathology scales with prior-scale/likelihood-width ratio; worse in high dimensions; a flat prior approximates a proper one locally only when the likelihood is guaranteed narrow (verify per dataset).
- tier: 🟢 · source: [betanalpha:prior_modeling](https://betanalpha.github.io/assets/case_studies/prior_modeling.html), [betanalpha:weakly_informative_shapes](https://betanalpha.github.io/assets/case_studies/weakly_informative_shapes.html)
- efficacy: {divergences: pending · min_ess: n_eff(σ) collapses to 821/10000 (N=5, Normal(0,1000)) · ess_per_sec: pending · rmse: (α,β) pushed to ±$15k · coverage: pending}
- moves: "Push the prior through the model (prior predictive) and plot the implied prior on the outcome" · "Run prior predictive checks via sample_prior='only' + pp_check()/fitted()" · "Check that every estimated parameter actually receives a proper prior"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability N2 · when **you use a diffuse-but-proper prior** (Normal(0,1000), U(−1000,1](../../recs/CC-priors-identifiability/N2.md) `0.92`
- [✗ CC-priors-identifiability N1 · when **you use a flat / improper prior "to be non-informative"** → doe](../../recs/CC-priors-identifiability/N1.md) `0.91`
- [CC-priors-identifiability C3 · "Non-informative" priors are a myth; the weakly-informative alternativ](../../claims/CC-priors-identifiability/C3.md) `0.91`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.88`
