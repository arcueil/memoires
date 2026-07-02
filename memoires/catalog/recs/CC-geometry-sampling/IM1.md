# ✗ IM1 · when computing **sparse log-determinant gradients in float32** → it does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ IM1**  · when computing **sparse log-determinant gradients in float32** → it does **NOT** work.
- why: the log-det JVP (partial-inverse + trace) accumulates rounding error → JVP error ~8.8e-4 in float32 vs ~8.5e-13 in float64, while the PRIMAL log-det can look correct in both; enable jax_enable_x64.
- conditions: log-det path specifically (the triangular-solve JVP is fine to ~1e-7 in float32); error scales with problem size.
- tier: 🟢 · source: [dansblog:derivatives](https://dansblog.netlify.app/posts/2022-05-20-to-catch-a-derivative-first-youve-got-to-think-like-a-derivative/to-catch-a-derivative-first-youve-got-to-think-like-a-derivative.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — JVP error 8.8e-4 (f32) → 8.5e-13 (f64) (no slot)
- moves: "Rule out floating-point precision as the driver of step-size collapse" · "Compare the suspect log-density against a trusted reference implementation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ time-series-state-space D3 · for a **log-scale forward algorithm with structural zeros** in the tra](../../recs/time-series-state-space/D3.md) `0.79`
- [✓ time-series-state-space D4 · for that structural-zero gradient failure → **regularize the zeros awa](../../recs/time-series-state-space/D4.md) `0.78`
- [✗ sparse-shrinkage D2 · for a **sparsity funnel** → reading a **near-zero divergence count fro](../../recs/sparse-shrinkage/D2.md) `0.78`
- [✓ CC-model-evaluation I5 · when you **need log|Q| for a Cholesky-factored sparse SPD matrix** (ma](../../recs/CC-model-evaluation/I5.md) `0.77`
