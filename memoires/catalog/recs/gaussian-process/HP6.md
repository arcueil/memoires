# ✗ HP6 · for **GP hyperparameter identifiability** → reading only the **marginal posteriors of ℓ and σ** does **NOT** work.

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — t](../../claims/gaussian-process/C1.md)

**✗ HP6**  · for **GP hyperparameter identifiability** → reading only the **marginal posteriors of ℓ and
σ** does **NOT** work.
- why: both marginals can be very wide even when σ²/ℓ (or σ²/ℓ^(2ν)) is tightly determined — the marginal width is not evidence the prior failed to resolve the likelihood.
- conditions: Matérn or EQ GP d≤3, fixed/bounded-domain where the ridge exists.
- tier: 🟢 · source: [dansblog:priors5](https://dansblog.netlify.app/posts/2022-09-07-priors5/priors5.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Separate the plotting/marginalization artifact from the actual fit before diagnosing further"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability G2 · when **you judge GP identifiability from the marginal ρ and σ posterio](../../recs/CC-priors-identifiability/G2.md) `0.88`
- [✗ CC-priors-identifiability G3 · when **you reach for a reference prior to "let the data speak" for GP ](../../recs/CC-priors-identifiability/G3.md) `0.86`
- [✓ regression GP1 · for a **latent-Gaussian (GP) regression with divergences at small σ** ](../../recs/regression/GP1.md) `0.82`
- [✗ time-series-state-space F2 · for **updating the posterior over the model's hyperparameters** (trans](../../recs/time-series-state-space/F2.md) `0.82`
