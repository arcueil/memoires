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

- [✓ ode-dynamical Q2 · for **supplying that scale legitimately** → draw it from **prior exper](../../recs/ode-dynamical/Q2.md) `0.74`
- [✗ CC-convergence-diagnostics B2 · when you run a single chain on a multimodal/mixture target → per-chain](../../recs/CC-convergence-diagnostics/B2.md) `0.73`
- [✓ CC-model-evaluation G15 · when **comparing candidate models by predictive fit** → running **`az.](../../recs/CC-model-evaluation/G15.md) `0.73`
- [✗ CC-convergence-diagnostics A1 · when a chain is stationary/irreducible/aperiodic and you take that as ](../../recs/CC-convergence-diagnostics/A1.md) `0.73`
