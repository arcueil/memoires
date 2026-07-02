# ✓ PB1 · for an **intended bimodal / bounded prior** (e.g. Beta) that misbehaves under HMC → swapping to a **logit-normal control

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✓ PB1**  · for an **intended bimodal / bounded prior** (e.g. Beta) that misbehaves under HMC → swapping
to a **logit-normal controlling location and spread on the unconstrained logit scale** works.
- why: an affine (location-scale) non-centering ports cleanly to the logit scale, controlling location and spread without the Beta's admissibility-boundary geometry (σ² < μ(1−μ)) that blows up the gradient.
- conditions: bounded-support prior specification under a gradient-based sampler; verify on the user's actual (non-toy) model.
- tier: ⚪ candidate (single-witness moves) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Propose swapping Beta for a logit-normal that controls location and spread on the unconstrained logit scale" · "Reparameterize the Beta through a concentration parameter on a logistic-compressed scale instead of through sigma = const/exp(v)" · "Port the concentration/gamma parameterization into the user's actual (non-toy) model and re-check divergences"

---


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel B8 · for an intended **bimodal beta prior** → re-express it as a **Mixture ](../../recs/hierarchical-multilevel/B8.md) `0.84`
- [✗ CC-priors-identifiability E1 · when **the true value may exceed your chosen scale and you use a light](../../recs/CC-priors-identifiability/E1.md) `0.81`
- [✓ regression LS1 · for an **outcome that is a proportion k/n** → model the **underlying c](../../recs/regression/LS1.md) `0.81`
- [✓ hierarchical-multilevel B3 · for a **Gaussian random-effect SD** where τ=0 is a plausible base mode](../../recs/hierarchical-multilevel/B3.md) `0.81`
