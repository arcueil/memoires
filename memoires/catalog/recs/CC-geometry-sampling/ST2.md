# ✗ ST2 · when **"Gradient at the initial value is not finite"** but log_prob evaluates fine → assuming the value check suffices d

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ ST2**  · when **"Gradient at the initial value is not finite"** but log_prob evaluates fine → assuming the value check suffices does **NOT** work.
- why: HMC depends entirely on the gradient, which can be NaN/Inf/wrong while the value is finite (≥4 distinct routes); debug the gradient channel (grad_log_prob / JVP) to find which parameter's gradient breaks.
- conditions: autodiff or externally supplied gradients; low acceptance across all step sizes.
- tier: 🟡 · source: [mc-stan:5816](https://discourse.mc-stan.org/t/estimating-variances-always-infinite-gradient/5816), [mc-stan:9813](https://discourse.mc-stan.org/t/known-gradient-breaking-behaviours/9813), [mc-stan:25130](https://discourse.mc-stan.org/t/non-finite-gradient-in-pharmacokinetic-model-with-complex-absorption/25130)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation" · "Rule out floating-point precision as the driver of step-size collapse"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓/✗ time-series-state-space D5 · for the forward recursion of a **short sequence with not-too-small pro](../../recs/time-series-state-space/D5.md) `0.81`
- [✗ ode-dynamical P1 · for a **positive parameter near a boundary** (e.g. drag k with `lower=](../../recs/ode-dynamical/P1.md) `0.80`
- [✗ CC-priors-identifiability X1 · when **a parameter is fit through a non-identity link / transform** (l](../../recs/CC-priors-identifiability/X1.md) `0.80`
- [✓ CC-priors-identifiability E7 · when **you are deciding whether a shrink-to-zero (PC) prior is appropr](../../recs/CC-priors-identifiability/E7.md) `0.79`
