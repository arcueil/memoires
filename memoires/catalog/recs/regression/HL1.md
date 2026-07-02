# ✗ HL1 · for a **varying-effects regression** → a **zero-centered global intercept AND zero-mean group effects without a sum-to-z

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C3 · Ridges and funnels in the *linear predictor* split into two look-alike regimes w](../../claims/regression/C3.md)

**✗ HL1**  · for a **varying-effects regression** → a **zero-centered global intercept AND zero-mean
group effects without a sum-to-zero/pin constraint** does **NOT** work (location non-identified).
- why: a constant shifts freely between the intercept and the group means without changing the likelihood → they trade off and σ_u inflates; exactly one term may carry the overall level.
- conditions: hierarchical/varying-effects models (incl GLM/nonlinear mean); even fully-observed, balanced data.
- tier: 🟡 · source: [mc-stan:39536](https://discourse.mc-stan.org/t/proper-use-of-sum-to-zero-vector-in-nested-multilevel-models/39536), [mc-stan:17086](https://discourse.mc-stan.org/t/dose-response-model-with-partial-pooling-on-maximum-value/17086)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the joint posterior of sigma and sd(Intercept) with pairs(fit); look for a degenerate ridge/arc" · "Audit the random-effects structure: check whether every term varies within the grouping factor" · "Recognize the few-groups hierarchical-variance pathology and switch the 2-level factor from random to fixed; compare convergence"

---


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel D1 · for a **hierarchical/varying-effects regression** → placing a zero-cen](../../recs/hierarchical-multilevel/D1.md) `0.94`
- [✗ CC-priors-identifiability S11 · when **a global intercept AND zero-mean group effects are both freely ](../../recs/CC-priors-identifiability/S11.md) `0.89`
- [✗ hierarchical-multilevel D3 · for a non-identified hierarchical model where you **predict new groups](../../recs/hierarchical-multilevel/D3.md) `0.81`
- [✗ spatial-areal Z1 · for **non-identified additive spatial effects** (ICAR/BYM/CAR effects,](../../recs/spatial-areal/Z1.md) `0.80`
