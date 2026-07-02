# ✗ LF3 · when covariates are **left uncentered before a polynomial/nonlinear expansion** → HMC on the resulting ridge does **NOT*

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✗ LF3**  · when covariates are **left uncentered before a polynomial/nonlinear expansion** → HMC on the resulting ridge does **NOT** work (massive inefficiency).
- why: the near-1D manifold spans a wide range the sampler must resolve fully in every trajectory.
- conditions: direction-preserving transforms of uncentered predictors.
- tier: 🟢 · source: qr_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize: move the removed column-mean content out of the basis and into the intercept's prior" · "Recommend QR decomposition of the predictor matrix"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ regression Q1 · for **near-collinear covariates** (e.g. x and x² for uncentered positi](../../recs/regression/Q1.md) `0.91`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.82`
- [✗ regression U10 · for **exact collinearity** (N<M+1, or perfectly correlated components ](../../recs/regression/U10.md) `0.82`
- [regression C3 · Ridges and funnels in the *linear predictor* split into two look-alike](../../claims/regression/C3.md) `0.82`
