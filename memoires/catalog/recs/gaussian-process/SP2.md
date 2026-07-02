# ✓ SP2 · for a **monotone/shape-constrained smooth** wanted from a linear spline basis → imposing the **shape constraint on the b

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C5 · A GP is non-parametric — prediction and structural decomposition require *explic](../../claims/gaussian-process/C5.md)

**✓ SP2**  · for a **monotone/shape-constrained smooth** wanted from a linear spline basis → imposing the
**shape constraint on the basis coefficients** works (corollary).
- why: the monotonicity corollary applies whenever a shape constraint is wanted from a linear spline basis — encode it in the coefficients rather than hoping the default prior delivers it.
- conditions: linear spline basis; shape (e.g. monotonicity) constraint desired.
- tier: 🟡 · source: [mc-stan:24759](https://discourse.mc-stan.org/t/splines-vs-gprocesses/24759)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reclassify the parameters before reasoning about priors — identify which are cut points / simplex / coefficients"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability X4 · when **you reason about a spline / GAM smooth via its coefficients or ](../../recs/CC-priors-identifiability/X4.md) `0.82`
- [spatial-areal C4 · Identifying additive spatial effects requires a sum-to-zero constraint](../../claims/spatial-areal/C4.md) `0.80`
- [✓ hierarchical-multilevel L2 · for the same setting → a **structured prior that borrows strength acro](../../recs/hierarchical-multilevel/L2.md) `0.80`
- [✓ CC-geometry-sampling DM6 · when parameters have **inequality/ordering/support constraints** → rep](../../recs/CC-geometry-sampling/DM6.md) `0.79`
