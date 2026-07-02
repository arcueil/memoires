# ✓ RP1 · when **per-group data are sparse / the prior dominates** → non-centered parameterization (NCP) works.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✓ RP1**  · when **per-group data are sparse / the prior dominates** → non-centered parameterization (NCP) works.
- why: relocates the τ-coupling into θ=μ+τ·θ̃, decoupling the scale from the sampling geometry; removes the CP funnel's divergences.
- conditions: normal hierarchy; half-normal/infinity-suppressing τ prior; the advantage reverses under dense data.
- tier: 🟢 · source: hierarchical_modeling, factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Identify the centered hierarchical parameterization as the root cause and prescribe non-centered reparameterization" · "Reframe the funnel as a sampler-geometry problem: NCP is equivalent to Riemannian/second-order HMC" · "Verify the reparameterized geometry is decoupled"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel P1 · for a normal hierarchical model with **weak per-group data** (few obs/](../../recs/hierarchical-multilevel/P1.md) `0.87`
- [✓ sparse-shrinkage G2 · for a **mixture-prior / horseshoe** → choosing **CP vs NCP per-paramet](../../recs/sparse-shrinkage/G2.md) `0.86`
- [✓ hierarchical-multilevel P3 · for a normal hierarchical model with **strong per-group data** → **cen](../../recs/hierarchical-multilevel/P3.md) `0.86`
- [✓ time-series-state-space P2 · for the same fine-grid Markov chain → the **non-centered parameterizat](../../recs/time-series-state-space/P2.md) `0.85`


## Enrichment (pymc-labs)

**CP-vs-NCP numeric rule of thumb (~20 obs/group)** (📐 portable) — Add threshold to RP1/RP2/RP3: non-center levels averaging < ~20 observations per group; center levels with many obs per group (likelihood 'pins' the parameter). Our recs give the sparse/dense direction but no numeric cutoff.

*Source: pymc-labs (human-curated).*
