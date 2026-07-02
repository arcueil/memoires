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

- [✓ ode-dynamical M5 · for **suppressing spurious period-alias modes without changing the mod](../../recs/ode-dynamical/M5.md) `0.79`
- [spatial-areal C4 · Identifying additive spatial effects requires a sum-to-zero constraint](../../claims/spatial-areal/C4.md) `0.78`
- [✗ spatial-areal Z1 · for **non-identified additive spatial effects** (ICAR/BYM/CAR effects,](../../recs/spatial-areal/Z1.md) `0.77`
- [✓ spatial-areal Z3 · for the same effects → a **hard sum-to-zero** via an exact linear map ](../../recs/spatial-areal/Z3.md) `0.77`
