# ✓ SE2 · for **encoding seasonality** when you want one interpretable effect per season → **sum-to-zero seasonal dummies** work.

[Time-series & state-space models](../../pages/time-series-state-space.md)

**Why this holds — the governing claim:**

- ↑ [time-series-state-space C6 · A structural time series decomposes additively into interpretable latent compone](../../claims/time-series-state-space/C6.md)

**✓ SE2**  · for **encoding seasonality** when you want one interpretable effect per season → **sum-to-zero
seasonal dummies** work.
- why: one effect per season under a sum-to-zero identifiability constraint (concatenate([raw, -raw.sum()])) gives a directly interpretable per-season effect.
- conditions: needs integer periods (contrast Fourier, which handles non-integer periods); the sum-to-zero constraint supplies identifiability.
- tier: 🟢 · source: [pymc-labs:time-series](https://github.com/pymc-labs/python-analytics-skills)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ regression HZ1 · for **count / semicontinuous data with excess zeros** → choosing betwe](../../recs/regression/HZ1.md) `0.78`
- [✗ ode-dynamical D1 · for **structural zeros** in the data of a dynamical/count model → trea](../../recs/ode-dynamical/D1.md) `0.78`
- [✓ ode-dynamical M5 · for **suppressing spurious period-alias modes without changing the mod](../../recs/ode-dynamical/M5.md) `0.77`
- [✗ spatial-areal Z4 · for **choosing soft vs hard** sum-to-zero → assuming one is **universa](../../recs/spatial-areal/Z4.md) `0.76`
