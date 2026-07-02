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

- [✓ spatial-areal Z3 · for the same effects → a **hard sum-to-zero** via an exact linear map ](../../recs/spatial-areal/Z3.md) `0.82`
- [✗ CC-priors-identifiability S3 · when **mixture components overlap** (separation within ~1σ) → an **ord](../../recs/CC-priors-identifiability/S3.md) `0.82`
- [✗ spatial-areal C1 · for **divergences caused by a hard clip on a constrained parameter** →](../../recs/spatial-areal/C1.md) `0.81`
- [✗ spatial-areal Z1 · for **non-identified additive spatial effects** (ICAR/BYM/CAR effects,](../../recs/spatial-areal/Z1.md) `0.81`


## Technique (pymc-labs)

**Manual change-of-variables Jacobian via pm.Potential** — The PyMC how for the constrained-parameter Jacobian move: when hand-rolling a transform (e.g. sigma = pt.exp(log_sigma) as a Deterministic), the change-of-variables term is NOT auto-added — insert pm.Potential('jac', log_sigma) (log|d sigma/d log_sigma| = log_sigma). Built-in transformed distributions add this automatically; only manual Deterministic transforms need the explicit Potential.
*Source: [pymc-labs:custom-models](https://github.com/pymc-labs/python-analytics-skills)*
