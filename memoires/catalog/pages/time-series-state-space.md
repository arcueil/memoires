# Time-series & state-space models

## Claims (the *why* — mid-level, ~3–5)

*Five mid-level principles synthesized from 9 granular claims. Tier is the best-supported
of the granular claims each subsumes. Source short-ids resolve to URLs in the Source key.*

### C1 · A discretized latent-state chain is a hierarchical-normal geometry problem — parameterize per-state and per-factorization, not globally 🟢
*[→ full entry](../claims/time-series-state-space/C1.md)*

**Statement.** A discretized latent-state chain (SDE, Markov chain, Brownian bridge) is structurally a
normal hierarchical model with N groups of size 1, so its HMC geometry obeys the same CP/NCP logic —
but the correct choice is *per-state* (CP for likelihood-pinned observed states, NCP for prior-only
unobserved states) and, within NCP, *per-factorization*, never a single global switch.

**Nuance.** The Euler–Maruyama step writes each transition as normal(x_{n−1}+f·dt, g·√dt) — a Normal
conditional on the previous state, exactly the structure of a hierarchical prior with unknown group
means, N transitions = N groups of size 1. On a fine grid neighboring states are near-perfectly
correlated, so the CP posterior is an elongated ridge whose correlation length exceeds 2^max_treedepth
leapfrog steps: the chain **saturates tree depth *without* divergences and *without* low E-BFMI** — a
pure trajectory-length failure, mechanically distinct from the local-curvature failure that produces
divergences. NCP (sample i.i.d. innovations, reconstruct states deterministically) collapses the ridge
and clears the saturation. When observed and unobserved times are mixed, observed states are pinned by
the likelihood (CP) and unobserved interior states are prior-only (NCP), so the right parameterization
is *mixed* — and requires pre-computed obs_idx/unobs_idx, since mis-specified arrays silently revert to
all-CP or all-NCP. Finally, multiple valid conditional factorizations of the (bridge) joint specify
*identical* densities and identical prior/posterior sample distributions, yet impose different NCP
geometries because the factorization order sets the length of the deterministic dependency chain in the
transformed-parameters block.

**Conditions.** Discretized linear-Gaussian / conditionally-normal latent chains; N ≥ several hundred
states with short increments (near-unit neighbor correlation in CP); observations sparse relative to N;
NCP in use for the factorization-order effect.

**Tier.** 🟢 established (subsumes `cp-markov-chain-treedepth-ncp-resolves`,
`sde-inference-as-hierarchical-model-mixed-cp-ncp`, `ncp-factorization-order-geometry-invariant-distribution`).

**Sources.** betanalpha:brownian_bridge · betanalpha:stochastic_differential_equations

---

### C2 · A clean-running sampler faithfully represents its model — clean diagnostics validate the sampler, not the model 🟢
*[→ full entry](../claims/time-series-state-space/C2.md)*

**Statement.** A clean-running sampler faithfully represents whatever model it was given, so clean HMC
diagnostics validate the *sampler*, not the *model* — a misspecification that is silent about a known
constraint (e.g., a Brownian-motion prior used where a terminal boundary condition is known) passes
with zero divergences and zero tree-depth saturations while the posterior is wrong by construction.

**Nuance.** The Brownian motion prior encodes only an initial condition; if the true problem has a
known, informative *terminal* boundary, the posterior trajectories will not respect it — and the
sampler cannot fix a model that never mentions the terminal constraint. The tell is not in sampler
diagnostics (which are clean) but in retrodictive / posterior-predictive checks and
simulate-and-recover harnesses. This is most dangerous when observations are concentrated in the early
portion of the interval, leaving the late portion unconstrained by data, so only the (missing) boundary
term could have pinned it.

**Conditions.** Terminal boundary condition known and informative; observations concentrated in the
early portion of the interval, late portion data-unconstrained.

**Tier.** 🟢 established (subsumes `brownian-motion-vs-bridge-model-misspecification`).

**Sources.** betanalpha:brownian_bridge

---

### C3 · Discrete latent states must be marginalized out — then the dominant failure is log-scale zeros in the marginal likelihood 🟡
*[→ full entry](../claims/time-series-state-space/C3.md)*

**Statement.** Gradient samplers cannot move a discrete latent-state sequence, so the working strategy
is to marginalize the states out via the forward algorithm into an exact, smooth, differentiable
likelihood — after which the dominant remaining failure mode is *numerical*: structural zeros in the
transition/emission matrices become log(0) = −∞ and their 0·log0 gradients are non-finite.

