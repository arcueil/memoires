# ✗ ZD2 · when **zero divergences + clean E-BFMI + no tree-depth saturation** in a multimodal posterior → concluding convergence d

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)

**✗ ZD2**  · when **zero divergences + clean E-BFMI + no tree-depth saturation** in a multimodal posterior → concluding convergence does **NOT** work.
- why: NUTS explores whichever mode it started in; inter-mode barriers are log-density valleys, not geometry kinks, so they never produce divergences. Only split-R̂ ≫ 1 and multi-chain scatter reveal the missed modes.
- conditions: modes separated by near-zero-density regions; each mode locally benign; chains at different modes.
- tier: 🟢 · source: identifying_mixture_models
- efficacy: {divergences: clean/pass · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Simulate a dataset from the model with known/recovered parameters and refit; check whether divergences reproduce" · "Use a multivariate / all-parameter view to surface the joint structure and rank candidate parameters"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-convergence-diagnostics B7 · when divergences / E-BFMI / tree-depth are clean on a well-separated m](../../recs/CC-convergence-diagnostics/B7.md) `0.92`
- [✗ mixture D2 · for a **degenerate mixture** → the **standard HMC diagnostics** (diver](../../recs/mixture/D2.md) `0.85`
- [CC-model-evaluation C1 · Clean computation certifies the sampler, not the model — evaluation mu](../../claims/CC-model-evaluation/C1.md) `0.85`
- [✓ ode-dynamical S6 · for deciding whether a **loose-solver posterior is trustworthy** → **r](../../recs/ode-dynamical/S6.md) `0.84`
