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

- [✗ gaussian-process S1 · for an **exact dense GP with N more than a few hundred** → **full-cova](../../recs/gaussian-process/S1.md) `0.81`
- [gaussian-process C3 · An exact dense GP does not scale — the fix is a *structured* represent](../../claims/gaussian-process/C3.md) `0.81`
- [✗ sparse-shrinkage W5 · for a **large sparse/hierarchical fit that stalls or runs pathological](../../recs/sparse-shrinkage/W5.md) `0.77`
- [✗ time-series-state-space P1 · for a **fine-grid discretized Markov chain** (e.g. Brownian motion, N≈](../../recs/time-series-state-space/P1.md) `0.77`
