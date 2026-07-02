# ✓ BK1 · when choosing a PyMC NUTS backend → selecting from the nutpie / numpyro / pymc menu works — a constant-factor cost lever

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C1 · Geometry belongs to the *model*, not the sampler — knobs and hardware mitigate c](../../claims/CC-geometry-sampling/C1.md)

**✓ BK1**  · when choosing a PyMC NUTS backend → selecting from the nutpie / numpyro / pymc menu works — a constant-factor cost lever, never a geometry fix.
- why: backend choice moves cost-per-gradient by a constant factor, never ESS-per-gradient — geometry is backend-invariant (per C1). nutpie (Rust, PyMC 6 default, best mass-matrix adaptation, ~2–5× faster than pure-Python NUTS, CPU); numpyro (JAX, GPU, `nuts={'chain_method':'vectorized'}` runs all chains as one batched program); pymc (pure-Python fallback, needed for compound steps).
- conditions: set via `pm.sample(nuts_sampler=...)`; nutpie supports scan/AR/GARCH11/HSGP/Mixture/DensityDist, so a "complex model" is not a reason to downgrade the backend.
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — nutpie ~2–5× faster than pure-Python NUTS on HSGP models (speedup factor, no slot)


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ latent-factor D1 · for a **latent-Gaussian** model → **joint HMC/NUTS on (u,θ)** without ](../../recs/latent-factor/D1.md) `0.76`
- [✓ time-series-state-space P8 · for **choosing per-state centeredness** → **adapting the centeredness ](../../recs/time-series-state-space/P8.md) `0.76`
- [✗ hierarchical-multilevel F1 · for a **strictly nested** hierarchy in array/plate PPLs (NumPyro/Pyro;](../../recs/hierarchical-multilevel/F1.md) `0.75`
- [✓ sparse-shrinkage W3 · for **HMC/NUTS with windowed warmup and multiple chains** → **adaptive](../../recs/sparse-shrinkage/W3.md) `0.74`


## Technique (pymc-labs)

**PyMC NUTS backend selection menu (nutpie / numpyro / pymc)** — nutpie (Rust, PyMC6 default, best mass-matrix adaptation, ~2-5x faster than pure-Python NUTS, CPU) / numpyro (JAX, GPU, `nuts={'chain_method':'vectorized'}` runs all chains as one batched program) / pymc (pure-Python fallback, needed for compound steps). Frame per C1: backend choice moves cost-per-gradient by a constant factor, never ESS-per-gradient (geometry is backend-invariant). Note nutpie supports scan/AR/GARCH11/HSGP/Mixture/DensityDist, so 'complex model' is not a reason to downgrade backend.
*Source: [pymc-labs:inference](https://github.com/pymc-labs/python-analytics-skills)*
