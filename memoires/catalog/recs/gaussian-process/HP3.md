# ✓ HP3 · for a **Matérn length scale in d≤3** → the **PC prior = Frechet(d/2)** (exactly inverse-gamma in 2D) works.

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — t](../../claims/gaussian-process/C1.md)

**✓ HP3**  · for a **Matérn length scale in d≤3** → the **PC prior = Frechet(d/2)** (exactly inverse-gamma
in 2D) works.
- why: derived from a spectral KL approximation whose integral converges iff d≤3; PC distance d(ℓ) ∝ ℓ^(−d/2) is domain-independent, unlike a naive finite-MVN construction.
- conditions: stationary Matérn, fixed ν, bounded domain, d≤3; the Gamma-on-κ result is squared-exponential-only, not Matérn.
- tier: 🟢 · source: [dansblog:priors5](https://dansblog.netlify.app/posts/2022-09-07-priors5/priors5.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Set the PC-prior scale by eliciting a tail probability P(ρ < ρ₀)=α on the length scale, and confirm the d≤3 convergence condition before trusting the construction"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ hierarchical-multilevel B3 · for a **Gaussian random-effect SD** where τ=0 is a plausible base mode](../../recs/hierarchical-multilevel/B3.md) `0.85`
- [✗ spatial-areal T1 · for a **CAR/GMRF model parameterized through precision Q** → interpret](../../recs/spatial-areal/T1.md) `0.81`
- [✓ spatial-areal T2 · for the same model → **elicit the prior on the marginal SD** (τ^{-1/2}](../../recs/spatial-areal/T2.md) `0.81`
- [✗ CC-priors-identifiability G3 · when **you reach for a reference prior to "let the data speak" for GP ](../../recs/CC-priors-identifiability/G3.md) `0.80`
