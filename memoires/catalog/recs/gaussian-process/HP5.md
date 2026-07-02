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

- [✗ CC-geometry-sampling GP4 · when **GP divergences localize at small σ** → a zero-avoiding prior on](../../recs/CC-geometry-sampling/GP4.md) `0.84`
- [✓ CC-geometry-sampling GP2 · when a **GP is too large** → replacing it with a low-rank basis-functi](../../recs/CC-geometry-sampling/GP2.md) `0.83`
- [✗ CC-priors-identifiability G3 · when **you reach for a reference prior to "let the data speak" for GP ](../../recs/CC-priors-identifiability/G3.md) `0.83`
- [✓ hierarchical-multilevel B3 · for a **Gaussian random-effect SD** where τ=0 is a plausible base mode](../../recs/hierarchical-multilevel/B3.md) `0.82`
