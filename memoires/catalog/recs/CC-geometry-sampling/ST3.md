# ✗ ST3 · when an **init-method failure** fires ("mass matrix zeros on the diagonal" / "bad initial energy" / NaN at start) → trea

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ ST3**  · when an **init-method failure** fires ("mass matrix zeros on the diagonal" / "bad initial energy" / NaN at start) → treating it as merely a bad start does **NOT** work.
- why: it usually signals model misspecification or pathological geometry; the init method (jitter+adapt_diag / adapt_full / ADVI-init) is a robustness/scaling tradeoff, not a free knob.
- conditions: PyMC NUTS; hierarchical / weakly-identified models; dense-vs-diagonal matters when parameters are strongly correlated.
- tier: 🟡 · source: [pymc:451](https://discourse.pymc.io/t/what-exactly-is-jitter-adapt-diag-and-why-is-it-the-default-now/451), [pymc:9728](https://discourse.pymc.io/t/quadpotentialfulladapt/9728), [pymc:5917](https://discourse.pymc.io/t/jitter-adapt-diag-vs-adapt-diag/5917)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a dense (full) mass matrix as an alternative to reparameterization" · "Examine the spread of inverse-mass-matrix entries to test for scale heterogeneity"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-convergence-diagnostics F1 · when NaN R̂/n_eff fires on a stored constant (fixed boundary state) → ](../../recs/CC-convergence-diagnostics/F1.md) `0.78`
- [✗ CC-convergence-diagnostics B6 · when you "discard the bad chains and keep the good ones" (burn-in fram](../../recs/CC-convergence-diagnostics/B6.md) `0.76`
- [✗ CC-model-evaluation E7 · when you **impute a missing RESPONSE and re-fit** on the imputed value](../../recs/CC-model-evaluation/E7.md) `0.75`
- [✗ ode-dynamical D1 · for **structural zeros** in the data of a dynamical/count model → trea](../../recs/ode-dynamical/D1.md) `0.75`
