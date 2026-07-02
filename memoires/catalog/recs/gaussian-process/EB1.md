# ✗ EB1 · for **setting a GP prior scale from a pre-fit to the same data** → **empirical-Bayes prior tuning** does **NOT** work.

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — t](../../claims/gaussian-process/C1.md)

**✗ EB1**  · for **setting a GP prior scale from a pre-fit to the same data** → **empirical-Bayes prior
tuning** does **NOT** work.
- why: it violates the Likelihood Principle and is worse than it looks; challenge whether the pre-fit is even necessary — prior experiments or first-principles domain reasoning can often supply the scale, and post-hoc model selection is a still deeper hazard.
- conditions: prior scale elicited from the data being analyzed; check whether the estimate is prior-only or a full fit.
- tier: ⚪ candidate (single-witness moves) · source: (move-only; corroborates [dansblog:cheat](https://dansblog.netlify.app/posts/2021-12-09-why-wont-you-cheat-with-me-repost/why-wont-you-cheat-with-me-repost.html))
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Name the procedure as empirical-Bayes prior tuning and diagnose WHY it is worse than it looks" · "Challenge the necessity of the pre-fit; ask whether prior experiments or domain reasoning could supply the scale" · "Surface and flag post-hoc model selection as a separate, deeper hazard than prior tuning"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ ode-dynamical Q1 · for **supplying a prior scale by pre-fitting the data** (empirical-Bay](../../recs/ode-dynamical/Q1.md) `0.94`
- [✗ CC-model-evaluation H1 · when computing a **Bayes factor on an estimation-prior fit** (e.g. rst](../../recs/CC-model-evaluation/H1.md) `0.84`
- [✗ CC-model-evaluation F11 · when **predicting a GP at new inputs X\*** via generic `Predictive` / ](../../recs/CC-model-evaluation/F11.md) `0.82`
- [✗ spatial-areal T3 · for choosing a **prior scale in a scale-mixture / structured spatial m](../../recs/spatial-areal/T3.md) `0.82`
