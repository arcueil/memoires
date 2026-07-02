# ✓ DM2 · when **mixture components are well-separated** (>~2–3 σ) → an ordering constraint selects one of the K! modes, works.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**✓ DM2**  · when **mixture components are well-separated** (>~2–3 σ) → an ordering constraint selects one of the K! modes, works.
- why: separated modes are distinct point clusters; ordering picks one.
- conditions: separation large enough that components don't continuously re-arrange.
- tier: 🟢 · source: identifying_mixture_models, mixture_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Simulate a dataset from the model with known/recovered parameters and refit"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability S3 · when **mixture components overlap** (separation within ~1σ) → an **ord](../../recs/CC-priors-identifiability/S3.md) `0.86`
- [✓ mixture B1 · for a degenerate mixture with **scalar component params + a permutatio](../../recs/mixture/B1.md) `0.84`
- [✗ mixture O1 · for **overlapping components** (separation < ~1–2 σ) → the **ordering ](../../recs/mixture/O1.md) `0.83`
- [✗ CC-convergence-diagnostics F6 · when a subset of parameters shows R̂>1.1 under a two-component (inner_](../../recs/CC-convergence-diagnostics/F6.md) `0.82`
