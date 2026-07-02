# ✗ GP2 · for **out-of-sample GP prediction** → treating the fitted GP as a **callable function** does **NOT** work.

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C5 · Derived quantities, predictions, and effect summaries are definition- and estima](../../claims/regression/C5.md)

**✗ GP2**  · for **out-of-sample GP prediction** → treating the fitted GP as a **callable function** does
**NOT** work.
- why: a GP defines a joint Gaussian over ALL inputs; the training fit gives nothing at new x — you must recompute the cross-covariance K(X_train,X_test) from the same kernel and apply the analytic posterior-predictive equations (gp.conditional/gp.predict).
- conditions: stationary-kernel GP regression; predictions at new inputs; PyMC/Stan/any GP library where the predictive step is separate from fitting.
- tier: 🟡 · source: [pymc:1299](https://discourse.pymc.io/t/regression-using-rbf-kernel/1299), [mc-stan:16891](https://discourse.mc-stan.org/t/gaussian-process-out-of-sample-predictive-distribution/16891), [mc-stan:5442](https://discourse.mc-stan.org/t/applied-gaussian-processes-in-stan-part-1-a-case-study/5442)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "inspect the rank/shape of Xnew passed to the GP prediction call" · "review the GP modelling choice (Latent vs Marginal) and the likelihood/parallelism settings" · "review how the random-variable query point is assembled and shaped before conditional"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ gaussian-process P2 · for **GP out-of-sample prediction** → explicitly **conditioning on the](../../recs/gaussian-process/P2.md) `0.86`
- [✗ CC-model-evaluation F11 · when **predicting a GP at new inputs X\*** via generic `Predictive` / ](../../recs/CC-model-evaluation/F11.md) `0.84`
- [gaussian-process C5 · A GP is non-parametric — prediction and structural decomposition requi](../../claims/gaussian-process/C5.md) `0.84`
- [✗ gaussian-process HP10 · for an **observational (non-designed) GP** → **retrofitting the ρ prio](../../recs/gaussian-process/HP10.md) `0.82`


## Technique (pymc-labs)

**pymc_bart API details: split_prior and out-of-sample set_data** — Bias which features are split on via `split_prior` (length-n_features weight vector; None = uniform). Out-of-sample prediction requires `pmb.set_data({'mu': X_new})` inside the model context before `sample_posterior_predictive` — a fitted BART is not a callable function, exactly the 'a fitted GP is not a callable, out-of-sample requires explicit conditioning' caveat.
*Source: [pymc-labs:bart](https://github.com/pymc-labs/python-analytics-skills)*
