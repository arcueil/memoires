# ✗ SC3 · when **vectorizing a computation "for its own sake"** to speed Stan → it does **NOT** work as the primary lever.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C1 · Geometry belongs to the *model*, not the sampler — knobs and hardware mitigate c](../../claims/CC-geometry-sampling/C1.md)

**✗ SC3**  · when **vectorizing a computation "for its own sake"** to speed Stan → it does **NOT** work as the primary lever.
- why: vectorization only reduces the number of autodiff variables; the dominant levers in order are (1) posterior geometry, (2) #autodiff variables, then (3) specialized vectorized functions.
- conditions: loop-vs-vectorized likelihoods, factor-indexed predictors, reduce_sum slicing.
- tier: 🟡 · source: [mc-stan:510](https://discourse.mc-stan.org/t/vectorization-of-sum-of-real-matrix-terms-any-ideas/510), [mc-stan:20567](https://discourse.mc-stan.org/t/vectorized-matrix-vector-multiplication-with-factors/20567), [mc-stan:16486](https://discourse.mc-stan.org/t/reduce-sum-with-hierarchical-vector-auto-regression/16486)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe runtime in terms of gradient evaluations: inspect leapfrog steps per iteration rather than wall-clock"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ gaussian-process S7 · for **gradient-based hyperparameter inference through the partial inve](../../recs/gaussian-process/S7.md) `0.76`
- [✗ hierarchical-multilevel J1 · for **minibatch/stochastic VI** (SVI/ADVI) → treating it like frequent](../../recs/hierarchical-multilevel/J1.md) `0.75`
- [✗ spatial-areal Z1 · for **non-identified additive spatial effects** (ICAR/BYM/CAR effects,](../../recs/spatial-areal/Z1.md) `0.74`
- [✓ ode-dynamical Q2 · for **supplying that scale legitimately** → draw it from **prior exper](../../recs/ode-dynamical/Q2.md) `0.74`
