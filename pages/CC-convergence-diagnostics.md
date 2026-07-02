# Cross-cutting: Convergence & Monte-Carlo reliability diagnostics

*A CROSS-CUTTING computation area, not a model class. The claims are mid-level principles about
**when a diagnostic can be trusted, what it is blind to, and how "convergence" alarms should be
read**; the practical layer is indexed by DIAGNOSTIC SITUATION / SYMPTOM (not by model), so it is
searchable by what you are actually seeing on the console.*

## Claims (the *why* — mid-level)

*Seven mid-level principles synthesized from 45 granular claims. Tier is the best-supported of the
granular claims each subsumes. Source short-ids resolve to URLs in the Source key at the bottom.
Glyphs: 🟢 established · 🟡 supported · ⚪ candidate / single-witness.*

### C1 · Convergence is not stationarity — a trustworthy error bar needs geometric ergodicity, expectand integrability, *and* equilibration 🟢

**Statement.** MCMC estimators are only *asymptotically* consistent; a valid finite-sample error bar
(a usable MCMC-SE) requires a Markov-chain CLT for the *specific* expectand, which stationarity /
irreducibility / aperiodicity do **not** guarantee — it additionally needs geometric ergodicity and
sufficient expectand integrability (E[f⁴] finite), and even then the chain must have equilibrated.

**Nuance.** Stationarity π(q)=∫π(q′)T(q|q′)dq′ is necessary but not sufficient: a
stationary-compatible transition that explores the typical set inefficiently yields large error, and
finite-sample quality is set by the interaction of the transition with the typical-set geometry, not
by the invariance condition. The CLT-based error bar demands *preasymptotic* consistency (finite-N
sequences behave like an N-fold product draw) — a strictly stronger property than asymptotic
consistency, and one MCMC does *not* satisfy in general, which is why MCMC error quantification is
delicate. Three failure modes each break the CLT independently: a recurrent but
non-geometrically-ergodic chain; undefined expectand moments; and unequilibrated warmup. The
heavy-tail case is the trap: a non-geometrically-ergodic chain can pass split-R̂ and k̂ at N≈10⁴ yet
reveal CLT failure only at N≈10⁶, because rare tail excursions that determine the stationary
distribution go unsampled for millions of iterations. Warmup is only valid if the *full* chain
(including the discarded states) would itself have satisfied the CLT — warmup never rescues a chain
that was never converging.

**Conditions.** Any MCMC estimate reported with an error bar; sharpest for heavy-tailed / weakly
mean-reverting targets and unbounded expectands; ESS/iteration ≪ 10⁻³ makes even a technically-valid
CLT practically useless.

**Tier.** 🟢 established (subsumes `mcmc-clt-conditions-exceed-stationarity`,
`mcmc-asymptotic-only-finite-sample-quality-depends-on-typical-set-expl`,
`preasymptotic-vs-asymptotic-consistency`, `mc-validity-requires-finite-mean-and-variance`,
`warmup-validity-requires-preexisting-clt`, `slow-mixing-heavy-tail-hides-failure-until-long-chains`).

**Sources.** betanalpha:markov_chain_monte_carlo_basics · betanalpha:markov_chain_monte_carlo ·
betanalpha:sampling · betanalpha:probabilistic_computation

---

### C2 · Diagnostics are necessary-not-sufficient and structurally blind to what the chain never sampled 🟢

**Statement.** Every generic diagnostic (trace plots, R̂, split-R̂, Geweke, ESS, divergences,
E-BFMI, tree-depth) is a *necessary* condition for equilibrium, never a *sufficient* one: a chain
stuck in one mode, confined by a reducibility barrier, or consistently wrong in the same way across
all chains reproduces every signature of success. And the whole diagnostic suite certifies *sampler
faithfulness*, not *model adequacy* — orthogonal properties.

**Nuance.** The epistemic limitation is irreducible: diagnostics are limited by the exploration of
the very chain that is pathological, so they are weakest exactly when needed most. Metastability is
the starkest case — local equilibrium within one mode is statistically indistinguishable from global
equilibrium (smooth traces, R̂≈1, reasonable ESS). R̂ has a matching blind spot: when all chains
start in the same basin, or all run long enough to become identically pathological, between-chain
variance is low and R̂→1 despite non-equilibrium. A *reducible* transition is worse still — it admits
multiple mutually-incompatible but internally-consistent stationary distributions, and split-R̂ and
k̂ are both silent whenever every realized chain lands in the same partition cell (Laplace + sign
barrier: split-R̂<1.1, all k̂ pass, yet E[Id]=−1.011±0.067 vs a true 0). On the model side, all
diagnostics can pass simultaneously for a demonstrably misspecified model when the misfit is absorbed
by an unconstrained nuisance parameter, lives in the functional form rather than the geometry, or is
a confounder that keeps the conditional model locally adequate.

**Conditions.** Single-chain or same-basin initialization amplifies every case; bespoke HMC
diagnostics (divergences) add partial signal but do not resolve multimodality; the model-adequacy gap
holds regardless of how clean the sampler diagnostics are.

**Tier.** 🟢 established (subsumes `mcmc-diagnostics-necessary-not-sufficient-metastability-masquerade`,
`rhat-blind-spot-consistently-pathological-chains`,
`reducible-transition-multiple-stationary-distributions-silent-diagnost`,
`mcmc-diagnostics-blind-to-model-misspecification`,
`casestudy-rhat-and-efmi-silent-on-label-switching`).

**Sources.** betanalpha:markov_chain_monte_carlo · betanalpha:markov_chain_monte_carlo_basics ·
betanalpha:mixture_models · betanalpha:falling · betanalpha:taylor_models ·
betanalpha:variate_covariate_modeling

---

### C3 · Multiple overdispersed chains are the structural guard — "burn-in / discard the bad chains" is actively harmful 🟢

**Statement.** Because the blind spots of C2 close only when chains disagree, running *multiple*
chains from genuinely *overdispersed* initializations is mandatory, not optional; and the industrial
"burn-in" analogy — discard the chains that misbehaved, keep the survivors — is actively harmful,
because one pathological chain invalidates the *entire* ensemble and discarding it destroys the very
disagreement the diagnostics rely on.

**Nuance.** MCMC equilibrium requires *all* chains to explore the stationary typical set; an
inconsistency in one implies inconsistency of the whole ensemble, not a localized failure. Between-
chain split-R̂ is the only reliable signal for label-switching / metastability (values of 50+
observed) precisely because per-chain n_eff can look completely legitimate when a chain has drawn all
its samples from one mode. For *detecting* metastability under a fixed budget, overdispersed chains
beat one long chain by a large factor (≈40× in a bimodal example: 4 chains × 5000 gave R̂=4.18,
n_eff=2 immediately, vs 1 chain × 200000 to see any signal) — but the asymmetry reverses once R̂≈1 is
confirmed, after which *longer* chains, not more chains, are the efficient path to ESS. Overdispersion
must be genuine (structurally different starts), not just different seeds from the same distribution.

**Conditions.** Any ensemble MCMC workflow; the multi-chain guard is the *only* structural defense
against reducibility/metastability false-cleans; the 40× figure is example-specific (depends on mode
separation, barrier height, dimension) and must not be confused with a slow chain caused by infra
(node contention, install hangs) which shows no R̂ signal.

