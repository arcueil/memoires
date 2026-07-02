# ✗ SP1 · when using a **classic horseshoe** (unbounded local scales) under a non-identified likelihood (M>N) → it does **NOT** wo

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✗ SP1**  · when using a **classic horseshoe** (unbounded local scales) under a non-identified likelihood (M>N) → it does **NOT** work.
- why: unbounded λ lets relevant slopes diffuse arbitrarily large → bimodal/funnel τ geometry → E-BFMI collapse; relevant slopes are left under-regularized (their heavy tails escape, so their posteriors fail to concentrate) despite correct qualitative sparsity.
- conditions: M>N collinear design; tau_0=σ default (ignores N and m_0); NCP already applied.
- tier: 🟢 · source: bayes_sparse_regression
- efficacy: {divergences: 138 (adapt_delta 0.99, max_treedepth 15) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — 25% treedepth saturation, E-BFMI<0.12 (no slot)
- moves: "Constrain the offending tails — tighten the relevant priors, and/or keep the parameter in log/unconstrained space throughout" · "Localize the divergences in parameter space and look for pathological geometry"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ regression U2 · for **M>N sparse regression** → the **classic horseshoe** (unbounded l](../../recs/regression/U2.md) `0.94`
- [✗ sparse-shrinkage P2 · for a **non-identified sparse regression (M > N)** → the **classic hor](../../recs/sparse-shrinkage/P2.md) `0.94`
- [✗ sparse-shrinkage S2 · for a **horseshoe** → the common default **tau_0 = σ** does **NOT** wo](../../recs/sparse-shrinkage/S2.md) `0.88`
- [✗ sparse-shrinkage D1 · for a **horseshoe funnel** → **raising adapt_delta / max_treedepth to ](../../recs/sparse-shrinkage/D1.md) `0.87`
