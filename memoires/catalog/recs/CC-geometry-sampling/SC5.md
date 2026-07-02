# ✗ SC5 · when **offloading dense Cholesky / triangular-solve / GLM to GPU** expecting a FLOP-proportional speedup → it does **NOT

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ SC5**  · when **offloading dense Cholesky / triangular-solve / GLM to GPU** expecting a FLOP-proportional speedup → it does **NOT** work.
- why: these ops are memory- and PCIe-bandwidth-bound in a sampler (small-to-moderate matrices round-tripped each leapfrog step); empirical speedups cap at ~10–30× despite >10× theoretical FLOPS.
- conditions: fp64 required; the matrix op is the bottleneck and data round-trips each gradient evaluation.
- tier: 🟡 · source: [mc-stan:9136](https://discourse.mc-stan.org/t/donating-gpu-time/9136), [mc-stan:17113](https://discourse.mc-stan.org/t/any-intuitions-results-on-when-gpu-reduce-sum/17113), [mc-stan:12835](https://discourse.mc-stan.org/t/cmdstan-opencl-gpu-problems-and-wiki-page/12835)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe runtime in terms of gradient evaluations" · "Try the cheap, non-structural fixes first (sampler kwargs, compile mode)"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ CC-model-evaluation I5 · when you **need log|Q| for a Cholesky-factored sparse SPD matrix** (ma](../../recs/CC-model-evaluation/I5.md) `0.77`
- [✓/✗ CC-priors-identifiability E2 · when **the likelihood is numerically sensitive** (ODE solver, GP kerne](../../recs/CC-priors-identifiability/E2.md) `0.77`
- [✗ gaussian-process G2 · for a **high-dimensional GP prior** → the **centered parameterization*](../../recs/gaussian-process/G2.md) `0.76`
- [✗ gaussian-process HP11 · for a **GP under cross-validation or sequential data collection** → th](../../recs/gaussian-process/HP11.md) `0.76`
