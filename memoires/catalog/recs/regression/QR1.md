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

- [✓ sparse-shrinkage S1 · for a **horseshoe / Finnish horseshoe** → setting **tau_0 = (m_0/(M − ](../../recs/sparse-shrinkage/S1.md) `0.80`
- [✗ sparse-shrinkage S2 · for a **horseshoe** → the common default **tau_0 = σ** does **NOT** wo](../../recs/sparse-shrinkage/S2.md) `0.80`
- [✓ sparse-shrinkage D4 · for **sparse regression** → reading the **σ (noise) posterior as a sen](../../recs/sparse-shrinkage/D4.md) `0.80`
- [✗ spatial-areal T1 · for a **CAR/GMRF model parameterized through precision Q** → interpret](../../recs/spatial-areal/T1.md) `0.79`
