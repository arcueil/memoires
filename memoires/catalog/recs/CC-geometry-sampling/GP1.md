# ✗ GP1 · when fitting a **dense exact GP beyond a few hundred–~1000 points** with HMC → it does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✗ GP1**  · when fitting a **dense exact GP beyond a few hundred–~1000 points** with HMC → it does **NOT** work.
- why: each gradient costs O(N³) (kernel Cholesky) and O(N²) memory → OOM or 0% progress; more data makes the matrix bigger, tuning the sampler doesn't help.
- conditions: latent-GP with a dense kernel matrix, N more than a few hundred, full Bayesian sampling.
- tier: 🟡 · source: [mc-stan:3517](https://discourse.mc-stan.org/t/using-gp-for-autocorrelation-in-a-time-series-model-memory-pressure-gp-kernel-definition/3517), [mc-stan:11661](https://discourse.mc-stan.org/t/how-to-make-gp-with-non-gaussian-likelihood-more-efficient/11661)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "reframe slowness as a divergence/geometry problem and reduce to a minimal reproducer" · "Change the model rather than the sampler"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ gaussian-process S1 · for an **exact dense GP with N more than a few hundred** → **full-cova](../../recs/gaussian-process/S1.md) `0.94`
- [gaussian-process C3 · An exact dense GP does not scale — the fix is a *structured* represent](../../claims/gaussian-process/C3.md) `0.89`
- [✓ gaussian-process G1 · for a **latent-GP field** with fixed hyperparameters and a relatively ](../../recs/gaussian-process/G1.md) `0.83`
- [✓ gaussian-process S2 · for a **large smooth stationary GP** → a **Hilbert-space basis-functio](../../recs/gaussian-process/S2.md) `0.82`
