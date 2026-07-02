# Experiment: grading "spike-and-slab is bad under HMC" by data

**Claim under test (the expert's own folklore):** *"spike-and-slab does not work well using HMC."*
The expert flagged it himself as received wisdom he wasn't sure of — so we grade it the way we grade any
forum/blog claim: **by experiment, not authority.**

**Setup.** Synthetic sparse linear regression, N=100, P=50, K=5 true non-zeros (β≈±2–3), σ=1.
Same sampler for every model: BlackJAX **NUTS + window adaptation**, 4 chains × 2000 (1000 warmup).
Self-contained JAX log-densities (`spike_slab_vs_horseshoe.py`) — not the aeppl/aesara
`sampling-book` horseshoe.

The HMC-able spike-and-slab is the **marginalized** one: integrate out the discrete inclusion indicator,
leaving a continuous two-component Gaussian mixture prior per coefficient,
`logp(βⱼ) = logsumexp([log(1−π)+N(βⱼ;0,σ_spike), log π+N(βⱼ;0,σ_slab)])`.
Fixed π=0.1, σ_spike=0.05, σ_slab=3.

## Result (the fair, 3-way comparison)

| metric | HS-centered (naive) | HS-non-centered (standard) | spike-slab (marginalized) |
|---|---|---|---|
| divergences /8000 | **3827** | 3 | **0** |
| min-ESS | 2 | 3404 | 1599 |
| ESS/sec | 0.1 | 288 | **584** |
| β RMSE | 0.048 | 0.046 | **0.030** |
| selection TP/FP | 5/5 · 0/45 | 5/5 · 0/45 | 5/5 · 0/45 |
| 90% coverage | 0.98 | 1.00 | 1.00 |

## Verdict

1. **The folklore is not supported as stated.** The *marginalized* spike-and-slab is not just HMC-able — on this
   problem it is the **best-behaved** model: 0 divergences, the highest ESS/sec, the lowest RMSE, perfect coverage.
2. **What the folklore actually refers to is the *discrete* spike-and-slab** (binary inclusion indicators zⱼ∈{0,1}).
   HMC cannot sample those at all — no gradient through a discrete parameter. The standard, HMC-compatible move is to
   **marginalize**, and once you do, it samples fine. So the claim is true of a model HMC can't touch and false of the
   one you'd actually run.
3. **Parameterization dominates model choice.** The real divergence factory here is the **centered horseshoe**
   (3827/8000 divergences, min-ESS 2) — the well-known funnel. Non-centering fixes it (3 divergences, min-ESS 3404).
   "Centered vs non-centered" mattered ~1000× more than "horseshoe vs spike-slab."

## Are-you-sure caveats (kept in, true to the brand)

- **The first run was an unfair fight.** v1 compared only a *centered* horseshoe against the spike-slab and read
  "spike-slab crushes horseshoe." That headline was a parameterization artifact — the centered horseshoe funnels by
  construction. Adding the non-centered horseshoe (the form anyone would actually use) is what makes the test honest.
- **The spike-slab here uses fixed, well-chosen scales** (σ_slab=3 ≈ the true effect size; π=0.1 = the true sparsity).
  That benign geometry is *because* the scales are fixed — there is no hyperprior funnel. Put hyperpriors on the
  spike/slab scales and it would reintroduce funnel geometry and need non-centering too. So the honest statement is
  **conditional on this parameterization**, not "spike-slab always wins."
- **Recovery is a tie.** All three find the 5 true signals with no false positives; the differences are sampling
  *efficiency* + a small RMSE edge, not selection skill.

## What this does to the catalog

The field guide had *"spike-slab specifically is bad under HMC"* as a **named gap** (no established entry). This
experiment fills it with a graded entry:

> **graded — refuted as stated; nuance is established.** The *marginalized* spike-and-slab is HMC-able and
> well-behaved (often better than a naive horseshoe). Pitfalls are (a) the *discrete* formulation, which HMC can't
> sample, and (b) *centered* parameterization of any global-local prior, which is the actual divergence source.
> Evidence: empirical, this experiment (single-dataset; effect is large and direction is unambiguous).

First worked example of the project's anti-folklore loop: an expert's confident claim → a light experiment →
a graded, evidence-backed entry that is *more nuanced and more useful* than the original folklore.

To reproduce: `uv run --with blackjax --with jax python experiments/spike_slab_vs_horseshoe.py`
