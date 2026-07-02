# ✗ TD2 · when tree-depth saturates from a **correlation-length / non-identifiability ridge** → raising max_treedepth alone to "fi

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✗ TD2**  · when tree-depth saturates from a **correlation-length / non-identifiability ridge** → raising max_treedepth alone to "fix" it does **NOT** work.
- why: longer trajectories don't remove the ridge; the posterior still wanders a non-identified / near-unit-correlated surface.
- conditions: ridge non-identifiability (missing anchor) or near-unit neighbor correlation.
- tier: 🟢 · source: ordinal_regression, brownian_bridge
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Treat max_treedepth saturation as a (capped) trajectory-length warning, raise max_depth until saturation stops, and refuse to ignore any R-hat > 1.1" · "interpret deep-tree saturation as a correlation / non-identifiability signature"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ regression O3 · for **ordinal regression showing tree-depth saturation without diverge](../../recs/regression/O3.md) `0.88`
- [✓ sparse-shrinkage D3 · for a **sparsity model at high adapt_delta** → checking **tree-depth s](../../recs/sparse-shrinkage/D3.md) `0.83`
- [✓ latent-factor E2 · for a **slow / deep-tree-saturating** latent-factor fit → treating slo](../../recs/latent-factor/E2.md) `0.81`
- [✗ CC-priors-identifiability S12 · when **the global ridge is already broken** (Gaussian prior on the aff](../../recs/CC-priors-identifiability/S12.md) `0.81`