**Tier.** 🟢 established (subsumes `burn-in-framing-is-actively-harmful`,
`casestudy-multiple-chains-are-mandatory-for-mixture-models`; plus candidate
`multiple-chains-overdispersed-optimal-for-metastability-detection` ⚪ and supported
`forum-c143` adaptive-warmup).

**Sources.** betanalpha:markov_chain_monte_carlo · betanalpha:identifying_mixture_models ·
mc-stan:9935 · mc-stan:12039 · mc-stan:12912

---

### C4 · Two orthogonal axes — mixing (R̂) and tail-integrability (k̂) — and the expectand decides what is estimable at all 🟢

**Statement.** R̂ and k̂ are sensitive to *orthogonal* failure modes and both are required: split-R̂
catches mixing failure (reducibility, metastability) while k̂ catches integrability failure (heavy
tails of the pushforward f∗π); neither alone suffices. And whether a quantity is Monte-Carlo estimable
at all is a property of the *expectand*, not the chain — bounded functionals are always estimable,
some quantities (densities) are not MC-estimable in principle, and rare events are estimable only at
explosive cost.

**Nuance.** k̂'s meaning is set by *which ratio* it is fitted to — conflating regimes is the core
error: (A) fitted to tail samples of an expectand f(x) it diagnoses moment existence (k̂>0.5 →
infinite variance, ≈0.7 → undefined mean; for Cauchy/Student-t with ν≤2 this is a mathematical
certainty, not an actionable warning); (B) PSIS-LOO predictive uses higher thresholds (0.5, 0.7); (C)
a VI/Laplace/Pathfinder proposal's importance weights inflate k̂ with dimension. Because bounded
indicators have all finite moments, they are always estimable even under a Cauchy target
(E[Id]=0.199±0.468 fails all four chains' k̂, but E[I[−1,1]]=0.502 passes everything) — so histogram
reconstruction via indicators is the robust route. A probability *density*, by contrast, is the
derivative of an expectation (a limit as bin-width→0), not an expectation, so it cannot be MC-
estimated from a finite sample: KDE is an inference step that imposes a kernel family, and fixed-bin
histograms are the genuine MC primitive. Rare-event probabilities cost N > (1−p)/(α²p) samples
(p=0.01, α=0.05 → 39,600) and give a paradoxical *zero* error estimate when no samples land in the
interval.

**Conditions.** k̂'s 0.25 threshold is calibrated for MCMC-SE integrability (E[f⁴] finite); indicators
with two distinct values return k̂=0 by construction (degenerate, not a certificate); density requests
on continuous 1-D output spaces; rare-event bounds assume the indicator CLT is valid (p not too close
to 0/1).

**Tier.** 🟢 established (subsumes `khat-and-rhat-detect-orthogonal-failure-modes`,
`khat-encodes-moment-existence-not-sampler-quality`,
`indicator-functions-always-mcmc-estimable-with-heavy-tails`, `kde-is-inference-not-mc-estimation`,
`rare-event-mc-cost`).

**Sources.** betanalpha:markov_chain_monte_carlo_basics · betanalpha:sampling · mc-stan:34064 ·
mc-stan:39374

---

### C5 · ESS is a property of the *function*, and its estimators fail exactly when the sampler struggles most — thinning never buys ESS 🟢

**Statement.** Effective sample size is a property of a particular expectand evaluated on the chain,
not of the chain itself (the same chain can have high ESS for one function and catastrophically low
ESS for another), and the standard ESS/n_eff estimators are least trustworthy precisely in the
struggling regime — they systematically *overestimate*. Thinning a well-mixing chain never improves
ESS-per-compute.

**Nuance.** ESS[f]=N/(1+2∑ρₗ[f]) depends entirely on the output sequence's autocorrelations, so a
function isolating a strongly-correlated direction inherits that correlation. Two estimator failures
compound: (1) *ringing* — under strong positive autocorrelation the Geyer pair-sum cutoff fires too
early (spurious negative pair sums), excluding large long-lag autocorrelations, so trust breaks down
below λ̂=ESŜ/N < 1/10000; (2) *sub-threshold bias* — below 0.001 effective samples per transition the
classical integrated-autocorrelation-time estimator is itself biased downward (the finite chain misses the long-lag tail, so n_eff is correspondingly overestimated). Negative autocorrelation
(antithetic chains) can push ESS>N — genuine super-efficiency (ESS=7600 from N=3800 for the identity
function) — but it is expectand-specific, vanishing for symmetric expectands (ESS=3662<N for the
square) and demanding regularization to avoid drastic overestimates. Some inefficiency is
*irreducible*: RWM ESS/iteration decays as O(D⁻¹) even at the optimal scale 2.4/√D (accept ≈0.234),
from ≈0.22 at D=1 to ≈0.03 at D=10 — a limit of local random-walk exploration, not a tuning failure.
Thinning costs *s*× compute for the same stored count, so ESS-per-compute can only stay flat or drop
(stride-1 ESS=1247 vs stride-2 ESS=1130).

**Conditions.** Holds whenever the target has heterogeneous correlation structure (all non-trivial
posteriors); the ringing/threshold failures are specific to classical Geyer/IAT estimators (modern
rank-normalized ESS differs); thinning's only legitimate use is storage reduction.

**Tier.** 🟢 established (subsumes `ess-is-function-specific`, `ess-estimator-overestimates-under-ringing`,
`negative-autocorrelation-ess-super-efficient-but-fragile`, `rwm-dimensional-scaling-irreducible`,
`thinning-never-improves-ess-per-compute`; plus supported `neff-estimator-bias-below-threshold`,
`forum-c397` run-until-ESS).

**Sources.** betanalpha:markov_chain_monte_carlo · betanalpha:markov_chain_monte_carlo_basics ·
betanalpha:pystan_workflow · mc-stan:1824 · mc-stan:495

---

### C6 · "Convergence" alarms can be diagnostic-plumbing artifacts, not just non-convergence — read the per-parameter table, and build gates that can't silently pass 🟢

**Statement.** R̂/n_eff/ESS alarms are not always non-convergence — several common ones are arithmetic
or plumbing artifacts, so an alarm is a prompt to look, not a verdict: a zero-variance saved quantity yields 0/0 → NaN R̂/n_eff; a transient warmup
exception is numerical underflow; run-to-run posterior drift can be unseeded *data*, not the sampler;
and even a genuinely-elevated R̂ can be *topological* slow mixing rather than trapped modes. The
correct reflex is to read the per-parameter table, not the collapsed top-line warning — and, when
diagnostics are automated into PASS/FAIL gates, to check the gate can't silently pass a bad draw.

**Nuance.** R̂ and n_eff are ratios of a quantity's between/within-chain variance, so any *constant*
saved alongside sampled parameters (fixed boundary state; S(0)=1 in a survival display grid; padding
like 1e-9; generated-quantity placeholders) produces a NaN false positive while the sampler runs
perfectly — exclude such deterministic quantities from automated checks. A "largest R-hat is NA,
chains have not mixed" top-line warning frequently traces to exactly one such zero-variance entry.
Stan's "multiplier is 0, but must be > 0!" (affine offset-multiplier scale underflow) appearing *only*
in early warmup is transient, not a defect. A conjugate Beta-Bernoulli giving a different posterior
mean every run is almost always regenerated *data* under an unseeded RNG (the conjugate posterior
Beta(α+#tails, β+#heads) is exact), not MCMC non-determinism. The subtle real case: a two-component
mixture prior (inner_τ≪outer_τ) drives R̂>1.1 for parameters whose likelihoods straddle both
components — but the trace shows all chains *do* visit both regions; it is rare (3–10 inter-component
transitions per 1000 iters) successful mixing, i.e. topological slow mixing, distinct from trapped-mode
multimodality. Automated gates have their own failure: collapsing a reference array across parameter
dimensions before a std_ratio makes it converge to 1−1/√d regardless of draw quality — a silent pass
for any output.

**Conditions.** Constant-quantity NaNs generalize to any derived quantity constant across draws;
underflow warnings apply to affine/lower-bound scale reparameterizations in early adaptation;
gate-construction pitfalls apply when building benchmark/self-consistency checks (dimension-collapsed
metrics, per-site vs per-scalar-dimension flattening).

**Tier.** 🟢 established (subsumes `nan-diagnostic-on-zero-variance-constant`,
`survival-s0-equals-1-nan-diagnostic-false-positive`,
`mixture-prior-rhat-failure-is-topological-not-geometric`; plus supported `forum-c241` NA-top-line,
`forum-c154` warmup-underflow, `forum-c371` unseeded-data, `worklog-std-ratio-dimension-collapse`,
`merged-51` max-z-gate, `worklog-vi-iid-draw-max-z`).

**Sources.** betanalpha:brownian_bridge · betanalpha:survival_modeling · betanalpha:modeling_sparsity ·
mc-stan:14100 · mc-stan:15988 · mc-stan:18883 · pymc:16339 · internal-experiments

---

### C7 · Approximation-based inference (IS, VI, perturbed MCMC) carries its own reliability diagnostics 🟢

**Statement.** When the estimator is not exact MCMC, the reliability question changes shape: importance
sampling needs *typical-set overlap* (finite ratio variance is necessary but nowhere near
sufficient); VI's ELBO is a noisy objective whose convergence is not mean convergence; and
"approximate MCMC" splits into three qualitatively distinct regimes with different validity theory —
you cannot reuse the exact-MCMC checklist unchanged.

**Nuance.** *IS:* absolute continuity (support containment) is necessary but far from sufficient —
the operative requirement is typical-set overlap, and in high D both proposal and target typical sets
thin into shells that miss, giving near-zero weights with rare catastrophic blow-ups; even *finite*
Var(R) can be so large the estimator is useless (the dominant high-D failure), and finite variance is
itself unverifiable from samples — so IS is best used to *refine* an already-good approximation (e.g.
post-VI), not as a standalone estimator, with ESS/k̂ as empirical (heuristic) overlap checks. *VI:* an
oscillating/spiking ELBO is *expected* (a Monte-Carlo objective; jitter scales with learning rate),
not a bug; and for mean-field VI on an ill-conditioned Gaussian (κ≫1) stochastic Adam can drive the
ELBO to a noise-dominated fixed point ("converged") while μ_q stays far from μ* — an *optimizer*
failure, distinct from intrinsic VI-family bias, fixable with more MC samples per step. Declaring
extra dependence (to_event) is always mathematically *safe* but forfeits the Rao-Blackwellization the
engine uses to cut ELBO-gradient variance. *Perturbed MCMC:* three regimes must not be conflated —
(1) bounded relative-error approximations (float32) preserve correctness (MEXIT coupling:
E(τ)≤1+δ̄⁻¹, and machine-ε≈10⁻⁷ makes decoupling times enormous), (2) random unbiased approximations
(pseudo-marginal) fail differently (stuck at over-estimated values), (3) biased algorithms
(ULA/SGLD) need discretization theory; an approximate MH chain of length N decomposes into J
correlated exact sub-chains with error bounded by ∑ⱼ M(θ)-weighted restart terms.

**Conditions.** IS overlap is most acute in high D with non-overlapping bulks; the VI ELBO-jitter and
mean-vs-ELBO points are specific to SGD-family stochastic optimization; the three-regime split governs
any "wrong acceptance probability" argument.

**Tier.** 🟢 established (subsumes `is-requires-typical-set-overlap-not-just-support-containment`,
`merged-52-mean-field-vi-gaussian-condition-number`, `three-regimes-wrong-acceptance-probability`,
`mexit-relative-error-bound-decoupling-time`,
`approximate-mh-chain-sub-chain-decomposition-and-error-bound`; plus supported
`is-finite-variance-insufficient-for-practical-reliability`, `forum-c63` ELBO-oscillation,
`forum-c392` to_event-vs-plate).

**Sources.** betanalpha:probabilistic_computation · dansblog:psis-proof · dansblog:wrong-mcmc ·
pyro:4275 · pyro:4472 · pyro:8858 · pyro:2258 · pyro:370 · internal-experiments

---

## Practical — what works / what doesn't (comprehensive, SITUATION-indexed)

*49 recs (16 ✓ / 32 ✗, plus 1 bidirectional), indexed by DIAGNOSTIC SITUATION / SYMPTOM rather than
by model. `efficacy` is the benchmark-shaped slot `{divergences, min_ess, ess_per_sec, rmse,
coverage}` — filled only from a metric present in the input, else `pending`. Attached `moves` are the
diagnostic "how", matched by relevance; move-derived single-witness attachments are the searchable
tail.*

### Is the estimate even valid? (CLT / convergence foundation)

**✗ A1** · when a chain is stationary/irreducible/aperiodic and you take that as certifying a valid
error bar → does **NOT** work.
- why: the MCMC-SE is valid only if a Markov-chain CLT holds for the specific expectand; stationarity does not imply it — geometric ergodicity + E[f⁴]-integrability + equilibration are additionally required.
- conditions: any MCMC estimate reported with an error bar; expectand-specific (may hold for an indicator yet fail for the identity on the same chain).
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics, betanalpha:markov_chain_monte_carlo, betanalpha:sampling
- efficacy: {divergences: pending · min_ess: ESS/iteration ≪ 10⁻³ makes even a valid CLT useless · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Separate the three distinct concerns the request conflates — inference vs computation vs algorithm" · "Cross-read the two samplers' signals instead of trusting either alone, accounting for sampler-specific failure modes"

**✗ A2** · when a heavy-tailed / non-geometrically-ergodic target passes split-R̂ and k̂ at short N
(~10⁴) → reading that as convergence does **NOT** work.
- why: rare tail excursions that determine the stationary distribution go unsampled for millions of iterations; the same diagnostics at N~10⁶ correctly reveal CLT failure.
- conditions: recurrent-but-not-geometrically-ergodic chain, unbounded expectand; short-chain masking is seed-dependent (multi-chain raises detection probability).
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: ESS/iteration < 10⁻³ is the practitioner red flag · ess_per_sec: pending · rmse: pending · coverage: split-R̂ clean at N=10⁴ but >1.1 at N=10⁶ (fires only if a chain makes an excursion)}
- moves: "Sweep the OTHER convergence diagnostics for corroborating warnings" · "ablate the model to a minimal version and run on simulated data"

**✓ A3** · when you need to *trust* a finite-N CLT error bar → require **preasymptotic** (not merely
asymptotic) consistency and validate it works.
- why: the CLT error bar assumes finite-N sequences behave like an N-fold product draw — a strictly stronger property than asymptotic consistency; MCMC does not satisfy it in general, so it must be checked (ESS/iteration, standardized-residual behaviour across replications).
- conditions: algorithm-validation setting where the true expectation and independent replications are available.
- tier: 🟢 · source: betanalpha:sampling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: standardized-residual check across R replications distinguishes the regimes · coverage: pending}
- moves: "Run a simulation: generate data from known parameters, fit, compare full posterior summaries" · "plot the lp__ trace and contrast across datasets to characterize the residual signal"

**✗ A4** · when the expectand has undefined mean or infinite variance → a Monte-Carlo point
estimate/error bar does **NOT** work.
- why: undefined mean → the running estimator drifts indefinitely with a non-collapsing envelope; finite mean but infinite variance → the point estimate converges but the CLT error bar is unreliable.
- conditions: i.i.d. or MCMC draws of an unbounded heavy-tailed expectand (Student-t ν≤2, Cauchy).
- tier: 🟢 · source: betanalpha:sampling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: undefined-mean → drift with non-collapsing error envelope; infinite-variance → point estimate converges, error bar unreliable · coverage: pending}
- moves: "Separate the three distinct concerns — inference vs computation vs algorithm" · "Sweep the OTHER convergence diagnostics for corroborating warnings"

**✓ A5** · when you discard warmup states → valid **only if** the full chain (including warmup) would
itself satisfy the CLT.
- why: warmup discards early states whose initialization influence hasn't decayed; that leaves a CLT-valid sub-chain only when the full chain was CLT-valid — warmup never rescues a never-converging chain.
- conditions: window size chosen so trace plots show no visible initialization influence (a visual criterion, not a fixed fraction).
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect sampler adaptation: get_adaptation_info(fit) — read step size and inverse-metric elements and their spread" · "Correct the definition of R-hat: within-chain vs between-chain variance (mixing)"

**✗ A6** · when a chain is stationary but explores the typical set inefficiently → relying on
stationarity for finite-sample accuracy does **NOT** work.
- why: finite-sample quality is set by the interaction of the transition with the typical-set geometry; a chain starting outside or crawling within the typical set yields large error at any fixed N.
- conditions: general; well-designed transitions (HMC/NUTS) can explore efficiently even in high D.
- tier: 🟢 · source: betanalpha:probabilistic_computation
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Pull get_sampler_params() and read stepsize__, treedepth__, n_leapfrog__, divergent__, energy__ per chain" · "Probe adaptation sufficiency via the leapfrog/treedepth history rather than divergence count alone"

### R̂ and multiple chains

**✗ B1** · when all chains start in the same basin (or all become identically pathological) → R̂ does
**NOT** detect the non-equilibrium.
- why: R̂ measures between-chain disagreement relative to within-chain variance; identical failure keeps between-chain variance low, so R̂→1 despite non-convergence.
- conditions: same-region initialization, or chains long enough to converge to the same pathological behaviour; more chains do not help if all are wrong the same way.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: R̂→1 despite non-equilibrium under same-basin init}
- moves: "Overdisperse the random initialization — raise init_r above its default of 2 (or use structurally different starts) — START with this" · "Re-examine the raw draws instead of the rendered traceplot"

