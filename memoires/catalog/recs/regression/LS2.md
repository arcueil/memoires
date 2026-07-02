# ✗ LS2 · for **two outcomes with unequal counts / non-Gaussian families** → a **residual correlation** (brms `set_rescor(TRUE)`) 

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C7 · Match the observation model to the data's generative structure, not its surface ](../../claims/regression/C7.md)

**✗ LS2**  · for **two outcomes with unequal counts / non-Gaussian families** → a **residual
correlation** (brms `set_rescor(TRUE)`) does **NOT** work.
- why: rescor needs a one-to-one pairing of residuals AND a tractable joint/CDF (Gaussian/Student); unequal-length or non-Gaussian outcomes have no quantity to estimate.
- conditions: multivariate/multi-outcome models; well-defined only for equal-length, paired, all-Gaussian/Student outcomes.
- tier: 🟡 · source: [mc-stan:16401](https://discourse.mc-stan.org/t/multivariate-formula-with-different-number-of-observations/16401), [mc-stan:28180](https://discourse.mc-stan.org/t/possible-to-model-mixed-families-with-set-rescor-true/28180)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the generated Stan code and the family/link, then triage by swapping to a simpler likelihood" · "Re-derive the augmented joint likelihood and check whether every margin's contribution is included"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability K3 · when **you fix a random-effect correlation to zero** (brms `||`, lkj-a](../../recs/CC-priors-identifiability/K3.md) `0.83`
- [✗ hierarchical-multilevel G2 · for a **mixed-effects model** → assuming a single **"Bayesian R²"** do](../../recs/hierarchical-multilevel/G2.md) `0.82`
- [✗ CC-model-evaluation H4 · when reporting a **single "Bayesian R²"** for a mixed model → does **N](../../recs/CC-model-evaluation/H4.md) `0.82`
- [✗ latent-factor C1 · for **correlated multi-category count/compositional** data → **indepen](../../recs/latent-factor/C1.md) `0.82`
