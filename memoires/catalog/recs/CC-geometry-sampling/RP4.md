# ✗ RP4 · when using **Stan's offset/multiplier sugar with a σ that can reach 0** → assuming it equals a hand-written NCP does **N

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✗ RP4**  · when using **Stan's offset/multiplier sugar with a σ that can reach 0** → assuming it equals a hand-written NCP does **NOT** work.
- why: the +1/σ log(σ)-Jacobian gradient and the −1/σ normal_lpdf gradient come from different autodiff sources → catastrophic cancellation → permanently stuck at the σ→0 boundary.
- conditions: high-dimensional random-effect vectors; σ initialized or drifting very small (default Uniform(−2,2) init).
- tier: 🟡 · source: [mc-stan:20712](https://discourse.mc-stan.org/t/offset-multiplier-initialization/20712)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reproduce the built-in transform by hand to make the internal geometry observable" · "Rule out floating-point precision as the driver of step-size collapse"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ time-series-state-space D3 · for a **log-scale forward algorithm with structural zeros** in the tra](../../recs/time-series-state-space/D3.md) `0.83`
- [✗ hierarchical-multilevel B4 · for the **data-level noise SD σ** in a simple random-intercept model →](../../recs/hierarchical-multilevel/B4.md) `0.81`
- [✓ hierarchical-multilevel B3 · for a **Gaussian random-effect SD** where τ=0 is a plausible base mode](../../recs/hierarchical-multilevel/B3.md) `0.81`
- [✓ time-series-state-space D4 · for that structural-zero gradient failure → **regularize the zeros awa](../../recs/time-series-state-space/D4.md) `0.81`