**✗ B2** · when you run a single chain on a multimodal/mixture target → per-chain diagnostics do
**NOT** reveal that only one mode was explored.
- why: within a single mode the chain reaches local equilibrium — smooth traces, R̂≈1, legitimate-looking n_eff — statistically indistinguishable from global equilibrium.
- conditions: multimodal / degenerate-mixture targets; single-chain analysis is blind to this.
- tier: 🟢 · source: betanalpha:identifying_mixture_models, betanalpha:markov_chain_monte_carlo
- efficacy: {divergences: none (trajectory valid within its mode) · min_ess: per-chain n_eff consistent with the samples drawn (all from one mode) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose tiny min-Neff as multimodality via per-element across-chain marginal posteriors, and classify the modes" · "Overdisperse the random initialization — raise init_r above its default of 2 (or use structurally different starts)"

**✓ B3** · when you suspect metastability / label switching → run multiple chains from overdispersed
inits and read **between-chain split-R̂** as the signal.
- why: HMC diagnostics (divergences, E-BFMI, tree depth) are all silent during label switching; only inflated split-R̂ alongside near-zero n_eff/iter, plus a disjoint multi-chain scatter, exposes it.
- conditions: multiple chains run; well-separated modes; exchangeable-prior mixtures.
- tier: 🟢 · source: betanalpha:mixture_models
- efficacy: {divergences: 0 (silent) · min_ess: near-zero n_eff/iter · ess_per_sec: pending · rmse: pending · coverage: split-R̂ ≫1.1 (values of 50+ observed)}
- moves: "Correct the definition of R-hat: within-chain vs between-chain variance (mixing)" · "Diagnose tiny min-Neff as multimodality via per-element across-chain marginals, classify the modes"

**✓ B4** · when detecting metastability under a compute budget → prefer more **overdispersed** chains
over one longer chain.
- why: parallel chains from dispersed starts independently fall into different modes, making between-chain disagreement immediate rather than waiting for a rare inter-mode crossing (≈40× sensitivity per compute in the bimodal example); once R̂≈1, switch to longer chains for ESS.
- conditions: overdispersed (structurally different) starts, not just different seeds; the 40× ratio is example-specific (mode separation, barrier height, dimension); does NOT apply when the slow chain is an infra/tooling problem (no R̂ signal).
- tier: ⚪ candidate · source: mc-stan:9935
- efficacy: {divergences: pending · min_ess: n_eff=2 (4 chains × 5000) · ess_per_sec: ≈40× detection sensitivity per compute · rmse: pending · coverage: R̂=4.18 (4×5000) vs R̂=3.46 (1×200000)}
- moves: "Overdisperse the random initialization — raise init_r above its default of 2 (or use structurally different starts)" · "Diagnose tiny min-Neff as multimodality via per-element across-chain marginals"

**✗ B5** · when a reducibility barrier confines all chains to one partition cell → split-R̂ and k̂ are
**silent** and do **NOT** flag the reducibility.
- why: a reducible transition admits multiple internally-consistent stationary distributions; if every realized chain lands in the same cell, all diagnostics look clean while the estimate is wrong.
- conditions: uniform initialization inside one partition cell; overdispersed multi-chain init is the only structural guard.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: E[Id]=−1.011±0.067 vs true 0 · coverage: split-R̂<1.1 and all k̂ pass (false clean)}
- moves: "Overdisperse the random initialization — raise init_r above its default of 2 (or use structurally different starts)" · "Re-examine the raw draws instead of the rendered traceplot"

