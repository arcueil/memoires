# ✗ EF4 · when **E-BFMI > 1** → treating it as a pathology does **NOT** work (benign artifact).

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✗ EF4**  · when **E-BFMI > 1** → treating it as a pathology does **NOT** work (benign artifact).
- why: on low-dimensional / simple targets the marginal energy is sharply bounded below while conditional energy changes are not → a variance-ratio artifact; E-(B)FMI carries no calibrated upper interpretation.
- conditions: low-dim/simple targets (e.g. mean of iid Gaussian); diminishes as dimension grows.
- tier: 🟡 · source: [mc-stan:28554](https://discourse.mc-stan.org/t/help-understanding-bfmi-interpreting-bfmi-1/28554)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read out the actual E-BFMI value (not just the boolean warning)" · "Calibrate severity and consult the canonical divergence reference before tuning"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ regression U9 · for the **underdetermined-regression E-BFMI failure** → a **more infor](../../recs/regression/U9.md) `0.81`
- [✓ sparse-shrinkage D5 · for **sparsity samplers** → reading **E-BFMI collapse as a geometry si](../../recs/sparse-shrinkage/D5.md) `0.80`
- [✗ CC-model-evaluation A1 · when **HMC diagnostics are clean** (0 divergences, R̂≈1, adequate ESS,](../../recs/CC-model-evaluation/A1.md) `0.78`
- [✗/✓ regression U8 · for the **underdetermined-regression funnel** → raising **max_treedept](../../recs/regression/U8.md) `0.78`