**Nuance.** HMC/NUTS has no gradient for discrete parameters and falls back to discrete random-walk
updates that mix worse as chain length and state cardinality grow; the HMM joint factorizes as a chain,
so the forward recursion α_t = ω_t .* (Γ·α_{t−1}), O(N·K²), sums the states out exactly and hands HMC a
continuous target over the hyperparameters. But on the log scale a structural (deterministic) zero — a
"dead"/absorbing state or an impossible transition — contributes log(0) = −∞, and autodiff hits 0·log0
(equivalently d/dp log p = 1/p → ∞): the likelihood *value* prints finite (log_sum_exp treats −∞ terms
as zero probability) while the *gradient* is non-finite, so the sampler rejects every initial value
with "Gradient evaluated at initial value is not finite." Fixes: regularize the zeros to a tiny
renormalized delta, exclude the impossible entries via sparse log-domain / control-flow special-casing,
or — for short sequences with not-too-small probabilities — run the recursion on the probability scale
and take the log once at the end.

**Conditions.** Discrete-latent-state likelihoods marginalized by the forward algorithm (HMM,
multi-state capture-recapture, dynamic occupancy) on an autodiff sampler; finite/small state space;
probability-scale recursion safe only for per-step factors ≳0.04 with T ≲100 in double precision.

**Tier.** 🟡 supported (subsumes `merged-0` [forward-algorithm marginalization],
`forum-c327` [log-scale structural-zero gradient]).

**Sources.** pymc:14751 · mc-stan:14052 · pyro:3283 · mc-stan:25312

---

### C4 · Divergence *location*, not count, is the primary triage signal — state-space models have geometrically explicable structural boundaries 🟢
*[→ full entry](../claims/time-series-state-space/C4.md)*

**Statement.** When divergences breach a tolerance gate, their *location* in parameter space is the
primary diagnostic, not their count: divergences that cluster tightly (~75–90 %) at a geometrically
explicable structural boundary — canonically the AR(1) unit-root region φ→1 where the stationary
variance σ²/(1−φ²) blows up — while all other diagnostics are healthy are *structural*, not
tuning-fixable.

**Nuance.** Procedure: bin the divergent-transition parameter values and compute the tail fraction; a
≥~75–90 % cluster near a structural boundary classifies the pathology as structural and justifies a
documented per-model gate exception, with a sampler swap (e.g. MCLMC) or reparameterization as the
long-term fix. If there is *no* tight cluster, do NOT grant an exception — run the hard-model recipe
first (higher target acceptance, deeper max tree depth, longer warmup). Count alone cannot distinguish
a false-positive scatter from a real boundary pinch.

**Conditions.** NUTS/HMC divergence triage on state-space / AR(1) and hierarchical models with
structural boundaries (unit root, funnel necks, variance-singularity regions); requires extracting and
binning per-divergence parameter values (e.g. via arviz).

**Tier.** 🟢 established (subsumes `merged-49`).

**Sources.** BlackJAX tuningfork benchmark (commits 2f7d70d · b26e00c · 7d86419)

---

### C5 · The recursion is conditional — respect what it conditions on (initial condition; frozen-model filter) 🟡
*[→ full entry](../claims/time-series-state-space/C5.md)*

**Statement.** Time-series inference goes wrong when the conditioning structure of the recursion is
mishandled in two recurring ways: conditioning the AR recursion on the first observation as if it were
*exogenous* biases the autoregressive coefficient (a Bayesian Nickell bias), and treating the cheap
online filter recursion as if it also updated the *hyperparameter* posterior conflates two distinct
objects.

**Nuance.** In a dynamic panel / hierarchical AR(1) (y_it = μ_i + δ·(y_{i,t−1}−μ_i) + ε_it) the lagged
response contains the individual effect u_i, and the first observation is itself a process draw
correlated with μ_i, so the naive `y ~ lag(y) + (1|individual)` with an exogenous first obs biases δ
(worst at small T, shrinking as T grows); the fix models the initial condition's *marginal* — the
stationary Normal(μ_i, σ_e/√(1−δ²)) for |δ|<1 — rather than conditioning on it. Separately, a
Kalman/particle filter updates the latent-state mean/covariance online in O(1) per step *only* for a
**frozen model** (fixed transition/observation/noise hyperparameters); the posterior over those "deep"
hyperparameters is conditioned on the whole dataset seen so far, and a filter step does nothing to
update it — the filter-recursion-looks-like-online-Bayes resemblance is superficial for the
hyperparameters (it holds exactly for linear-Gaussian latent states, approximately via EKF/particle for
nonlinear ones, and not at all for the hyperparameter posterior).

**Conditions.** Dynamic-panel/AR models with a lagged DV plus group-level intercepts and short-to-
moderate T (initial-condition bias); any SSM where inference targets both filterable latent states and
dataset-conditional global hyperparameters (online-update claim), general to MCMC-based PPLs.

**Tier.** 🟡 supported (subsumes `merged-9` [Nickell bias / initial condition],
`forum-c279` [filter vs hyperparameter posterior]).

**Sources.** mc-stan:5136 · pymc:17654 · pymc:17575 · pymc:17628

---

---

### C6 · A structural time series decomposes additively into interpretable latent components (trend / seasonal / noise), each with its own state-noise scale, fit jointly 🟢
*[→ full entry](../claims/time-series-state-space/C6.md)*

