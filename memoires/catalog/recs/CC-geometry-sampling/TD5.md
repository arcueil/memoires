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

- [✗ regression O3 · for **ordinal regression showing tree-depth saturation without diverge](../../recs/regression/O3.md) `0.81`
- [✗ CC-priors-identifiability E1 · when **the true value may exceed your chosen scale and you use a light](../../recs/CC-priors-identifiability/E1.md) `0.80`
- [✓ CC-priors-identifiability W3 · when **the M>N regression is genuinely sparse** → a **Finnish horsesho](../../recs/CC-priors-identifiability/W3.md) `0.79`
- [✗ CC-priors-identifiability N2 · when **you use a diffuse-but-proper prior** (Normal(0,1000), U(−1000,1](../../recs/CC-priors-identifiability/N2.md) `0.78`
