# ✗ ST1 · when **"Initial evaluation of model at starting point failed" / -inf logp** fires → forcing a new starting point does **

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ ST1**  · when **"Initial evaluation of model at starting point failed" / -inf logp** fires → forcing a new starting point does **NOT** work.
- why: the -inf is a logp (not a parameter value): a constrained quantity (σ≤0, a Beta shape ≤0, data outside support) left its support at the default start; a new start won't fix the structural cause.
- conditions: constrained quantity is a deterministic function of unconstrained latents/covariates (heteroskedastic/distributional regression, GLM shape params).
- tier: 🟡 · source: [pymc:16104](https://discourse.pymc.io/t/sampling-error-y-inf-when-adding-sigma-heteroskedastic-modelling/16104), [pymc:7160](https://discourse.pymc.io/t/error-with-model-initial-evaluation-of-model-at-starting-point-failed/7160), [pymc:9994](https://discourse.pymc.io/t/initial-evaluation-of-model-at-starting-point-failed/9994)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Confirm the failure is real and characterize it: look at the pairs plot and count divergences / mean treedepth at default settings" · "Diagnose the constrained-parameter Jacobian: change-of-variables term for lower-bounded params"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation F10 · when a **constraint is imposed via `pm.Potential`** (e.g. −inf outside](../../recs/CC-model-evaluation/F10.md) `0.80`
- [✗ CC-model-evaluation D5 · when reading a **frequentist procedure as quantifying which parameters](../../recs/CC-model-evaluation/D5.md) `0.79`
- [✗ CC-model-evaluation E1 · when **choosing the likelihood family by matching the data histogram's](../../recs/CC-model-evaluation/E1.md) `0.79`
- [✗ CC-model-evaluation F14 · when reading a **factor's effect off the reference / baseline level** ](../../recs/CC-model-evaluation/F14.md) `0.79`


## Enrichment (pymc-labs)

**'Initial evaluation at starting point failed' / -inf logp — cause taxonomy, debug APIs, and a corrective to ST1** (🔧 PyMC-specific) — Enrich ST1. (a) Add PyMC debug APIs it lacks: `model.point_logps()` / `model.debug()` to pinpoint which RV is -inf. (b) Corrective nuance / mild contradiction: ST1's headline 'forcing a new starting point does NOT work' overstates — pymc splits four causes, two of which ARE start-fixable: jitter pushing a valid param outside a constraint (fix: `init='adapt_diag'`, no jitter) and bad default initvals (fix: `initvals=...`); only data-outside-support and constant-response are truly structural. Scope ST1's 'new start won't help' to the structural sub-case (its own `conditions` already imply this).

*Source: pymc-labs (human-curated).*


## Technique (pymc-labs)

**'Initial evaluation failed / -inf logp': distinguish structural support-violation from jitter noise; debug API** — ST1 says 'a new start won't fix it' — but that is the STRUCTURAL case only. Cause-2: default jitter+adapt_diag can push an otherwise-valid constrained param outside support -> here a start DOES fix it (init='adapt_diag' to drop jitter, set initvals=, or init='advi+adapt_diag'). Debug with model.point_logps() and model.debug(). Guards ST1 from over-application.
*Source: [pymc-labs:troubleshooting](https://github.com/pymc-labs/python-analytics-skills)*
