# ✓ DV8 · when divergences appear **even in a prior-only run** (no likelihood) → the origin is the prior / reject()-abuse / heavy-

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C2 · Divergences are read by *location* and *origin*, not count — and their *absence*](../../claims/CC-geometry-sampling/C2.md)

**✓ DV8**  · when divergences appear **even in a prior-only run** (no likelihood) → the origin is the prior / reject()-abuse / heavy-tailed positive scale — the prior-only test localizes it, works.
- why: running the prior model without the likelihood isolates whether the funnel is prior-induced or reject()-induced.
- conditions: reject() and likelihood must be structurally separable; most acute for vague/heavy-tailed priors on positive scale/precision parameters.
- tier: 🟢 · source: [mc-stan:10759](https://discourse.mc-stan.org/t/meaning-of-divergences-in-prior-predictive-checks/10759), [mc-stan:18100](https://discourse.mc-stan.org/t/weird-output-for-a-very-simple-model-with-sample-prior-only/18100), [mc-stan:24267](https://discourse.mc-stan.org/t/divergences-when-adding-prior-sampling/24267)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Locate where the funnel-forming parameter actually enters the program (likelihood/transformed-params vs generated quantities)" · "Set the interpretation policy for divergence counts before chasing them"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [time-series-state-space C4 · Divergence *location*, not count, is the primary triage signal — state](../../claims/time-series-state-space/C4.md) `0.82`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.82`
- [✓ time-series-state-space T3 · for **scattered (non-clustered) divergences** → running the **hard-mod](../../recs/time-series-state-space/T3.md) `0.82`
- [✗ regression U6 · for **underdetermined linear regression (N<M+1)** → trusting **zero di](../../recs/regression/U6.md) `0.82`
