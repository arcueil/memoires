# ✓ DV5 · when unsure whether divergences are true vs false positive → the **adapt_delta escalation probe** works to classify them

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)

**✓ DV5**  · when unsure whether divergences are true vs false positive → the **adapt_delta escalation probe** works to classify them.
- why: false-positive divergences (numerical error) vanish completely near adapt_delta=1; true-positive geometry failures persist.
- conditions: requires a RANGE of adapt_delta, not a single value; HMC/NUTS.
- tier: 🟢 · source: divergences_and_bias
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Build a funnel and dial its dimension; raise adapt_delta to suppress divergences and watch which diagnostic survives" · "Correct the knob direction: raise adapt_delta ONLY for divergences"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ sparse-shrinkage D3 · for a **sparsity model at high adapt_delta** → checking **tree-depth s](../../recs/sparse-shrinkage/D3.md) `0.83`
- [✗ sparse-shrinkage D2 · for a **sparsity funnel** → reading a **near-zero divergence count fro](../../recs/sparse-shrinkage/D2.md) `0.83`
- [✓ ode-dynamical S6 · for deciding whether a **loose-solver posterior is trustworthy** → **r](../../recs/ode-dynamical/S6.md) `0.81`
- [time-series-state-space C4 · Divergence *location*, not count, is the primary triage signal — state](../../claims/time-series-state-space/C4.md) `0.81`
