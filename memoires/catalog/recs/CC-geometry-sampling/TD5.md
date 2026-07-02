# ✗ TD5 · when reading **Cauchy tail quantiles at default max_treedepth=10** → trusting them does **NOT** work (silent downward bi

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✗ TD5**  · when reading **Cauchy tail quantiles at default max_treedepth=10** → trusting them does **NOT** work (silent downward bias).
- why: tail-visiting trajectories are silently truncated — no divergence, no saturation warning — biasing tail quantiles downward.
- conditions: prior-dominated Cauchy; default depth 10; product of N=50 independent Cauchy variates tested.
- tier: 🟢 · source: fitting_the_cauchy
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a minimal heavy-tailed 1-D target and read the diagnostic triple (divergences / E-BFMI / R-hat / treedepth)" · "Perturb the sampler controls (max_treedepth, adapt_delta)"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ regression O3 · for **ordinal regression showing tree-depth saturation without diverge](../../recs/regression/O3.md) `0.82`
- [✗ CC-priors-identifiability E1 · when **the true value may exceed your chosen scale and you use a light](../../recs/CC-priors-identifiability/E1.md) `0.80`
- [✗ latent-factor E5 · for a **strongly-correlated latent posterior** where NUTS saturates ma](../../recs/latent-factor/E5.md) `0.79`
- [✓/✗ CC-priors-identifiability E2 · when **the likelihood is numerically sensitive** (ODE solver, GP kerne](../../recs/CC-priors-identifiability/E2.md) `0.78`
