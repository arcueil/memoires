# ✓ DV3 · when divergences **cluster at small τ / an abrupt boundary** in the non-divergent cloud → reading them as true-positive 

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)

**✓ DV3**  · when divergences **cluster at small τ / an abrupt boundary** in the non-divergent cloud → reading them as true-positive funnel-neck geometry works.
- why: eight-schools shows divergent transitions at log(τ)<0 with a sharp lower boundary the sampler cannot penetrate → identifies the CP parameterization failure.
- conditions: prior suspicion about a specific model component makes the search cheaper.
- tier: 🟢 · source: rstan_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Localize with targeted pairs plots: each group param against its own hyper-mean and hyper-sd" · "Locate the hierarchical scale parameter that a coordinate could funnel into"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel E2 · for **divergences** → **pairs-plotting** the offending parameters and ](../../recs/hierarchical-multilevel/E2.md) `0.87`
- [✗ time-series-state-space T2 · for divergences clustering tightly at the **AR(1) unit-root boundary**](../../recs/time-series-state-space/T2.md) `0.83`
- [✓ gaussian-process E1 · for a **GP funnel with divergences** → **pairs-plotting the ENSEMBLE o](../../recs/gaussian-process/E1.md) `0.82`
- [✓ gaussian-process E2 · for **locating *where* a divergence occurred** → reporting the traject](../../recs/gaussian-process/E2.md) `0.81`
