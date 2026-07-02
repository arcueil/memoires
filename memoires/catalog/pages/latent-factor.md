# Latent-factor models (factor analysis / SEM / IRT / PPCA / latent-Gaussian)

## Claims (the *why* — mid-level, ~3–5)

*Four mid-level principles synthesized from 5 granular claims. Tier is the best-supported
of the granular claims each subsumes. Source short-ids resolve to URLs at the bottom.*

### C2 · When an observable is a many-to-one (additive) combination of latent components, the decomposition is generically non-identified — only the aggregate is informed 🟡
*[→ full entry](../claims/latent-factor/C2.md)*

**Statement.** If an observed quantity is the sum (or other many-to-one combination) of two or more
latent additive components that each carry their own free parameters — e.g. observed response time
rt = rt₁ + rt₂ in a non-compensatory IRT / response-time model — the data inform only the sum, so
the component split is non-identified.

**Nuance.** In the noise-free limit r₁+r₂=r_t is one equation in two unknowns — an entire ray of
(r₁,r₂) pairs is observationally equivalent; with noise this becomes a long curved posterior ridge
with near-perfect parameter correlations. Its fingerprint is tiny n_eff (often <10), low E-BFMI,
divergences, and max-treedepth saturation. It is resolved *only* by structure that ties the
components together — shared parameters across items/conditions, an observed split of the sum, or an
anchoring constraint — not by tuning.

**Conditions.** Latent/measurement models where an observable is additive (or otherwise many-to-one)
in multiple unobserved components with their own free parameters; especially acute when the
components are exchangeable in form (same family, similar scales) with no cross-item shared
structure, observed split, or anchor.

**Tier.** 🟡 supported (subsumes `forum-c204` additive-decomposition-generically-non-identified).

**Sources.** mc-stan:16945

---

### C3 · For correlated multi-category / compositional data, put the dependence in the model via correlated latent rates — independent per-category likelihoods discard the structural dependence 🟡
*[→ full entry](../claims/latent-factor/C3.md)*

**Statement.** For vectors of counts/proportions across K>2 mutually-dependent categories, model the
categories *jointly* — a multivariate-normal prior on the latent *log*-rates with an LKJ/Cholesky
covariance feeding per-category likelihoods, or a Dirichlet-multinomial — rather than fitting
independent per-category likelihoods.

**Nuance.** Separate per-category binomials throw away the structural negative correlation of a
composition: a share can only rise if others fall (zero-sum), and separately-estimated binomials
cannot see this (the Andorra/vote example). The latent rate must live on the *log* (not natural/
positive) scale, and needs a reference-category constraint for identifiability; a reduced-rank
covariance is needed when K is large. The Dirichlet-multinomial route benefits from marginalizing θ
under HMC to avoid the non-centred Dirichlet funnel; the DM payoff over a single-precision Dirichlet
appears specifically when categories have heterogeneous overdispersion or non-trivial inter-category
correlation.

**Conditions.** Observations are vectors of counts/proportions across K>2 dependent categories
(multi-party polling, RNA-seq gene counts, histogram/bin counts); gradient-based samplers (HMC/NUTS).

**Tier.** 🟡 supported (subsumes `forum-c41` model-correlated-categories-through-joint-latent-rates).

**Sources.** pymc:10872 · pymc:14766 · mc-stan:1843

---

### C4 · For latent-Gaussian models, marginalizing the latent field strictly dominates non-centering — it removes the funnel rather than reshaping it 🟢
*[→ full entry](../claims/latent-factor/C4.md)*

**Statement.** The joint posterior p(u,θ|y) of a latent-Gaussian model almost always has funnel
geometry — the conditional variance of u given θ shrinks as θ varies — which forces aggressive
non-centered reparameterization (NCP) for joint HMC/NUTS; for the conjugate Gaussian latent class,
analytic marginalization of u is *strictly stronger* than NCP: it removes the funnel from the
sampler's state space entirely instead of merely reshaping it.

**Nuance.** This is *analytic conjugate-Gaussian* marginalization of a continuous latent field — distinct from the discrete-mixture marginalization (log-sum-exp over assignments) of the mixture page; the two share only the word. Marginalization and NCP are not equivalent even when both are available — NCP reshapes the
funnel, marginalization removes it. Conjugacy makes full marginalization exact and cheap (the cost is
a sparse linear solve at each θ), making NCP an unnecessary fallback for this class. For non-Gaussian
likelihoods marginalization is only approximate and NCP may be competitive or necessary; and after
marginalizing u, if θ itself has strong posterior correlation or heavy tails, HMC tuning on the
θ-only posterior may still be required.

