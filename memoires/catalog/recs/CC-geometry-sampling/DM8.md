# ✗ DM8 · when **`*_rng` is called inside the Stan model / transformed-parameters block** → it does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**✗ DM8**  · when **`*_rng` is called inside the Stan model / transformed-parameters block** → it does **NOT** work.
- why: HMC differentiates a single deterministic unnormalized log-density; randomness makes the target non-deterministic and breaks leapfrog — `*_rng` is compile-time banned outside `transformed data` / `generated quantities`.
- conditions: any Stan HMC/NUTS model wanting to simulate/subsample inside the likelihood or port an `observe()`-style program.
- tier: 🟡 · source: [mc-stan:23805](https://discourse.mc-stan.org/t/sampling-from-a-matrix-in-stan/23805), [mc-stan:10296](https://discourse.mc-stan.org/t/observe-statement/10296), [mc-stan:3583](https://discourse.mc-stan.org/t/multivariate-skew-t-distribution/3583)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the model graph for completeness before any sampler tuning: trace whether every term is defined" · "Compare the suspect log-density against a trusted reference implementation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ measurement-error-missing J2 · for the **misclassification-row simplex under HMC** → reparameterize t](../../recs/measurement-error-missing/J2.md) `0.80`
- [✓ CC-model-evaluation F2 · when generating a posterior predictive → **drawing through the observa](../../recs/CC-model-evaluation/F2.md) `0.79`
- [✗ time-series-state-space D1 · for an **HMM / discrete-latent-state / state-space model** under HMC/N](../../recs/time-series-state-space/D1.md) `0.79`
- [✗ CC-convergence-diagnostics F3 · when a top-line "largest R-hat is NA, chains have not mixed" / "Bulk/T](../../recs/CC-convergence-diagnostics/F3.md) `0.78`


## Technique (pymc-labs)

**Python if/else is traced once at graph-build time** — A Python if/else on a random variable is evaluated ONCE at model construction, not per-draw. Use pt.switch(cond,a,b), pytensor.ifelse.ifelse for branching, or pytensor.scan for iterative/loop logic that depends on RVs. Analogous to DM8 (*_rng banned in model block) but a distinct trap.
*Source: [pymc-labs:pymc-modeling](https://github.com/pymc-labs/python-analytics-skills)*