**Statement.** A structural time series (the BSTS/STS paradigm) decomposes additively into interpretable
latent components — a level/trend term (a random walk, or a local-linear-trend where the level's drift is
itself a random-walk slope), a seasonal term, and observation noise — each carrying its own state-noise
scale and all fit jointly.

**Nuance.** The local-linear-trend building block writes the level as
level_t = level + cumsum(slope + innov), i.e. the level's drift is itself a random-walk slope rather than a
fixed constant. Each component contributes an independent latent chain with its own state-noise (innovation)
scale, and the observed series is their additive sum plus observation noise; because the components combine
additively they remain individually interpretable. This is a distinct organizing lens from treating a latent
chain purely through its CP/NCP geometry (C1) — here the modeling content is the additive component structure
itself.

**Conditions.** Structural (additive-component) time-series modeling — level/trend + seasonal + observation
noise combined additively; each component a latent chain with its own state-noise scale; components fit
jointly.

**Tier.** 🟢 established (source: pymc-labs L1, human-curated)

**Sources.** pymc-labs:time-series

---

## Practical — what works / what doesn't (comprehensive, bidirectional)

*28 recs (18 ✓ / 9 ✗, plus 1 bidirectional). `efficacy` is the benchmark-shaped slot
`{divergences, min_ess, ess_per_sec, rmse, coverage}` — filled only from a metric present in the input
(here: divergence counts/locations and tree-depth-saturation observations), else `pending`. Attached
`moves` are the diagnostic "how", matched by relevance. Single-witness moves are tiered ⚪ and kept as
the searchable tail; multi-witness move counts are noted.*

### Parameterization of the latent-state chain (CP / NCP / factorization order)