**Conditions.** The specific latent-Gaussian class y|u,θ ~ N(Au, σ²W), u|θ ~ N(0, Q(θ)⁻¹); the
dominance of marginalization over NCP holds whenever conjugacy is exact.

**Tier.** 🟢 established (subsumes `marginalization-strictly-dominates-ncp-for-latent-gaussian`).

**Sources.** dansblog:linear-mixed-effects

---

## Practical — what works / what doesn't (comprehensive, bidirectional)

*20 recs (9 ✓ / 10 ✗, plus 1 bidirectional). `efficacy` is the benchmark-shaped slot
`{divergences, min_ess, ess_per_sec, rmse, coverage}` — filled ONLY from a metric present in the
input (this class carries almost no benchmark numbers, so most are `pending`); qualitative signatures
from the input are recorded where they map to a slot. Attached `moves` are the diagnostic "how",
matched by relevance. The move tail is single-witness (⚪) unless noted, kept as the searchable tail.*

### Identifiability from symmetry (sign / rotation / label-switching)

**✗ A1** · for a **factor / SEM / IRT / PPCA / MDS** model with sign/rotation/permutation invariance → *[→ entry](../recs/latent-factor/A1.md)*
**unconstrained sampling** does **NOT** work (genuinely multimodal).
- why: the likelihood (Cov(Y)=ΛΛᵀ+Σ) is invariant to sign-flips, rotations, and component
  relabeling → the true posterior has many equivalent modes; chains land in conflicting orientations
  (R-hat in the 20s–30s). This is structural non-identifiability, not a mixing-efficiency problem.
