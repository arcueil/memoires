# ✗ DV9 · when a chain **freezes intermittently in a funnel neck** (sticky excursions) → relying on those excursions to self-corre

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C1 · Geometry belongs to the *model*, not the sampler — knobs and hardware mitigate c](../../claims/CC-geometry-sampling/C1.md)

**✗ DV9**  · when a chain **freezes intermittently in a funnel neck** (sticky excursions) → relying on those excursions to self-correct on a finite run does **NOT** work.
- why: frozen excursions are the only ASYMPTOTIC bias correction, but on finite runs they produce oscillating signed bias and declining ESS-per-iteration — the MCMC CLT needs the geometric ergodicity the pinch breaks.
- conditions: curvature high relative to step length; single-chain context (Eight Schools CP, 10k iterations).
- tier: 🟢 · source: divergences_and_bias, markov_chain_monte_carlo
- efficacy: {divergences: pending · min_ess: declining ESS-per-iteration (oscillating running mean) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Set the interpretation policy for divergence counts before chasing them — separate 'predictive metric looks fine' from 'posterior is unbiased'" · "Manually decrease the stepsize below what adaptation chose, post-warmup"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel E3 · for a **high-curvature pinch (CP funnel)** on a finite run → relying o](../../recs/hierarchical-multilevel/E3.md) `0.94`
- [✗ CC-convergence-diagnostics A2 · when a heavy-tailed / non-geometrically-ergodic target passes split-R̂](../../recs/CC-convergence-diagnostics/A2.md) `0.82`
- [✗ CC-convergence-diagnostics A6 · when a chain is stationary but explores the typical set inefficiently ](../../recs/CC-convergence-diagnostics/A6.md) `0.82`
- [CC-convergence-diagnostics C1 · Convergence is not stationarity — a trustworthy error bar needs geomet](../../claims/CC-convergence-diagnostics/C1.md) `0.81`
