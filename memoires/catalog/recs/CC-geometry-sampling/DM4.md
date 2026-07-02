# ✗ DM4 · when a posterior is **multimodal with well-separated modes** → hard-rejecting constraints or trusting single-chain clean

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claims:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)
- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**✗ DM4**  · when a posterior is **multimodal with well-separated modes** → hard-rejecting constraints or trusting single-chain cleanliness does **NOT** work; use split-R̂ + multi-chain scatter.
- why: within-mode diagnostics (divergences, E-BFMI, treedepth) all pass; only cross-chain comparison sees the missed modes.
- conditions: modes separated by near-zero density; chains at different modes.
- tier: 🟢 · source: identifying_mixture_models
- efficacy: {divergences: clean/pass · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — split-R̂ ≫ 1 (no slot)
- moves: "Simulate a dataset from the model with known/recovered parameters and refit; check whether divergences reproduce"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ ode-dynamical M2 · for **genuine multimodality** → **characterize each mode with posterio](../../recs/ode-dynamical/M2.md) `0.84`
- [✗ ode-dynamical M1 · for **unexpected multimodality** in a dynamical-model posterior → trea](../../recs/ode-dynamical/M1.md) `0.84`
- [✓ CC-model-evaluation A7 · when a **shared parameter is constrained by two independent sources / ](../../recs/CC-model-evaluation/A7.md) `0.83`
- [✗ CC-convergence-diagnostics F6 · when a subset of parameters shows R̂>1.1 under a two-component (inner_](../../recs/CC-convergence-diagnostics/F6.md) `0.82`
