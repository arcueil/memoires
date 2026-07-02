# ✗ VS3 · for **reading projpred's forward-search path as an interpretable formula** → does **NOT** work (it can select an interac

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✗ VS3**  · for **reading projpred's forward-search path as an interpretable formula** → does **NOT**
work (it can select an interaction before its main effects).
- why: the search ranks terms by predictive KL-projection, not statistical marginality; the path is not a formula — constrain it (formula-aware / search_terms) for marginality-respecting submodels.
- conditions: candidate set contains interactions/smooths/group effects; most acute in plain-GLM reference models.
- tier: 🟡 · source: [mc-stan:14893](https://discourse.mc-stan.org/t/projpred-interactions-without-marginal-terms/14893), [mc-stan:40885](https://discourse.mc-stan.org/t/implementing-projection-predictive-feature-selection-for-custom-model-with-projpred/40885), [mc-stan:18954](https://discourse.mc-stan.org/t/new-projpred-is-now-on-cran/18954)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the estimand" · "Read the headline LOO diagnostics first"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation G12 · when reading a **projpred forward-search path as an interpretable mode](../../recs/CC-model-evaluation/G12.md) `0.96`
- [✓ sparse-shrinkage V2 · for **selecting a smaller predictor set** → **projection-predictive se](../../recs/sparse-shrinkage/V2.md) `0.80`
- [✗ ode-dynamical Q3 · for **validating a prior** → checking **prior-predictive consequences ](../../recs/ode-dynamical/Q3.md) `0.80`
- [✗ CC-model-evaluation F14 · when reading a **factor's effect off the reference / baseline level** ](../../recs/CC-model-evaluation/F14.md) `0.80`