**✗ P1** · for a **fine-grid discretized Markov chain** (e.g. Brownian motion, N≈500 states) with *[→ entry](../recs/time-series-state-space/P1.md)*
**sparse observations** → the **centered parameterization (CP)** does **NOT** work (tree-depth
saturation).
- why: near-unit correlations between neighboring states make the posterior an elongated ridge whose correlation length exceeds 2^max_treedepth leapfrog steps — the sampler saturates tree depth without ever mis-conserving the Hamiltonian.
- conditions: linear-Gaussian/additive-increment transitions; N ≥ several hundred with short increments; observations sparse (dense obs would partially break the ridge). Failure is tree-depth saturation, *not* divergences and *not* low E-BFMI.
- tier: 🟢 · source: betanalpha:brownian_bridge
- efficacy: {divergences: 0 (no divergences, no low E-BFMI — failure is tree-depth saturation) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify the warning: separate treedepth-saturation from divergences before choosing a playbook" · "Read saturation as evidence the target is highly degenerate / possibly non-identifiable, and investigate the target geometry" · "Rule out a per-chain bad-adaptation artifact before blaming geometry"

**✓ P2** · for the same fine-grid Markov chain → the **non-centered parameterization (NCP)** (sample *[→ entry](../recs/time-series-state-space/P2.md)*
i.i.d. innovations, reconstruct states deterministically) works.
- why: decouples the near-unit neighbor correlation into an isotropic innovation space, collapsing the ridge so trajectory length no longer exceeds max tree depth.
- conditions: linear-Gaussian transitions; the deterministic reconstruction chain is the NCP transformed-parameters loop.
- tier: 🟢 · source: betanalpha:brownian_bridge
- efficacy: {divergences: 0 (both CP and NCP are divergence-free; NCP additionally clears the tree-depth saturation) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "non-center every latent state and re-run" · "name the structural geometry and the parameterization rule" · "Try a dense (full) mass matrix as an alternative to reparameterization, isolating 'metric can't capture the correlation' from 'geometry is intrinsically bad'"

**✓ P3** · for a **discretized SDE with mixed observed/unobserved time points** → a **mixed *[→ entry](../recs/time-series-state-space/P3.md)*
parameterization** (CP for observed-time / likelihood-pinned states, NCP for unobserved intermediate
states) works.
- why: the SDE chain is structurally a hierarchical normal (N groups of size 1); observed states are strongly pinned by the likelihood (CP-favorable), unobserved states have only the SDE transition density as prior (NCP-favorable).
- conditions: fine temporal grid mixing observed/unobserved states; requires pre-computed obs_idx/unobs_idx; EM approximation forces normal transitions (non-normal exact transitions may differ).
- tier: 🟢 · source: betanalpha:stochastic_differential_equations
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "name the structural geometry and the parameterization rule" · "Adapt the centeredness of the hierarchical parametrization continuously during warmup (rather than committing to fully centered or fully non-centered)"

**✗ P4** · for a discretized SDE → **mis-specified obs_idx/unobs_idx arrays** that silently collapse the *[→ entry](../recs/time-series-state-space/P4.md)*
mixed scheme to **monolithic all-CP or all-NCP** do **NOT** work.
- why: the collapse is silent (no error), leaving either the observed states (under all-NCP) or the unobserved states (under all-CP) in their failure regime.
- conditions: index arrays computed off-graph before the fit; the revert is invisible in code, visible only in geometry diagnostics.
- tier: 🟢 · source: betanalpha:stochastic_differential_equations
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Establish a validation harness before debating structure: fit synthetic/simulated data with KNOWN parameters and check recovery" · "Treat any behavioral difference between mathematically-equivalent programs as a red flag and demand both exact sources to diff"

**✓ P5** · for the **NCP of a Brownian bridge** (fixed boundary states + interior observations) → *[→ entry](../recs/time-series-state-space/P5.md)*
**choosing the conditional factorization order that minimizes the deterministic dependency-chain
length** works.
- why: all valid factorizations give identical joint densities and identical sample distributions, but the factorization order sets the length of the sequential reconstruction loop, and a shorter loop yields better HMC geometry.
- conditions: conditionally-decomposable latent process with fixed boundaries + interior observations; effect scales with the number of constrained states and the observed/unobserved ratio.
- tier: 🟢 · source: betanalpha:brownian_bridge
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "name the structural geometry and the parameterization rule" · "Treat any behavioral difference between mathematically-equivalent programs as a red flag and demand both exact sources to diff"

**✗ P6** · for comparing **two mathematically-equivalent NCP factorizations** → assuming distributional *[→ entry](../recs/time-series-state-space/P6.md)*
equivalence implies **equivalent sampler geometry** does **NOT** work.
- why: identical densities do not imply identical geometry — the transformed-parameters dependency chain differs by factorization order, so HMC sees different posterior shapes.
- conditions: NCP in use; in CP the distributional equivalence still holds but the baseline geometry is poor for all orderings.
- tier: 🟢 · source: betanalpha:brownian_bridge
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Treat any behavioral difference between mathematically-equivalent programs as a red flag and demand both exact sources to diff" · "Drop below the sampler and compare raw log-density gradients of the two programs at identical unconstrained parameter values"

**✓ P7** · for a **correlated latent-state ridge** → trying a **dense (full) mass matrix** as an *[→ entry](../recs/time-series-state-space/P7.md)*
alternative to reparameterization works to *diagnose* whether the problem is the metric or the geometry.
- why: isolates "the metric can't capture the correlation" (dense matrix helps) from "the geometry is intrinsically bad" (dense matrix doesn't help → reparameterize).
- conditions: diagnostic step, not a guaranteed fix; judge first whether the correlation is large enough to actually impede HMC.
- tier: ⚪ candidate (move-derived, n_threads=3) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a dense (full) mass matrix as an alternative to reparameterization, isolating 'metric can't capture the correlation' from 'geometry is intrinsically bad'" · "Triage severity: judge whether the plotted posterior correlation is large enough to actually impede HMC"

**✓ P8** · for **choosing per-state centeredness** → **adapting the centeredness continuously during *[→ entry](../recs/time-series-state-space/P8.md)*
warmup** (rather than committing to fully-CP or fully-NCP) works.
- why: lets the sampler interpolate the CP↔NCP mix per state instead of a hand-picked global switch.
- conditions: hierarchical/latent-chain parameterization with a per-state centeredness knob.
- tier: ⚪ candidate (single-witness move) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Adapt the centeredness of the hierarchical parametrization continuously during warmup (rather than committing to fully centered or fully non-centered)"

### Model specification vs a clean sampler (boundary conditions)

**✗ S1** · for a latent process with a **known, informative terminal boundary condition** → a *[→ entry](../recs/time-series-state-space/S1.md)*
**Brownian motion prior** (encodes only the initial condition) does **NOT** work — the posterior
trajectories fail to respect the terminal constraint even when the sampler runs perfectly cleanly.
- why: a clean sampler faithfully represents its model; if the model is silent about the terminal boundary the posterior is wrong by construction, and no sampler tuning can fix it.
- conditions: terminal boundary known and informative; observations concentrated early, leaving the late portion data-unconstrained.
- tier: 🟢 · source: betanalpha:brownian_bridge
- efficacy: {divergences: 0 · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending} — clean run (0 divergences, 0 tree-depth saturations) on a misspecified model
- moves: "Read the posterior to assess identifiability/flexibility, and recommend posterior-predictive / retrodictive checks as the arbiter of structure choices" · "Do NOT band-aid the tails with hard bounds; investigate WHY the sampler visits them via posterior predictive exploration" · "Test whether the data can actually identify the latent dynamics, or whether the joint is over-flexible / under-informed"

**✓ S2** · for the same problem → a **Brownian bridge prior** (encodes both initial *and* terminal *[→ entry](../recs/time-series-state-space/S2.md)*
boundary conditions) works.
- why: the model must itself encode the terminal constraint; the bridge conditions the process on both endpoints so posterior trajectories respect it.
- conditions: both boundary conditions known; interior observations may be sparse.
- tier: 🟢 · source: betanalpha:brownian_bridge
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "name the structural geometry and the parameterization rule" · "Read the posterior to assess identifiability/flexibility, and recommend posterior-predictive / retrodictive checks as the arbiter"

**✓ S3** · for **deciding whether a clean fit actually reflects a correct model** → run *[→ entry](../recs/time-series-state-space/S3.md)*
**prior-predictive + retrodictive/posterior-predictive checks + a known-parameter simulate-and-recover
harness** works (clean HMC diagnostics validate the sampler, not the model).
- why: sampler diagnostics cannot detect a missing structural term; only checking the model's implied and refit behavior against known/simulated ground truth can.
- conditions: general state-space workflow; build a fast run→PPC loop before debating structure.
- tier: 🟢 · source: betanalpha:brownian_bridge
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Push the prior through the model (prior predictive) and plot the implied prior on the outcome, AND audit the data for covariate combinations" (n_threads=4) · "Establish a validation harness before debating structure: fit synthetic/simulated data with KNOWN parameters and check recovery; build a fast run→PPC" · "Inspect the data and the per-point latent field: raw y-vs-x scatter, stepped pairs over chunks of f, and posterior predictive checks to flag misfit"

### Discrete latent states — marginalization & log-scale numerics

**✗ D1** · for an **HMM / discrete-latent-state / state-space model** under HMC/NUTS → **sampling the *[→ entry](../recs/time-series-state-space/D1.md)*
discrete state sequence directly** does **NOT** work.
- why: discrete parameters have no gradient, so HMC/NUTS cannot move them and falls back to discrete random-walk updates that mix worse as chain length and state cardinality grow.
- conditions: any chain/tree-structured discrete latent process on a gradient-based sampler.
- tier: 🟡 · source: pymc:14751
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Point to implementing the forward algorithm directly in Stan as the general replacement" · "Check the built-in function's capability against documentation and known prior forum precedent"

**✓ D2** · for the same → **marginalize the latent states via the forward algorithm** *[→ entry](../recs/time-series-state-space/D2.md)*
(α_t = ω_t .* (Γ·α_{t−1}), O(N·K²)) works — yields an exact, smooth, fully-differentiable marginal
likelihood over the hyperparameters.
- why: the HMM joint factorizes as a chain, so summing over the transition matrix Γ collapses the discrete states exactly, handing HMC a continuous target.
- conditions: finite/small state space (or otherwise closed-form conditional); per-step sum over states tractable; Dirichlet-row conjugate-update and rate-matrix/matrix_exp shortcuts apply under extra structure.
- tier: 🟡 · source: pymc:14751, mc-stan:14052, pyro:3283
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Point to implementing the forward algorithm directly in Stan as the general replacement" · "Exploit known states to prune the marginalization sum" · "Structure ragged multi-series data so each site is a separate HMM term"

**✗ D3** · for a **log-scale forward algorithm with structural zeros** in the transition/emission *[→ entry](../recs/time-series-state-space/D3.md)*
matrices → leaving those zeros as **log(0) = −∞** does **NOT** work.
- why: autodiff differentiates through 0·log0 (equivalently 1/p → ∞) and returns a non-finite gradient, so the sampler rejects every initial value with "Gradient evaluated at initial value is not finite" — even though the likelihood *value* prints finite (log_sum_exp treats −∞ as zero probability).
- conditions: discrete-latent likelihoods with structural/deterministic zeros ("dead"/absorbing states, impossible transitions) on an autodiff sampler; symptom is finite target print + rejected inits.
- tier: 🟡 · source: mc-stan:25312
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Localize WHERE the gradient is non-finite vs confirm the VALUE is finite (diagnostic_file output and/or print before target +=)" · "Attribute the infinite gradient to differentiating through log(0) / 0*log(0) terms (cross-check against known Stan-math behavior)"

**✓ D4** · for that structural-zero gradient failure → **regularize the zeros away** (replace 0 entries *[→ entry](../recs/time-series-state-space/D4.md)*
with a tiny positive delta, renormalize rows) **or exclude the impossible entries** via sparse
log-domain matmul / control-flow special-casing works.
- why: removes the −∞ contributions whose gradients are non-finite, keeping the target and its gradient finite.
- conditions: choose regularization vs sparse special-casing by how many zeros and how much they distort; boundary-avoiding priors keep probabilities off the endpoints.
- tier: 🟡 · source: mc-stan:25312
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Regularize the structural zeros away (replace 0 entries with a tiny positive delta, renormalizing rows) and re-run" · "Keep log scale but exclude the impossible (log(0)) entries entirely via sparse log-domain matmul or control-flow special-casing" · "Add boundary-avoiding priors and/or narrow the [0,1] constraints away from the endpoints"

**✓/✗ D5** · for the forward recursion of a **short sequence with not-too-small probabilities** → *[→ entry](../recs/time-series-state-space/D5.md)*
running it on the **probability scale** (multiply marginal probs, take log once at the end) **works** and
sidesteps the log(0) gradient issue; for **long sequences with small probabilities** it does **NOT**
work (underflow).
- why: staying on the probability scale avoids differentiating log(0), but the product of many small factors underflows double precision on long chains.
- conditions: probability-scale safe roughly for per-step factors ≳0.04 with T ≲100 in double precision; otherwise stay on the log scale with the delta-regularization / special-casing fix.
- tier: 🟡 · source: mc-stan:25312
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Move the forward recursion to the PROBABILITY scale (store marginal probs in gamma, multiply, take log only once at the final target increment)"

**✓ D6** · for **posterior-predictive latent-trajectory draws** from a marginalized HMM → **FFBS** *[→ entry](../recs/time-series-state-space/D6.md)*
(forward-filter backward-sample) works; and note the **Viterbi (joint-mode) vs marginal-mode** decoders
diverge when adjacent states are strongly coupled.
- why: FFBS recovers full trajectory draws consistent with the marginalized likelihood; the two decoders coincide only when the marginal modes happen to also form the joint mode.
- conditions: continuous-Gaussian states use smoothing; discrete states use Viterbi/forward-backward/FFBS; divergence largest when the transition prior dominates or marginals are near-tied.
- tier: 🟡 · source: mc-stan:14052, pyro:3283
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Point to implementing the forward algorithm directly as the general replacement" · "Verify the reference likelihood against the primary source papers rather than trusting the manual"

### Divergence triage & structural boundaries (AR unit root)

**✓ T1** · for **MCMC divergences breaching a gate** in a state-space / AR(1) model → triaging by *[→ entry](../recs/time-series-state-space/T1.md)*
divergence **location** (bin the divergent-transition parameter values, compute the tail fraction)
rather than by **count** works.
- why: location is the primary diagnostic — a tight cluster at a structural boundary means something count alone can never reveal.
- conditions: NUTS/HMC; requires extracting per-divergence parameter values and binning them (e.g. arviz).
- tier: 🟢 · source: BlackJAX tuningfork benchmark (merged-49)
- efficacy: {divergences: ~75–90 % of divergent transitions cluster near φ>0.99 (AR(1) unit-root boundary) in the structural case · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the observed divergence signature against the false-positive vs true-pathology templates" · "Distinguish 'too-few-divergences' regime from 'severe misspecification / un-explorable space' regime and decide between tuning vs reparameterization"

**✗ T2** · for divergences clustering tightly at the **AR(1) unit-root boundary** (φ→1, stationary *[→ entry](../recs/time-series-state-space/T2.md)*
variance σ²/(1−φ²) diverges) with all other diagnostics healthy → treating it as a **tuning problem**
(or granting a blanket count-based exception) does **NOT** work.
- why: it is a structural boundary, not a step-size problem; document it as a per-model gate exception and reserve a sampler swap (MCLMC) or reparameterization as the actual fix.
- conditions: ≥~75–90 % cluster persists near the boundary despite higher target acceptance / deeper tree depth / longer warmup.
- tier: 🟢 · source: BlackJAX tuningfork benchmark (merged-49)
- efficacy: {divergences: structural cluster at φ→1 persists across tuning · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Distinguish 'too-few-divergences' regime from 'severe misspecification / un-explorable space' regime and decide between tuning vs reparameterization" · "Compare the observed divergence signature against the false-positive vs true-pathology templates"

**✓ T3** · for **scattered (non-clustered) divergences** → running the **hard-model recipe first** *[→ entry](../recs/time-series-state-space/T3.md)*
(higher target acceptance, deeper max tree depth, longer warmup) before granting any exception works.
- why: with no tight structural cluster the divergences are more likely tuning-addressable, so exhaust the recipe before declaring a structural boundary.
- conditions: no ≥~75–90 % cluster at an explicable boundary; diagnose warmup empirically before guessing.
- tier: 🟢 · source: BlackJAX tuningfork benchmark (merged-49)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the observed divergence signature against the false-positive vs true-pathology templates" · "Diagnose warmup empirically (save_warmup=1, plot traceplots and the step-size trajectory across warmup) before guessing buffer sizes; choose adapt_delta accordingly"

### Dynamic panel / hierarchical AR(1) initial condition

**✗ A1** · for a **Bayesian dynamic panel / hierarchical AR(1)** with individual random intercepts → *[→ entry](../recs/time-series-state-space/A1.md)*
the naive spec `y ~ lag(y) + (1|individual)` **conditioning on the first observation as exogenous** does
**NOT** work (biased AR coefficient δ — Bayesian Nickell bias).
- why: the lagged DV y_{i,t−1} contains the individual effect u_i (correlated with the random intercept by construction), and the first observation is itself a process draw correlated with μ_i.
- conditions: lagged DV + group-level random intercepts; bias worst at small T, shrinks as T grows; stationary |δ|<1.
- tier: 🟡 · source: mc-stan:5136
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Critique the lagged-raw-ordinal-as-covariate construction on principled grounds (process well-definedness, dependency, multivariate generalization)" · "Question whether a time-series/AR structure is identifiable at all at this series length; weigh against a multilevel cross-sectional encoding"

**✓ A2** · for a **hierarchical AR(1)** → the **mean-centered generative form** *[→ entry](../recs/time-series-state-space/A2.md)*
y_it = μ_i + δ·(y_{i,t−1}−μ_i) + ε_it with the **stationary initial condition**
Normal(μ_i, σ_e/√(1−δ²)) works.
- why: models the initial condition's marginal rather than conditioning on it, removing the correlation between the first observation and μ_i that biases δ.
- conditions: stationary AR(1), |δ|<1; unit-root/nonlinear processes need a different initial-condition treatment (same principle, different closed form).
- tier: 🟡 · source: mc-stan:5136
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe to a latent continuous state-space: latent f[t] evolves as a Gaussian (V)AR of previous latent states + covariates + noise" · "Establish a validation harness: fit synthetic data with KNOWN parameters and check recovery" · "Choose the correct missing-data mechanism for the attrition"

### Online filtering vs the hyperparameter posterior

**✓ F1** · for a **frozen (fixed-hyperparameter) linear-Gaussian state-space model** → an **online *[→ entry](../recs/time-series-state-space/F1.md)*
O(1)-per-step Kalman/particle filter recursion** works to update the latent-state mean/covariance as new
data arrive.
- why: the filter propagates the latent state distribution conditional on fixed transition/observation/noise hyperparameters; exact for linear-Gaussian, approximate (EKF/particle) for nonlinear/non-Gaussian.
- conditions: hyperparameters held fixed; latent state is Markov and filterable.
- tier: 🟡 · source: pymc:17654, pymc:17575, pymc:17628
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Probe whether this filter-vs-smoother resemblance is superficial or a real structural property of full-joint Bayesian inference" · "Benchmark the two formulations head-to-head on speed, ESS, and parameter estimates to decide whether the filter is worth its complexity"

**✗ F2** · for **updating the posterior over the model's hyperparameters** (transition/observation/noise *[→ entry](../recs/time-series-state-space/F2.md)*
"deep" parameters) as new data arrive → a **Kalman/particle filter step** does **NOT** work.
- why: the hyperparameter posterior is conditioned on the whole dataset seen so far; the O(1) recursion only propagates the latent state under *frozen* hyperparameters and does nothing to the hyperparameter posterior — genuinely incremental hyperparameter updating is a different problem.
- conditions: inference targeting global hyperparameters; general to MCMC-based PPLs (PyMC/pymc-extras, Stan, NumPyro), not PyMC-specific.
- tier: 🟡 · source: pymc:17654, pymc:17575, pymc:17628
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Probe whether this filter-vs-smoother resemblance is superficial or a real structural property of full-joint Bayesian inference" · "Reframe what the epsilons ARE statistically and recognize them as nuisance latent variables that ideally should be integrated out, not sampled"

**✓ F3** · for **embedding a Kalman-filter likelihood in a PyMC/PPL model** → **building the state-space *[→ entry](../recs/time-series-state-space/F3.md)*
symbolic graph directly from the model RVs** (flatten+concatenate priors into θ, call the Kalman build
inside the model context) works — often better than wrapping a compiled custom Op.
- why: keeps the filter symbolic and differentiable alongside the rest of the model graph, avoiding an opaque Op boundary.
- conditions: PPL with a symbolic backend; a hand-written scan wrapped as a custom Op with pm.Potential is the fallback when a symbolic build is impractical.
- tier: ⚪ candidate (move-derived) · source: (move-only, pymc filter threads context)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Build the state-space symbolic graph directly from the PyMC RVs (flatten+concatenate priors into theta, call update/Kalman build inside the model context)" · "Wrap a hand-written aesara Kalman-filter scan as a custom Op with explicit itypes/otypes and attach its log-likelihood through pm.Potential" · "Question whether the aesara functions need to be compiled/Op-wrapped at all"

### Multimodality (periodic / frequency-domain state-space) — searchable tail

**✓ M1** · for a **periodic/oscillatory time series** with a **multimodal frequency posterior** → *[→ entry](../recs/time-series-state-space/M1.md)*
applying a **smooth time-domain window** (suppressing frequency-domain sidelobes) works to make the
likelihood unimodal.
- why: frequency-domain sidelobes create spurious secondary modes; a smooth window removes them.
- conditions: periodic-signal model; the modes are spectral artifacts, not scientifically distinct solutions.
- tier: ⚪ candidate (single-witness move) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Apply a smooth time-domain window so frequency-domain sidelobes are suppressed/removed, making the likelihood unimodal" · "Map the mode locations against the data geometry (period count on the domain, window length)"

**✓ M2** · for the same multimodal frequency posterior → considering **non-gradient / alternative-domain *[→ entry](../recs/time-series-state-space/M2.md)*
samplers** (slice-based Gibbs, Lomb-Scargle periodogram, full-spectrum sampling; SMC for realtime) works.
- why: gradient samplers get stuck between well-separated modes; alternative-domain methods explore the frequency space differently.
- conditions: multimodal likelihood over frequency; sweep the SNR axis to see whether modes connect or sharpen.
- tier: ⚪ candidate (single-witness move) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Consider non-gradient / alternative-domain samplers (slice-based Gibbs; Lomb-Scargle periodogram; full-spectrum sampling) and sequential MC for realtime" · "Sweep the noise/SNR axis and re-inspect the likelihood surface + chain behaviour (does ambiguity flatten and connect the modes, or sharpen them?)"

**✓ M3** · for a **tiny min-ESS diagnosed as multimodality** → **classifying the modes** (symmetry- *[→ entry](../recs/time-series-state-space/M3.md)*
induced/equivalent vs genuinely different solutions) before treating multimodality as pathology works,
alongside **reparametrizing onto bounded/circular latent quantities** or **enumerate-and-marginalize**
over anchor-point function values.
- why: symmetry-equivalent modes are benign (relabeling), genuinely-different modes are the real target; the fix (circular priors, anchor-point enumeration) depends on which.
- conditions: multimodal posterior surfaced via per-element across-chain marginals; anchor-point enumeration parametrizes by function values at two well-separated points.
- tier: ⚪ candidate (move-derived; multimodality-classify move n_threads=2) · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify the multimodality: are the modes mathematically equivalent (symmetry-induced) or genuinely different solutions" (n_threads=2) · "Reparametrize onto bounded latent quantities (latent covariate / function-values) with circular-friendly priors" · "Enumerate-and-marginalize: parametrize by function values at two well-separated anchor points z1,z2 and enumerate discrete modes"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
brownian_bridge · stochastic_differential_equations

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pymc:N` → `https://discourse.pymc.io/t/…/N`;
`pyro:N` → `https://forum.pyro.ai/t/…/N`):
mc-stan:5136 (dynamic panel data models) · mc-stan:14052 (posterior predictive for HMMs) ·
mc-stan:25312 (infinite gradient in an HMM) · pymc:14751 (HMM custom distribution) ·
pymc:17654 / pymc:17575 / pymc:17628 (online/streaming Bayesian SSM, GSoC 2026) · pyro:3283
(marginal probabilities / Viterbi from HMM)

**BlackJAX tuningfork benchmark** (`merged-49`, no external URL): commits 2f7d70d · b26e00c · 7d86419
(divergence-location triage; AR(1) unit-root boundary exception).

### Conditional volatility (GARCH)

**✓ V1** · for a **conditional-volatility / financial-returns time series** (time-varying variance) → a *[→ entry](../recs/time-series-state-space/V1.md)*
**GARCH(1,1) conditional-variance model** σ²_t = ω + α·ε²_{t−1} + β·σ²_{t−1} works.
- why: models conditional heteroskedasticity (volatility clustering) by letting the variance evolve as a function of the previous squared residual and the previous variance, instead of assuming a constant σ.
- conditions: PyMC `pm.GARCH11(omega, alpha_1, beta_1, initial_vol)`; priors ω~HalfNormal, α~Beta(2,5), β~Beta(5,2), with approximate stationarity α+β<1.
- tier: 🟢 · source: pymc-labs:time-series
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

### Seasonality encodings (Fourier vs sum-to-zero dummies)

**✓ SE1** · for **encoding seasonality** in a time series → a **Fourier basis** (K sin/cos harmonics at the *[→ entry](../recs/time-series-state-space/SE1.md)*
period) works.
- why: smooth and cheap; handles non-integer periods (365.25) and stacked multi-seasonality (weekly + yearly bases summed).
- conditions: heuristic n_terms ≤ period/2 (Nyquist), usually far fewer; more terms = more flexible but risk overfit.
- tier: 🟢 · source: pymc-labs:time-series
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ SE2** · for **encoding seasonality** when you want one interpretable effect per season → **sum-to-zero *[→ entry](../recs/time-series-state-space/SE2.md)*
seasonal dummies** work.
- why: one effect per season under a sum-to-zero identifiability constraint (concatenate([raw, -raw.sum()])) gives a directly interpretable per-season effect.
- conditions: needs integer periods (contrast Fourier, which handles non-integer periods); the sum-to-zero constraint supplies identifiability.
- tier: 🟢 · source: pymc-labs:time-series
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

### GP time-series (temporal kernels, composition, HSGP scaling)

**✓ GP1** · for a **nonparametric time-series model** → a **GP prior over time with composed kernels** works. *[→ entry](../recs/time-series-state-space/GP1.md)*
- why: Matern52 for smooth trends; compose kernels as a structural decomposition — cov_trend (long-lengthscale Matern) + locally-periodic seasonality (Periodic × Matern-decay); kernel composition (additive/multiplicative structure) is the GP analogue of the structural-TS decomposition (C6).
- conditions: exact Latent GP is O(T³) — switch to HSGP (Hilbert-space approximation, m basis functions, boundary factor c) for T > ~500; forecast via gp.conditional(Xnew).
- tier: 🟢 · source: pymc-labs:gaussian-processes
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
