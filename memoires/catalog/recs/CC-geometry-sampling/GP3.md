# ✓ GP3 · when a **latent-Gaussian/GP regression shows divergences concentrated at small σ** → analytically marginalizing the late

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✓ GP3**  · when a **latent-Gaussian/GP regression shows divergences concentrated at small σ** → analytically marginalizing the latent field (`y ~ multi_normal_cholesky(0, K+σ²I)`) works.
- why: the pathology is the joint neck of the non-centered latent η with σ; integrating out η (and the intercept) removes it — more reliable than a zero-avoiding σ prior.
- conditions: Gaussian (or Laplace-approximable) likelihood; N small enough for a dense N×N Cholesky per iteration.
- tier: 🟡 · source: [mc-stan:26425](https://discourse.mc-stan.org/t/help-reparameterize-gp-model-to-remove-divergent-transitions/26425)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Localize the divergence source: separate kernel-hyperparameter non-identifiability from geometry by toggling which hyperparameter is sampled" · "Attack GP hyperparameter non-identifiability via marginalization / reparameterization rather than priors alone"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ regression GP1 · for a **latent-Gaussian (GP) regression with divergences at small σ** ](../../recs/regression/GP1.md) `0.97`
- [✓/✗ gaussian-process G4 · for a **GP regression** y ~ N(a+f, σ) with **divergences concentrated ](../../recs/gaussian-process/G4.md) `0.95`
- [✓ gaussian-process G1 · for a **latent-GP field** with fixed hyperparameters and a relatively ](../../recs/gaussian-process/G1.md) `0.88`
- [gaussian-process C2 · The GP latent field is a high-dimensional funnel — whiten it (NCP Chol](../../claims/gaussian-process/C2.md) `0.86`
