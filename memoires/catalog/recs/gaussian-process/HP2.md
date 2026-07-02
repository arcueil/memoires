# ✗ HP2 · for an **EQ length scale** → a **half-normal / light-tailed** prior does **NOT** work.

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — t](../../claims/gaussian-process/C1.md)

**✗ HP2**  · for an **EQ length scale** → a **half-normal / light-tailed** prior does **NOT** work.
- why: N⁺(0, 20/3)-type priors suppress the large-ρ plateau but leave the small-ρ (interpolation) plateau exposed, so ρ can collapse below the minimum spacing.
- conditions: EQ kernel; two simultaneous flat regions in the marginal likelihood.
- tier: 🟢 · source: [betanalpha:gaussian_processes](https://betanalpha.github.io/assets/case_studies/gaussian_processes.html), [betanalpha:some_containment_prior_models](https://betanalpha.github.io/assets/case_studies/some_containment_prior_models.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reconsider/retract: separate the GP's variance component (magnitude) from its correlation component (length-scale)"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability G6 · when **you use GP ARD inverse-length-scales for variable selection** (](../../recs/CC-priors-identifiability/G6.md) `0.82`
- [✗ CC-priors-identifiability N3 · when **you put uniform(0,10) / wide normals on scale hyperparameters**](../../recs/CC-priors-identifiability/N3.md) `0.81`
- [✓ hierarchical-multilevel B2 · for a hierarchical **scale parameter** → **weakly-informative bounded ](../../recs/hierarchical-multilevel/B2.md) `0.81`
- [✗ regression PR2 · for a regression fit through a **link/transform** (logit, log, log-σ, ](../../recs/regression/PR2.md) `0.81`
