# ✓ VI1 · when you want faster, more stable VI convergence than stochastic ADVI → deterministic ADVI (DADVI) works.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✓ VI1**  · when you want faster, more stable VI convergence than stochastic ADVI → deterministic ADVI (DADVI) works.
- why: DADVI fixes the Monte-Carlo sample set used to estimate the ELBO so the gradient is deterministic, removing MC gradient noise → faster, more stable VI convergence than stochastic ADVI (Giordano et al.).
- conditions: VI approximation; PyMC entry point `pymc_extras.fit(method='dadvi')`. DADVI still optimizes the ELBO (reverse-KL), so the ST5 zero-forcing caveat holds — a VI initializer/approximation, not a drop-in final posterior.
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel J1 · for **minibatch/stochastic VI** (SVI/ADVI) → treating it like frequent](../../recs/hierarchical-multilevel/J1.md) `0.81`
- [✗ CC-convergence-diagnostics J2 · when you take ELBO-convergence as *mean*-convergence for MFVI on an il](../../recs/CC-convergence-diagnostics/J2.md) `0.78`
- [✓ sparse-shrinkage W6 · for the **same stalled fit** → **diagnosing and fixing the geometry fi](../../recs/sparse-shrinkage/W6.md) `0.77`
- [✗ CC-convergence-diagnostics E4 · when you want a probability *density* from samples via KDE → does **NO](../../recs/CC-convergence-diagnostics/E4.md) `0.77`
