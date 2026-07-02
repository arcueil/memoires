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

- [✓ spatial-areal Z3 · for the same effects → a **hard sum-to-zero** via an exact linear map ](../../recs/spatial-areal/Z3.md) `0.77`
- [✓ ode-dynamical P2 · for an ODE model with **parameters on wildly different scales** → **ma](../../recs/ode-dynamical/P2.md) `0.75`
- [✓ ode-dynamical Q4 · for **eliciting a prior on an awkwardly-scaled ODE parameter** → elici](../../recs/ode-dynamical/Q4.md) `0.75`
- [✓ ode-dynamical R7 · for **exposing hidden parameter combinations** → **re-derive the ODE/f](../../recs/ode-dynamical/R7.md) `0.75`
