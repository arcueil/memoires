# ✓ TD3 · when tree-depth saturates in a **fine-grid discretized Markov chain** (CP, near-unit neighbor correlation) → NCP (sample

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claims:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)
- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✓ TD3**  · when tree-depth saturates in a **fine-grid discretized Markov chain** (CP, near-unit neighbor correlation) → NCP (sample i.i.d. innovations, reconstruct states deterministically) resolves it, works.
- why: CP imposes near-unit correlations between neighboring states → an elongated ridge; NCP decorrelates them.
- conditions: N ≥ several hundred states, short increments, observations sparse relative to N.
- tier: 🟢 · source: brownian_bridge
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize the group-level effects to non-centered form (gamma_raw ~ std_normal…)" · "Verify the reparameterized geometry is decoupled"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ time-series-state-space P1 · for a **fine-grid discretized Markov chain** (e.g. Brownian motion, N≈](../../recs/time-series-state-space/P1.md) `0.89`
- [✓ time-series-state-space P2 · for the same fine-grid Markov chain → the **non-centered parameterizat](../../recs/time-series-state-space/P2.md) `0.87`
- [✓ hierarchical-multilevel P10 · for a **discretized SDE** fit as a hierarchical chain of latent states](../../recs/hierarchical-multilevel/P10.md) `0.83`
- [✓ time-series-state-space P3 · for a **discretized SDE with mixed observed/unobserved time points** →](../../recs/time-series-state-space/P3.md) `0.82`
