# ✗ GP4 · when **GP divergences localize at small σ** → a zero-avoiding prior on σ alone does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✗ GP4**  · when **GP divergences localize at small σ** → a zero-avoiding prior on σ alone does **NOT** work.
- why: pairs plots correctly localize to small σ, tempting a boundary-avoiding prior, but in practice it did not remove the divergences — the η–σ geometry is the cause.
- conditions: non-centered latent field coupled to the noise scale.
- tier: 🟡 · source: [mc-stan:26425](https://discourse.mc-stan.org/t/help-reparameterize-gp-model-to-remove-divergent-transitions/26425)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Test the zero-avoiding-prior remedy empirically: sweep the strength/location of the boundary-avoiding prior on sigma and tabulate divergence counts" · "Localize the divergence source"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓/✗ gaussian-process G4 · for a **GP regression** y ~ N(a+f, σ) with **divergences concentrated ](../../recs/gaussian-process/G4.md) `0.87`
- [✗ gaussian-process HP5 · for **GP (σ, ℓ)** in a fixed-domain low-n setting → a **reference prio](../../recs/gaussian-process/HP5.md) `0.83`
- [✓ regression GP1 · for a **latent-Gaussian (GP) regression with divergences at small σ** ](../../recs/regression/GP1.md) `0.82`
- [✗ gaussian-process G2 · for a **high-dimensional GP prior** → the **centered parameterization*](../../recs/gaussian-process/G2.md) `0.81`
