# ✓ EL1 · when **you must choose HOW to source a prior (which elicitation strategy)** → route by **expert access + scale knowledge

[Cross-cutting: priors, identifiability & degeneracy](../../pages/CC-priors-identifiability.md)

**Why this holds — the governing claim:**

- ↑ [CC-priors-identifiability C10 · Prior sourcing is a strategy-selection problem — route the elicitation method by](../../claims/CC-priors-identifiability/C10.md)

**✓ EL1**  · when **you must choose HOW to source a prior (which elicitation strategy)** → route by **expert access + scale knowledge**.
- decision tree:
  - expert access & can quantify precisely → SHELF / PreliZ roulette / quartile (see EL2)
  - expert but imprecise → constrained / maxent priors (see C8)
  - no expert but know rough scale → weakly-informative (routes into C3 scale/tail engineering + the E8 menu)
  - no scale knowledge → iterate via prior-predictive check
- why: this is the *routing* layer the catalog lacks — it covers the technical calibration of a prior once chosen, but not how to select the sourcing strategy in the first place.
- conditions: pre-data prior construction; the branch is picked by whether a domain expert is available and how precisely the scale is known.
- tier: 🟢 (source: pymc-labs)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ ode-dynamical Q2 · for **supplying that scale legitimately** → draw it from **prior exper](../../recs/ode-dynamical/Q2.md) `0.81`
- [✗ ode-dynamical Q1 · for **supplying a prior scale by pre-fitting the data** (empirical-Bay](../../recs/ode-dynamical/Q1.md) `0.80`
- [✓ ode-dynamical Q4 · for **eliciting a prior on an awkwardly-scaled ODE parameter** → elici](../../recs/ode-dynamical/Q4.md) `0.79`
- [✓ CC-model-evaluation E5 · when you need **coherent predictions for an unobserved / hypothetical ](../../recs/CC-model-evaluation/E5.md) `0.78`
