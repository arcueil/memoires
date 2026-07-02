# ✗ RP6 · when a **Gamma / Inverse-Gamma prior on a latent positive vector funnels** → reparameterizing the Gamma itself does **NO

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✗ RP6**  · when a **Gamma / Inverse-Gamma prior on a latent positive vector funnels** → reparameterizing the Gamma itself does **NOT** work.
- why: the Gamma has no cheap differentiable inverse-CDF in the shape and no offset/multiplier non-centering → it stays effectively centered and keeps its funnel.
- conditions: estimated shape/rate hyperpriors; weakly-informative / small-data regime where the neck is actually visited.
- tier: 🟡 · source: [mc-stan:37076](https://discourse.mc-stan.org/t/reparameterizing-gamma-distribution-to-avoid-low-bfmi/37076), [mc-stan:1017](https://discourse.mc-stan.org/t/reparameterizing-the-gamma/1017), [mc-stan:38465](https://discourse.mc-stan.org/t/when-to-use-reparameterization-in-gamma-regression/38465)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Add priors on the scale hyperparameters; escalate from wide weakly-informative to genuinely informative (lighter tails than Cauchy)" · "Change the model rather than the sampler: reparameterize the offending term, and/or add prior information"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ latent-factor D1 · for a **latent-Gaussian** model → **joint HMC/NUTS on (u,θ)** without ](../../recs/latent-factor/D1.md) `0.84`
- [✗ regression U7 · for the **underdetermined-regression funnel** → **NCP** (non-centered ](../../recs/regression/U7.md) `0.84`
- [✓ regression GP1 · for a **latent-Gaussian (GP) regression with divergences at small σ** ](../../recs/regression/GP1.md) `0.82`
- [✓ CC-priors-identifiability E3 · when **you need to suppress a specific tail on a positive parameter** ](../../recs/CC-priors-identifiability/E3.md) `0.82`
