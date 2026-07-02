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

- [✗ CC-priors-identifiability X1 · when **a parameter is fit through a non-identity link / transform** (l](../../recs/CC-priors-identifiability/X1.md) `0.78`
- [✗ spatial-areal R1 · for an **ICAR / BYM / intrinsic-smoothing-spline** component (Q rank-d](../../recs/spatial-areal/R1.md) `0.77`
- [✗ spatial-areal Z1 · for **non-identified additive spatial effects** (ICAR/BYM/CAR effects,](../../recs/spatial-areal/Z1.md) `0.77`
- [✗ CC-model-evaluation F13 · when interpreting **latent / penalized / transformed parameters from t](../../recs/CC-model-evaluation/F13.md) `0.77`
