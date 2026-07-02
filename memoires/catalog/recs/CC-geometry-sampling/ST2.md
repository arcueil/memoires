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

- [✗ time-series-state-space D3 · for a **log-scale forward algorithm with structural zeros** in the tra](../../recs/time-series-state-space/D3.md) `0.83`
- [✗ gaussian-process HP11 · for a **GP under cross-validation or sequential data collection** → th](../../recs/gaussian-process/HP11.md) `0.82`
- [time-series-state-space C3 · Discrete latent states must be marginalized out — then the dominant fa](../../claims/time-series-state-space/C3.md) `0.81`
- [✗ CC-convergence-diagnostics A4 · when the expectand has undefined mean or infinite variance → a Monte-C](../../recs/CC-convergence-diagnostics/A4.md) `0.81`


## Enrichment (pymc-labs)

**Proactive gradient-finiteness check for a custom logp** (🔧 PyMC-specific) — Enriches C7/ST2 ('finite logp != finite gradient') with a proactive check: before sampling a custom distribution, compile pytensor.grad(logp, x) and assert np.isfinite over a grid of test points. Turns the ST2 run-time 'Gradient at initial value not finite' failure into a pre-flight test that localizes non-differentiable seams (switch/abs/boundary) in hand-written densities.

*Source: pymc-labs (human-curated).*
