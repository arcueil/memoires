# ✗ DV1 · when divergences appear on a hierarchical/scale model → treating them as a code bug and hunting the program does **NOT**

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claims:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)
- ↑ [CC-geometry-sampling C1 · Geometry belongs to the *model*, not the sampler — knobs and hardware mitigate c](../../claims/CC-geometry-sampling/C1.md)

**✗ DV1**  · when divergences appear on a hierarchical/scale model → treating them as a code bug and hunting the program does **NOT** work.
- why: divergent transitions signal failed geometric ergodicity in a neighborhood → estimators biased at finite N; the fix is geometry (reparameterize/marginalize), not debugging.
- conditions: HMC/NUTS only — the energy-error check is absent in Metropolis-Hastings/Gibbs.
- tier: 🟢 · source: divergences_and_bias, pystan_workflow, rstan_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Treat divergences as a posterior-geometry problem: look at the induced posterior geometry / pairs plot rather than hunting for a code bug" · "Locate the divergences: pairs-plot the offending parameters and highlight divergent transitions"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [time-series-state-space C4 · Divergence *location*, not count, is the primary triage signal — state](../../claims/time-series-state-space/C4.md) `0.86`
- [hierarchical-multilevel C1 · Hierarchical geometry is intrinsic and load-bearing — sampler tuning c](../../claims/hierarchical-multilevel/C1.md) `0.84`
- [✓ hierarchical-multilevel E2 · for **divergences** → **pairs-plotting** the offending parameters and ](../../recs/hierarchical-multilevel/E2.md) `0.84`
- [✓ gaussian-process E2 · for **locating *where* a divergence occurred** → reporting the traject](../../recs/gaussian-process/E2.md) `0.84`
