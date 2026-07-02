# ✓ GP2 · when a **GP is too large** → replacing it with a low-rank basis-function (HSGP) or a state-space/Markov (Matérn) represe

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✓ GP2**  · when a **GP is too large** → replacing it with a low-rank basis-function (HSGP) or a state-space/Markov (Matérn) representation works.
- why: it changes the GP representation rather than tuning the sampler.
- conditions: basis-function route assumes a smooth stationary kernel + centered/bounded inputs; state-space route needs low-dim (1D, time-like) ordered inputs + a Matérn kernel (not squared-exponential); Laplace-marginalize a non-Gaussian likelihood.
- tier: 🟡 · source: [mc-stan:3517](https://discourse.mc-stan.org/t/using-gp-for-autocorrelation-in-a-time-series-model-memory-pressure-gp-kernel-definition/3517), [mc-stan:11661](https://discourse.mc-stan.org/t/how-to-make-gp-with-non-gaussian-likelihood-more-efficient/11661)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Attack GP hyperparameter non-identifiability via marginalization / reparameterization rather than priors alone" · "Change the model rather than the sampler"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ gaussian-process S2 · for a **large smooth stationary GP** → a **Hilbert-space basis-functio](../../recs/gaussian-process/S2.md) `0.90`
- [✗ gaussian-process S1 · for an **exact dense GP with N more than a few hundred** → **full-cova](../../recs/gaussian-process/S1.md) `0.84`
- [✗ gaussian-process HP5 · for **GP (σ, ℓ)** in a fixed-domain low-n setting → a **reference prio](../../recs/gaussian-process/HP5.md) `0.83`
- [gaussian-process C3 · An exact dense GP does not scale — the fix is a *structured* represent](../../claims/gaussian-process/C3.md) `0.83`
