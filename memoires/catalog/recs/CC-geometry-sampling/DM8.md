# ✗ DM8 · when **`*_rng` is called inside the Stan model / transformed-parameters block** → it does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**✗ DM8**  · when **`*_rng` is called inside the Stan model / transformed-parameters block** → it does **NOT** work.
- why: HMC differentiates a single deterministic unnormalized log-density; randomness makes the target non-deterministic and breaks leapfrog — `*_rng` is compile-time banned outside `transformed data` / `generated quantities`.
- conditions: any Stan HMC/NUTS model wanting to simulate/subsample inside the likelihood or port an `observe()`-style program.
- tier: 🟡 · source: [mc-stan:23805](https://discourse.mc-stan.org/t/sampling-from-a-matrix-in-stan/23805), [mc-stan:10296](https://discourse.mc-stan.org/t/observe-statement/10296), [mc-stan:3583](https://discourse.mc-stan.org/t/multivariate-skew-t-distribution/3583)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the model graph for completeness before any sampler tuning: trace whether every term is defined" · "Compare the suspect log-density against a trusted reference implementation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel B4 · for the **data-level noise SD σ** in a simple random-intercept model →](../../recs/hierarchical-multilevel/B4.md) `0.77`
- [✗ CC-model-evaluation F13 · when interpreting **latent / penalized / transformed parameters from t](../../recs/CC-model-evaluation/F13.md) `0.76`
- [✗ CC-priors-identifiability X1 · when **a parameter is fit through a non-identity link / transform** (l](../../recs/CC-priors-identifiability/X1.md) `0.75`
- [✗ measurement-error-missing L1 · for a **custom count likelihood in brms/Stan on large-count data** → t](../../recs/measurement-error-missing/L1.md) `0.75`
