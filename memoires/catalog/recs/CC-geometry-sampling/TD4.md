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

- [✗ regression O3 · for **ordinal regression showing tree-depth saturation without diverge](../../recs/regression/O3.md) `0.79`
- [✗ latent-factor E5 · for a **strongly-correlated latent posterior** where NUTS saturates ma](../../recs/latent-factor/E5.md) `0.78`
- [✗ CC-priors-identifiability E1 · when **the true value may exceed your chosen scale and you use a light](../../recs/CC-priors-identifiability/E1.md) `0.78`
- [✓ regression QR1 · for **regressing a chosen quantile tau** (0.5 = median, 0.9 = 90th pct](../../recs/regression/QR1.md) `0.77`
