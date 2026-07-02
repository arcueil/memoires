# ✓ GP1 · for a **nonparametric time-series model** → a **GP prior over time with composed kernels** works.

[Time-series & state-space models](../../pages/time-series-state-space.md)

**Why this holds — the governing claim:**

- ↑ [time-series-state-space C6 · A structural time series decomposes additively into interpretable latent compone](../../claims/time-series-state-space/C6.md)

**✓ GP1**  · for a **nonparametric time-series model** → a **GP prior over time with composed kernels** works.
- why: Matern52 for smooth trends; compose kernels as a structural decomposition — cov_trend (long-lengthscale Matern) + locally-periodic seasonality (Periodic × Matern-decay); kernel composition (additive/multiplicative structure) is the GP analogue of the structural-TS decomposition (C6).
- conditions: exact Latent GP is O(T³) — switch to HSGP (Hilbert-space approximation, m basis functions, boundary factor c) for T > ~500; forecast via gp.conditional(Xnew).
- tier: 🟢 · source: [pymc-labs:gaussian-processes](https://github.com/pymc-labs/python-analytics-skills)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ gaussian-process E4 · for **prior-improbable posteriors on GP terms** → reading them as a **](../../recs/gaussian-process/E4.md) `0.83`
- [✗ gaussian-process HP4 · for **EQ GP hyperparameters** → **maximum marginal likelihood (MML) wi](../../recs/gaussian-process/HP4.md) `0.83`
- [✓ hierarchical-multilevel L2 · for the same setting → a **structured prior that borrows strength acro](../../recs/hierarchical-multilevel/L2.md) `0.82`
- [✗ gaussian-process EB1 · for **setting a GP prior scale from a pre-fit to the same data** → **e](../../recs/gaussian-process/EB1.md) `0.82`
