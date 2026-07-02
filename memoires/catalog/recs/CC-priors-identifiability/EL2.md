# ✓ EL2 · when **you have expert access and want a structured elicitation protocol** → run the **SHELF-like 7-step protocol**.

[Cross-cutting: priors, identifiability & degeneracy](../../pages/CC-priors-identifiability.md)

**Why this holds — the governing claim:**

- ↑ [CC-priors-identifiability C8 · Maximum-entropy priors are the least-committal distribution given elicited const](../../claims/CC-priors-identifiability/C8.md)

**✓ EL2**  · when **you have expert access and want a structured elicitation protocol** → run the **SHELF-like 7-step protocol**.
- steps: (1) define parameter + units → (2) establish plausible min/max → (3) elicit quantiles (25 / 50 / 75) → (4) elicit tail behavior → (5) fit distribution (`find_constrained_prior` / `pz.quartile`) → (6) validate by showing the fitted distribution back to the expert → (7) close with a prior-predictive check ("do these predictions look realistic?").
- why: portable structured expert-interview mechanics; fills the "prior elicitation from substance" gap that the catalog leaves open on the sourcing side.
- conditions: an available domain expert; a parameter with an interpretable scale / units.
- tier: 🟢 (source: pymc-labs)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ ode-dynamical Q4 · for **eliciting a prior on an awkwardly-scaled ODE parameter** → elici](../../recs/ode-dynamical/Q4.md) `0.80`
- [✗ CC-model-evaluation D5 · when reading a **frequentist procedure as quantifying which parameters](../../recs/CC-model-evaluation/D5.md) `0.79`
- [✓ ode-dynamical Q2 · for **supplying that scale legitimately** → draw it from **prior exper](../../recs/ode-dynamical/Q2.md) `0.78`
- [✓ hierarchical-multilevel P10 · for a **discretized SDE** fit as a hierarchical chain of latent states](../../recs/hierarchical-multilevel/P10.md) `0.78`
