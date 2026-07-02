# ✗ HP4 · for **EQ GP hyperparameters** → **maximum marginal likelihood (MML) without a prior** does **NOT** work.

[Gaussian processes & latent-Gaussian models](../../pages/gaussian-process.md)

**Why this holds — the governing claim:**

- ↑ [gaussian-process C1 · GP covariance hyperparameters are only weakly (often *partially*) identified — t](../../claims/gaussian-process/C1.md)

**✗ HP4**  · for **EQ GP hyperparameters** → **maximum marginal likelihood (MML) without a prior** does
**NOT** work.
- why: the marginal likelihood has multiple flat plateaus with vanishing gradients, so MML is seed-dependent, converging to qualitatively different solutions — not numerical noise but distinct plateau regions.
- conditions: EQ kernel, inference over (ρ, α); multiple degeneracy plateaus present.
- tier: 🟢 · source: [betanalpha:gaussian_processes](https://betanalpha.github.io/assets/case_studies/gaussian_processes.html)
- efficacy: {divergences: n/a · min_ess: n/a · ess_per_sec: pending · rmse: two MML optima — seed 5838298 → ρ=1.14, σ=0.20 vs seed 2384853 → ρ=0.234, σ=2.40 (distinct plateaus, not perturbed local optima) · coverage: pending}
- moves: "Detect the plateau degeneracy by re-running MML from several seeds and checking whether the optima are distinct plateau regions rather than perturbed local optima"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability G3 · when **you reach for a reference prior to "let the data speak" for GP ](../../recs/CC-priors-identifiability/G3.md) `0.86`
- [✗ CC-priors-identifiability G1 · when **you estimate an EQ-kernel length scale ρ by maximum marginal li](../../recs/CC-priors-identifiability/G1.md) `0.83`
- [✓ time-series-state-space GP1 · for a **nonparametric time-series model** → a **GP prior over time wit](../../recs/time-series-state-space/GP1.md) `0.83`
- [✓ CC-geometry-sampling GP2 · when a **GP is too large** → replacing it with a low-rank basis-functi](../../recs/CC-geometry-sampling/GP2.md) `0.81`
