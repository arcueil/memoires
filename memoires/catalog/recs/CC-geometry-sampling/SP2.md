# ✗ SP2 · when a **horseshoe shows E-BFMI collapse + divergences** → raising adapt_delta/max_treedepth to fix it does **NOT** work

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✗ SP2**  · when a **horseshoe shows E-BFMI collapse + divergences** → raising adapt_delta/max_treedepth to fix it does **NOT** work.
- why: these are geometry signals (heavy-tailed τ/λ funnel near zero), not tuning deficits; adapt_delta=0.99 & max_treedepth=15 still yield 138 divergences.
- conditions: classic horseshoe, non-identified likelihood, non-centered parameterization already applied.
- tier: 🟢 · source: bayes_sparse_regression
- efficacy: {divergences: 138 (persist at adapt_delta 0.99, max_treedepth 15) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Calibrate severity and consult the canonical divergence reference before tuning" · "Change the model rather than the sampler: reparameterize the offending term, and/or add prior information"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ sparse-shrinkage D1 · for a **horseshoe funnel** → **raising adapt_delta / max_treedepth to ](../../recs/sparse-shrinkage/D1.md) `0.89`
- [✗/✓ regression U8 · for the **underdetermined-regression funnel** → raising **max_treedept](../../recs/regression/U8.md) `0.82`
- [✓ sparse-shrinkage D3 · for a **sparsity model at high adapt_delta** → checking **tree-depth s](../../recs/sparse-shrinkage/D3.md) `0.81`
- [✗ CC-convergence-diagnostics B7 · when divergences / E-BFMI / tree-depth are clean on a well-separated m](../../recs/CC-convergence-diagnostics/B7.md) `0.80`


## Contradiction record

**pymc-labs says:** use target_accept=0.99 as first-line for the horseshoe double-funnel, and offer Laplace 'if sufficient' as a simpler fallback. · **this catalog says (SP2):** raising adapt_delta/max_treedepth does NOT cure a non-identified (M>N) horseshoe — 138 divergences persist at 0.99; need the regularized/Finnish slab (SP3), and (SP4) Laplace/LASSO is a dichotomous soft failure (over-shrinks relevant, under-concentrates irrelevant). · **adjudication:** WE are more precise — keep target_accept=0.99 only as a stopgap; prefer the regularized horseshoe. Mild contradiction — pymc is less precise, not wrong.
*The catalog is contradiction-aware by design: both positions stay visible.*
