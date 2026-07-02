# ✗ IM4 · when building a **JIT-compilable differentiable sparse Cholesky via pure-Python JAX idioms** (vmap/fori_loop/scan/lax.ma

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ IM4**  · when building a **JIT-compilable differentiable sparse Cholesky via pure-Python JAX idioms** (vmap/fori_loop/scan/lax.map/tree_map) → it does **NOT** work.
- why: value-dependent ragged column shapes break vmap/scan/fori_loop without heavy padding, and tree_map compile times explode above n≈20; the only viable path is a custom JAX primitive wrapping a compiled XLA kernel with manual JIT/VJP(/batching) rules.
- conditions: as of JAX ~0.3.x (2022); stated as personal failure, not universal impossibility.
- tier: 🟢 · source: [dansblog:sparse-cholesky3](https://dansblog.netlify.app/posts/2022-05-14-jax-ing-a-sparse-cholesky-factorisation-part-3-in-an-ongoing-journey/jax-ing-a-sparse-cholesky-factorisation-part-3-in-an-ongoing-journey.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ gaussian-process S8 · for **sparse Cholesky in JAX** → relying on **dynamically-shaped outpu](../../recs/gaussian-process/S8.md) `0.86`
- [✗ CC-model-evaluation I6 · when a **sparse-matrix class lazily caches its Cholesky via a mutable ](../../recs/CC-model-evaluation/I6.md) `0.82`
- [✓ sparse-shrinkage W6 · for the **same stalled fit** → **diagnosing and fixing the geometry fi](../../recs/sparse-shrinkage/W6.md) `0.76`
- [✓ gaussian-process M3 · for a **Markovian GP** → building a **sparse precision Q via FEM** wor](../../recs/gaussian-process/M3.md) `0.76`
