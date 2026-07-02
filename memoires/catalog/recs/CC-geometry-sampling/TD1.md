# ✓ TD1 · when tree-depth saturates **without divergences and with normal E-FMI** → reading it as non-identifiability / an elongat

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✓ TD1**  · when tree-depth saturates **without divergences and with normal E-FMI** → reading it as non-identifiability / an elongated ridge (not a max_treedepth deficit) works.
- why: saturation without divergences means the correlation length exceeds 2^max_treedepth leapfrog steps; ordinal ridge (no anchor) gives R̂~2.3 / n_eff~0.00073 / ~97% saturation for ALL params, single-parameter wandering ~1.95 / ~0.00075 / ~87% for the one c[k].
- conditions: E-FMI normal rules out funnel/curvature; ordinal logistic/probit shown.
- tier: 🟢 · source: ordinal_regression
- efficacy: {divergences: 0 (without divergences) · min_ess: n_eff ~0.00073 (ridge, all params) / ~0.00075 (single param) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "interpret deep-tree saturation as a correlation / non-identifiability signature, not a tuning issue" · "Treat max_treedepth saturation as a (capped) trajectory-length warning, raise max_depth until saturation stops, and refuse to ignore any R-hat > 1.1"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ regression O3 · for **ordinal regression showing tree-depth saturation without diverge](../../recs/regression/O3.md) `0.87`
- [✗ CC-convergence-diagnostics B7 · when divergences / E-BFMI / tree-depth are clean on a well-separated m](../../recs/CC-convergence-diagnostics/B7.md) `0.82`
- [✓ sparse-shrinkage D3 · for a **sparsity model at high adapt_delta** → checking **tree-depth s](../../recs/sparse-shrinkage/D3.md) `0.82`
- [✓ ode-dynamical R8 · for **testing whether a ridge is data-limited vs structural** → **add ](../../recs/ode-dynamical/R8.md) `0.81`
