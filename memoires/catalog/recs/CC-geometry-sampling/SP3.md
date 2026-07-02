# ✓ SP3 · when a **horseshoe is non-identified** → adding the Finnish/regularized slab (a Student-t cap on large slopes) works.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✓ SP3**  · when a **horseshoe is non-identified** → adding the Finnish/regularized slab (a Student-t cap on large slopes) works.
- why: the slab caps escaped slopes at ~s·few without touching the spike → eliminates divergences, tree-depth saturation, and the E-BFMI pathology; accurate narrow posteriors for both relevant and irrelevant slopes.
- conditions: calibrate slab_scale (s~3–5 for slopes ~10) and slab_df; NCP of β and τ (τ non-centered relative to σ).
- tier: 🟢 · source: bayes_sparse_regression
- efficacy: {divergences: ~0 (pathology eliminated) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Change the model rather than the sampler: add prior information" · "Reparameterize the group-level effects to non-centered form"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ sparse-shrinkage P1 · for a **non-identified sparse regression (M > N)** → the **Finnish / r](../../recs/sparse-shrinkage/P1.md) `0.95`
- [✗ sparse-shrinkage P2 · for a **non-identified sparse regression (M > N)** → the **classic hor](../../recs/sparse-shrinkage/P2.md) `0.85`
- [✓ regression U4 · for **M>N sparse regression** → a **correctly-specified sparse prior**](../../recs/regression/U4.md) `0.84`
- [✓ sparse-shrinkage G4 · for a **Finnish horseshoe under HMC** → **non-centering β *and* τ (τ r](../../recs/sparse-shrinkage/G4.md) `0.84`
