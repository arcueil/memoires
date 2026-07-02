# ✓ DV2 · when divergences appear → pairs-plotting the offending parameters and checking whether they **cluster** vs scatter works

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)

**✓ DV2**  · when divergences appear → pairs-plotting the offending parameters and checking whether they **cluster** vs scatter works to localize the bottleneck.
- why: clustering at a boundary/funnel-neck is a true positive that names the geometric bottleneck; count alone is insufficient.
- conditions: needs scatter visualization in parameter space; the analyst chooses which parameters to examine.
- tier: 🟢 · source: rstan_workflow, divergences_and_bias
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Locate the divergences: pairs-plot the offending parameters and highlight divergent transitions" · "Look at the ENSEMBLE of divergent draws rather than individual points" · "Add treedepth to the pairs plot and isolate divergent draws with anomalously LOW treedepth"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel E2 · for **divergences** → **pairs-plotting** the offending parameters and ](../../recs/hierarchical-multilevel/E2.md) `0.93`
- [✓ gaussian-process E1 · for a **GP funnel with divergences** → **pairs-plotting the ENSEMBLE o](../../recs/gaussian-process/E1.md) `0.87`
- [✓ time-series-state-space T3 · for **scattered (non-clustered) divergences** → running the **hard-mod](../../recs/time-series-state-space/T3.md) `0.85`
- [✗ time-series-state-space T2 · for divergences clustering tightly at the **AR(1) unit-root boundary**](../../recs/time-series-state-space/T2.md) `0.84`
