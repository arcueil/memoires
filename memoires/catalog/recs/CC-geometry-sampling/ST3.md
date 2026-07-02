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

- [✗ regression PR4 · for a **positive-support GLM** (Gamma, Weibull, inverse-Gaussian) → an](../../recs/regression/PR4.md) `0.79`
- [✗ measurement-error-missing K1 · for a **latent/mixture measurement model that diverges** → **pure samp](../../recs/measurement-error-missing/K1.md) `0.78`
- [✓ sparse-shrinkage D5 · for **sparsity samplers** → reading **E-BFMI collapse as a geometry si](../../recs/sparse-shrinkage/D5.md) `0.78`
- [✓ measurement-error-missing K3 · for such a fit → **diagnose the geometry first** — pairs/scatter of (μ](../../recs/measurement-error-missing/K3.md) `0.78`


## Enrichment (pymc-labs)

**'Mass matrix contains zeros on diagonal' -> standardize predictors / weakly-informative prior for curvature** (📐 portable) — New rec enriching ST3: zero mass-matrix diagonal = a param's logp gradient is numerically 0 via (a) predictors on wildly different scales -> large-scale gradient underflows -> standardize ALL predictors to unit scale; (b) flat likelihood (empty group / no data) -> replace diffuse prior (Uniform(0,100)) with a weakly-informative one (HalfNormal(1)) to supply soft curvature. Our RP10 only covers dense-metric rescaling, not the standardize/weak-prior fixes.

*Source: pymc-labs (human-curated).*
