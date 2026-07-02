# ✓ IM3 · when a **JAX primitive needs to call non-JAX code** (scipy/Fortran/C++) → putting it in `def_impl` (which receives concr

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✓ IM3**  · when a **JAX primitive needs to call non-JAX code** (scipy/Fortran/C++) → putting it in `def_impl` (which receives concrete numpy-duck-typed arrays) works.
- why: `def_impl` is not traced — a stable seam for non-JAX kernels; but `def_abstract_eval` must still work on ShapedArray, and JIT/vmap/grad rules are added separately (else `jit` fails at trace time).
- conditions: eager-mode only until the transformation rules are registered.
- tier: 🟢 · source: [dansblog:sparse4](https://dansblog.netlify.app/posts/2022-05-18-sparse4-some-primatives/sparse4-some-primatives.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation I6 · when a **sparse-matrix class lazily caches its Cholesky via a mutable ](../../recs/CC-model-evaluation/I6.md) `0.79`
- [✗ gaussian-process S8 · for **sparse Cholesky in JAX** → relying on **dynamically-shaped outpu](../../recs/gaussian-process/S8.md) `0.77`
- [✓ spatial-areal N3 · for a **GP held-out / cross-validation claim** → require an **explicit](../../recs/spatial-areal/N3.md) `0.74`
- [✗ CC-priors-identifiability X7 · when **you hand-write a constraining transform for a K-element simplex](../../recs/CC-priors-identifiability/X7.md) `0.73`
