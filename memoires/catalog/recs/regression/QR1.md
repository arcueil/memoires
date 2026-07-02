# ✓ QR1 · for **regressing a chosen quantile tau** (0.5 = median, 0.9 = 90th pct) **instead of the mean** → an **asymmetric-Laplac

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✓ QR1**  · for **regressing a chosen quantile tau** (0.5 = median, 0.9 = 90th pct) **instead of the
mean** → an **asymmetric-Laplace likelihood with fixed tau** works.
- why: `logp(y) = log(tau(1−tau)/sigma) − z·(tau − [z<0])`, with `z = (y−mu)/sigma` and `mu = X.b`; an
outlier-robust alternative to mean regression. Implement in PyMC via `pm.CustomDist`.
- conditions: a targeted quantile rather than the mean; tau fixed. Pairs with SM3 — default
`epred`/`fitted` return the ALD *mean*, which is offset from the targeted quantile whenever tau≠0.5.
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ spatial-areal T1 · for a **CAR/GMRF model parameterized through precision Q** → interpret](../../recs/spatial-areal/T1.md) `0.82`
- [✓ CC-priors-identifiability W3 · when **the M>N regression is genuinely sparse** → a **Finnish horsesho](../../recs/CC-priors-identifiability/W3.md) `0.81`
- [✗ CC-priors-identifiability X3 · when **you place a prior on a GMRF / CAR precision τ as if it were an ](../../recs/CC-priors-identifiability/X3.md) `0.80`
- [✓ sparse-shrinkage D4 · for **sparse regression** → reading the **σ (noise) posterior as a sen](../../recs/sparse-shrinkage/D4.md) `0.79`
