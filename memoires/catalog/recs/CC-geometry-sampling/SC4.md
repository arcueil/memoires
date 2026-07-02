# ✓ SC4 · when a **custom `_lpdf` recomputes an expensive data-independent term** (integrate_1d, ODE, big linear algebra) once per

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✓ SC4**  · when a **custom `_lpdf` recomputes an expensive data-independent term** (integrate_1d, ODE, big linear algebra) once per observation → vectorizing the `_lpdf` to compute it once per leapfrog step works.
- why: Stan does not cache/memoize across per-obs `~` calls; the data-independent term is repeated N× per gradient evaluation.
- conditions: term depends on parameters but not the individual data point; keep the `~` sampling-statement form.
- tier: ⚪ · source: [mc-stan:24425](https://discourse.mc-stan.org/t/caching-results-of-repeated-evaluations-of-integrate-1d-in-custom-distribution/24425)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Change the model rather than the sampler: reparameterize the offending term"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation G1 · when reading **`lp__` / `target` as the pointwise log-likelihood** for](../../recs/CC-model-evaluation/G1.md) `0.79`
- [✓ sparse-shrinkage W6 · for the **same stalled fit** → **diagnosing and fixing the geometry fi](../../recs/sparse-shrinkage/W6.md) `0.78`
- [✓/✗ CC-priors-identifiability E6 · when **a family's CDF/quantile has no closed form** → for **fixed-para](../../recs/CC-priors-identifiability/E6.md) `0.78`
- [ode-dynamical C1 · Continuous-time generative flows: the vector field's reversibility is ](../../claims/ode-dynamical/C1.md) `0.77`
