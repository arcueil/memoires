# ✗ PR2 · for a regression fit through a **link/transform** (logit, log, log-σ, centered intercept) → specifying priors on the **n

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C2 · Linear (and polynomial) regression is a *local Taylor approximation* — validity ](../../claims/regression/C2.md)

**✗ PR2**  · for a regression fit through a **link/transform** (logit, log, log-σ, centered intercept) →
specifying priors on the **natural scale** does **NOT** work (priors are read on the internal scale).
- why: any prior you set is interpreted on the internal (link) scale — a [0,1]-bounded prior under a logit link is incoherent, and a default t(3,0,2.5) can blow up under pushforward.
- conditions: any non-identity link/transform; most acute for default priors and bounded-support priors on unbounded link-scale parameters.
- tier: 🟡 · source: [mc-stan:34027](https://discourse.mc-stan.org/t/understanding-intercept-prior-in-brms/34027), [mc-stan:27338](https://discourse.mc-stan.org/t/priors-for-log-sigma-in-distributional-gaussian-model/27338), [mc-stan:10344](https://discourse.mc-stan.org/t/shifted-log-normal-distribution-with-varying-shifts-by-participant/10344)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "State the mechanism: priors go on the (unconstrained, pre-transformation) linear-predictor parameters" · "Reframe: under a non-identity link the coefficient (and its prior) is not interpretable in isolation" · "Run prior predictive checks via sample_prior='only' + pp_check()"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability X1 · when **a parameter is fit through a non-identity link / transform** (l](../../recs/CC-priors-identifiability/X1.md) `0.91`
- [✗ CC-priors-identifiability X2 · when **you set LogNormal(μ,σ) using a natural-scale mean/sd** → does *](../../recs/CC-priors-identifiability/X2.md) `0.83`
- [✗ ode-dynamical Q1 · for **supplying a prior scale by pre-fitting the data** (empirical-Bay](../../recs/ode-dynamical/Q1.md) `0.82`
- [✓/✗ CC-priors-identifiability G5 · when **you set ρ-prior bounds from the observed covariate span** → wor](../../recs/CC-priors-identifiability/G5.md) `0.81`