**✗ B6** · when you "discard the bad chains and keep the good ones" (burn-in framing) → does **NOT**
work.
- why: one pathological chain invalidates the whole ensemble, not just itself; discarding it conceals the pathology and destroys the between-chain disagreement diagnostics rely on.
- conditions: any ensemble-based MCMC workflow.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reject the 'ignore divergences' framing on principle before any code change" · "Sweep the OTHER convergence diagnostics for corroborating warnings"

**✗ B7** · when divergences / E-BFMI / tree-depth are clean on a well-separated mixture → concluding
convergence does **NOT** work.
- why: HMC cannot tunnel between well-separated modes, but the trajectory is valid within its mode, so divergences don't fire and E-BFMI is fine; only inflated split-R̂ and a disjoint multi-chain scatter catch it.
- conditions: multiple chains; well-separated components; exchangeable mixture priors.
- tier: 🟢 · source: betanalpha:mixture_models
- efficacy: {divergences: 0 (silent on label switching) · min_ess: near-zero n_eff/iter · ess_per_sec: pending · rmse: pending · coverage: only split-R̂ + disjoint scatter detect it}
- moves: "Sweep the OTHER convergence diagnostics for corroborating warnings" · "Diagnose tiny min-Neff as multimodality via per-element across-chain marginals"

