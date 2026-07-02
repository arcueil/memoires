# ✓ PR3 · for a **log-link count model** → **eliciting slope priors in log space** from domain knowledge about proportional change

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C2 · Linear (and polynomial) regression is a *local Taylor approximation* — validity ](../../claims/regression/C2.md)

**✓ PR3**  · for a **log-link count model** → **eliciting slope priors in log space** from domain
knowledge about proportional changes works.
- why: a unit change in the linear predictor *multiplies* the outcome by exp(β); default Normal(0,1)/Normal(0,100) implies wildly implausible multiplicative effects.
- conditions: log-link models (Poisson, NegBin, log-normal); covariates with meaningful units where experts can bound proportional change.
- tier: 🟢 · source: [betanalpha:general_taylor_models](https://betanalpha.github.io/assets/case_studies/general_taylor_models.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Push the prior through the model (prior predictive) and plot the implied prior on the outcome" · "State the mechanism: priors go on the linear-predictor parameters; the link constrains a·x+b" · "Reframe the prior onto the latent linear predictor and put the scale on TOTAL model variance"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability X1 · when **a parameter is fit through a non-identity link / transform** (l](../../recs/CC-priors-identifiability/X1.md) `0.84`
- [✓ hierarchical-multilevel G3 · for **marginal effects/predictions** from random-slope or correlated-R](../../recs/hierarchical-multilevel/G3.md) `0.83`
- [✓ CC-model-evaluation F9 · when computing **marginal effects from random-slope / correlated-RE mo](../../recs/CC-model-evaluation/F9.md) `0.82`
- [✗ CC-model-evaluation G1 · when reading **`lp__` / `target` as the pointwise log-likelihood** for](../../recs/CC-model-evaluation/G1.md) `0.82`
