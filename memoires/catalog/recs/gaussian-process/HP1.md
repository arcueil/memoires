# ✓ HP1 · for an **EQ / Matérn GP length scale** where the design is length-scale-sensitive → an **inverse-gamma (quantile-elicite

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — t](../../claims/gaussian-process/C1.md)

**✓ HP1**  · for an **EQ / Matérn GP length scale** where the design is length-scale-sensitive → an
**inverse-gamma (quantile-elicited) prior** works.
- why: its strong suppression toward zero matches the *threshold* character of the small-ρ interpolation degeneracy; a half-normal does not.
- conditions: EQ kernel with inferred ρ; covariate-span bounds are approximate unless the design was deliberately chosen for the relevant length scales.
- tier: 🟢 · source: [betanalpha:gaussian_processes](https://betanalpha.github.io/assets/case_studies/gaussian_processes.html), [betanalpha:some_containment_prior_models](https://betanalpha.github.io/assets/case_studies/some_containment_prior_models.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Tighten hyperparameter priors using GP-specific prior guidance"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability G6 · when **you use GP ARD inverse-length-scales for variable selection** (](../../recs/CC-priors-identifiability/G6.md) `0.86`
- [CC-priors-identifiability C5 · Scaling a prior to the experimental design is principled, not cheating](../../claims/CC-priors-identifiability/C5.md) `0.86`
- [✓ ode-dynamical Q4 · for **eliciting a prior on an awkwardly-scaled ODE parameter** → elici](../../recs/ode-dynamical/Q4.md) `0.82`
- [✓ CC-geometry-sampling RP8 · when a **Cauchy/half-Cauchy prior in the prior-dominated regime** forc](../../recs/CC-geometry-sampling/RP8.md) `0.81`
