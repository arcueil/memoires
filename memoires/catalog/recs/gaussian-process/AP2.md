# ✗ AP2 · for the **same contrast when between-group variation is genuinely unstructured noise** → a **GP/shared-intercept** model

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C5 · A GP is non-parametric — prediction and structural decomposition require *explic](../../claims/gaussian-process/C5.md)

**✗ AP2**  · for the **same contrast when between-group variation is genuinely unstructured noise** → a
**GP/shared-intercept** model does **NOT** help.
- why: if there is no real structure to attribute, the GP adds nothing over a simpler noise-only model; predictive checks should reveal this.
- conditions: between-group variation genuinely unstructured; simpler noise-only model adequate.
- tier: 🟡 · source: [mc-stan:26490](https://discourse.mc-stan.org/t/modeling-of-an-a-b-test-with-average-revenue-as-the-measure-with-per-day-data/26490), [mc-stan:39288](https://discourse.mc-stan.org/t/how-to-simulate-the-confidence-which-was-measured-by-participants-self-reports/39288)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Quantify what the proposed prior actually implies and sanity-check against domain plausibility"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel C5 · for a **grouped/repeated-measures contrast** (A/B test with per-day da](../../recs/hierarchical-multilevel/C5.md) `0.86`
- [✓ hierarchical-multilevel L2 · for the same setting → a **structured prior that borrows strength acro](../../recs/hierarchical-multilevel/L2.md) `0.85`
- [✗ hierarchical-multilevel B4 · for the **data-level noise SD σ** in a simple random-intercept model →](../../recs/hierarchical-multilevel/B4.md) `0.83`
- [✗ CC-priors-identifiability S9 · when **two additive model components share a function class** (overlap](../../recs/CC-priors-identifiability/S9.md) `0.82`
