# ✗ DM3 · when **mixture components overlap** (<~1.5–2 σ) → the ordering constraint does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**✗ DM3**  · when **mixture components overlap** (<~1.5–2 σ) → the ordering constraint does **NOT** work.
- why: components continuously re-arrange to yield similar likelihoods → a 'bowtie' / curved ridge in (μ₁,μ₂) that rotates with the mixture weight → very low n_eff with NO divergences.
- conditions: mixture weight θ jointly inferred; K over-specified worsens it; ridge persists with or without the ordering constraint.
- tier: 🟢 · source: identifying_mixture_models, mixture_models
- efficacy: {divergences: 0 (no divergences) · min_ess: very low n_eff · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Use a multivariate / all-parameter view to surface the joint structure and rank candidate parameters" · "interpret deep-tree saturation as a correlation / non-identifiability signature"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ mixture O1 · for **overlapping components** (separation < ~1–2 σ) → the **ordering ](../../recs/mixture/O1.md) `0.94`
- [✗ CC-priors-identifiability S3 · when **mixture components overlap** (separation within ~1σ) → an **ord](../../recs/CC-priors-identifiability/S3.md) `0.92`
- [mixture C4 · Overlapping components are a *second*, continuous non-identifiability ](../../claims/mixture/C4.md) `0.88`
- [✗ mixture O4 · for **overlapping components** → trying to **infer the mixture weight ](../../recs/mixture/O4.md) `0.87`
