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

- [✗ CC-priors-identifiability G2 · when **you judge GP identifiability from the marginal ρ and σ posterio](../../recs/CC-priors-identifiability/G2.md) `0.93`
- [✗ CC-priors-identifiability G3 · when **you reach for a reference prior to "let the data speak" for GP ](../../recs/CC-priors-identifiability/G3.md) `0.89`
- [✓ CC-geometry-sampling GP2 · when a **GP is too large** → replacing it with a low-rank basis-functi](../../recs/CC-geometry-sampling/GP2.md) `0.84`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.83`
