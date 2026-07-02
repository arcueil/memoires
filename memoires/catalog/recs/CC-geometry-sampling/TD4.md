# ✓ TD4 · when **Cauchy tail quantiles matter** → raising max_treedepth to 20 to let trajectories reach U-turns deep in the tails 

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✓ TD4**  · when **Cauchy tail quantiles matter** → raising max_treedepth to 20 to let trajectories reach U-turns deep in the tails works (at high cost).
- why: NUTS is geometrically correct but the tail trajectories are so long that max_treedepth=20 is load-bearing.
- conditions: prior-dominated Cauchy; NUTS (static HMC fails categorically); ~2000 grad-evals/iter at depth 20.
- tier: 🟢 · source: fitting_the_cauchy
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — median ~2000 gradient evals/iteration at max_treedepth=20 (cost, no slot)
- moves: "Reframe runtime in terms of gradient evaluations: inspect leapfrog steps per iteration rather than wall-clock" · "Perturb the sampler controls (max_treedepth, adapt_delta) and watch whether 'cleanness' is stable"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability E1 · when **the true value may exceed your chosen scale and you use a light](../../recs/CC-priors-identifiability/E1.md) `0.79`
- [✗ regression O3 · for **ordinal regression showing tree-depth saturation without diverge](../../recs/regression/O3.md) `0.78`
- [✗ CC-priors-identifiability N2 · when **you use a diffuse-but-proper prior** (Normal(0,1000), U(−1000,1](../../recs/CC-priors-identifiability/N2.md) `0.78`
- [✓ time-series-state-space T3 · for **scattered (non-clustered) divergences** → running the **hard-mod](../../recs/time-series-state-space/T3.md) `0.78`
