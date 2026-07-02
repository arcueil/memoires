# ✗ ZD1 · when **zero divergences in an underdetermined regression** (N<M) → concluding correct exploration does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)

**✗ ZD1**  · when **zero divergences in an underdetermined regression** (N<M) → concluding correct exploration does **NOT** work.
- why: the underdetermined likelihood pushes σ toward zero into a funnel (the extra parameters let residuals shrink to ~0), but the data soften that σ→0 tip just enough to keep the divergence count at zero, yet E-FMI=0.028, 74.5% tree-depth saturation, R̂=2.38 on lp__ — the absence of divergences is not a near-miss but actively misleading.
- conditions: N=100, M=200 slopes; weakly-informative priors; default max_treedepth=10; 4 chains, 4000 post-warmup.
- tier: 🟢 · source: underdetermined_linear_regression
- efficacy: {divergences: 0 · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Set the interpretation policy for divergence counts before chasing them — separate 'predictive metric fine' from 'posterior unbiased'" · "Read out the actual E-BFMI value (not just the boolean warning) and validate inference against ground truth via simulation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ regression U6 · for **underdetermined linear regression (N<M+1)** → trusting **zero di](../../recs/regression/U6.md) `0.88`
- [✗ regression O3 · for **ordinal regression showing tree-depth saturation without diverge](../../recs/regression/O3.md) `0.82`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.82`
- [✓ gaussian-process E2 · for **locating *where* a divergence occurred** → reporting the traject](../../recs/gaussian-process/E2.md) `0.82`
