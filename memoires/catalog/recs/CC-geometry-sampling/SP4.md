# ✗ SP4 · when using the **Laplace prior** (Bayesian LASSO) for simultaneous sparsity → it does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✗ SP4**  · when using the **Laplace prior** (Bayesian LASSO) for simultaneous sparsity → it does **NOT** work.
- why: the uniform tail above λ competes with the spike below → over-shrinks relevant slopes and under-concentrates irrelevant ones (a dichotomous soft failure).
- conditions: M>N; Laplace scale ~ σ=1; collinear unit-variance design.
- tier: 🟢 · source: bayes_sparse_regression
- efficacy: {divergences: ~0 (passes except E-BFMI) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — E-BFMI 0.028–0.058 on all 4 chains, R̂>1.1 for σ and lp__ (no slot)
- moves: "Read out the actual E-BFMI value (not just the boolean warning)" · "Take the divergences seriously and refit; re-examine HMC diagnostics (ESS, Rhat) per-threshold"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ sparse-shrinkage P3 · for a **sparse regression** → the **Laplace prior (Bayesian LASSO)** d](../../recs/sparse-shrinkage/P3.md) `0.92`
- [sparse-shrinkage C1 · Bayesian sparsity is posterior concentration, not selection — so it al](../../claims/sparse-shrinkage/C1.md) `0.87`
- [✓ sparse-shrinkage P6 · for **continuous shrinkage when full sparsity is NOT required** → the ](../../recs/sparse-shrinkage/P6.md) `0.87`
- [sparse-shrinkage C2 · A sparse prior needs two scales — every single-scale prior compromises](../../claims/sparse-shrinkage/C2.md) `0.86`
