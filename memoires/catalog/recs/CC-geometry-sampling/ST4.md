# ✓ ST4 · when **warmup adaptation is the bottleneck** → seeding HMC with a Pathfinder/VI init (even a poor posterior) works.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✓ ST4**  · when **warmup adaptation is the bottleneck** → seeding HMC with a Pathfinder/VI init (even a poor posterior) works.
- why: initialization and posterior-approximation are decoupled objectives — a variance-underestimating fit still lands a point in the bulk of the typical set.
- conditions: large nonlinear/hierarchical models with slow adaptation; low value when a dispersed default init already mixes.
- tier: 🟡 · source: [mc-stan:34960](https://discourse.mc-stan.org/t/using-pathfinder-or-other-method-to-set-initial-values-for-sampling/34960)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Decouple the expensive warmup/metric estimation from production sampling by saving and reusing the adapted metric + step-size" · "Make adaptation actually run by shrinking the warmup adaptation schedule, then read back the adapted metric"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ ode-dynamical S5 · for an ODE fit whose **warmup is dominated by solver precision** → **t](../../recs/ode-dynamical/S5.md) `0.80`
- [✓ sparse-shrinkage W3 · for **HMC/NUTS with windowed warmup and multiple chains** → **adaptive](../../recs/sparse-shrinkage/W3.md) `0.80`
- [sparse-shrinkage C5 · Build sparse models by nested expansion under valid warmup — fix geome](../../claims/sparse-shrinkage/C5.md) `0.80`
- [✓ gaussian-process W1 · for **multi-chain HMC/NUTS with windowed warmup** → **adaptive warmup ](../../recs/gaussian-process/W1.md) `0.79`


## Technique (pymc-labs)

**DADVI — deterministic ADVI (fixed MC sample set removes ELBO gradient noise)** — 'Deterministic ADVI fixes the Monte-Carlo sample set used to estimate the ELBO so the gradient is deterministic, removing MC gradient noise -> faster, more stable VI convergence than stochastic ADVI.' Portable method (Giordano et al.); PyMC entry point `pymc_extras.fit(method='dadvi')`.
*Source: [pymc-labs:pymc-extras](https://github.com/pymc-labs/python-analytics-skills)*

**Pathfinder mechanism (quasi-Newton / L-BFGS-path VI, multi-path)** — The mechanism behind ST4/ST5's Pathfinder: 'Pathfinder traces the L-BFGS optimization path from a random init toward the mode, fits a Gaussian at each iterate, and (multi-path: `num_paths`) importance-resamples across the best-ELBO iterates. This is why it is seconds-fast and lands a point in the typical-set bulk — the exact property ST4 relies on.' `maxcor` = L-BFGS history.
*Source: [pymc-labs:inference](https://github.com/pymc-labs/python-analytics-skills)*
