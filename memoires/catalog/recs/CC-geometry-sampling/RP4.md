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

- [✓ CC-priors-identifiability E7 · when **you are deciding whether a shrink-to-zero (PC) prior is appropr](../../recs/CC-priors-identifiability/E7.md) `0.77`
- [✗ regression U10 · for **exact collinearity** (N<M+1, or perfectly correlated components ](../../recs/regression/U10.md) `0.76`
- [✓ spatial-areal Z2 · for the same effects → the **N-corrected soft constraint sum(x) ~ norm](../../recs/spatial-areal/Z2.md) `0.75`
- [✗ CC-priors-identifiability X2 · when **you set LogNormal(μ,σ) using a natural-scale mean/sd** → does *](../../recs/CC-priors-identifiability/X2.md) `0.75`
