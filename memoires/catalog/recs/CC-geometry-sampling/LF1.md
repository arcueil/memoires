# ✗ LF1 · when the **funnel lives in the likelihood** (underdetermined/collinear regression, σ-funnel) → NCP does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✗ LF1**  · when the **funnel lives in the likelihood** (underdetermined/collinear regression, σ-funnel) → NCP does **NOT** work.
- why: there is no prior scale to algebraically decouple; σ couples to the degenerate plane of equally-fitting slopes and the ridge narrows as σ→0.
- conditions: N<M+1 or perfectly-correlated covariates; the σ prior does not truncate the funnel from below.
- tier: 🟢 · source: taylor_models, underdetermined_linear_regression
- efficacy: {divergences: 0 (underdetermined N=100/M=200, softened tip) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose WHERE the funnel lives: distinguish a subject↔population funnel (reparameterizable) from a funnel between population hyperparameters" · "separate likelihood from posterior and write out both log-posteriors term by term"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ regression U7 · for the **underdetermined-regression funnel** → **NCP** (non-centered ](../../recs/regression/U7.md) `0.88`
- [✗ hierarchical-multilevel P9 · for an **underdetermined / rank-deficient Gaussian regression** → NCP ](../../recs/hierarchical-multilevel/P9.md) `0.84`
- [✗ regression U10 · for **exact collinearity** (N<M+1, or perfectly correlated components ](../../recs/regression/U10.md) `0.84`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.82`
