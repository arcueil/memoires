# ✗ DV7 · when **near-zero divergences at the LARGEST step size** (adapt_delta≈0.80) → reading it as "resolved" does **NOT** work 

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)

**✗ DV7**  · when **near-zero divergences at the LARGEST step size** (adapt_delta≈0.80) → reading it as "resolved" does **NOT** work (false negative).
- why: a low count at the largest step size can mean the chain never entered the funnel, not that the funnel is resolved.
- conditions: must be compared against a swept range; single adapt_delta cannot distinguish ergodic from non-ergodic.
- tier: 🟢 · source: divergences_and_bias
- efficacy: {divergences: ~0 at adapt_delta=0.80 (false negative) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Correct the knob direction: raise adapt_delta ONLY for divergences; otherwise LOWER it" · "Manually decrease the stepsize below what adaptation chose, post-warmup"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel E1 · for a **hierarchical funnel** → sweeping **adapt_delta / shrinking ste](../../recs/hierarchical-multilevel/E1.md) `0.92`
- [✗ sparse-shrinkage D2 · for a **sparsity funnel** → reading a **near-zero divergence count fro](../../recs/sparse-shrinkage/D2.md) `0.90`
- [✓ sparse-shrinkage D3 · for a **sparsity model at high adapt_delta** → checking **tree-depth s](../../recs/sparse-shrinkage/D3.md) `0.87`
- [✗ sparse-shrinkage D1 · for a **horseshoe funnel** → **raising adapt_delta / max_treedepth to ](../../recs/sparse-shrinkage/D1.md) `0.84`