### ESS / n_eff

**✗ C1** · when you quote one number as "the chain's ESS" → does **NOT** work.
- why: ESS[f]=N/(1+2∑ρₗ[f]) is a property of the expectand; the same chain can have high ESS for one function and catastrophically low ESS for another.
- conditions: any target with directions of heterogeneous correlation (all non-trivial posteriors); spread is largest under high-curvature geometry (funnels, tight scales).
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo
- efficacy: {divergences: pending · min_ess: same chain — high ESS for one function, catastrophically low for another · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read Rhat and ESS (incl. in the unconstrained space) as a localizer, not just a pass/fail gate"

**✗ C2** · when the chain is highly autocorrelated (λ̂=ESŜ/N < 1/10000) → trusting the ESS estimate
does **NOT** work.
- why: ringing in the correlogram fires the Geyer pair-sum cutoff too early, excluding large positive autocorrelations at longer lags → systematic overestimate exactly when the sampler is worst.
- conditions: classical Geyer pair-sum estimator; large positive autocorrelations persisting to high lags.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo
- efficacy: {divergences: pending · min_ess: ESS estimate untrustworthy (overestimated) once λ̂ < 10⁻⁴ · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Interrogate HOW the diagnostics are recomputed (probe the estimation provenance, not just the numbers)" · "Compute R-hat/ESS directly on the real parameters (improved rank-normalized monitor)"

**✗ C3** · when fewer than 0.001 effective samples per transition → trusting reported n_eff does
**NOT** work.
- why: the classical integrated-autocorrelation-time estimator is biased and typically *overestimates* in the extremely-sticky regime — untrustworthy precisely when the sampler struggles most.
- conditions: classical IAT-based n_eff (PyStan 2.x / fast_monitor era); modern rank-normalized ESS differs; the 0.001 threshold is an empirical heuristic.
- tier: 🟡 · source: betanalpha:pystan_workflow
- efficacy: {divergences: pending · min_ess: n_eff overestimated when < 0.001 effective samples/transition · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compute R-hat/ESS directly on the real parameters (improved rank-normalized monitor)" · "Stop brute-forcing; refit small (200/200 or 500/500) purely for diagnosis and read per-parameter n_eff/Rhat plus trace/pairs plots"

**✓/✗ C4** · when negative autocorrelations (antithetic mixing) appear → ESS>N is *real*
super-efficiency for the anti-symmetric expectand, but does **NOT** transfer to symmetric expectands.
- why: ∑ρₗ[f]<0 gives ESS[f]>N (identity: ESS=7600 from N=3800), a genuine gain over i.i.d.; symmetric expectands do not benefit and may suffer (square: ESS=3662<N), and estimators are fragile (can drastically overestimate without regularization).
- conditions: irreducible periodic/antithetic chain; benefit is expectand-specific; aggregate information is conserved across functions.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics, betanalpha:markov_chain_monte_carlo
- efficacy: {divergences: pending · min_ess: ESS=7600 from N=3800 (identity, >N); ESS=3662 (square, <N) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compute R-hat/ESS directly (improved / regularized rank-normalized monitor)" · "Read Rhat and ESS as a localizer, not just a pass/fail gate"

**✗ C5** · when RWM ESS/iteration decays with dimension → tuning the proposal scale to fix it does
**NOT** work.
- why: the O(D⁻¹) decay is irreducible — it persists even at the optimal scale 2.4/√D (accept ≈0.234), reflecting the fundamental limitation of local random-walk exploration in high D.
- conditions: formally proven for i.i.d. product targets; qualitatively robust to correlation.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo
- efficacy: {divergences: pending · min_ess: ESS/iteration ≈0.22 (D=1) → ≈0.03 (D=10) at optimal scale/accept 0.234 · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "interrogate the mechanism before running anything: locate the load-bearing structure being exploited" · "probe the sampler tuning diagnostics for a too-small step size signature"

**✗ C6** · when a self-consistency std_ratio is formed after collapsing the reference array across
parameter dimensions → the gate does **NOT** work.
- why: the collapsed ratio converges to 1−1/√d regardless of draw quality — a perfect and a pathological draw give the same value, silently passing any output.
- conditions: reference array pooled/flattened across true parameter dimensions before the ratio; fingerprint is a std_ratio stable across different draws.
- tier: 🟡 · source: internal-experiments
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: std_ratio → 1−1/√d irrespective of draw quality (silent pass)}
- moves: "Interrogate HOW the diagnostics are recomputed after sub-sampling (probe estimation provenance)" · "Compute R-hat/ESS directly on the real per-dimension parameters and compare"

**✓ C7** · when ESS/n_eff is untrustworthy in the struggling regime → **refit small purely for
diagnosis** and read per-parameter n_eff/R̂ + trace/pairs plots works.
- why: brute-forcing more draws does not fix a biased estimator or a geometry problem; a cheap diagnostic run localizes it (per-parameter n_eff/R̂, traceplots, pairs plots).
- conditions: general; especially when n_eff is reported near or below the sub-threshold bias regime.
- tier: 🟡 · source: betanalpha:pystan_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Stop brute-forcing; refit small (200/200 or 500/500) purely for diagnosis and read per-parameter n_eff/Rhat plus trace/pairs plots" · "Read Rhat and ESS as a localizer, not just a pass/fail gate"

### Thinning

**✗ D1** · when you thin a well-mixing chain to "improve" ESS → does **NOT** work.
- why: thinning costs s× compute for the same stored count, so ESS-per-compute can only stay flat or drop; the autocorrelation gain is cancelled by the reduced N.
- conditions: already well-mixing aperiodic chain.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: stride-1 ESS=1247 vs stride-2 ESS=1130 · ess_per_sec: thinning only reduces ESS-per-compute · rmse: pending · coverage: pending}
- moves: "Prescribe deterministic post-run thinning as the correct primitive and justify on efficiency/diagnostic grounds"

**✓ D2** · when memory is the binding constraint on a necessarily-long chain → thinning **for storage
reduction** works.
- why: the sole legitimate use — reduce stored states when chain length must be large but memory is limited; holds only when the thinning period is shorter than the autocorrelation length.
- conditions: storage-limited; chain already well-mixing.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Prescribe deterministic post-run thinning as the correct primitive" · "Provide the concrete deterministic-index recipe and fold it into the tool's API"

**✗ D3** · when you thin a periodic chain by a stride that is a multiple of its period M → does
**NOT** work (destroys validity).
- why: the M-step composite kernel τ^M is reducible; once initialized on one side of the invariant boundary the thinned chain never crosses, giving multiple stationary distributions and an inconsistent ensemble — even though the unthinned chain is correct.
- conditions: discrete period M≥2; if the period is unknown, no safe stride can be guaranteed.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: period-2 → τ² reducible with 2 (extreme) stationary dists; thinned chains confined to R⁺ or R⁻}
- moves: "Separate the two failure modes — order/shuffling vs irregular spacing — and ask for the actual use case" · "Prescribe deterministic post-run thinning as the correct primitive"

**✓ D4** · when thinning is genuinely needed → use **deterministic post-run thinning by a stride COPRIME with the period** works.
- why: a stride coprime with M (gcd = 1) preserves irreducibility and correctness; deterministic indexing is the correct, diagnosable primitive (vs random subsampling).
- conditions: strictly-nested storage/diagnostic use; stride coprime with any known period.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Provide the concrete deterministic-index recipe and fold it into the tool's API" · "Prescribe deterministic post-run thinning and justify on efficiency/diagnostic grounds"

### k̂ / tail integrability / estimand estimability

**✓ E1** · when split-R̂ passes but you need to know the estimate is trustworthy → also compute **k̂**
(the two catch orthogonal failures).
- why: k̂ catches integrability failure (heavy pushforward tails) exactly where split-R̂ passes, and split-R̂ catches mixing failure where k̂ passes; neither alone is sufficient.
- conditions: k̂'s 0.25 threshold is calibrated for MCMC-SE integrability (E[f⁴] finite); both require E_π[f²] finite to be meaningful.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: Cauchy target — split-R̂<1.1 (mixing OK) yet all four tail k̂>0.25 (integrability fails)}
- moves: "Sweep the OTHER convergence diagnostics for corroborating warnings" · "Cross-read the two samplers' signals instead of trusting either alone"

**✗ E2** · when you read k̂ as a generic "sampler-quality" flag → does **NOT** work.
- why: k̂'s meaning is set by *which* ratio it is fitted to — (A) expectand-moment existence, (B) PSIS-LOO predictive, (C) VI/Laplace/Pathfinder proposal weights (dimension-inflated); conflating regimes is the core error.
- conditions: for Cauchy/Student-t ν≤2, k̂>0.5 is a mathematical certainty (not an actionable warning); distinguishing distribution-property from sampler-failure needs ≥2 parameterizations and an invariance check.
- tier: 🟢 · source: mc-stan:34064, mc-stan:39374
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: k̂>0.5 → infinite variance, ≈0.7 → undefined mean (regime A); regime C inflates with dimension}
- moves: "Separate the three distinct concerns — inference vs computation vs algorithm" · "Interrogate HOW the diagnostic is computed (probe provenance, not just the number)"

**✓ E3** · when a heavy-tailed target makes the identity function fail k̂ → estimate **bounded
functionals** (indicators / probabilities) instead — always MC-estimable.
- why: bounded indicators live in [0,1] so all moments are finite and the CLT applies regardless of target tail heaviness; histogram reconstruction via indicators is the robust route.
- conditions: chain itself converged (split-R̂ consistent with stationarity); indicator resolution limited by the number of bins.
- tier: 🟢 · source: betanalpha:markov_chain_monte_carlo_basics
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: E[Id]=0.199±0.468 (fails k̂ on all chains) vs E[I[−1,1]]=0.502 (passes all diagnostics) · coverage: pending}
- moves: "Separate the three distinct concerns — inference vs computation vs algorithm" · "Read Rhat and ESS as a localizer, not just a pass/fail gate"

