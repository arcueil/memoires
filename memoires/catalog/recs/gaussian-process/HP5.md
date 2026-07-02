# ✗ HP5 · for **GP (σ, ℓ)** in a fixed-domain low-n setting → a **reference prior** does **NOT** work well.

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — t](../../claims/gaussian-process/C1.md)

**✗ HP5**  · for **GP (σ, ℓ)** in a fixed-domain low-n setting → a **reference prior** does **NOT** work
well.
- why: it structurally reproduces the likelihood ridge in the posterior (substantial mass near ℓ=0) rather than resolving it, and changes form when the likelihood changes (requires Gaussian, no observation noise in the original).
- conditions: Matérn GP d≤3, fixed-domain (infill), Gaussian likelihood.
- tier: 🟢 · source: [dansblog:priors5](https://dansblog.netlify.app/posts/2022-09-07-priors5/priors5.html)
- efficacy: {divergences: pending · min_ess: lower ESS than PC prior · ess_per_sec: ~8.5× wall time and 2× warmup iterations vs a PC prior · rmse: pending · coverage: posterior mass near ℓ=0 (ridge reproduced)}
- moves: "Compare the reference-prior posterior against a PC-prior fit and check whether posterior mass piles up near ℓ=0 (ridge reproduced rather than resolved)"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability G3 · when **you reach for a reference prior to "let the data speak" for GP ](../../recs/CC-priors-identifiability/G3.md) `0.93`
- [✗ CC-priors-identifiability G2 · when **you judge GP identifiability from the marginal ρ and σ posterio](../../recs/CC-priors-identifiability/G2.md) `0.86`
- [✓ ode-dynamical R2 · for the **g/k ridge** → an **informative/regularizing prior on g and k](../../recs/ode-dynamical/R2.md) `0.84`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.84`
