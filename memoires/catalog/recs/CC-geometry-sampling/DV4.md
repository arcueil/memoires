# ✗ DV4 · when divergences **scatter uniformly** like non-divergent draws → treating each as THE pathology location does **NOT** w

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)

**✗ DV4**  · when divergences **scatter uniformly** like non-divergent draws → treating each as THE pathology location does **NOT** work (false positives / pure numerical error).
- why: uniform scatter is step-size-too-large numerical error; these vanish under an adapt_delta escalation, unlike clustered true positives.
- conditions: distinguish only by cluster analysis + the adapt_delta probe.
- tier: 🟢 · source: rstan_workflow, divergences_and_bias
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- pragmatic anchor (pymc-L1): a **<0.1% randomly-scattered** divergence rate is often treated as acceptable in practice — an operational threshold for this "false-positive scatter" case. The strict counter-stance (Betancourt: investigate *any* divergence for bias) still holds when scatter can't be confirmed; the split is pragmatic-tolerant vs strict-investigate.
- moves: "Correct the knob direction: raise adapt_delta ONLY for divergences; otherwise LOWER it so the adapted stepsize stays large enough to move" · "Look at the ENSEMBLE of divergent draws rather than individual points"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel E2 · for **divergences** → **pairs-plotting** the offending parameters and ](../../recs/hierarchical-multilevel/E2.md) `0.87`
- [✓ gaussian-process E2 · for **locating *where* a divergence occurred** → reporting the traject](../../recs/gaussian-process/E2.md) `0.84`
- [time-series-state-space C4 · Divergence *location*, not count, is the primary triage signal — state](../../claims/time-series-state-space/C4.md) `0.84`
- [✓ ode-dynamical S6 · for deciding whether a **loose-solver posterior is trustworthy** → **r](../../recs/ode-dynamical/S6.md) `0.83`
