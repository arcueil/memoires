# ✗ DM9 · when the generative model has **hard partitions / threshold splits** (trees) or a **sharply multimodal** parameter (raw-

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**✗ DM9**  · when the generative model has **hard partitions / threshold splits** (trees) or a **sharply multimodal** parameter (raw-sinusoid frequency) → naive direct HMC does **NOT** work.
- why: hard thresholds make the log-density piecewise-constant (non-differentiable); sharp multimodality disconnects the typical set — the leapfrog integrator can't traverse either.
- conditions: gradient samplers; exception when the discrete structure can be exactly marginalized, or a strong prior / FFT-init collapses the multimodality.
- tier: 🟡 · source: [mc-stan:11795](https://discourse.mc-stan.org/t/bayesian-random-forest/11795), [mc-stan:22038](https://discourse.mc-stan.org/t/ideas-for-modelling-a-periodic-timeseries/22038), [mc-stan:3884](https://discourse.mc-stan.org/t/test-soft-vs-hard-sum-to-zero-constrain-choosing-the-right-prior-for-soft-constrain/3884)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Marginalize the discrete latent variables" · "Change the model rather than the sampler: reparameterize the offending term"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel B4 · for the **data-level noise SD σ** in a simple random-intercept model →](../../recs/hierarchical-multilevel/B4.md) `0.82`
- [✓/✗ CC-priors-identifiability E2 · when **the likelihood is numerically sensitive** (ODE solver, GP kerne](../../recs/CC-priors-identifiability/E2.md) `0.82`
- [✓ hierarchical-multilevel K3 · for a hierarchical model whose **latents are conditionally independent](../../recs/hierarchical-multilevel/K3.md) `0.82`
- [✓ hierarchical-multilevel P1 · for a normal hierarchical model with **weak per-group data** (few obs/](../../recs/hierarchical-multilevel/P1.md) `0.82`
