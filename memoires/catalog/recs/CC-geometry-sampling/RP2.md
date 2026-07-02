# ✗ RP2 · when **per-group data are dense / the likelihood dominates** → NCP does **NOT** work (inverted funnel).

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✗ RP2**  · when **per-group data are dense / the likelihood dominates** → NCP does **NOT** work (inverted funnel).
- why: fixing θ̃ enforces the hyperbolic constraint η_k·τ=const in the likelihood → an inverted funnel that worsens as the likelihood narrows; use CP here.
- conditions: dense per-group data; mirror image of CP's failure.
- tier: 🟢 · source: hierarchical_modeling, factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a centered parameterization for strongly-informed upsilon — per-element parameterization choice" · "Diagnose WHERE the funnel lives: subject↔population (reparameterizable) vs a funnel between population hyperparameters"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel P2 · for a normal hierarchical model with **strong/dense per-group data** →](../../recs/hierarchical-multilevel/P2.md) `0.93`
- [hierarchical-multilevel C2 · CP and NCP are exactly complementary and data-dependent — parameterize](../../claims/hierarchical-multilevel/C2.md) `0.87`
- [✓ hierarchical-multilevel P1 · for a normal hierarchical model with **weak per-group data** (few obs/](../../recs/hierarchical-multilevel/P1.md) `0.86`
- [✓ hierarchical-multilevel P3 · for a normal hierarchical model with **strong per-group data** → **cen](../../recs/hierarchical-multilevel/P3.md) `0.86`


## Enrichment (pymc-labs)

**CP-vs-NCP numeric rule of thumb (~20 obs/group)** (📐 portable) — Add threshold to RP1/RP2/RP3: non-center levels averaging < ~20 observations per group; center levels with many obs per group (likelihood 'pins' the parameter). Our recs give the sparse/dense direction but no numeric cutoff.

*Source: pymc-labs (human-curated).*
