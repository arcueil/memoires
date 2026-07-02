# ✗ SP1 · for a **Bayesian penalized-spline / GAM smooth** → reasoning about global behavior from the **default coefficient / wigg

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C5 · A GP is non-parametric — prediction and structural decomposition require *explic](../../claims/gaussian-process/C5.md)

**✗ SP1**  · for a **Bayesian penalized-spline / GAM smooth** → reasoning about global behavior from the
**default coefficient / wiggliness priors** does **NOT** work.
- why: splines are interpretable only *locally*; sampling functions from the prior pushforward of a common spline model produces surprisingly wild global behavior, and GP interpretability does *not* transfer to most spline models.
- conditions: B-splines, thin-plate, factor smooths (mgcv/brms, PyMC spline regressions) where the user reasons via coefficients or default priors.
- tier: 🟡 · source: [mc-stan:24759](https://discourse.mc-stan.org/t/splines-vs-gprocesses/24759), [mc-stan:34721](https://discourse.mc-stan.org/t/gaussian-hierarchical-factor-spline-model-increasing-efficiency/34721), [pymc:6235](https://discourse.pymc.io/t/spline-regression-in-pymc3/6235)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Examine the JOINT prior on the linear predictor by adding effects and tracking variance growth" · "Quantify what the proposed prior actually implies (simulate draws)"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability X4 · when **you reason about a spline / GAM smooth via its coefficients or ](../../recs/CC-priors-identifiability/X4.md) `0.96`
- [✗ CC-model-evaluation F13 · when interpreting **latent / penalized / transformed parameters from t](../../recs/CC-model-evaluation/F13.md) `0.84`
- [✗ CC-priors-identifiability X5 · when **a power-scaling / prior-sensitivity diagnostic flags the fixed ](../../recs/CC-priors-identifiability/X5.md) `0.83`
- [CC-priors-identifiability C4 · A prior lives on the model's *internal* (parameterized) scale, not the](../../claims/CC-priors-identifiability/C4.md) `0.82`
