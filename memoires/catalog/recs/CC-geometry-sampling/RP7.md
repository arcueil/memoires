# ✓ RP7 · when a **Gamma-prior latent vector funnels** → substituting a LogNormal (or an informative zero-avoiding prior) works.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✓ RP7**  · when a **Gamma-prior latent vector funnels** → substituting a LogNormal (or an informative zero-avoiding prior) works.
- why: LogNormal admits the log-scale non-centering the Gamma resists.
- conditions: a log-scale shape for the latent is acceptable; else mean-shape reparam + tail-placement + a zero-avoiding prior.
- tier: 🟡 · source: [mc-stan:37076](https://discourse.mc-stan.org/t/reparameterizing-gamma-distribution-to-avoid-low-bfmi/37076), [mc-stan:1017](https://discourse.mc-stan.org/t/reparameterizing-the-gamma/1017), [mc-stan:38465](https://discourse.mc-stan.org/t/when-to-use-reparameterization-in-gamma-regression/38465)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Change the model rather than the sampler: reparameterize the offending term, and/or add prior information" · "Constrain the offending tails — tighten the relevant priors, and/or keep the parameter in log/unconstrained space throughout"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ latent-factor D1 · for a **latent-Gaussian** model → **joint HMC/NUTS on (u,θ)** without ](../../recs/latent-factor/D1.md) `0.83`
- [✗ CC-priors-identifiability S10 · when **a latent affinity/location and cutpoints/offsets appear only as](../../recs/CC-priors-identifiability/S10.md) `0.83`
- [✓/✗ gaussian-process G4 · for a **GP regression** y ~ N(a+f, σ) with **divergences concentrated ](../../recs/gaussian-process/G4.md) `0.82`
- [✓ CC-priors-identifiability E5 · when **you tune a containment prior by moment-matching and δ is large*](../../recs/CC-priors-identifiability/E5.md) `0.82`
