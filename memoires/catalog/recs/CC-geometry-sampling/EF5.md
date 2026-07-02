# ✓ EF5 · when applying the **0.2 E-BFMI threshold** → treating it as a rough empirical guideline (not a calibrated law) works as 

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✓ EF5**  · when applying the **0.2 E-BFMI threshold** → treating it as a rough empirical guideline (not a calibrated law) works as the correct stance.
- why: the diagnostic's author labels 0.2 a "very rough recommendation" subject to revision; Stan's console output and the check_energy utility threshold can even disagree on the same fit.
- conditions: Betancourt's own qualifier at the time of the case studies.
- tier: 🟡 · source: pystan_workflow / rstan_workflow (named in the claim's nuance; input `sources` array is empty)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Calibrate severity and consult the canonical divergence reference before tuning"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ sparse-shrinkage D5 · for **sparsity samplers** → reading **E-BFMI collapse as a geometry si](../../recs/sparse-shrinkage/D5.md) `0.80`
- [✓ regression U9 · for the **underdetermined-regression E-BFMI failure** → a **more infor](../../recs/regression/U9.md) `0.79`
- [✗ CC-convergence-diagnostics C3 · when fewer than 0.001 effective samples per transition → trusting repo](../../recs/CC-convergence-diagnostics/C3.md) `0.77`
- [✗ regression T3 · for a **multi-term Taylor model** → using the **same extremity thresho](../../recs/regression/T3.md) `0.77`
