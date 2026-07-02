# ✗ RP9 · when choosing a parameterization by **"best geometry"** (fewest grad-evals/iter) → assuming it wins ESS/second does **NO

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C4 · Reparameterization is the primary geometry fix — but it is regime-dependent, fam](../../claims/CC-geometry-sampling/C4.md)

**✗ RP9**  · when choosing a parameterization by **"best geometry"** (fewest grad-evals/iter) → assuming it wins ESS/second does **NOT** work.
- why: ESS/sec = (iterations/sec) × (ESS/iter); the tan()-CDF-inversion form wins ESS/iteration but loses iterations/second to transcendental cost → a three-way tie.
- conditions: CPU execution; transcendental function cost drives the result; the shortcut fails whenever per-step cost differences are non-negligible.
- tier: 🟢 · source: fitting_the_cauchy
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: ~2500 (tan / Alt 3) vs ~3500 (Inv-Gamma) · rmse: pending · coverage: pending}
- moves: "Try the cheap, non-structural fixes first (sampler kwargs, compile mode) and observe whether the speed picture moves"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-convergence-diagnostics D1 · when you thin a well-mixing chain to "improve" ESS → does **NOT** work](../../recs/CC-convergence-diagnostics/D1.md) `0.80`
- [✓/✗ CC-priors-identifiability E6 · when **a family's CDF/quantile has no closed form** → for **fixed-para](../../recs/CC-priors-identifiability/E6.md) `0.78`
- [✗ CC-convergence-diagnostics C1 · when you quote one number as "the chain's ESS" → does **NOT** work.](../../recs/CC-convergence-diagnostics/C1.md) `0.78`
- [✓ CC-convergence-diagnostics C7 · when ESS/n_eff is untrustworthy in the struggling regime → **refit sma](../../recs/CC-convergence-diagnostics/C7.md) `0.78`
