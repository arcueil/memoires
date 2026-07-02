# ✓ ZD3 · when a **global funnel is present but divergences lag** → reading E-FMI (below 0.2) as the earlier warning works.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✓ ZD3**  · when a **global funnel is present but divergences lag** → reading E-FMI (below 0.2) as the earlier warning works.
- why: energy-level exploration is impaired before divergences accumulate to diagnostic levels.
- conditions: global (non-localized) single top-level scale; chain-specific — only chains near the neck trigger it.
- tier: 🟢 · source: hierarchical_modeling
- efficacy: {divergences: 2/4000 (K=9 pure funnel) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read out the actual E-BFMI value (not just the boolean warning)" · "Locate the hierarchical scale parameter that a coordinate could funnel into"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ gaussian-process E1 · for a **GP funnel with divergences** → **pairs-plotting the ENSEMBLE o](../../recs/gaussian-process/E1.md) `0.81`
- [✗ sparse-shrinkage D2 · for a **sparsity funnel** → reading a **near-zero divergence count fro](../../recs/sparse-shrinkage/D2.md) `0.81`
- [✗ CC-convergence-diagnostics B7 · when divergences / E-BFMI / tree-depth are clean on a well-separated m](../../recs/CC-convergence-diagnostics/B7.md) `0.79`
- [✓ sparse-shrinkage D3 · for a **sparsity model at high adapt_delta** → checking **tree-depth s](../../recs/sparse-shrinkage/D3.md) `0.79`
