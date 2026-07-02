# ✗ EF2 · when **E-FMI passes** → concluding no posterior degeneracy does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C3 · The diagnostics are distinct fingerprints, not interchangeable — tree-depth satu](../../claims/CC-geometry-sampling/C3.md)

**✗ EF2**  · when **E-FMI passes** → concluding no posterior degeneracy does **NOT** work.
- why: E-FMI is insensitive to flat directions, continuous/discrete concentration on a lower-dim surface, and multimodality — regardless of how severe R̂/divergences/treedepth are; it detects only incoherent diffusive energy exploration.
- conditions: additive/multiplicative flat priors, mixture label-switching / unidentified components.
- tier: 🟢 · source: identifiability
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — flat additive prior: R̂=1.35 for b, 60% treedepth saturation, E-FMI clean (no slot)
- moves: "Triage the warning hierarchy: read which diagnostic dominates, and cross-check that a non-HMC fit succeeds" · "Use a multivariate / all-parameter view to surface the joint structure"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation A1 · when **HMC diagnostics are clean** (0 divergences, R̂≈1, adequate ESS,](../../recs/CC-model-evaluation/A1.md) `0.80`
- [✓ CC-model-evaluation H3 · when **assessing whether an effect is non-negligible** → a **direction](../../recs/CC-model-evaluation/H3.md) `0.80`
- [✓ CC-model-evaluation F2 · when generating a posterior predictive → **drawing through the observa](../../recs/CC-model-evaluation/F2.md) `0.80`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.80`


## Technique (pymc-labs)

**Sum-to-zero & soft-penalty constraints for additive non-identifiability** — The standard fix for intercept<->group-effect additive degeneracy is a sum-to-zero constraint — hard via centering (alpha = alpha_raw - alpha_raw.mean(), or pm.ZeroSumNormal), or soft via pm.Potential(-k*(sum)^2). Caveat: soft QUADRATIC penalties (soft ordering, soft sum-to-zero) introduce a stiff direction -> scale heterogeneity/anisotropy that RP10's dense metric or reparameterization must then absorb, so a hard bijection/ZeroSumNormal is usually preferable under NUTS.
*Source: [pymc-labs:priors](https://github.com/pymc-labs/python-analytics-skills)*
