# ✓ ST7 · when reasoning about **where to start / why the mode is a bad target** → using the near-E[log p] definition of the typic

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✓ ST7**  · when reasoning about **where to start / why the mode is a bad target** → using the near-E[log p] definition of the typical set (not "a donut that always excludes the mode") works.
- why: at moderate dimension the typical set can still contain the mode, and it is not invariant under nonlinear reparameterization; the clean donut picture is safe only in high dimension.
- conditions: moderate d (~10); under CP↔NCP / log-exp transforms.
- tier: 🟡 · source: [mc-stan:17174](https://discourse.mc-stan.org/t/the-typical-set-and-its-relevance-to-bayesian-computation/17174)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Equalize and pin the starting point to isolate initialization effects"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-convergence-diagnostics I1 · when you rely on absolute continuity (support containment) for IS vali](../../recs/CC-convergence-diagnostics/I1.md) `0.81`
- [✓ CC-model-evaluation D1 · when asking **"is my model good enough?"** → judging **relevant (goal-](../../recs/CC-model-evaluation/D1.md) `0.80`
- [✓ time-series-state-space M3 · for a **tiny min-ESS diagnosed as multimodality** → **classifying the ](../../recs/time-series-state-space/M3.md) `0.79`
- [✗ CC-priors-identifiability N2 · when **you use a diffuse-but-proper prior** (Normal(0,1000), U(−1000,1](../../recs/CC-priors-identifiability/N2.md) `0.79`
