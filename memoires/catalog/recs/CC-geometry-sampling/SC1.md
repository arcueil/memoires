# ✗ SC1 · when a fit **stalls or runs pathologically slowly** → parallelization (map_rect/reduce_sum/MPI/more cores) as the FIRST 

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C1 · Geometry belongs to the *model*, not the sampler — knobs and hardware mitigate c](../../claims/CC-geometry-sampling/C1.md)

**✗ SC1**  · when a fit **stalls or runs pathologically slowly** → parallelization (map_rect/reduce_sum/MPI/more cores) as the FIRST move does **NOT** work.
- why: parallelism cuts cost per gradient by at most a constant; effective-samples-per-gradient is set by geometry alone. A stuck model is usually misspecified/non-identified/over-parameterized.
- conditions: stalls in warmup / super-linear runtime; once well-specified & conditioned, reduce_sum/map_rect IS the right tool.
- tier: 🟡 · source: [mc-stan:14303](https://discourse.mc-stan.org/t/stuck-at-warmup-iteration-with-no-error-cmdstanr/14303), [mc-stan:14300](https://discourse.mc-stan.org/t/parallelisation-suggestion/14300)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe persistent slowness as a diagnostic signal — short cheap runs and posterior inspection of parameter correlations" · "Reframe via the folk theorem: treat the slowdown as a geometry/identifiability symptom, isolate by building up complexity one layer at a time"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ sparse-shrinkage W5 · for a **large sparse/hierarchical fit that stalls or runs pathological](../../recs/sparse-shrinkage/W5.md) `0.95`
- [✗ hierarchical-multilevel K1 · for a hierarchical MCMC fit that **stalls or runs pathologically slowl](../../recs/hierarchical-multilevel/K1.md) `0.94`
- [✓ sparse-shrinkage W6 · for the **same stalled fit** → **diagnosing and fixing the geometry fi](../../recs/sparse-shrinkage/W6.md) `0.84`
- [✓ hierarchical-multilevel E6 · for a **slow/pathological** hierarchical fit → treating slowness as a ](../../recs/hierarchical-multilevel/E6.md) `0.82`
