# ✗ ST5 · when using a **Pathfinder / reverse-KL (ELBO) VI fit as the POSTERIOR** → it does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ ST5**  · when using a **Pathfinder / reverse-KL (ELBO) VI fit as the POSTERIOR** → it does **NOT** work.
- why: reverse-KL (the ELBO objective) is zero-forcing / mode-seeking → underestimates posterior variance and can badly miss hierarchical hyperparameters; it is useful only as an initializer.
- conditions: hierarchical models especially.
- tier: 🟡 · source: [mc-stan:34960](https://discourse.mc-stan.org/t/using-pathfinder-or-other-method-to-set-initial-values-for-sampling/34960)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read out the actual E-BFMI value and validate inference against ground truth via simulation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ sparse-shrinkage W6 · for the **same stalled fit** → **diagnosing and fixing the geometry fi](../../recs/sparse-shrinkage/W6.md) `0.80`
- [✗ CC-convergence-diagnostics J2 · when you take ELBO-convergence as *mean*-convergence for MFVI on an il](../../recs/CC-convergence-diagnostics/J2.md) `0.80`
- [✓/✗ regression U5 · for the **σ posterior in sparse regression** → reading σ as a **diagno](../../recs/regression/U5.md) `0.79`
- [✓ ode-dynamical S1 · for a Bayesian model with an **ODE-solve likelihood** → **sample under](../../recs/ode-dynamical/S1.md) `0.79`


## Enrichment (pymc-labs)

**VI/Pathfinder can miss multimodality (second VI failure mode)** (📐 portable) — One-line addition to ST5's 'why': beyond variance-underestimation (which ST5 nails), a unimodal q also misses multimodality entirely. Cross-link DM4 (missed well-separated modes) — 'Always validate VI/Pathfinder against MCMC.'

*Source: pymc-labs (human-curated).*
