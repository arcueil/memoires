# ✗ IM8 · when computing a **CNF's log-det trace `tr(df/dx)` by naive autodiff** → it does **NOT** scale.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ IM8**  · when computing a **CNF's log-det trace `tr(df/dx)` by naive autodiff** → it does **NOT** scale.
- why: autodiff computes each Jacobian row separately → d backward passes → O(d²); the Hutchinson estimator needs one JVP (O(d)) but adds variance ∝ the Jacobian's Frobenius norm, and structured f (masked-autoregressive/triangular) gives an analytic trace.
- conditions: general unconstrained f; Hutchinson variance dominates for ill-conditioned / high-norm Jacobians.
- tier: 🟢 · source: [dansblog:diffusion](`https://dansblog.netlify.app/posts/2023-01-30-diffusion/diffusion.html`)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reduce scope: make the model sample correctly WITHOUT the flow before reintroducing it"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ time-series-state-space D3 · for a **log-scale forward algorithm with structural zeros** in the tra](../../recs/time-series-state-space/D3.md) `0.82`
- [✗ spatial-areal T1 · for a **CAR/GMRF model parameterized through precision Q** → interpret](../../recs/spatial-areal/T1.md) `0.79`
- [✓ latent-factor E2 · for a **slow / deep-tree-saturating** latent-factor fit → treating slo](../../recs/latent-factor/E2.md) `0.79`
- [spatial-areal C2 · The GMRF precision parameterization silently decouples its scalar τ fr](../../claims/spatial-areal/C2.md) `0.79`
