# ✗ IM2 · when an **expensive primal (Cholesky) must be shared across multiple tangents** via `ad.defjvp`/`defjvp2` → it does **NO

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ IM2**  · when an **expensive primal (Cholesky) must be shared across multiple tangents** via `ad.defjvp`/`defjvp2` → it does **NOT** work.
- why: defjvp registers separate per-argument JVPs each repeating the forward computation; the manual `(arg_values, arg_tangents) -> (primal, jvp)` value_and_jvp pattern returns both in one call so an O(n³) factorization runs once.
- conditions: only when the primal is expensive and reused; for cheap primals defjvp is simpler and better.
- tier: 🟡 · source: [dansblog:derivatives](https://dansblog.netlify.app/posts/2022-05-20-to-catch-a-derivative-first-youve-got-to-think-like-a-derivative/to-catch-a-derivative-first-youve-got-to-think-like-a-derivative.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ gaussian-process S8 · for **sparse Cholesky in JAX** → relying on **dynamically-shaped outpu](../../recs/gaussian-process/S8.md) `0.80`
- [✓ CC-model-evaluation A7 · when a **shared parameter is constrained by two independent sources / ](../../recs/CC-model-evaluation/A7.md) `0.79`
- [✗ CC-model-evaluation G8 · when **`elpd_diff` exceeds several `se_diff` but is tiny in absolute t](../../recs/CC-model-evaluation/G8.md) `0.77`
- [✓ spatial-areal Z3 · for the same effects → a **hard sum-to-zero** via an exact linear map ](../../recs/spatial-areal/Z3.md) `0.77`
