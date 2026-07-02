# ✓ RP3 · when **levels within one model differ in data richness** → parameterizing per-level (mixed CP/NCP) works.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✓ RP3**  · when **levels within one model differ in data richness** → parameterizing per-level (mixed CP/NCP) works.
- why: neither monolithic choice is safe under imbalance; center the data-rich levels, non-center the sparse ones.
- conditions: per-level assessment required; multiple levels in the same model can need different parameterizations.
- tier: 🟢 · source: hierarchical_modeling, factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a centered parameterization for strongly-informed upsilon (keep non-centered for weakly-informed ones)" · "Locate the hierarchical scale parameter that a coordinate could funnel into"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel P3 · for a normal hierarchical model with **strong per-group data** → **cen](../../recs/hierarchical-multilevel/P3.md) `0.86`
- [✓ hierarchical-multilevel P5 · for **unbalanced** hierarchical data (mixed per-group sample sizes) → ](../../recs/hierarchical-multilevel/P5.md) `0.85`
- [hierarchical-multilevel C2 · CP and NCP are exactly complementary and data-dependent — parameterize](../../claims/hierarchical-multilevel/C2.md) `0.85`
- [✓ hierarchical-multilevel P1 · for a normal hierarchical model with **weak per-group data** (few obs/](../../recs/hierarchical-multilevel/P1.md) `0.84`
