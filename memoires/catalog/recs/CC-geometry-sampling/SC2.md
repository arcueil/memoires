# ✓ SC2 · when a fit is **slow** → reframing it as a geometry/identifiability symptom (short cheap runs, inspect parameter correla

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C1 · Geometry belongs to the *model*, not the sampler — knobs and hardware mitigate c](../../claims/CC-geometry-sampling/C1.md)

**✓ SC2**  · when a fit is **slow** → reframing it as a geometry/identifiability symptom (short cheap runs, inspect parameter correlations, build complexity one layer at a time) works.
- why: the folk theorem — computational trouble signals a model problem; a minimal reproducer localizes it.
- conditions: general; pairs plots in the space the sampler actually works in.
- tier: 🟡 · source: [mc-stan:14303](https://discourse.mc-stan.org/t/stuck-at-warmup-iteration-with-no-error-cmdstanr/14303), [mc-stan:14300](https://discourse.mc-stan.org/t/parallelisation-suggestion/14300)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "reframe slowness as a divergence/geometry problem and reduce to a minimal reproducer" · "isolate by aggressively simplifying the model and inspecting per-parameter diagnostics" · "incrementally add complexity back, one block at a time, watching diagnostics at each step"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel E6 · for a **slow/pathological** hierarchical fit → treating slowness as a ](../../recs/hierarchical-multilevel/E6.md) `0.91`
- [✓ latent-factor E2 · for a **slow / deep-tree-saturating** latent-factor fit → treating slo](../../recs/latent-factor/E2.md) `0.90`
- [✓ sparse-shrinkage W6 · for the **same stalled fit** → **diagnosing and fixing the geometry fi](../../recs/sparse-shrinkage/W6.md) `0.84`
- [✗ sparse-shrinkage W5 · for a **large sparse/hierarchical fit that stalls or runs pathological](../../recs/sparse-shrinkage/W5.md) `0.84`


## Technique (pymc-labs)

**PyMC performance handles: HSGP API, avoid saving large Deterministics, model.profile()** — (1) low-rank GP via pm.gp.HSGP(m=[...], c=...); (2) avoid pm.Deterministic on n_obs x n_draws intermediates (memory blowup) — recompute in posterior_predictive; (3) profile with model.profile(model.logp()) and a grad-profile to operationalize the SC 'reframe runtime as gradient evaluations' move.
*Source: [pymc-labs:pymc-modeling](https://github.com/pymc-labs/python-analytics-skills)*
