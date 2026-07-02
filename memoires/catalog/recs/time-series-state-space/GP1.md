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

- [gaussian-process C5 · A GP is non-parametric — prediction and structural decomposition requi](../../claims/gaussian-process/C5.md) `0.85`
- [✗ gaussian-process A1 · for an **additive / multi-component signal decomposition** (multi-scal](../../recs/gaussian-process/A1.md) `0.82`
- [✓ CC-model-evaluation F12 · when **predicting a GP at new inputs** → **explicitly conditioning on ](../../recs/CC-model-evaluation/F12.md) `0.82`
- [✓ gaussian-process AP3 · for **population-mean estimation under covariate-dependent randomizati](../../recs/gaussian-process/AP3.md) `0.81`
