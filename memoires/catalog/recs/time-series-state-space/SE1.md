# ✓ SE1 · for **encoding seasonality** in a time series → a **Fourier basis** (K sin/cos harmonics at the period) works.

[Time-series & state-space models](../../pages/time-series-state-space.md)

**Why this holds — the governing claim:**

- ↑ [time-series-state-space C6 · A structural time series decomposes additively into interpretable latent compone](../../claims/time-series-state-space/C6.md)

**✓ SE1**  · for **encoding seasonality** in a time series → a **Fourier basis** (K sin/cos harmonics at the
period) works.
- why: smooth and cheap; handles non-integer periods (365.25) and stacked multi-seasonality (weekly + yearly bases summed).
- conditions: heuristic n_terms ≤ period/2 (Nyquist), usually far fewer; more terms = more flexible but risk overfit.
- tier: 🟢 · source: [pymc-labs:time-series](https://github.com/pymc-labs/python-analytics-skills)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ ode-dynamical M4 · for a **periodic dynamical model with period-induced multimodality** →](../../recs/ode-dynamical/M4.md) `0.79`
- [✓ ode-dynamical M5 · for **suppressing spurious period-alias modes without changing the mod](../../recs/ode-dynamical/M5.md) `0.78`
- [✗ gaussian-process A1 · for an **additive / multi-component signal decomposition** (multi-scal](../../recs/gaussian-process/A1.md) `0.76`
- [✓ CC-convergence-diagnostics D4 · when thinning is genuinely needed → use **deterministic post-run thinn](../../recs/CC-convergence-diagnostics/D4.md) `0.76`