**✗ E4** · when you want a probability *density* from samples via KDE → does **NOT** work as
Monte-Carlo estimation.
- why: density is the derivative of an expectation (a limit as bin-width→0), not an expectation; KDE is an *inference* step imposing a kernel family and discarding kernel/bandwidth uncertainty. Fixed-bin histograms are the genuine MC primitive.
- conditions: continuous 1-D output spaces requesting a Lebesgue density; fixed bins chosen without reference to the sample (adaptive binning reintroduces inference).
- tier: 🟢 · source: betanalpha:sampling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Separate the three distinct concerns the request conflates — inference vs computation vs algorithm"

**✗ E5** · when estimating a small tail probability p by plain Monte Carlo → assuming a modest sample
suffices does **NOT** work.
- why: relative error α requires N > (1−p)/(α²p), which explodes as p→0 (p=0.01, α=0.05 → 39,600 samples); worse, when no samples fall in the interval the MC error estimate is paradoxically *zero* (Binomial variance collapses).
- conditions: i.i.d. samples; indicator CLT valid (p not too close to 0/1).
- tier: 🟢 · source: betanalpha:sampling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: N > (1−p)/(α²p) → 39,600 at p=0.01, α=0.05; zero samples-in-interval → false zero error}
- moves: "interrogate the mechanism before running anything: locate the load-bearing structure being exploited"

### False-alarm plumbing artifacts (read the per-parameter table)

**✗ F1** · when NaN R̂/n_eff fires on a stored constant (fixed boundary state) → reading it as a
mixing failure does **NOT** work.
- why: R̂/n_eff are ratios of a quantity's variance; a constant has exactly zero variance → 0/0 = NaN. Technically-correct arithmetic, practically a false positive while the sampler runs perfectly.
- conditions: a fixed value stored in a parameters/transformed-parameters array alongside sampled variables; built-in diagnostics applied to that array.
- tier: 🟢 · source: betanalpha:brownian_bridge
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: 0/0 = NaN R̂/n_eff on the constant}
- moves: "Filter the fit summary to parameters with NA R-hat / flagged ESS and see what kind of quantity they are" · "Trace each flagged quantity back to its definition in the Stan program" · "Re-run with the constant quantities excluded from the saved output"

**✗ F2** · when NaN R̂/n_eff appears for S(0)=1 in a survival display grid → treating it as
non-convergence does **NOT** work.
- why: S(0)=exp(−Λ(0))=1 is a parameter-free identity; every chain returns exactly 1 → zero variance → NaN R̂/n_eff. A deterministic false positive to exclude from automated checking.
- conditions: any survival model whose display grid includes t=0; generalizes to any derived quantity constant across draws.
- tier: 🟢 · source: betanalpha:survival_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: S(0)=1 → zero variance → NaN R̂/n_eff (deterministic false positive)}
- moves: "Filter the fit summary to parameters with NA R-hat / flagged ESS" · "Make the constant non-constant by a numerically negligible jitter, and add a post-hoc R̂/ESS guard"

**✗ F3** · when a top-line "largest R-hat is NA, chains have not mixed" / "Bulk/Tail ESS too low"
warning fires → reading it as ensemble non-convergence does **NOT** work.
- why: a single zero-variance saved quantity (generated quantity or transformed parameter pinned to a constant like 1e-9 padding) makes the automatic R̂/ESS undefined for that entry and propagates an alarming collapsed summary — diagnose from the per-parameter table.
- conditions: a saved entry held constant across draws (placeholders, padding); does NOT apply when stochastic parameters themselves show R̂>1.01 or anti-scaling ESS (those are real).
- tier: 🟡 · source: mc-stan:14100
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: zero-variance saved quantity → NA top-line R̂ (false alarm)}
- moves: "Filter the fit summary to parameters with NA R-hat / flagged ESS" · "Trace each flagged quantity back to its definition" · "Compute R-hat/ESS directly on the real parameters and compare"

**✗ F4** · when a "multiplier is 0, but must be > 0!" (scale-underflow) exception appears **only** in
early warmup → reading it as a model defect does **NOT** work.
- why: the affine transform a = offset + multiplier·a_raw underflows when the scale momentarily collapses toward the floating-point underflow floor (≈exp(−745), not exp(−300)≈5.1e-131) during initial adaptation; the exception is transient numerical underflow that disappears once step size/metric settle.
- conditions: Stan offset-multiplier / lower-bound scale reparameterizations; error appears only in the first warmup iterations and vanishes thereafter.
- tier: 🟡 · source: mc-stan:15988, mc-stan:18883
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Localize the offending scale parameter feeding the likelihood and check its prior/constraint and init scale for overflow at random starts" · "Trace each flagged quantity back to its definition"

