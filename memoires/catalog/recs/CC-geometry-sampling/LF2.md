# ✓ LF2 · when covariates are **near-collinear** (x, x² for uncentered positive x) → centering / orthogonalizing via QR before fit

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C5 · Likelihood-induced funnels have *no reparameterization analogue* — non-identifia](../../claims/CC-geometry-sampling/C5.md)

**✓ LF2**  · when covariates are **near-collinear** (x, x² for uncentered positive x) → centering / orthogonalizing via QR before fitting works.
- why: the joint slope posterior collapses onto a narrow elongated ridge → HMC needs tiny steps + very long trajectories (>1M grad-evals); QR removes the correlation.
- conditions: uncentered predictors; likelihood-induced (weak prior); the posterior is identified (true param on the ridge) — purely computational.
- tier: 🟢 · source: qr_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — over 1,000,000 gradient evaluations reported (cost, no slot)
- moves: "Recommend QR decomposition of the predictor matrix: regress on Q, recover raw coefficients via R⁻¹" · "Inspect bivariate (pairs/ShinyStan) plots, especially intercept-vs-slope within and across groups, for ridges/funnels"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ regression Q1 · for **near-collinear covariates** (e.g. x and x² for uncentered positi](../../recs/regression/Q1.md) `0.88`
- [✓ regression Q2 · for a **near-collinear (identified) linear predictor** → **centering t](../../recs/regression/Q2.md) `0.87`
- [✗ regression U10 · for **exact collinearity** (N<M+1, or perfectly correlated components ](../../recs/regression/U10.md) `0.82`
- [✗ regression DG1 · for **nonlinearly-correlated component covariates** → reading **curvat](../../recs/regression/DG1.md) `0.81`


## Technique (pymc-labs)

**Multicollinearity detection thresholds (condition number, VIF) + prediction-vs-interpretation nuance** — PRE-fit collinearity detection to add to the QR story — np.linalg.cond(X) > ~30, or VIF > 5-10, flags multicollinearity before the ridge appears. Decision nuance: if prediction (not coefficient interpretation) is the goal, collinearity may be harmless — don't interpret individual coefficients. The catalog has the geometry (ridge/QR) but not the detection thresholds.
*Source: [pymc-labs:regression](https://github.com/pymc-labs/python-analytics-skills)*
