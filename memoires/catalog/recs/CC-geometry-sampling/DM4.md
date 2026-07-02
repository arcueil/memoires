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

- [✗ CC-convergence-diagnostics B7 · when divergences / E-BFMI / tree-depth are clean on a well-separated m](../../recs/CC-convergence-diagnostics/B7.md) `0.86`
- [✗ CC-priors-identifiability S1 · when **chains land in conflicting sign/label/orientation modes and tun](../../recs/CC-priors-identifiability/S1.md) `0.85`
- [✗ CC-convergence-diagnostics B2 · when you run a single chain on a multimodal/mixture target → per-chain](../../recs/CC-convergence-diagnostics/B2.md) `0.84`
- [✗ mixture D1 · for a **degenerate mixture** (identical component family, exchangeable](../../recs/mixture/D1.md) `0.84`