**✗ F5** · when a small conjugate Beta-Bernoulli gives a different posterior mean every re-run →
blaming MCMC non-determinism does **NOT** work.
- why: with few observations the conjugate posterior Beta(α+#tails, β+#heads) is exact and the sampler is essentially noise-free; the run-to-run change is regenerated *data* under an unseeded RNG, not sampler stochasticity.
- conditions: small-data conjugate/near-conjugate models with data simulated inside the run by an unseeded call; prior-dominance strongest when #obs is small.
- tier: 🟡 · source: pymc:16339
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: posterior mean varies from unseeded data, not sampler noise (conjugate posterior is exact) · coverage: pending}
- moves: "Run a simulation: generate data from known parameters (seed it), fit, compare full posterior summaries"

**✗ F6** · when a subset of parameters shows R̂>1.1 under a two-component (inner_τ≪outer_τ) mixture
prior → reading it as trapped-mode multimodality does **NOT** work.
- why: the traces show all chains *do* visit both the inner-core peak and the outer plateau; R̂ elevation comes from *rare but successful* inter-component transitions (3–10 per 1000 iters) — topological slow mixing, distinct from geometric trapping.
- conditions: well-separated components (outer_τ≫inner_τ); some likelihoods straddle both; run short enough that only a few transitions occur.
- tier: 🟢 · source: betanalpha:modeling_sparsity
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: R̂>1.1 from 3–10 inter-component transitions per 1000 iters (chains NOT trapped)}
- moves: "Diagnose tiny min-Neff as multimodality via per-element across-chain marginals, classify the modes" · "Re-examine the raw draws instead of the rendered traceplot"

### Warmup & stopping rules

**✓ G1** · when running multiple chains with windowed warmup → feed **between-chain R̂ / bulk-ESS
back** to make warmup adaptive (auto-length, drop earliest windows, pool variance) works.
- why: R̂/ESS already tell you whether the ensemble reached stationarity, so you can stop warmup once targets are met, pick the window subset that maximizes ESS, and pool variance across chains for faster mass-matrix adaptation (fewer leapfrog steps).
- conditions: HMC/NUTS windowed warmup, multiple chains; does NOT apply to structurally non-identifiable models (factor indeterminacy, sign/reflection, label switching) without first fixing identifiability.
- tier: 🟡 · source: mc-stan:12039, mc-stan:12912
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: auto-length + variance-pooling → fewer leapfrog steps / faster mass-matrix adaptation · rmse: pending · coverage: pending}
- moves: "Inspect sampler adaptation: get_adaptation_info(fit) — read step size and inverse-metric elements and their spread" · "Correct the definition of R-hat: within-chain vs between-chain variance (mixing)"

**✗ G2** · when you halt sampling the instant ESS first crosses a threshold → does **NOT** work.
- why: split-R̂/FFT-ESS cannot be computed cheaply online (full recompute each check, often costlier than the iterations), and stopping on the same noisy diagnostic you target is an optional-stopping rule that biases the estimate.
- conditions: adaptive run-until-ESS / run-until-time rules on dynamic HMC; any attempt to compute R̂/ESS online; pipelines assuming equal iterations per chain.
- tier: 🟡 · source: mc-stan:1824, mc-stan:495
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: optional-stopping on the targeted diagnostic biases the estimate · coverage: pending}
- moves: "Interrogate HOW the diagnostics are recomputed (probe estimation provenance, not just the numbers)" · "Reject the automatic non-terminating escalation loop; do the escalation by hand, one step at a time"

### Approximate / perturbed MCMC (wrong acceptance probability)

**✓ H1** · when the acceptance probability has a small *bounded relative error* (float32 on a
well-conditioned posterior) → correctness is preserved.
- why: the MEXIT coupling gives a decoupling time whose expectation grows like ~1/δ̄; machine-ε≈10⁻⁷ makes δ̄ tiny and expected decoupling times enormous, so the approximate chain tracks the exact one.
- conditions: proposal absolutely continuous with strictly positive density; relative error on acceptance and rejection ratios uniformly bounded.
- tier: 🟢 · source: dansblog:wrong-mcmc
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: expected decoupling time ~1/δ̄; float32 machine-ε≈10⁻⁷ → enormous decoupling times → correctness preserved}
- moves: "Separate the three distinct concerns — inference vs computation vs algorithm" · "Compare divergence behaviour across sampler backends to separate a backend bug from a geometry problem"

**✗ H2** · when you treat every "wrong acceptance probability" the same → does **NOT** work.
- why: three regimes need different theory — (1) bounded relative error (float32) preserves correctness via MEXIT; (2) random unbiased approximations (pseudo-marginal) fail differently (stuck at over-estimated values, need Var(log L̂) control); (3) biased algorithms (ULA/SGLD) need discretization-error theory with a separate stationarity concept.
- conditions: any argument about approximate acceptance probabilities; regime (1)'s coupling bound does not extend to (2) or (3).
- tier: 🟢 · source: dansblog:wrong-mcmc
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Separate the three distinct concerns — inference vs computation vs algorithm" · "Treat inferential and algorithmic problems as coupled — consider improving the MODEL rather than only the sampler"

**✓ H3** · when bounding the error of an approximate MH chain → decompose it into **J correlated exact
sub-chains** and bound by the drift-weighted restart sum.
- why: each sub-chain is a segment of an exact MH chain from the previous decoupling point; total error ≤ (C/N)∑ⱼ M(θ_{N_{j−1}})(1−ρ^{N_j−1})/(1−ρ) — impact depends on how large the drift M(θ) is at restarts and whether J is small vs N (an open ESS/MCSE question).
- conditions: exact chain geometrically ergodic with drift M(θ) and contraction ρ; bounded continuous h; ESS concern when J is not negligible vs N.
- tier: 🟢 · source: dansblog:wrong-mcmc
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: error ≤ (C/N)∑ⱼ M(θ)(1−ρ^{N_j−1})/(1−ρ) · coverage: pending}
- moves: "Separate the three distinct concerns — inference vs computation vs algorithm" · "Interrogate HOW the diagnostics are recomputed (probe estimation provenance)"

### Importance sampling

**✗ I1** · when you rely on absolute continuity (support containment) for IS validity → does **NOT**
work.
- why: the operative requirement is *typical-set overlap*, a much stronger condition; in high D both proposal and target typical sets thin into shells that miss, so weights are near-zero for almost all samples with rare catastrophic blow-ups — the estimator looks like it works but is driven by a handful of samples.
- conditions: high D with non-overlapping bulk; low-D problems have broad typical sets where IS can work.
- tier: 🟢 · source: betanalpha:probabilistic_computation
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: typical-set shells thin as D grows → overlap fails; weights near-zero with rare blow-ups}
- moves: "run the model unchanged at default settings and read the sampler diagnostics incl. the weight distribution" · "interrogate the mechanism before running anything: locate the load-bearing structure"

**✗ I2** · when you check only that the IS ratio has finite variance → does **NOT** work.
- why: finite Var(R) is necessary but not sufficient — it can be so large the estimator is useless (the dominant high-D failure), and finite variance is itself practically unverifiable from samples.
- conditions: high-dimensional settings; even bounded ratios fail if the bound grows with dimension.
- tier: 🟡 · source: dansblog:psis-proof
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: Var(R)<∞ necessary but not sufficient; large-but-finite variance dominates high-D failure}
- moves: "run the model and read the weight distribution rather than scatter alone" · "Separate the three distinct concerns — inference vs computation vs algorithm"

