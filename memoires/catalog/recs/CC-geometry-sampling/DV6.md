# ✓ DV6 · when the divergence count stays **flat across adapt_delta 0.85→0.99** → diagnosing true geometric non-ergodicity and rep

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claims:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)
- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✓ DV6**  · when the divergence count stays **flat across adapt_delta 0.85→0.99** → diagnosing true geometric non-ergodicity and reparameterizing (NCP) works.
- why: a flat count as step size shrinks is the fingerprint that no step-size reduction restores geometric ergodicity for the centered parameterization.
- conditions: 10k post-warmup, single chain, weakly-informed CP (8 groups, σ_n up to 28).
- tier: 🟢 · source: divergences_and_bias
- efficacy: {divergences: ~0 (0.80, false neg), ~295 (0.85), ~315 (0.90), ~235 (0.95), ~255 (0.99) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run the model on the shared dataset, inspect adapt_delta sensitivity, and read the geometry against a known case study" · "Identify the centered hierarchical parameterization as the root cause and prescribe non-centered reparameterization"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel E1 · for a **hierarchical funnel** → sweeping **adapt_delta / shrinking ste](../../recs/hierarchical-multilevel/E1.md) `0.90`
- [✗ sparse-shrinkage D2 · for a **sparsity funnel** → reading a **near-zero divergence count fro](../../recs/sparse-shrinkage/D2.md) `0.85`
- [✓ sparse-shrinkage D3 · for a **sparsity model at high adapt_delta** → checking **tree-depth s](../../recs/sparse-shrinkage/D3.md) `0.84`
- [✗ gaussian-process G8 · for **frozen/flat GP traces** with a collapsed step size → reading the](../../recs/gaussian-process/G8.md) `0.83`
