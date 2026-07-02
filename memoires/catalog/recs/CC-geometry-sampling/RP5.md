# ✓ RP5 · when **NCP is needed** → hand-writing `x_raw ~ std_normal(); x = μ + σ·x_raw` (not the built-in sugar) works.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✓ RP5**  · when **NCP is needed** → hand-writing `x_raw ~ std_normal(); x = μ + σ·x_raw` (not the built-in sugar) works.
- why: the hand-rolled form avoids the offset/multiplier gradient-cancellation trap while encoding the identical posterior.
- conditions: hierarchical/random-effect scale that can approach zero.
- tier: 🟡 · source: [mc-stan:20712](https://discourse.mc-stan.org/t/offset-multiplier-initialization/20712)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize the group-level effects to non-centered form (gamma_raw ~ std_normal…)"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability N3 · when **you put uniform(0,10) / wide normals on scale hyperparameters**](../../recs/CC-priors-identifiability/N3.md) `0.79`
- [✗ CC-priors-identifiability N2 · when **you use a diffuse-but-proper prior** (Normal(0,1000), U(−1000,1](../../recs/CC-priors-identifiability/N2.md) `0.79`
- [✗ CC-priors-identifiability X2 · when **you set LogNormal(μ,σ) using a natural-scale mean/sd** → does *](../../recs/CC-priors-identifiability/X2.md) `0.78`
- [✗ CC-model-evaluation G3 · when computing **elpd by a global `mean(exp())` over the flattened S×n](../../recs/CC-model-evaluation/G3.md) `0.78`
