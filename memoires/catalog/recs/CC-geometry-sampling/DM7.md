# ✗ DM7 · when a distribution's **support boundary depends on the parameters** (GEV with ξ<0) → the naive (μ,σ,ξ) parametrization 

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**✗ DM7**  · when a distribution's **support boundary depends on the parameters** (GEV with ξ<0) → the naive (μ,σ,ξ) parametrization does **NOT** work.
- why: the sampled endpoint moves under the sampler → a shifting wall → extreme curvature and near-total divergences even with standardization and non-centering.
- conditions: free-bound truncation / finite-support families; gradient samplers.
- tier: 🟡 · source: [mc-stan:40694](https://discourse.mc-stan.org/t/generalized-extreme-value-distribution/40694)
- efficacy: {divergences: 90–97% (naive parametrization) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read sampler diagnostics (divergences) and re-run with a higher target_accept near the hard boundary" · "Check whether the proposed value can leave the parameter's valid range"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel B4 · for the **data-level noise SD σ** in a simple random-intercept model →](../../recs/hierarchical-multilevel/B4.md) `0.81`
- [✗ CC-priors-identifiability N4 · when **you use a Beta with a shape parameter < 1** (e.g. Beta(0.5,0.5)](../../recs/CC-priors-identifiability/N4.md) `0.80`
- [✓/✗ gaussian-process G4 · for a **GP regression** y ~ N(a+f, σ) with **divergences concentrated ](../../recs/gaussian-process/G4.md) `0.80`
- [✓ gaussian-process S4 · for a **sparse-precision latent-Gaussian model** → **parameterizing vi](../../recs/gaussian-process/S4.md) `0.80`
