# ✓ RP8 · when a **Cauchy/half-Cauchy prior in the prior-dominated regime** forces ~2000 grad-evals/iter → a Gamma or Inverse-Gamm

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✓ RP8**  · when a **Cauchy/half-Cauchy prior in the prior-dominated regime** forces ~2000 grad-evals/iter → a Gamma or Inverse-Gamma **scale-mixture-of-Gaussians** reparameterization compacts the geometry, works.
- why: the scale-mixture turns heavy-tailed contours into compact near-ellipsoidal ones — the gain is purely geometric.
- conditions: NUTS; the tangent trick applies specifically to a Cauchy/half-Cauchy on a `lower=0` scale/variance; data-rich settings may not need it.
- tier: 🟢 · source: [mc-stan:9638](https://discourse.mc-stan.org/t/theoretical-lowest-runtime-hierarchical-linear-model/9638), [mc-stan:19997](https://discourse.mc-stan.org/t/reparameterizing-multiple-cauchy-parameters/19997)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — grad-evals/iter ~2000 nominal → 15–31 (Gamma) / 7–15 (Inv-Gamma) (cost, no slot)
- moves: "Reframe runtime in terms of gradient evaluations: inspect leapfrog steps per iteration" · "Change the model rather than the sampler: reparameterize the offending term"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ regression PR5 · for a **high-dimensional scale-mixture (local-global) prior** → calibr](../../recs/regression/PR5.md) `0.84`
- [✓ gaussian-process HP1 · for an **EQ / Matérn GP length scale** where the design is length-scal](../../recs/gaussian-process/HP1.md) `0.83`
- [✗ gaussian-process HP2 · for an **EQ length scale** → a **half-normal / light-tailed** prior do](../../recs/gaussian-process/HP2.md) `0.82`
- [✓/✗ CC-priors-identifiability E2 · when **the likelihood is numerically sensitive** (ODE solver, GP kerne](../../recs/CC-priors-identifiability/E2.md) `0.82`
