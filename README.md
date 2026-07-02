# Bayesian catalog — the guide (3-layer, data-driven) · ✅ ADOPTED 2026-07-01

The published corpus. **Apex → claims → practical → moves**, depth measured from embeddings; recs rigorously validated (error-dense class swept); cross-checked against the human-curated **pymc-labs peer-L1** (`dist/pymc_L1/`, gap-fillers merged in).

0. **[Super-axioms](SUPER_AXIOMS.md)** — 6 grand principles.
1. **[Claims spine](CLAIMS_SPINE.md)** — 82 mid-level principles (the *why*).
2. **Practical layer** — bidirectional recs + attached moves (per-page below).
3. **[pymc-labs peer-L1](pymc_L1/README.md)** — vetted external knowledge (techniques/API + contradictions audit).

## Cross-cutting (computation & diagnostics)

- **[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](pages/CC-geometry-sampling.md)** — 8 claims · 83 recs
- **[Cross-cutting: priors, identifiability & degeneracy](pages/CC-priors-identifiability.md)** — 9 claims · 59 recs
- **[Cross-cutting: Model evaluation — is the fit trustworthy, is the model adequate, and is the comparison honest?](pages/CC-model-evaluation.md)** — 9 claims · 74 recs
- **[Cross-cutting: Convergence & Monte-Carlo reliability diagnostics](pages/CC-convergence-diagnostics.md)** — 7 claims · 49 recs

## By model class *(a navigation tag, not the only axis)*

- **[Regression models (linear / GLM / GP / ordinal)](pages/regression.md)** — 5 claims · 65 recs
- **[Hierarchical / multilevel models](pages/hierarchical-multilevel.md)** — 5 claims · 62 recs
- **[Mixture models (finite mixtures, label switching, zero-inflation)](pages/mixture.md)** — 5 claims · 22 recs
- **[Gaussian processes & latent-Gaussian models](pages/gaussian-process.md)** — 5 claims · 53 recs
- **[Time-series & state-space models](pages/time-series-state-space.md)** — 6 claims · 32 recs
- **[Spatial & areal models (CAR / ICAR / BYM, GMRFs, spatial GPs)](pages/spatial-areal.md)** — 4 claims · 26 recs
- **[Latent-factor models (factor analysis / SEM / IRT / PPCA / latent-Gaussian)](pages/latent-factor.md)** — 3 claims · 20 recs
- **[ODE / dynamical-system models (mechanistic ODE likelihoods, SDEs, and continuous-time generative flows)](pages/ode-dynamical.md)** — 3 claims · 35 recs
- **[Measurement-error & missing-data models](pages/measurement-error-missing.md)** — 6 claims · 29 recs
- **[Sparse regression & shrinkage priors](pages/sparse-shrinkage.md)** — 7 claims · 30 recs

---

**Structure:** 6 super-axioms → **82 claims** → **639 recs** → moves. Quality: claims 98.7% faithful · recs error-dense class rigorously swept (3/82 residual, fixed) · moves ~39/40 sound. 446 granular claims retained on disk (never-delete). Gaps closed via pymc-L1 (see `GAPS.md`).