**✓ I3** · when using IS → deploy it to **refine an already-good approximation** (e.g. post-VI), not
as a standalone estimator from a naive proposal.
- why: overlap is feasible when the proposal is already close; ESS and PSIS k̂ then capture overlap quality empirically (heuristics, not guarantees).
- conditions: a good starting proposal (post-VI/Laplace); k̂/ESS read as heuristics.
- tier: 🟢 · source: betanalpha:probabilistic_computation
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "run the model and read the sampler diagnostics incl. the weight distribution"

### Variational inference (SVI / ADVI)

**✗ J1** · when you read an oscillating / spiking ELBO curve as a bug or a bad variational family →
does **NOT** work.
- why: the ELBO is a noisy Monte-Carlo objective (single-sample estimates and/or mini-batching), so SGD/Adam produces a jittery loss whose smoothness scales with the learning rate — expected behaviour, not a defect.
- conditions: SVI/ADVI with SGD-family optimizers, MC ELBO estimates and/or data subsampling; does not describe deterministic full-batch optimization.
- tier: 🟡 · source: pyro:4275, pyro:4472
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Interrogate HOW the diagnostics are recomputed (probe estimation provenance, not just the numbers)" · "Separate the three distinct concerns — inference vs computation vs algorithm"

**✗ J2** · when you take ELBO-convergence as *mean*-convergence for MFVI on an ill-conditioned
Gaussian (κ≫1) → does **NOT** work.
- why: stochastic Adam drives the ELBO to a noise-dominated fixed point ("converged") while μ_q stays far from μ* — an optimizer failure (the MFVI optimum is exact for any Gaussian), fixable with more MC samples per step, categorically distinct from intrinsic VI bias on non-Gaussian targets.
- conditions: mean-field Gaussian VI, stochastic reparameterized ELBO gradients, large κ; the "add MC samples" remedy applies only to this optimizer-failure regime.
- tier: 🟢 · source: internal-experiments
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: ill_cond_50 (d=50, κ=1000, 5 samples/step): ELBO trend≈0 but μ_q far from μ* · coverage: pending}
- moves: "Treat inferential and algorithmic problems as coupled — improve the MODEL/optimizer rather than only trusting the loss" · "Separate the three distinct concerns — inference vs computation vs algorithm"

**✓ J3** · when unsure whether to declare dependence (to_event) vs conditional independence (plate) in
SVI → declaring dependence is always mathematically **safe** but forfeits variance reduction.
- why: extra dependence never makes the model wrong, but it discards the conditional-independence structure the engine uses for Rao-Blackwellization; declaring independence (plate) lowers ELBO-gradient-estimator variance — payoff largest for discrete/non-reparameterizable latents and minibatched data.
- conditions: trace-based PPLs (Pyro/NumPyro) consuming plate/to_event; does not transfer to HMC/NUTS (there the lever is geometry, not gradient variance).
- tier: 🟡 · source: pyro:8858, pyro:2258, pyro:370
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Decompose the model into its statistical components and ask which component is sampled" · "Separate the three distinct concerns — inference vs computation vs algorithm"

### Ground-truth benchmark gates

**✓ K1** · when validating an MCMC recipe against ground truth → a conservative **three-band max-z
gate** works.
- why: Z_max = max_d |sample_mean_d − gt_mean_d| / SE_diff_d with SE_diff_d = max(sample_std_d/√ESS_d, gt_std_d/√N_gt) flattened over all scalar dimensions; Z<2 PASS, 2≤Z<4 REVIEW, Z≥4 FAIL. The conservative denominator biases toward FAIL (correct when a missed biased recipe is costlier than a false flag).
- conditions: per-dimension gt means/stds + per-dimension ESS; compute z over scalar dimensions flattened across sites (never per named site); Laplace-family covers only φ marginals; fixed-L HMC also checks resonance (num_steps·step_size ≈ 2π).
- tier: 🟡 · source: internal-experiments
- efficacy: {divergences: pending · min_ess: uses per-dimension ESS_d in the SE denominator · ess_per_sec: pending · rmse: pending · coverage: Z<2 PASS, 2–4 REVIEW, ≥4 FAIL}
- moves: "Compute R-hat/ESS directly on the real parameters (rank-normalized monitor)" · "Run a simulation: generate data from known parameters, fit, compare full posterior summaries"

**✓ K2** · when validating **iid VI draws** (n≪GT_ESS) against a high-ESS ground truth → use a
**z<4.0** gate (not z<2.0).
- why: both the numerator bias and the SE denominator scale as 1/√n, so max|z| is *pivotal* in n — it converges to max_d|N(0,1)| and does NOT shrink toward zero with more draws; the z<4 gate matches this.
- conditions: iid-VI-sampler cert mode only (GT_ESS ~10k–40k, n=1000); MCMC and VI-as-warmup draws are non-iid and keep the standard z<2.0 gate; genuine VI bias must still be caught separately.
- tier: 🟡 · source: internal-experiments
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: z<4.0 gate; max|z| pivotal in n (does not shrink with more draws)}
- moves: "Run a simulation: generate iid draws vs high-ESS ground truth and compare mean z-scores" · "Compute R-hat/ESS directly on the real parameters"

**✗ K3** · when you apply the standard **z<2.0** gate to iid VI draws → does **NOT** work.
- why: because max|z| is pivotal (converges to max_d|N(0,1)|), a z<2.0 gate false-flags good draws at ~37%; the family-wide iid-VI gate must be relaxed to z<4.0.
- conditions: iid VI cert mode (n≪GT_ESS); the mis-calibration is specific to iid draws, not MCMC/warmup draws.
- tier: 🟡 · source: internal-experiments
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: z<2.0 on iid VI → ~37% false-flag rate}
- moves: "Run a simulation comparing iid draws against high-ESS ground truth" · "Interrogate HOW the diagnostics are recomputed (probe estimation provenance)"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
markov_chain_monte_carlo · markov_chain_monte_carlo_basics · probabilistic_computation · sampling ·
identifying_mixture_models · mixture_models · modeling_sparsity · brownian_bridge ·
survival_modeling · pystan_workflow · falling · taylor_models · variate_covariate_modeling

**Dan Simpson blog** (`dansblog:<id>` → `https://dansblog.netlify.app/posts/…`):
wrong-mcmc (`2022-11-23-wrong-mcmc`) · psis-proof (`2022-06-03-that-psis-proof`)

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pyro:N` → `https://forum.pyro.ai/t/…/N`;
`pymc:N` → `https://discourse.pymc.io/t/…/N`):
mc-stan:12039 · mc-stan:12912 · mc-stan:15988 · mc-stan:18883 · mc-stan:14100 · mc-stan:1824 ·
mc-stan:495 · mc-stan:34064 · mc-stan:39374 · mc-stan:9935 · pyro:8858 · pyro:2258 · pyro:370 ·
pyro:4275 · pyro:4472 · pymc:16339

**internal-experiments** — catalog `experiments/` + worklog case studies with no external source
(`merged-51` max-z gate · `merged-52` MFVI condition-number · `worklog-std-ratio-dimension-collapse`
· `worklog-vi-iid-draw-max-z`); tiers assigned but single-provenance, kept as the spot-checked tail.
