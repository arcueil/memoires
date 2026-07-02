# ✓ IM5 · when a **JAX sparse algorithm needs doubly-indirect scatter** (col_ptr[node] as write index) → accumulating (col,row) CO

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✓ IM5**  · when a **JAX sparse algorithm needs doubly-indirect scatter** (col_ptr[node] as write index) → accumulating (col,row) COO pairs with a monotonic integer counter, then sort + CSC via scipy outside JAX, works (~150×).
- why: single-level direct addressing (`index[k].at[counter].set(val)`) avoids the double indirection XLA can't handle; hand the sort/CSC to scipy.
- conditions: symbolic (structural) phase only; nnz static (recompile per sparsity pattern); needs scipy, not GPU-portable.
- tier: 🟢 · source: [dansblog:sparse7](https://dansblog.netlify.app/posts/2022-11-27-sparse7/sparse7.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — ~150× speedup at n=4000 (no slot)
- moves: "Compare the suspect log-density against a trusted reference implementation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ gaussian-process S8 · for **sparse Cholesky in JAX** → relying on **dynamically-shaped outpu](../../recs/gaussian-process/S8.md) `0.81`
- [✗ CC-model-evaluation I6 · when a **sparse-matrix class lazily caches its Cholesky via a mutable ](../../recs/CC-model-evaluation/I6.md) `0.79`
- [✗ spatial-areal R1 · for an **ICAR / BYM / intrinsic-smoothing-spline** component (Q rank-d](../../recs/spatial-areal/R1.md) `0.76`
- [✗ sparse-shrinkage G3 · for a **mixture-prior / horseshoe** → the **N_k observation-count heur](../../recs/sparse-shrinkage/G3.md) `0.75`
