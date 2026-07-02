# ✓ GP1 · for a **latent-Gaussian (GP) regression with divergences at small σ** → analytically **marginalizing the latent field** 

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C3 · Ridges and funnels in the *linear predictor* split into two look-alike regimes w](../../claims/regression/C3.md)

**✓ GP1**  · for a **latent-Gaussian (GP) regression with divergences at small σ** → analytically
**marginalizing the latent field** (integrate out η and the intercept) works better than tweaking the σ
prior.
- why: the pathology is the joint geometry of the non-centered latent field η with σ (a neck/funnel); a zero-avoiding σ prior does not remove it, but integrating out η collapses the model to y~multi_normal_cholesky(0, K+σ²I) over the hyperparameters.
- conditions: Gaussian/Laplace-approximable observation model; N small enough that a dense N×N Cholesky per iteration is affordable.
- tier: 🟡 · source: [mc-stan:26425](https://discourse.mc-stan.org/t/help-reparameterize-gp-model-to-remove-divergent-transitions/26425)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Exploit conjugacy: analytically marginalize the latent field (and intercept) out of the posterior" · "Test the zero-avoiding-prior remedy empirically: sweep the strength/location and tabulate divergences" · "Confirm the pathology is a funnel and locate where the divergences concentrate"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ CC-geometry-sampling GP3 · when a **latent-Gaussian/GP regression shows divergences concentrated ](../../recs/CC-geometry-sampling/GP3.md) `0.97`
- [✓/✗ gaussian-process G4 · for a **GP regression** y ~ N(a+f, σ) with **divergences concentrated ](../../recs/gaussian-process/G4.md) `0.96`
- [gaussian-process C2 · The GP latent field is a high-dimensional funnel — whiten it (NCP Chol](../../claims/gaussian-process/C2.md) `0.87`
- [✓ gaussian-process G1 · for a **latent-GP field** with fixed hyperparameters and a relatively ](../../recs/gaussian-process/G1.md) `0.87`
