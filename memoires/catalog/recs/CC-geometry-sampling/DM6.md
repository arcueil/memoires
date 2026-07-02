# ✓ DM6 · when parameters have **inequality/ordering/support constraints** → reparameterizing to an unconstrained space (built-in 

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**✓ DM6**  · when parameters have **inequality/ordering/support constraints** → reparameterizing to an unconstrained space (built-in `<lower>`/`<upper>`, simplex/stick-breaking/affine bijections) works.
- why: a smooth bijection keeps the log-density differentiable everywhere the leapfrog evaluates it.
- conditions: simple bounds → built-ins; coupled constraints (ordering, sum-to-bound, linear combinations) → a custom bijective transform.
- tier: 🟡 · source: [mc-stan:38573](https://discourse.mc-stan.org/t/benchmarking-with-inequality-constraints-on-the-true-value-in-stan/38573)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose the constrained-parameter Jacobian: Stan optimizes on the UNCONSTRAINED scale — the target carries a change-of-variables term for lower-bounded params" · "Remove the flat region by eliminating the hard clip — reparametrize onto the constrained support instead"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability S3 · when **mixture components overlap** (separation within ~1σ) → an **ord](../../recs/CC-priors-identifiability/S3.md) `0.81`
- [✗ mixture O1 · for **overlapping components** (separation < ~1–2 σ) → the **ordering ](../../recs/mixture/O1.md) `0.81`
- [mixture C3 · The two fixes divide by exactness — ordering constraints are provably ](../../claims/mixture/C3.md) `0.81`
- [✓ ode-dynamical P3 · for **constraint specification** → **separate hard (physical, e.g. pos](../../recs/ode-dynamical/P3.md) `0.80`
