# ✗ HP8 · for a **GP with ARD** over several covariates → using the **ARD inverse-length-scales for variable selection** does **NO

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — t](../../claims/gaussian-process/C1.md)

**✗ HP8**  · for a **GP with ARD** over several covariates → using the **ARD inverse-length-scales for
variable selection** does **NOT** work.
- why: length scales are only weakly informed (worse under a Bernoulli likelihood), so their posteriors stay broad no matter how tight the per-parameter prior; ARD is an unreliable selection mechanism.
- conditions: GP regression with inferred hyperparameters, ARD over several covariates, weakly-informative / non-Gaussian likelihood; most acute for full-interaction EQ kernels in moderate-to-high dimension.
- tier: 🟡 · source: [mc-stan:35930](https://discourse.mc-stan.org/t/r2d2-prior-and-gaussian-processes/35930)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe: decouple prior specification from the selection decision; do not encode selection in the prior" · "Reconsider/retract: separate the GP's variance component from its correlation component"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability G6 · when **you use GP ARD inverse-length-scales for variable selection** (](../../recs/CC-priors-identifiability/G6.md) `0.95`
- [CC-priors-identifiability C5 · Scaling a prior to the experimental design is principled, not cheating](../../claims/CC-priors-identifiability/C5.md) `0.85`
- [✗ regression U1 · for a regression with **more covariates than observations (M > N)** → ](../../recs/regression/U1.md) `0.83`
- [✗ spatial-areal B1 · for **BKMR** (recognized as GP regression with an ARD kernel) with a *](../../recs/spatial-areal/B1.md) `0.83`
