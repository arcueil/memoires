# ✓ EF3 · when a **single global scale funnels but divergences lag** → treating E-FMI < 0.2 as an early-warning obstruction signal

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✓ EF3**  · when a **single global scale funnels but divergences lag** → treating E-FMI < 0.2 as an early-warning obstruction signal works.
- why: energy-level exploration is impaired before divergences accumulate.
- conditions: global (non-localized) funnel; chain-specific — only chains near the neck trigger.
- tier: 🟢 · source: hierarchical_modeling
- efficacy: {divergences: 2/4000 (K=9) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — E-FMI 0.134/0.160 (no slot)
- moves: "Read out the actual E-BFMI value (not just the boolean warning)" · "Locate the hierarchical scale parameter that a coordinate could funnel into"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ sparse-shrinkage D2 · for a **sparsity funnel** → reading a **near-zero divergence count fro](../../recs/sparse-shrinkage/D2.md) `0.84`
- [✓ gaussian-process E1 · for a **GP funnel with divergences** → **pairs-plotting the ENSEMBLE o](../../recs/gaussian-process/E1.md) `0.83`
- [✓ gaussian-process E2 · for **locating *where* a divergence occurred** → reporting the traject](../../recs/gaussian-process/E2.md) `0.83`
- [✓ sparse-shrinkage D3 · for a **sparsity model at high adapt_delta** → checking **tree-depth s](../../recs/sparse-shrinkage/D3.md) `0.82`
