# ✓ PR5 · for a **high-dimensional scale-mixture (local-global) prior** → calibrating the **global scale τ jointly to (n, p, expec

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C3 · Ridges and funnels in the *linear predictor* split into two look-alike regimes w](../../claims/regression/C3.md)

**✓ PR5**  · for a **high-dimensional scale-mixture (local-global) prior** → calibrating the **global
scale τ jointly to (n, p, expected sparsity k)** works; a fixed τ does **NOT**.
- why: a fixed τ is effectively non-informative about sparsity regardless of dimension; the design-dependence enters through the downstream decision process, not the marginal prior alone.
- conditions: p≫n, sparsity a modeling goal; a downstream decision process (threshold/selection/projection); heavy-enough local tails (half-Cauchy).
- tier: 🟢 · source: [dansblog:cheat](https://dansblog.netlify.app/posts/2021-12-09-why-wont-you-cheat-with-me-repost/why-wont-you-cheat-with-me-repost.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Test the zero-avoiding-prior remedy empirically: sweep the strength/location and tabulate" · "Reframe the prior onto the latent linear predictor and put the scale on TOTAL model variance"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ sparse-shrinkage S3 · for **high-dimensional (p ≫ n) sparse regression** → a **fixed global ](../../recs/sparse-shrinkage/S3.md) `0.88`
- [sparse-shrinkage C3 · The global scale is a design-dependent quantity — calibrate it to (N, ](../../claims/sparse-shrinkage/C3.md) `0.88`
- [✗ spatial-areal T3 · for choosing a **prior scale in a scale-mixture / structured spatial m](../../recs/spatial-areal/T3.md) `0.85`
- [✗ hierarchical-multilevel B1 · for a hierarchical model with **few obs/group** → **vague/uniform prio](../../recs/hierarchical-multilevel/B1.md) `0.84`
