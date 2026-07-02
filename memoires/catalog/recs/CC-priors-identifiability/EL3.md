# ✓ EL3 · when **you have verbal domain knowledge and need to turn it into a distribution family / parameters** → use the **verbal

[Cross-cutting: priors, identifiability & degeneracy](../../pages/CC-priors-identifiability.md)

**Why this holds — the governing claims:**

- ↑ [CC-priors-identifiability C8 · Maximum-entropy priors are the least-committal distribution given elicited const](../../claims/CC-priors-identifiability/C8.md)
- ↑ [CC-priors-identifiability C3 · "Non-informative" priors are a myth; the weakly-informative alternative is delib](../../claims/CC-priors-identifiability/C3.md)

**✓ EL3**  · when **you have verbal domain knowledge and need to turn it into a distribution family / parameters** → use the **verbal→distribution translation table**.
- table:
  - "roughly A–B" → constrained mass=0.90 on [A, B]
  - "usually around X, rarely above Y" → LogNormal / Gamma with median ≈ X and 95th pct ≈ Y
  - "positive, diminishing for large values" → HalfNormal / Exponential / HalfCauchy
  - "could go either way ~50–50" → Beta(1,1) or symmetric Normal(0,·)
  - "no more than X in absolute value" → TruncatedNormal or Uniform(−X, X)
- why: maps words → family; complementary to C3 / C4, which assume the family is already chosen.
- conditions: verbal statements can be pinned to a quantile / mass or to a qualitative shape.
- tier: 🟢 (source: pymc-labs)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ CC-geometry-sampling DM1 · when a model has **discrete component-assignment variables z** → margi](../../recs/CC-geometry-sampling/DM1.md) `0.80`
- [✗ CC-model-evaluation E1 · when **choosing the likelihood family by matching the data histogram's](../../recs/CC-model-evaluation/E1.md) `0.80`
- [✗ mixture O4 · for **overlapping components** → trying to **infer the mixture weight ](../../recs/mixture/O4.md) `0.79`
- [✓ ode-dynamical Q4 · for **eliciting a prior on an awkwardly-scaled ODE parameter** → elici](../../recs/ode-dynamical/Q4.md) `0.79`
