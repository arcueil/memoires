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

- [✗ CC-priors-identifiability N3 · when **you put uniform(0,10) / wide normals on scale hyperparameters**](../../recs/CC-priors-identifiability/N3.md) `0.82`
- [✓ CC-priors-identifiability E7 · when **you are deciding whether a shrink-to-zero (PC) prior is appropr](../../recs/CC-priors-identifiability/E7.md) `0.81`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.81`
- [✗ CC-priors-identifiability W2 · when **you fix that sampling with a narrow WIP** (Normal(0,1) on all s](../../recs/CC-priors-identifiability/W2.md) `0.81`
