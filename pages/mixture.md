# Mixture models (finite mixtures, label switching, zero-inflation)

## Claims (the *why* — mid-level, ~3–5)

*Six mid-level principles synthesized from 24 granular claims. Tier is the best-supported of the
granular claims each subsumes. Source short-ids resolve to URLs in the Source key at the bottom.*

### C1 · Label switching is a structural K! multimodality — a theorem, not a sampler failure 🟢

**Statement.** When mixture components share a distributional family and priors are exchangeable, the
posterior is *exactly* invariant to all K! permutations of the component labels, so it has exactly K!
isolated modes of equal mass; this is a property of the *model's* posterior geometry, not a
convergence bug that longer runs, better inits, or sampler tuning can cure.

**Nuance.** The multimodality is exact and combinatorial — a theorem, not a heuristic. Each mode
carries positive, equal probability mass and the modes are separated by near-zero-density valleys, so
any single HMC/NUTS chain is trapped in whichever mode it warmed up into for the whole of a finite
run — and this is true of *any* MCMC algorithm, not a defect of HMC specifically. The same mechanism,
compounded, is what makes a Bayesian *neural network's weight posterior* effectively intractable:
hidden-unit permutation plus sign/aliasing symmetries give a combinatorial set of equivalent modes
(far worse than a finite mixture's K!, and multiplying per layer) layered on top of funnel geometry —
so the finite-mixture story is the identifiable, relabelable *easy* end of a spectrum.

**Conditions.** Degenerate mixture: identical component families, exchangeable priors, K≥2, data that
cannot discriminate assignments; applies to HMC/NUTS and to VI; the weight-space case needs a
multilayer over-parameterized model (milder for a single linear/logistic layer).

**Tier.** 🟢 established (subsumes `casestudy-label-switching-is-structural-not-computational`,
`casestudy-label-switching-is-structural-not-computational-2`; plus supported `forum-c287`
neural-network weight symmetry).

**Sources.** betanalpha:identifying_mixture_models · betanalpha:mixture_models · mc-stan:3277 ·
mc-stan:1399 · pymc:8805

---

### C3 · The two fixes divide by exactness — ordering constraints are provably exact; symmetry-breaking priors are regime-dependent 🟢

**Statement.** For scalar component parameters, an ordering constraint (e.g. μ₁ < μ₂) is a
*mathematically exact* resolution: it selects one of the K! symmetric "pyramid" regions and yields
identical expectations to the full posterior for any permutation-invariant estimand. Non-exchangeable
(asymmetric) mean priors instead try to *break* the symmetry, and only work when the prior is strong
enough to suppress the disfavored modes relative to the likelihood — which fails at large N.

**Nuance.** The ordering proof (§3.2.2) shows E_π[f] = E_π′[f] for any permutation-invariant f, where
π′ restricts to the ordered region; the K-dimensional space decomposes into K! pyramids each a
rotation of the others, so restricting to one loses nothing for permutation-invariant inferences (the
*set* of component means, not "which component is index 1"). Asymmetric priors, by contrast, are a
data-regime gamble: the mixture likelihood becomes highly informative as N grows, and its K! symmetry
then swamps even a strong finite prior — at N=1000 chains still lock into the reversed mode with
priors centered 2.5 prior-SDs from the true means (|4−2.75|/0.5), while at N=100 the same priors succeed. So the
boundary between success and failure is a threshold in N, not a property of the prior alone; ordering
is the safe default when a scalar parameter and permutation-invariant estimand are available.

**Conditions.** Ordering: at least one scalar component parameter, permutation-invariant estimand,
exchangeable priors. Asymmetric priors: finite prior strength; success only while the per-mode
likelihood curvature stays below the prior curvature between modes (i.e. small N).

**Tier.** 🟢 established (subsumes
`casestudy-ordering-constraint-exact-identification-with-correct-inferences`,
`casestudy-parameter-ordering-exactly-resolves-label-switching`,
`casestudy-asymmetric-prior-insufficient-against-large-n-likelihood`,
`casestudy-non-exchangeable-prior-fails-at-large-n`).

**Sources.** betanalpha:mixture_models · betanalpha:identifying_mixture_models

---

### C4 · Overlapping components are a *second*, continuous non-identifiability that ordering does not cure 🟢

**Statement.** When components are insufficiently separated (overlap within ~1–2 σ), the discrete K!
label-switching degeneracy transforms into a *continuous* non-identifiability — an elongated, curved
"bowtie" ridge in (μ₁, μ₂) space whose orientation rotates with the mixture weight θ — that produces
very low n_eff *without any divergences* and that the ordering constraint only halves (to a
"half-bowtie"), not removes.

**Nuance.** With separated components the K! modes are distinct point clusters and ordering picks one;
with overlap the components can continuously re-arrange to give near-identical likelihoods, so no
point-selection helps. A direct consequence is that the *mixture weight θ becomes uninformed*: when
each datum is nearly equally consistent with either component, the likelihood ratio barely varies
across the data range and θ's posterior collapses onto its prior no matter how many observations you
collect. Neither ordering nor asymmetric mean priors touch this manifold; the only structural fix is a
prior that actively *repels* the components from each other — and constructing a well-behaved repulsive
prior was an open research problem at the time of writing. The overlap regime is especially severe
when K is over-specified relative to the true number of clusters.

**Conditions.** Two or more components with separation ≪ ~2σ; θ jointly inferred; ridge geometry
persists with or without the ordering constraint; worse when K is over-specified.

**Tier.** 🟢 established (subsumes
`casestudy-component-overlap-creates-continuous-non-identifiability-bowtie`,
`casestudy-overlapping-components-produce-continuous-non-identifiability`,
`casestudy-mixture-weight-is-uninformed-by-overlapping-components`,
`casestudy-repulsive-priors-needed-for-overlapping-component-regime`).

**Sources.** betanalpha:identifying_mixture_models

---

### C5 · Where the mixture lives dictates how you treat it — marginalize the assignment, decompose the observation 🟢

**Statement.** The discrete structure of a mixture must be handled *explicitly and
placement-appropriately*: in the *likelihood*, marginalize the component-assignment variables z out
analytically (log_sum_exp) before sampling — it is required for gradient samplers and strictly
Rao-Blackwell-better — then reconstruct z's posterior *data-conditioned* if you need it; in the
*observation model*, structural mixtures (zero-inflation, hurdle, signal/background contamination)
decompose into separable sub-models that must be built in, not omitted.

**Nuance.** HMC/NUTS cannot move in discrete space, so marginalizing z yields a continuous likelihood
that is a convex combination of component densities, amenable to gradients — and the Rao–Blackwell
theorem guarantees strictly lower-variance estimates than sampling z. But marginalization *removes* z
from the returned draws by design, so recovering it is a distinct second step: the correct quantity is
the data-conditioned membership E[z | θ, y] (Bayes' rule over the same per-component densities that
built the marginalized likelihood), *not* the prior-side E[z | θ] that ignores the data. Zero-inflation
over a *continuous* baseline decomposes *exactly* — the inflated point has zero probability under the
continuous baseline and the baseline has zero mass at the inflated point, so the two contribute to
disjoint observations and can be fit independently (or the counts ignored when a nuisance). And the
observational model is the theoretical model *convolved with the measurement response*: omitting a
background-contamination mixture or binning/censoring biases every parameter away from the physical
quantity of interest. A recurring downstream trap: `fitted`-type output (conditional mean E[y|x]) has
already averaged the inflation away, so only the posterior-*predictive* reproduces the zero spike.

**Conditions.** Continuous sampler (HMC/NUTS) or enumerating SVI; components analytically marginalizable;
continuous, absolutely-continuous baseline with a fixed inflation point for the exact decomposition;
non-trivial measurement response for the contamination/censoring point (less relevant when the response
is ~identity).

**Tier.** 🟢 established (subsumes `casestudy-marginalize-discrete-assignments-before-sampling`,
`casestudy-continuous-inflation-decomposes-into-independent-binomial-and-baseline`,
`measurement-model-must-include-censoring-and-contamination`; plus supported `forum-c53`, `forum-c477`,
`merged-5`, `forum-c450`, `forum-c65`).

**Sources.** betanalpha:mixture_models · betanalpha:generative_modeling · mc-stan:22488 · mc-stan:16736 ·
mc-stan:3012 · pyro:2555 · pyro:2405

---

### C6 · A mixture can be a *prior*, not a likelihood — then the rule is per-component parameterization by likelihood location 🟢

**Statement.** When the mixture is a *prior* (a scale-mixture of normals: two-component sparsity prior,
horseshoe, Laplace), the optimal centered-vs-non-centered choice for each individual parameter is set
by *where its likelihood concentrates* relative to the inner-core scale τ₁ — not by how many
observations inform it (the N_k heuristic that works for single-scale hierarchies fails here) — and the
characteristic R̂ inflation is a *topological* slow-mixing effect, not the mode-trapping of a degenerate
mixture nor a geometric funnel.

**Nuance.** A single-scale normal hierarchy has one degree of freedom (likelihood width vs prior
scale), so N_k predicts the right parameterization. A scale mixture adds a *second* degree of freedom —
which component dominates — governed by likelihood *location*: parameters whose likelihoods concentrate
at or below τ₁ need NCP, those concentrating in the outer plateau need CP, independent of N_k (the K=9
demonstration holds N_k=1 fixed and varies location). Separately, when many latent parameters get a
two-component prior with outer_τ ≫ inner_τ, the subset whose likelihoods *straddle* both components
show R̂ > 1.1 — but the traceplots show all chains *do* visit both the inner-core peak and the outer
plateau; the transitions are just rare (a few per 1000 iterations), so this is too-few-transitions slow
mixing, curable by longer runs, and must not be misread as either isolated-mode trapping (C1) or a
geometric pinch that would show divergences.

**Conditions.** Prior is a scale-mixture of normals with well-separated τ₁ ≪ τ₂; contexts may have
small N_k; the topological R̂ effect needs likelihoods straddling both components and short runs.

**Tier.** 🟢 established (subsumes `ncp-cp-choice-mixture-models-depends-on-value-location`,
`mixture-prior-rhat-failure-is-topological-not-geometric`).

**Sources.** betanalpha:modeling_sparsity

---

## Practical — what works / what doesn't (comprehensive, bidirectional)

*22 recs (7 ✓ / 12 ✗, plus 3 bidirectional). `efficacy` is the benchmark-shaped slot
`{divergences, min_ess, ess_per_sec, rmse, coverage}` — filled only from a metric present in the input,
else `pending`. Attached `moves` are the diagnostic "how", matched by relevance. Move-only / single-witness
recs are tiered ⚪ and kept as the searchable tail.*

### Detecting label switching

**✗ D1** · for a **degenerate mixture** (identical component family, exchangeable priors) → a **single
chain + per-chain diagnostics** does **NOT** work (looks healthy, explores one mode).
- why: per-chain n_eff is legitimate for the samples drawn — but they were all drawn from one mode; single-chain diagnostics are structurally blind to the other K!−1 modes.
- conditions: chains initialized randomly or near one mode; per-chain diagnostics examined in isolation.
- tier: 🟢 · source: betanalpha:identifying_mixture_models
- efficacy: {divergences: 0 (clean) · min_ess: per-chain n_eff looks normal; scatter shows only one cluster (fig002, large N) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Confirm the failure is real and characterize it: look at the pairs plot and count divergences / mean treedepth at default settings" · "Map the mode locations against the data geometry (period count on the domain, window length)" · "Sweep the noise/SNR axis and re-inspect the likelihood surface + chain behaviour"

**✗ D2** · for a **degenerate mixture** → the **standard HMC diagnostics** (divergences, E-BFMI,
tree-depth saturation) do **NOT** work to detect mode-trapping.
- why: modes are separated by low-density valleys, not geometry kinks, so the trajectory stays valid within its mode (no divergences) and E-BFMI only measures within-mode quality.
- conditions: well-separated modes; multiple chains still required for the alternative signal to exist.
- tier: 🟢 · source: betanalpha:mixture_models, betanalpha:identifying_mixture_models
- efficacy: {divergences: 0 · min_ess: split-R̂ ≫ 1.1 (50+ observed), near-zero n_eff/iter, E-BFMI fine · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the ESS/R-hat estimators themselves rather than trusting the reported numbers" · "Confirm the failure is real and characterize it: look at the pairs plot and count divergences / mean treedepth"

**✓ D3** · for a **degenerate mixture** → **multiple chains from dispersed inits + split-R̂ +
multi-chain scatter** works (the only reliable detector).
- why: cross-chain comparison is the sole quantity that exposes chains sitting in disjoint clusters; split-R̂ blows up and the scatter shows the separate modes directly.
- conditions: chains dispersed across the modes; well-separated components.
- tier: 🟢 · source: betanalpha:mixture_models, betanalpha:identifying_mixture_models
- efficacy: {divergences: 0 · min_ess: split-R̂ 50+ flags the split; near-zero n_eff/iter · ess_per_sec: pending · rmse: pending · coverage: multi-chain scatter shows disjoint clusters}
- moves: "Map the mode locations against the data geometry" · "Triage on whether secondary modes are scientifically real vs nuisance"

### Breaking the K! labeling degeneracy

**✓ B1** · for a degenerate mixture with **scalar component params + a permutation-invariant estimand**
→ an **ordering constraint** (μ₁ < μ₂) works, *exactly*.
- why: the K-space decomposes into K! symmetric pyramids; restricting to one gives E_π′[f] = E_π[f] for any permutation-invariant f — exact, not an approximation.
- conditions: at least one scalar parameter to order; permutation-invariant inference; exchangeable priors.
- tier: 🟢 · source: betanalpha:mixture_models, betanalpha:identifying_mixture_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: exact E[f] recovery for permutation-invariant f (proof §3.2.2)}
- moves: "Trace the offset construction at the initial point to see why the ordering constraint is violated" · "Read sampler diagnostics (divergences) and re-run with a higher target_accept to force a smaller step size near the hard boundary"

**✗ B2** · for a degenerate mixture → **running longer / pure tuning** (adapt_delta→0.999, more
iterations) does **NOT** work.
- why: the modes are separated by near-zero-density barriers HMC cannot tunnel through; the pathology is structural, so no amount of tuning, longer runs, or better initialization moves a single chain across.
- conditions: degenerate mixture; single chain (or all chains) trapped.
- tier: 🟢 · source: betanalpha:identifying_mixture_models, betanalpha:mixture_models
- efficacy: {divergences: 0 (tuning changes nothing) · min_ess: split-R̂ stays ≫ 1 · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try pure tuning: bump adapt_delta toward 0.999 and increase iterations" · "Triage on whether secondary modes are scientifically real vs nuisance"

**✓/✗ B3** · for a degenerate mixture with **asymmetric / non-exchangeable mean priors** → the priors
**work at small N** but do **NOT** work at large N (likelihood swamps the prior).
- why: the prior must suppress the disfavored modes relative to the likelihood; the mixture likelihood becomes highly informative as N grows and its K! symmetry overwhelms even a strong finite prior.
- conditions: N=100 succeeds; N=1000 fails even with prior centers a full 4 SD from the true means (true μ=[−2.75, 2.75], prior centers [−4, 4]); no ordering constraint applied.
- tier: 🟢 · source: betanalpha:mixture_models, betanalpha:identifying_mixture_models
- efficacy: {divergences: pending · min_ess: R̂ 49–58 at N=1000 (priors μ~N(±4, 0.5), fails); N=100 succeeds · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run on simulated data and on prior-predictive / increasing-N data and inspect the likelihood/posterior geometry" · "Relax/remove priors (widen the μ prior) and rerun; compare divergence count and E-BFMI" · "Distinguish 'no information' from 'informatively small,' and test the claim with a known-signal simulation contrast"

### Overlapping components (continuous non-identifiability)

**✗ O1** · for **overlapping components** (separation < ~1–2 σ) → the **ordering constraint** does
**NOT** fully work (a continuous bowtie ridge persists).
- why: overlapping components re-arrange continuously to give near-identical likelihoods, so ordering only reduces the bowtie to a half-bowtie — the elongated curved ridge in (μ₁, μ₂) remains.
- conditions: μ=[−0.75, 0.75], σ=1 (within ~1.5 σ); θ jointly inferred; K over-specified makes it worse.
- tier: 🟢 · source: betanalpha:identifying_mixture_models
- efficacy: {divergences: 0 (none) · min_ess: very low n_eff without divergences · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect a pairs/scatter plot of the parameters (mu1 vs mu2, and sigma vs locations) for correlation or funnel shapes" · "Locate the likelihood symmetry/redundancy generating the flat manifold" · "Separate strict (technical) non-identifiability from data-limited degeneracy before anything else"

**✓ O3** · for **overlapping components** → a **repulsive prior** (penalizing μ₁ ≈ μ₂) is the only
structural fix (an open research problem at time of writing).
- why: the overlap generates a continuous manifold of near-equally-good configurations; ordering and asymmetric mean priors don't remove it, but a prior that repels the components can break the manifold.
- conditions: substantial overlap (separation within ~1 σ); ordering already applied; no external info on which component should be larger.
- tier: 🟢 · source: betanalpha:identifying_mixture_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize mu as (mu1, delta) with mu2 = mu1 + delta and a prior on the difference; rerun"

**✗ O4** · for **overlapping components** → trying to **infer the mixture weight θ from the data** does
**NOT** work (posterior ≈ prior).
- why: when components overlap, each datum is nearly equally consistent with either, so the likelihood ratio barely varies across the data range and θ picks up almost no information regardless of N.
- conditions: separation ≪ component spread; component parameters not tightly constrained a priori.
- tier: 🟢 · source: betanalpha:identifying_mixture_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: θ posterior ≈ θ prior}
- moves: "Check whether the data span the region that informs the weakly-constrained parameters" · "Sweep the noise/SNR axis and re-inspect the likelihood surface (does ambiguity flatten and connect the modes, or sharpen them?)"

### Discrete latents: marginalize, then recover

**✓ M1** · for a mixture under **HMC/NUTS** → **marginalize the discrete assignments z analytically**
(log_sum_exp) works — it is required and strictly Rao-Blackwell-better.
- why: continuous samplers cannot move in discrete space; the marginalized likelihood is a convex combination of component densities, gradient-friendly, and provably lower-variance than sampling z.
- conditions: components share a family enabling analytic marginalization; for zero-inflation, separate the point-mass from the continuous baseline.
- tier: 🟢 · source: betanalpha:mixture_models
- efficacy: {divergences: 0 · min_ess: 1599 · ess_per_sec: 584 · rmse: 0.030 (β RMSE; selection 5/5 true positives, 0/45 false positives) · coverage: 1.00 (90% CI) · measured on the marginalized spike-and-slab (discrete inclusion integrated out via log_sum_exp over a 2-component Gaussian mixture per coefficient), sparse linear regression N=100 P=50 K=5, BlackJAX NUTS + window adaptation 4 chains × 2000 · source: experiments/RESULTS.md (BlackJAX, first-party)}
- moves: "Marginalize the discrete latent variables: sum the joint density over all admissible values of the discrete states" · "Resolve the scalar-vs-vector contract of log_mix and the loop indexing" · "Catch the dimension mismatch in the likelihood term"

**✗ M2** · for **discrete latent indices in mean-field SVI** → putting the discrete latent as a
**sampled guide site** does **NOT** work (high-variance REINFORCE gradient).
- why: a sampled discrete site has no reparameterization, so the ELBO gradient falls back to the high-variance score-function estimator; enumerate the discrete support instead (Pyro warns beyond ~25 sites) or use a Gibbs-within-HMC kernel.
- conditions: finite mixtures, clustering, stochastic-block/community, DP/CRP, HMM-like states where the labels are the quantity of interest; enumeration needs a small discrete support.
- tier: 🟡 · source: pyro:2405, pyro:464, pyro:98
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Marginalize the discrete latent variables: sum the joint density over all admissible values" · "Enumerate-and-marginalize: parametrize by function values at two well-separated anchor points, enumerate discrete modes within a range"

**✓ M3** · for a **marginalized model** → recover z **post-hoc as the data-conditioned membership
E[z | θ, y]** (not the prior-side E[z | θ]) works.
- why: marginalization removes z from the returned draws by design; recovering it is a separate step that must condition on both θ *and* the data via Bayes' rule over the same per-component densities.
- conditions: Stan generated-quantities block, or Pyro `infer_discrete(temperature=1)` for a joint draw / `temperature=0` for the MAP configuration; the compute_marginals caveat applies with upstream continuous latents.
- tier: 🟡 · source: mc-stan:22488, pyro:2555, pyro:2149, pyro:626
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Marginalize the discrete latent variables: sum the joint density over all admissible values" · "Reduce to the minimal generative model and write out both candidate predictive distributions by hand for y=1 and y=0 cases"

**✗ M4** · for **benchmarking a marginalized/enumerated sampler against a discrete-Gibbs sampler** on a
mixture → trusting the **headline efficiency number** does **NOT** work without auditing the setup.
- why: the reported ESS/sec can be handicapped by engine configuration biased against the conditional/discrete sampler and by walltime measurement contamination — anchor against theory before believing a surprising result.
- conditions: cross-sampler mixture benchmark where the marginalized route is expected to win.
- tier: ⚪ candidate (single-witness moves) · source: (move-derived, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the benchmark's engine configuration for handicaps that bias against the conditional/discrete sampler" · "Re-derive the right efficiency metric and check walltime for measurement contamination" · "Anchor the empirical result against established theory and reframe the question as 'why might this specific eval fail to show the expected benefit'"

### Zero-inflation / hurdle / structural mixtures

**✓ Z1** · for **zero-inflation over a continuous baseline** → **decompose exactly into an independent
binomial** (inflation counts) **+ baseline** (non-inflated obs) works.
- why: the inflated point has zero probability under the continuous baseline and the baseline has zero mass at the inflated point, so the two contribute to disjoint observation sets — they can be fit separately and the counts ignored when a nuisance.
- conditions: absolutely-continuous baseline; inflated value a fixed point (not parameter-dependent).
- tier: 🟢 · source: betanalpha:mixture_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Write out the two competing data-generating processes explicitly side by side, simulate both, plot them, and ask the user which one they actually believe" · "Reduce to the minimal generative model and write out both candidate predictive distributions by hand for y=1 and y=0 cases"

**✗ Z2** · for **hurdle / zero-inflated models** → reading **`fitted`-type output** (conditional mean
E[y|x]) as the prediction does **NOT** work (shows no zero spike).
- why: `fitted` returns the posterior of the conditional expectation, in which the zero-inflation has already been averaged in, so the density is smooth and looks like the model "failed to predict zeros"; the posterior-*predictive* (`predict`) reproduces the spike.
- conditions: brms/tidybayes (the hu/zi reversed-sign convention is brms-specific; the expectation-vs-predictive point is framework-general — NumPyro/PyMC deterministic-mean vs predictive).
- tier: 🟡 · source: mc-stan:16736, mc-stan:6128, mc-stan:23910
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Apply the order-of-operations rule for nonlinear summaries of posterior draws" · "Reduce to the minimal generative model and write out both candidate predictive distributions by hand for y=1 and y=0 cases"

**✓/✗ Z3** · for a **theoretical quantity observed through a measurement process** → building the
observational model as **theory ⊛ measurement, including a signal/background contamination mixture and
binning/censoring**, works; **omitting** the contamination/censoring does **NOT** work (biased
parameters that aren't the physical quantity).
- why: integrating the spectrum over each bin gives multinomial probabilities ρ_k and a λ·π(E|θ_S)+(1−λ)·π(E|θ_B) mixture separates signal from background; omit the background model and it is conflated with signal.
- conditions: non-trivial measurement response (binned counts vs continuous energies, background mixed with signal, multiple zero-inflation mechanisms); less relevant when the response is ~identity.
- tier: 🟢 · source: betanalpha:generative_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Write out the two competing data-generating processes explicitly side by side, simulate both, plot them" · "Validate correctness via simulation-based recovery, and read estimates on the correct scale"

**✓/✗ Z4** · for **marginalizing a sum of independent binomial latent counts against an observed
total** in HMC → a **Poisson/NegBin approximation works** when each success probability is small
relative to its count; it does **NOT** work when probabilities are large and counts small.
- why: the exact marginalization is a discrete convolution costing ~O(count²) per observation and dominating runtime; the Poisson approximation collapses it, but introduces dispersion error when p is large — then use the exact convolution with the log_sum_exp running-prefix speedup.
- conditions: gradient-based sampler (Stan/HMC); small p relative to count for the approximation to hold.
- tier: 🟡 · source: mc-stan:3012
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: exact convolution ~O(count²)/obs dominates runtime; approx collapses it · rmse: pending · coverage: pending}
- moves: "Diagnose computational feasibility separately from statistical correctness"

### Scale-mixture / sparsity priors (the mixture is a *prior*)

**✗ S1** · for choosing **CP vs NCP per parameter in a mixture / horseshoe prior** → using the **N_k
(observation-count) heuristic** does **NOT** work.
- why: a scale-mixture prior adds a second degree of freedom (which component dominates), governed by likelihood *location* relative to the inner scale τ₁, not by count or width — the single-scale N_k rule mispredicts.
- conditions: scale-mixture of normals (two-normal mixture, horseshoe, Laplace); τ₁ ≪ τ₂ well separated; small N_k is the heuristic's failure domain.
- tier: 🟢 · source: betanalpha:modeling_sparsity
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: K=9 demo holds N_k=1 fixed and varies location}
- moves: "Plot one or a handful of local parameters against the shared hierarchical scale parameter they depend on" · "Non-center the mixture components: introduce z ~ std_normal() and set component value = mu + sigma*z"

**✓ S2** · for a **mixture / horseshoe prior** → choose **CP/NCP per parameter by where its likelihood
concentrates** relative to τ₁ (concentrate ≤ τ₁ → NCP; in the outer plateau → CP) works.
- why: the parameterization that decouples the sampling geometry depends on which mixture component the individual likelihood selects, which is a property of its location.
- conditions: well-separated τ₁ ≪ τ₂; per-parameter (mixed across the vector); HMC.
- tier: 🟢 · source: betanalpha:modeling_sparsity
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Non-center the mixture components: introduce z ~ std_normal() and set component value = mu + sigma*z" · "Cross-check the reparameterized fit against the centered fit (and against simulated ground-truth) on multiple datasets" · "Inspect the generated Stan code to confirm the parameterization actually in use rather than guessing"

**✗ S3** · for a **two-component normal mixture prior** (outer_τ ≫ inner_τ) → reading **R̂ > 1.1 on
straddling parameters as isolated-mode trapping** (or as a geometric funnel) does **NOT** work — it is
topological rare-transition slow mixing.
- why: the traceplots show all chains *do* visit both the inner-core peak and the outer plateau, just rarely (a few transitions per 1000 iterations), so chains differ in how many crossings they happened to make — curable by longer runs, distinct from both C1 mode-trapping and a divergence-producing geometric pinch.
- conditions: outer_τ ≫ inner_τ; some parameters' likelihoods straddle both the inner core and the plateau; run length short enough that only ~3–10 crossings occur per chain.
- tier: 🟢 · source: betanalpha:modeling_sparsity
- efficacy: {divergences: 0 · min_ess: R̂ > 1.1 from rare inter-component transitions (plateau amplitude ~7–10; ~3–10 transitions/1000 iters; 4 chains) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Confirm the failure is real and characterize it: look at the pairs plot and count divergences / mean treedepth" · "Audit the ESS/R-hat estimators themselves rather than trusting the reported numbers"

### Over-parameterized weight-space symmetry

**✗ N1** · for a **Bayesian neural network** → treating the **weight posterior as a tractable HMC/NUTS
or ADVI target** does **NOT** work.
- why: hidden-unit permutation plus sign/aliasing symmetries give a combinatorial set of equivalent modes (far worse than a finite mixture's K!, compounding per layer) on top of funnel geometry, so any sampler characterizes only one mode and never the full weight posterior.
- conditions: multilayer over-parameterized nets (milder for a single linear/logistic layer); both MCMC and VI; less relevant when only point predictions or the predictive distribution are needed, or when the symmetry is finite and relabelable (then ordering resolves it).
- tier: 🟡 · source: mc-stan:3277, mc-stan:1399, pymc:8805
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Triage on whether secondary modes are scientifically real vs nuisance" · "Map the mode locations against the data geometry"

### Mixture likelihood implementation

**✗ I1** · for a **Gaussian-mixture / quadratic-form pseudo-likelihood in HMC** → treating it as a
**canned black-box procedure** does **NOT** work (numerically and inferentially fragile).
- why: the mixture pseudo-likelihood is better expressed as a hand-written target-density increment; as a canned quadratic-form procedure it is numerically and inferentially fragile under HMC.
- conditions: GMM/quadratic-form pseudo-likelihood used as a target under a gradient sampler.
- tier: ⚪ candidate (single-witness moves) · source: (move-derived, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe GMM as a hand-written pseudo-likelihood target increment, not a canned procedure" · "Flag GMM/quadratic-form pseudo-likelihood as numerically and inferentially fragile in HMC"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
mixture_models · identifying_mixture_models · modeling_sparsity · generative_modeling ·
gaussian_processes · identifiability

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pyro:N` → `https://forum.pyro.ai/t/…/N`;
`pymc:N` → `https://discourse.pymc.io/t/…/N`):
mc-stan:22488 (marginalisation users-guide) · mc-stan:3012 (sum-of-binomials) ·
mc-stan:16736 · mc-stan:6128 · mc-stan:23910 (hurdle fitted-vs-predict) ·
mc-stan:3277 · mc-stan:1399 · pymc:8805 (Bayesian neural networks) ·
pyro:2555 · pyro:2149 · pyro:626 (recover discrete latents) ·
pyro:2405 · pyro:464 · pyro:98 (discrete latents in SVI / enumeration)
