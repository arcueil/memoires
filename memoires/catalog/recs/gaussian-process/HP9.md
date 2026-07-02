# ✓ HP9 · for a **designed study** whose sampling was motivated by length-scale knowledge → **setting ρ-prior bounds from the obse

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — t](../../claims/gaussian-process/C1.md)

**✓ HP9**  · for a **designed study** whose sampling was motivated by length-scale knowledge → **setting
ρ-prior bounds from the observed covariate span** works.
- why: the degeneracy thresholds (δx_min, Δx) are properties of the design; using them is principled when the design was chosen *because* of domain knowledge about length scales.
- conditions: designed (non-observational) study.
- tier: 🟢 · source: [betanalpha:gaussian_processes](https://betanalpha.github.io/assets/case_studies/gaussian_processes.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Correct the semantics of prior predictive checks: check consequences against IMPLICIT DOMAIN EXPERTISE, not against the observed data"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓/✗ CC-priors-identifiability G5 · when **you set ρ-prior bounds from the observed covariate span** → wor](../../recs/CC-priors-identifiability/G5.md) `0.91`
- [CC-priors-identifiability C5 · Scaling a prior to the experimental design is principled, not cheating](../../claims/CC-priors-identifiability/C5.md) `0.86`
- [✓ CC-priors-identifiability G4 · when **ρ drifts to ∞ or the GP interpolates** → recognize these as **t](../../recs/CC-priors-identifiability/G4.md) `0.85`
- [✗ CC-priors-identifiability G6 · when **you use GP ARD inverse-length-scales for variable selection** (](../../recs/CC-priors-identifiability/G6.md) `0.82`


## Contradiction record

**pymc-labs says:** (unconditionally) 'concentrate the IG prior between the shortest and longest pairwise distances in the data', beta = max_dist/2. · **this catalog says:** deriving ρ-prior bounds from the observed covariate span is principled ONLY when the design was itself length-scale-motivated (HP9); for an observational study it is circular / overfits the prior to the initial data (HP10). · **adjudication:** our catalog is the more careful of the two — an external-expert file that skips the designed-vs-observational distinction we hold (Betancourt); their guidance omits that caveat.
*The catalog is contradiction-aware by design: both positions stay visible.*
