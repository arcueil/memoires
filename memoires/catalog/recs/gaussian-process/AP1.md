# ✓ AP1 · for a **grouped / repeated-measures contrast** (A/B test with per-day counts and revenue) → a **GP or shared RE on the g

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C5 · A GP is non-parametric — prediction and structural decomposition require *explic](../../claims/gaussian-process/C5.md)

**✓ AP1**  · for a **grouped / repeated-measures contrast** (A/B test with per-day counts and revenue) →
a **GP or shared RE on the group-level intercept** works (sharpens the effect).
- why: the quantity of interest is the condition difference; without a mechanism to attribute structured day-to-day variation, it gets dispersed across "difference" and "noise", inflating both — a GP on the intercept attributes it.
- conditions: plausible structured (temporal/spatial/grouping) baseline variation; concurrent/parallel design; scales awkwardly to many conditions (A/B/C/…).
- tier: 🟡 · source: [mc-stan:26490](https://discourse.mc-stan.org/t/modeling-of-an-a-b-test-with-average-revenue-as-the-measure-with-per-day-data/26490), [mc-stan:39288](https://discourse.mc-stan.org/t/how-to-simulate-the-confidence-which-was-measured-by-participants-self-reports/39288)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Establish the data-generating context of the estimate before diagnosing the model"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel C5 · for a **grouped/repeated-measures contrast** (A/B test with per-day da](../../recs/hierarchical-multilevel/C5.md) `0.95`
- [✓ hierarchical-multilevel F4 · for **pre/post** repeated measures → modeling **both timepoints as the](../../recs/hierarchical-multilevel/F4.md) `0.81`
- [✓ hierarchical-multilevel L2 · for the same setting → a **structured prior that borrows strength acro](../../recs/hierarchical-multilevel/L2.md) `0.80`
- [✓ measurement-error-missing C2 · for pre/post repeated measures → modeling **both timepoints as the res](../../recs/measurement-error-missing/C2.md) `0.80`
