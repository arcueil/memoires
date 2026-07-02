# ✓ AP3 · for **population-mean estimation under covariate-dependent randomization** (Robins–Ritov) → a **structured GP prior over

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C5 · A GP is non-parametric — prediction and structural decomposition require *explic](../../claims/gaussian-process/C5.md)

**✓ AP3**  · for **population-mean estimation under covariate-dependent randomization** (Robins–Ritov) →
a **structured GP prior over the stratum index** recovers √n-consistency.
- why: a smooth GP (or true parametric model) lets unobserved strata be predicted from observed ones *without* using the sampling weights ξ_j — the failure was the high-dimensional iid/exchangeable prior carrying no cross-stratum information.
- conditions: the GP smoothness must genuinely reflect structural regularity in μ_j (not be imposed ad hoc to patch the inconsistency) and be sufficient to predict unobserved strata at the required rate.
- tier: ⚪ candidate · source: [dansblog:robins-ritov](https://dansblog.netlify.app/posts/2022-11-12-robins-ritov/robins-ritov.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Verify the GP smoothness reflects genuine structural regularity in μ_j (sufficient to predict unobserved strata at the required rate), not an ad-hoc smoothness imposed to patch the inconsistency"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel L1 · for **population-mean estimation under high-stratum covariate-dependen](../../recs/hierarchical-multilevel/L1.md) `0.91`
- [✗ measurement-error-missing A3 · for population-mean estimation under **covariate-dependent sampling wh](../../recs/measurement-error-missing/A3.md) `0.85`
- [✓ hierarchical-multilevel L2 · for the same setting → a **structured prior that borrows strength acro](../../recs/hierarchical-multilevel/L2.md) `0.85`
- [✓ measurement-error-missing A4 · for that covariate-dependent-sampling problem → **modeling the randomi](../../recs/measurement-error-missing/A4.md) `0.84`