- conditions: any latent model with sign/label/rotation invariance; worst with 2+ factors or many indicators.
- tier: 🟡 · source: mc-stan:1483, pymc:1324
- efficacy: {divergences: pending · min_ess: pending (R-hat 20s–30s reported, not an efficacy slot) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose tiny min-Neff as multimodality via per-element across-chain marginal posteriors, and classify the modes" · "Disambiguate which model produced the failing diagnostics before interpreting them" · "Interpret deep-tree saturation as a correlation / non-identifiability signature, not a tuning issue"

**✗ A2** · for a factor model → constraining **ONE loading's sign positive** does **NOT** work when *[→ entry](../recs/latent-factor/A2.md)*
that **anchor loading is weak** (the worst option).
- why: the constraint is satisfiable at ~0 with no likelihood penalty, so local modes where the
  anchor is effectively zero survive and the other loadings stay sign-unidentified → oscillation
  among 3+ solutions.
- conditions: weak/near-zero anchor loading; multilevel models where loadings can flip sign after adding random effects.
- tier: 🟡 · source: mc-stan:1483
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Stress-test the no-divergence claim by REPLACING the parameter constraint with an explicit inv_logit + raw real parameter (same model, different transform)" · "Read the constraint trick as diagnostic, not a fix; reason about why a constraint changes initialization" · "Discriminate 'concentration from a sharp-but-PROPER prior' vs 'concentration from FP-masked impropriety'"

**✓ A3** · for a factor model → **orienting all loadings positive** (per column) works better than a *[→ entry](../recs/latent-factor/A3.md)*
single-anchor constraint.
- why: constrains the sign of every column rather than betting the whole identification on one
  possibly-weak anchor.
- conditions: needs cross-loadings to be absent or handled separately; trickier in multilevel models.
- tier: 🟡 · source: mc-stan:1483
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Rank the modes by posterior density and check whether some are spurious, by adding lp__ to the plot" · "Reconstruct the mechanism: compare the parameter values across modes and build a causal story for why separate basins exist"

**✓ A4** · for **PPCA / factor analysis** where a **sparse loading structure is plausible** → a *[→ entry](../recs/latent-factor/A4.md)*
**sparse ("witch-hat") prior** on the loadings works to break the rotational symmetry.
- why: a sparse-loading prior privileges the axis-aligned solution, removing the rotational
  degeneracy the likelihood alone leaves open.
- conditions: sparse loading structure genuinely plausible (most loadings near zero); fails when
  factors are weakly contrasted.
- tier: 🟡 · source: pymc:1324
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Look at the joint posterior of only the real parameters with a pairs plot, dropping the high-dimensional latent/control clutter" · "Constrain the offending tails — tighten the relevant priors, and/or keep the parameter in log/unconstrained space throughout"

**✗ A5** · for a latent-variable model with **weakly-contrasted factors** → **post-hoc relabeling / *[→ entry](../recs/latent-factor/A5.md)*
re-orientation** does **NOT** work (the modes overlap into "one big mush").
- why: when factors are weakly contrasted the equivalent modes overlap rather than separate, so no
  relabeling can recover identifiability — the non-identification is not merely a labeling artifact.
- conditions: weak factor contrast; overlapping posterior modes.
- tier: 🟡 · source: pymc:1324
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Rank the modes by posterior density and check whether some are spurious, by adding lp__ to the plot" · "Diagnose tiny min-Neff as multimodality via per-element across-chain marginal posteriors, and classify the modes"

### Additive / many-to-one latent decomposition

**✗ B1** · for a model where an **observable = sum of latent components**, each with free parameters *[→ entry](../recs/latent-factor/B1.md)*
(rt = rt₁ + rt₂) → the **naive decomposition** does **NOT** work (non-identified ridge).
- why: the data inform only the sum → a ray/curved ridge of observationally-equivalent component
  pairs with near-perfect parameter correlations; the sampler cannot resolve it.
- conditions: additive/many-to-one latent components, exchangeable in form (same family, similar
  scales), no cross-item shared structure or observed split.
- tier: 🟡 · source: mc-stan:16945
- efficacy: {divergences: present (+ max-treedepth saturation) · min_ess: tiny n_eff, often <10 · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Calibrate severity and consult the canonical divergence reference before tuning" · "Reframe slowness as a divergence/geometry problem and reduce to a minimal reproducer" · "Interpret deep-tree saturation as a correlation / non-identifiability signature, not a tuning issue"

**✓ B2** · for such an **additive-component** model → adding **structure that ties the components *[→ entry](../recs/latent-factor/B2.md)*
together** (shared parameters across items/conditions, an observed split of the sum, or an anchoring
constraint) works.
- why: cross-component structure supplies the extra equation the aggregate likelihood lacks, pinning
  the split to a unique solution.
- conditions: some shared/observed/anchoring structure must be available and defensible.
- tier: 🟡 · source: mc-stan:16945
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Isolate by aggressively simplifying the model and inspecting per-parameter diagnostics" · "Incrementally add complexity back, one block at a time, watching diagnostics at each step" · "Locate the coupling by combining low-ESS triangulation with model-structure-guided targeted pairs plots"

### Correlated multi-category / compositional data

**✗ C1** · for **correlated multi-category count/compositional** data → **independent per-category *[→ entry](../recs/latent-factor/C1.md)*
likelihoods** (separate binomials) do **NOT** work.
- why: they throw away the structural (zero-sum) negative correlation between categories — separate
  binomials cannot see that one share only rises if others fall.
- conditions: K>2 mutually-dependent categories; payoff of a joint model is largest under
  heterogeneous overdispersion / non-trivial inter-category correlation.
- tier: 🟡 · source: pymc:10872, pymc:14766
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Use a multivariate / all-parameter view to surface the joint structure and rank candidate parameters" · "Count degrees of freedom against the likelihood and test whether a variance term can be dropped or shared"

**✓ C2** · for correlated multi-category data → a **joint latent-rate model** — MvNormal on the *log* *[→ entry](../recs/latent-factor/C2.md)*
rates (LKJ/Cholesky covariance) feeding per-category likelihoods, or a **Dirichlet-multinomial** —
works.
- why: the covariance carries the inter-category dependence the independent model discards.
- conditions: log-scale rates + a reference-category constraint for identifiability; reduced-rank covariance when K is large.
- tier: 🟡 · source: pymc:10872, pymc:14766, mc-stan:1843
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify whether the distribution to be reparameterized is a likelihood (data) or a hierarchical prior (parameter)" · "Constrain the offending tails — keep the parameter in log/unconstrained space throughout" · "Raise LKJ eta (lkj(1)->lkj(20)) and watch divergence count and whether key parameters move"

**✗ C3** · for the joint latent-rate model → putting the **MvNormal on the natural (positive) rate *[→ entry](../recs/latent-factor/C3.md)*
scale** does **NOT** work.
- why: the latent rate misbehaves on the positive scale; the MvNormal must go on the *log* rates.
- conditions: positive-support rates; gradient-based sampler.
- tier: 🟡 · source: pymc:10872
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Constrain the offending tails — and/or keep the parameter in log/unconstrained space throughout" · "Disambiguate whether the funnel is in the sampled parameters or in the reconstructed transformed parameters"

**✓ C4** · for a **Dirichlet-multinomial** under HMC → **marginalizing θ** (the Dirichlet mixing *[→ entry](../recs/latent-factor/C4.md)*
proportions) works — it avoids the non-centred Dirichlet funnel.
- why: marginalizing the Dirichlet component removes the non-centred Dirichlet funnel that
  gradient-based samplers otherwise hit.
- conditions: Dirichlet-multinomial construction; HMC/NUTS.
- tier: 🟡 · source: mc-stan:1843
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify whether the distribution to be reparameterized is a likelihood (data) or a hierarchical prior (parameter)" · "Disambiguate whether the funnel is in the sampled parameters or in the reconstructed transformed parameters" · "Attempt reparameterization of the offending tightly-constrained coordinates"

### Latent-Gaussian geometry (marginalize vs non-center)

**✗ D1** · for a **latent-Gaussian** model → **joint HMC/NUTS on (u,θ)** without reparameterization *[→ entry](../recs/latent-factor/D1.md)*
does **NOT** work (funnel geometry).
- why: the conditional variance of u given θ shrinks as θ varies → a funnel the joint sampler cannot
  resolve without aggressive reparameterization.
- conditions: y|u,θ ~ N(Au, σ²W), u|θ ~ N(0, Q(θ)⁻¹); scale/hyperparameter θ drives the neck.
- tier: 🟢 · source: dansblog:linear-mixed-effects
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Plot one or a handful of local parameters against the shared hierarchical scale parameter they depend on" · "Diagnose the funnel orientation between an individual z-score and the population log-scale" · "Probe local log-convexity by computing the condition number of the inverse Hessian of the log density at posterior draws"

**✓ D2** · for a **conjugate latent-Gaussian** model → **analytic marginalization of u** works and is *[→ entry](../recs/latent-factor/D2.md)*
**strictly stronger** than NCP.
- why: conjugacy makes marginalization exact and cheap (a sparse linear solve at each θ), and it
  *removes* the funnel from the sampler's state space rather than reshaping it.
- conditions: exact conjugacy (Gaussian likelihood); leaves a θ-only posterior to sample.
- tier: 🟢 · source: dansblog:linear-mixed-effects
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Profile and decompose the cost of one marginal-density evaluate+differentiate call; compare against a known-fast reference implementation" · "Cross-check the differentiated marginal against independent references and seek a hard-geometry test case" · "Compare candidate inner convergence criteria by cost-per-step and by downstream effect on the outer marginal/gradient"

**✓/✗ D3** · for a latent-Gaussian model → **NCP** works (and is necessary) when the likelihood is *[→ entry](../recs/latent-factor/D3.md)*
**non-Gaussian** so marginalization is only approximate; it does **NOT** match marginalization for the
**conjugate Gaussian** class (an unnecessary fallback that reshapes, rather than removes, the funnel).
- why: NCP and marginalization are not equivalent — NCP reshapes the funnel while marginalization
  removes it; with exact conjugacy the marginal route dominates, but without it NCP may be the only
  option.
- conditions: non-Gaussian likelihood → marginalization approximate → NCP competitive/necessary; conjugate Gaussian → prefer marginalization.
- tier: 🟢 · source: dansblog:linear-mixed-effects
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Treat the NCP regression as evidence, not noise — check whether NCP is even the right regime and whether the code is correct" · "Flip the global parameterization and compare which warnings appear" · "Classify whether the distribution to be reparameterized is a likelihood (data) or a hierarchical prior (parameter)"

**✗ D4** · for a marginalized latent-Gaussian model → assuming **marginalization ends the tuning** does *[→ entry](../recs/latent-factor/D4.md)*
**NOT** work when θ itself is badly conditioned.
- why: after marginalizing u, if θ has strong posterior correlation or heavy tails, HMC tuning on the
  θ-only posterior is still required — the funnel is gone but θ's own geometry can remain hard.
- conditions: θ with strong posterior correlation or heavy tails after marginalization.
- tier: 🟢 · source: dansblog:linear-mixed-effects
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reason about dense-metric reach versus the actual geometry" · "Reason about what the mass-matrix adaptation can structurally represent" · "Constrain the offending tails — tighten the relevant priors, and/or keep the parameter in log/unconstrained space throughout"

### Cross-cutting diagnostics (searchable move tail)

**✓ E1** · for a suspected **multimodal / non-identified** latent-factor posterior → **diagnosing tiny *[→ entry](../recs/latent-factor/E1.md)*
min-Neff as multimodality** (per-element across-chain marginals, then ranking modes) works to
classify the pathology.
- why: near-zero across-chain agreement with within-chain stability fingerprints separate basins;
  adding lp__ separates spurious from genuine modes.
- conditions: multiple chains; per-parameter/per-element inspection.
- tier: ⚪ candidate (move-derived "how") · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: tiny min-Neff = multimodality signature · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose tiny min-Neff as multimodality via per-element across-chain marginal posteriors, and classify the modes" · "Rank the modes by posterior density and check whether some are spurious, by adding lp__ to the plot" · "Reconstruct the mechanism: compare the parameter values across modes and build a causal story"

**✓ E2** · for a **slow / deep-tree-saturating** latent-factor fit → treating slowness as a *[→ entry](../recs/latent-factor/E2.md)*
**geometry/non-identifiability signal** and **reducing to a minimal reproducer** (then adding
complexity back) works to localize it.
- why: the folk theorem — computational trouble signals a model problem; a minimal reproducer plus
  incremental re-expansion localizes the offending block.
- conditions: general; the first (n_threads=2) move corroborates before tuning.
- tier: ⚪ candidate (move-derived; the lead move has n_threads=2) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe slowness as a divergence/geometry problem and reduce to a minimal reproducer" · "Isolate by aggressively simplifying the model and inspecting per-parameter diagnostics" · "Incrementally add complexity back, one block at a time, watching diagnostics at each step"

**✓ E3** · for **NA R-hat / flagged-ESS** on constant or generated quantities → recognizing it as a *[→ entry](../recs/latent-factor/E3.md)*
**false decoupling** (constant/generated-quantities artifact) and recomputing on the real parameters
works.
- why: constant columns and generated-quantities RNG produce NA/degenerate R-hat that is not a
  sampling failure; tracing each flagged quantity to its definition and recomputing on the real
  parameters clears the false alarm.
- conditions: fit summary with NA R-hat on quantities that are constant or RNG-generated.
- tier: ⚪ candidate (move-derived "how") · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Filter the fit summary to the parameters with NA R-hat / flagged ESS and see what kind of quantity they are" · "Trace each flagged quantity back to its definition in the Stan program" · "Compute R-hat/ESS directly on the real parameters (improved rank-normalized monitor)"

**✗ E4** · for a latent model with **~one random effect per observation** → **PSIS-LOO** does **NOT** *[→ entry](../recs/latent-factor/E4.md)*
work reliably (inflated khat; p_loo ≈ p).
- why: each left-out point's own latent effect predicts it almost regardless of the covariate → the
  importance sampling degenerates; the p_loo-vs-p / p-vs-n decision tree flags it.
- conditions: per-observation latents; unreliable importance weights.
- tier: ⚪ candidate (move-derived "how") · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compute p_loo and compare it against the actual number of parameters p and the sample size n" · "Check the number of effective posterior draws (ESS) and whether khat is inflated by Monte Carlo variability" · "Replace the failed importance-sampling step with exact computation, and/or reduce posterior flexibility"

**✗ E5** · for a **strongly-correlated latent posterior** where NUTS saturates max_treedepth → trusting *[→ entry](../recs/latent-factor/E5.md)*
the **default U-turn termination** does **NOT** always work (it can miss wraparound turns).
- why: on strongly-correlated geometry the endpoint U-turn check can fail to see a turn across merged
  subtrees, causing deep-treedepth resonance; a modified U-turn/rho check is under investigation.
- conditions: highly-correlated latent posterior; deep-treedepth saturation not explained by tuning.
- tier: ⚪ candidate (move-derived "how"; technique-development, not settled) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Build a geometric/analytic model of how NUTS concatenates subtrees and ask when the endpoint U-turn check can fail to see a turn" · "Add U-turn checks that span the gap between the two merged subtrees, enumerate candidate variants by permissiveness, and pick one that catches wraparound" · "Compare rho-estimator definitions across implementations and check whether a shortened rho both fixes the resonance AND preserves reversibility"

---

## Source key

**Dan Simpson blog** (`dansblog:<id>` → `https://dansblog.netlify.app/posts/…`):
linear-mixed-effects (`2022-03-22-a-linear-mixed-effects-model`).

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pymc:N` → `https://discourse.pymc.io/t/…/N`):
mc-stan:16945 (non-compensatory IRT model) · mc-stan:1483 (latent factor loadings) ·
mc-stan:1843 (non-centred parameterisation for the Dirichlet distribution) ·
pymc:10872 (dependent histogram count data) · pymc:14766 (US presidential election w/ polling) ·
pymc:1324 (unique solution for probabilistic PCA).
