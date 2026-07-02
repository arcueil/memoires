# ✓ RB1 · for a **regression with outliers / poor posterior-predictive tail fit** → swapping the **Normal likelihood for Student-t

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C7 · Match the observation model to the data's generative structure, not its surface ](../../claims/regression/C7.md)

**✓ RB1**  · for a **regression with outliers / poor posterior-predictive tail fit** → swapping the
**Normal likelihood for Student-t** (an implicit contamination model) works.
- why: Student-t downweights outliers without flagging them (Student-t = an infinite scale-mixture of
Normals); nu = tail heaviness (nu=1 is Cauchy / very heavy, nu>30 ≈ Normal).
- conditions: nu priors — `Gamma(2, 0.1)` (mode ~10, weakly-informative); `Exponential(1/29)+1`
(heavy-tail-leaning; the `+1` offset keeps nu>1 so the mean stays finite); or fix `nu~4`. Compare vs
Normal by LOO (`az.compare`). Complements C1's *explicit* signal/background contamination mixture with
the *implicit*-mixture route.
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ measurement-error-missing N1 · for **outliers you want to downweight without explicitly flagging them](../../recs/measurement-error-missing/N1.md) `0.94`
- [✓ sparse-shrinkage D4 · for **sparse regression** → reading the **σ (noise) posterior as a sen](../../recs/sparse-shrinkage/D4.md) `0.82`
- [✗ CC-priors-identifiability W1 · when **M > N** (more covariates than observations) and you **widen the](../../recs/CC-priors-identifiability/W1.md) `0.82`
- [✓ CC-model-evaluation F4 · when you need **full predictive uncertainty** → **`posterior_predict`*](../../recs/CC-model-evaluation/F4.md) `0.82`
