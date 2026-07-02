# ✓ DG2 · for **per-unit posterior-predictive residuals across a covariate** → reading the residual band's **shape** works to fing

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C2 · Linear (and polynomial) regression is a *local Taylor approximation* — validity ](../../claims/regression/C2.md)

**✓ DG2**  · for **per-unit posterior-predictive residuals across a covariate** → reading the residual
band's **shape** works to fingerprint the missing structure (flat offset → missing unit-level RE;
arch/dome → missing functional dependence).
- why: coherent displacement/shape across the covariate range (not point-by-point zero-containment) identifies the missing term.
- conditions: repeating-unit structure; residuals plotted per unit vs covariate; evaluate coherence across the full range.
- tier: 🟢 · source: [betanalpha:falling](https://betanalpha.github.io/assets/case_studies/falling.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe via the folk theorem: isolate by building up complexity one layer at a time" · "Separate the plotting/marginalization artifact from the actual fit before diagnosing further"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel E5 · for **per-unit posterior-predictive residuals plotted across a covaria](../../recs/hierarchical-multilevel/E5.md) `0.98`
- [✓ hierarchical-multilevel G3 · for **marginal effects/predictions** from random-slope or correlated-R](../../recs/hierarchical-multilevel/G3.md) `0.84`
- [✓ CC-model-evaluation F4 · when you need **full predictive uncertainty** → **`posterior_predict`*](../../recs/CC-model-evaluation/F4.md) `0.82`
- [✓ hierarchical-multilevel L2 · for the same setting → a **structured prior that borrows strength acro](../../recs/hierarchical-multilevel/L2.md) `0.81`
