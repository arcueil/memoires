# ✓ DM1 · when a model has **discrete component-assignment variables z** → marginalizing them out analytically (`log_sum_exp`) bef

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**✓ DM1**  · when a model has **discrete component-assignment variables z** → marginalizing them out analytically (`log_sum_exp`) before sampling works.
- why: HMC can't move in discrete space; the marginalized likelihood is a smooth convex combination, and Rao-Blackwell guarantees lower-variance estimates.
- conditions: continuous sampler (HMC/NUTS); components share a family enabling analytic marginalization.
- tier: 🟢 · source: mixture_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Marginalize the discrete latent variables: sum the joint density over all admissible values of the discrete states" · "Diagnose the failed marginalization attempt: ask whether it failed to IMPLEMENT vs implemented-but-wrong-results"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [mixture C5 · Where the mixture lives dictates how you treat it — marginalize the as](../../claims/mixture/C5.md) `0.89`
- [✓ mixture M1 · for a mixture under **HMC/NUTS** → **marginalize the discrete assignme](../../recs/mixture/M1.md) `0.88`
- [✓ measurement-error-missing H2 · for a **missing discrete covariate** → **marginalize it out** (conditi](../../recs/measurement-error-missing/H2.md) `0.84`
- [✓/✗ measurement-error-missing F1 · for a **bivariate (or joint) model where one component can go missing*](../../recs/measurement-error-missing/F1.md) `0.83`
