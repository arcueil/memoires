# ✗ ST1 · when **"Initial evaluation of model at starting point failed" / -inf logp** fires → forcing a new starting point does **

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ ST1**  · when **"Initial evaluation of model at starting point failed" / -inf logp** fires → forcing a new starting point does **NOT** work.
- why: the -inf is a logp (not a parameter value): a constrained quantity (σ≤0, a Beta shape ≤0, data outside support) left its support at the default start; a new start won't fix the structural cause.
- conditions: constrained quantity is a deterministic function of unconstrained latents/covariates (heteroskedastic/distributional regression, GLM shape params).
- tier: 🟡 · source: [pymc:16104](https://discourse.pymc.io/t/sampling-error-y-inf-when-adding-sigma-heteroskedastic-modelling/16104), [pymc:7160](https://discourse.pymc.io/t/error-with-model-initial-evaluation-of-model-at-starting-point-failed/7160), [pymc:9994](https://discourse.pymc.io/t/initial-evaluation-of-model-at-starting-point-failed/9994)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Confirm the failure is real and characterize it: look at the pairs plot and count divergences / mean treedepth at default settings" · "Diagnose the constrained-parameter Jacobian: change-of-variables term for lower-bounded params"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ latent-factor A2 · for a factor model → constraining **ONE loading's sign positive** does](../../recs/latent-factor/A2.md) `0.75`
- [✗ hierarchical-multilevel P9 · for an **underdetermined / rank-deficient Gaussian regression** → NCP ](../../recs/hierarchical-multilevel/P9.md) `0.75`
- [✓ CC-priors-identifiability E8 · when **you need a starting weakly-informative prior and want a constru](../../recs/CC-priors-identifiability/E8.md) `0.75`
- [✗ CC-model-evaluation D5 · when reading a **frequentist procedure as quantifying which parameters](../../recs/CC-model-evaluation/D5.md) `0.75`
