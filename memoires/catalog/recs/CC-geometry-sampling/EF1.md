# ✗ EF1 · when **E-FMI passes but the funnel is localized** (per-latent-pair) → concluding good geometry does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✗ EF1**  · when **E-FMI passes but the funnel is localized** (per-latent-pair) → concluding good geometry does **NOT** work.
- why: each narrow neck contributes a diluted share of total energy variance; the more contexts, the more diluted → E-FMI becomes an increasingly unreliable funnel detector as the model scales. Divergence counts stay primary.
- conditions: hierarchical factor / scale-mixture / horseshoe with per-context or per-observation scales.
- tier: 🟢 · source: factor_modeling, modeling_sparsity
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Triage the warning hierarchy: read which diagnostic dominates (E-BFMI vs divergences vs treedepth)" · "Plot one or a handful of local parameters against the shared hierarchical scale parameter they depend on"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ sparse-shrinkage D5 · for **sparsity samplers** → reading **E-BFMI collapse as a geometry si](../../recs/sparse-shrinkage/D5.md) `0.86`
- [hierarchical-multilevel C1 · Hierarchical geometry is intrinsic and load-bearing — sampler tuning c](../../claims/hierarchical-multilevel/C1.md) `0.83`
- [✗ measurement-error-missing K1 · for a **latent/mixture measurement model that diverges** → **pure samp](../../recs/measurement-error-missing/K1.md) `0.83`
- [sparse-shrinkage C4 · Sparsity pathology is intrinsic funnel geometry — diagnostics are sign](../../claims/sparse-shrinkage/C4.md) `0.83`
