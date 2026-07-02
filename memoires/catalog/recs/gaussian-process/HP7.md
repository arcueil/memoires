# ✓ HP7 · for **GP hyperparameter identifiability** → inspecting the **2-D joint posterior of (ℓ, σ)** works.

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — t](../../claims/gaussian-process/C1.md)

**✓ HP7**  · for **GP hyperparameter identifiability** → inspecting the **2-D joint posterior of (ℓ, σ)**
works.
- why: an elongated ridge reveals that only the combination is determined; a compact blob shows the prior resolved it. The joint is the correct diagnostic, the marginals are not.
- conditions: d≤3 Matérn/EQ; evaluating whether the prior resolved the ρ/ℓ-vs-σ non-identifiability.
- tier: 🟢 · source: [dansblog:priors5](https://dansblog.netlify.app/posts/2022-09-07-priors5/priors5.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Search systematically for the right projection / pairs plot — but deductively, not by blind ML search"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability G2 · when **you judge GP identifiability from the marginal ρ and σ posterio](../../recs/CC-priors-identifiability/G2.md) `0.90`
- [✗ CC-priors-identifiability G3 · when **you reach for a reference prior to "let the data speak" for GP ](../../recs/CC-priors-identifiability/G3.md) `0.87`
- [✓ ode-dynamical R2 · for the **g/k ridge** → an **informative/regularizing prior on g and k](../../recs/ode-dynamical/R2.md) `0.83`
- [✓ ode-dynamical R5 · for **localizing a suspected identifiability ridge** → a **controlled ](../../recs/ode-dynamical/R5.md) `0.82`
