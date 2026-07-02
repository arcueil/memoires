# ✗ SC6 · when expecting an **online O(1) Kalman/particle filter step to update the hyperparameter POSTERIOR** → it does **NOT** w

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ SC6**  · when expecting an **online O(1) Kalman/particle filter step to update the hyperparameter POSTERIOR** → it does **NOT** work.
- why: the recursion propagates the latent-state distribution only for FROZEN hyperparameters; the deep-parameter posterior is tied to the exact dataset and needs re-inference on new data.
- conditions: state-space models; linear-Gaussian exact / EKF-particle approx for states, never the hyperparameters.
- tier: 🟡 · source: [pymc:17654](https://discourse.pymc.io/t/gsoc-2026-online-sequential-updates-for-bayesian-state-space-models/17654), [pymc:17575](https://discourse.pymc.io/t/potential-approach-towards-scalable-online-bayesian-ssms-project-gsoc-2026/17575), [pymc:17628](https://discourse.pymc.io/t/gsoc-2026-streaming-inference-advi-with-api-data/17628)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Decouple the expensive warmup/metric estimation from production sampling by saving and reusing the adapted metric + step-size"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ time-series-state-space F2 · for **updating the posterior over the model's hyperparameters** (trans](../../recs/time-series-state-space/F2.md) `0.89`
- [✓ time-series-state-space F1 · for a **frozen (fixed-hyperparameter) linear-Gaussian state-space mode](../../recs/time-series-state-space/F1.md) `0.84`
- [✗ CC-priors-identifiability P6 · when **you drop the prior term on subsequent online / streaming update](../../recs/CC-priors-identifiability/P6.md) `0.80`
- [✗ hierarchical-multilevel B1 · for a hierarchical model with **few obs/group** → **vague/uniform prio](../../recs/hierarchical-multilevel/B1.md) `0.78`
