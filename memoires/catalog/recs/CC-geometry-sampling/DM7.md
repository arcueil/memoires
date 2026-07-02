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

- [✗ spatial-areal C1 · for **divergences caused by a hard clip on a constrained parameter** →](../../recs/spatial-areal/C1.md) `0.82`
- [✗ CC-priors-identifiability N6 · when **you try to calibrate an unbounded scale parameter by frequentis](../../recs/CC-priors-identifiability/N6.md) `0.81`
- [✗ ode-dynamical P1 · for a **positive parameter near a boundary** (e.g. drag k with `lower=](../../recs/ode-dynamical/P1.md) `0.81`
- [✗ time-series-state-space T2 · for divergences clustering tightly at the **AR(1) unit-root boundary**](../../recs/time-series-state-space/T2.md) `0.81`
