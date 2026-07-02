# ODE / dynamical-system models (mechanistic ODE likelihoods, SDEs, and continuous-time generative flows)

## Claims (the *why* — mid-level, ~3–5)

*Three mid-level principles synthesized from 5 granular claims. Tier is the best-supported of the
granular claims each subsumes. Source short-ids resolve to URLs in the Source key at the bottom.*

### C1 · Continuous-time generative flows: the vector field's reversibility is free, but interior-time supervision is the real scarce resource 🟢
*[→ full entry](../claims/ode-dynamical/C1.md)*

**Statement.** In ODE/SDE-based generative models a *single* learned vector field f governs the whole
transport, so structural properties of f — not architectural choices — set the tradeoffs:
reversibility comes for free (the same f runs forward for training and backward for sampling, with no
need to commit to modeling T or T⁻¹), but f is unconstrained at interior times, creating an
"information desert" that diffusion's analytic Ornstein–Uhlenbeck marginals fill.

**Nuance.** Two distinct structural facts. (1) In single-map normalizing flows one must explicitly
decide to model the forward *or* inverse direction, and special invertible architectures are required;
in a CNF the ODE with terminal condition S(x,1)=u solved *backward* yields the inverse automatically
from the same f — Picard–Lindelöf guarantees well-posedness in both time directions for Lipschitz f —
and likelihood calculations are cleaner mapping p→p_Z than p_Z→p. (2) The flip side: because f is
anchored only at t=0 and t=1, every interior time is unsupervised — the information desert. Diffusion
escapes it by replacing the *learned* forward process with the OU process, whose marginal X_t|X_0=x₀ ~
N(x₀e^(−t), (1−e^(−2t))I) is analytically exact at every t, so each interior time point becomes a
valid, cheaply-sampled training constraint — unlimited synthetic data via reparameterization, no SDE
integration. The advantage is *informational*, not computational. Neither structural gift removes the
trace/Jacobian bottleneck — that is a separate failure mode.

**Conditions.** CNF/diffusion generative models; reversibility needs Lipschitz f; the exact OU closed
form is for constant-coefficient OU (dX=−X dt+√2 dW), extending to smooth non-constant β(t) via
m(t)=exp(−½∫β), v(t)=1−m(t)² (Song et al. 2021); the desert comparison presupposes CNF training
*without* auxiliary kinetic-energy or Frobenius-Jacobian penalties that partially address it.

**Tier.** 🟢 established (subsumes `cnf-dual-direction-same-field`, `ou-process-fixes-cnf-information-desert`).

**Sources.** dansblog:diffusion

---

### C2 · Bayesian inference through an ODE likelihood: per-iteration cost is parameter-dependent, so solver accuracy is a tuned dimension managed jointly with sampling 🟡
*[→ full entry](../claims/ode-dynamical/C2.md)*

**Statement.** When the likelihood requires a numerical ODE/dynamical-system solve, the cost of a
single HMC iteration depends on the current parameter draw (unlike regression), so accuracy and
sampler fidelity must be managed *jointly*; the robust strategy is to sample with a cheap/low-accuracy
solver and importance-sample (PSIS) back to the true posterior, treating solver tolerances, step size
and sub-steps as tuned discretization.

**Nuance.** A single fixed tolerance is wasteful because the *prior* region often contains highly
non-linear, expensive-to-solve (stiff) configurations while the *posterior* concentrates where the
system is nearly linear and cheap — a fixed high tolerance pays the worst-case cost everywhere (the
Monster hierarchical-ODE model can take hours per iteration in the prior region). So: run production
sampling under a loose solver, recompute the log-density under a more accurate solver on the drawn
samples, and PSIS-correct — monitoring whether the higher-precision lp__ over the existing draws has
actually converged.

**Conditions.** Likelihood requires a numerical ODE/dynamical-system solve (PK-PD, compartmental,
kinetic, hierarchical ODE) where solver work scales with how non-linear/stiff the current draw is;
HMC/NUTS; a PSIS/importance-sampling correction is feasible (you can recompute the log-density under a
more accurate solver for the drawn samples).

**Tier.** 🟡 supported (subsumes `forum-c378` ODE-likelihood-cost).

**Sources.** mc-stan:21018 · mc-stan:22683

---

### C3 · Dynamical-system inference is riddled with structural near-identifiabilities that only physics or informative priors resolve 🟢
*[→ full entry](../claims/ode-dynamical/C3.md)*

**Statement.** In both deterministic-ODE and SDE inference, distinct parameters routinely collapse
onto a single identifiable combination — g and k onto the terminal-velocity ratio mg/k, measurement
noise σ and diffusion amplitude τ onto one observed-variance budget — leaving a posterior ridge the
data cannot break; resolving it by an informative prior or by fixing one parameter is a *load-bearing,
substantive* modeling decision, not a technical convenience.

**Nuance.** The mechanism is physical/structural, not numerical. For a *light* ball near terminal
velocity, fall time grows nearly linearly with height and the trajectory constrains only |v_T|²=mg/k,
so any (g,k) on that ridge fits equally — the inverse-gamma priors on g and k are what actually pin
the posterior. In SDE models σ (through the measurement model N(x,σ)) and τ (through the transition
N(·,τ√dt)) inject variance by *different routes* but have a similar effect on observed y, especially
when observation density is low relative to the diffusion correlation length; fixing one avoids a real
ridge. These ridges are diagnosable — pair-plots show the tight correlation, and a controlled ablation
(fix the suspect parameter at constants vs free it, watch divergences appear only when free; add data
and watch the posterior pull off the boundary) localizes them — but they are *not* fixable by sampler
tuning alone.

**Conditions.** Deterministic ODE with a near-degenerate regime (light ball near terminal velocity;
only light-ball data, no heavy-ball data to separately identify g) or SDE with σ and τ both free
(severity grows as observations become sparse relative to the correlation length). The SDE case is
*asserted*, not empirically demonstrated in the source (medium confidence).

**Tier.** 🟢 established (subsumes `near-identification-ridge-in-drag-gravity`; plus supported
`sigma-tau-non-identifiability-in-sde-models` 🟡).

**Sources.** betanalpha:falling · betanalpha:stochastic_differential_equations

---

## Practical — what works / what doesn't (comprehensive, bidirectional)

*35 recs (25 ✓ / 10 ✗). `efficacy` is the benchmark-shaped slot
`{divergences, min_ess, ess_per_sec, rmse, coverage}` — every field is `pending` here because the
input carries no experiment metrics (a hole for a future tuningfork run or one-off experiment to plug
into). Attached `moves` are the diagnostic "how"; every move in the input is single-witness
(n_threads=1), so recs grounded *only* on a move are tiered ⚪ candidate (the searchable tail), while
recs inheriting a claim take the claim's tier. `(context …)` on a ⚪ source marks the case study the
move plainly belongs to without being asserted as a cited witness.*

### Solver cost & accuracy (ODE-likelihood inference)

**✓ S1** · for a Bayesian model with an **ODE-solve likelihood** → **sample under a cheap/low-accuracy *[→ entry](../recs/ode-dynamical/S1.md)*
solver and PSIS-correct** back to the true posterior works.
- why: per-iteration cost is parameter-dependent (prior region stiff/expensive, posterior nearly linear/cheap); a loose solver during sampling plus a high-accuracy recompute + importance weights recovers the true posterior at a fraction of the cost.
- conditions: ODE/dynamical-system likelihood (PK-PD, compartmental, kinetic, hierarchical ODE); HMC/NUTS; you can recompute the log-density under a more accurate solver on the drawn samples.
- tier: 🟡 · source: mc-stan:21018, mc-stan:22683
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Sweep ODE solver controls: tighten tolerances (1e-6→1e-8/1e-10), vary max_num_steps, try the stiff solver, externally re-time-step" · "Monitor discretization convergence: recompute lp__ at higher precision (more sub-steps) over the existing draws (generate_quantities)" · "Reframe from counting to bias-assessment: how much posterior mass is missed"

**✗ S2** · for an **ODE-likelihood model** → a **single fixed solver tolerance across the whole run** *[→ entry](../recs/ode-dynamical/S2.md)*
does **NOT** work (wasteful).
- why: a fixed high tolerance pays worst-case cost everywhere — the prior region contains highly non-linear/stiff configurations (hours per iteration in the Monster model) while the posterior concentrates where the system is nearly linear and cheap.
- conditions: cost scales with the stiffness/non-linearity of the current draw; wide prior relative to a concentrated posterior.
- tier: 🟡 · source: mc-stan:22683, mc-stan:21018
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Sweep ODE solver controls (tolerances / max_num_steps / stiff solver / external re-time-stepping)" · "Tune warm-up to the precision requirements (precision-adaptive, incremental, parallel) rather than default warm-up"

**✓ S3** · for a **stiff ODE likelihood** → replace the black-box stiff solver with an *[→ entry](../recs/ode-dynamical/S3.md)*
**operator-splitting scheme** (exact matrix-exponential flow for the linear part + a cheap explicit
approximation for the rest) works.
- why: the linear part has an exact flow, so only the non-linear remainder needs numerical work — much cheaper than a general stiff solver.
- conditions: ODE with a separable linear part; move-derived (single witness).
- tier: ⚪ candidate · source: (move-only, n_threads=1; context mc-stan:22683)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Replace the black-box stiff solver with an operator-splitting scheme: exact flow for the linear part (matrix exponential) plus a cheap explicit approximation"

**✓ S4** · for a **hierarchical ODE model parallelized with reduce_sum** → move the per-subject **ODE *[→ entry](../recs/ode-dynamical/S4.md)*
solve INSIDE the partial_sum function** works.
- why: parallelizing only the cheap likelihood leaves the expensive ODE serial; putting the solve inside partial_sum makes the parallelized work the ODE itself.
- conditions: within-chain parallelism (reduce_sum/map_rect); per-subject independent solves.
- tier: ⚪ candidate · source: (move-only, n_threads=1; context mc-stan:22683)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Move the expensive computation (the per-subject ODE solve) INSIDE the partial_sum function so the parallelized work is the ODE, not just the cheap likelihood"

**✓ S5** · for an ODE fit whose **warmup is dominated by solver precision** → **tune warmup to the *[→ entry](../recs/ode-dynamical/S5.md)*
precision requirements** (precision-adaptive / incremental / parallel) works vs default warmup.
- why: default warmup wastes effort at uniform precision; adapting precision to the phase matches solver work to need.
- conditions: solver-cost-dominated warmup; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1; context mc-stan:21018)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Tune warm-up to the precision requirements (precision-adaptive, incremental, parallel) rather than relying on default warm-up"

**✓ S6** · for deciding whether a **loose-solver posterior is trustworthy** → **reframe from counting *[→ entry](../recs/ode-dynamical/S6.md)*
divergences to bias assessment** (false vs true positive, how much posterior mass is missed) works.
- why: the decision-relevant question is bias, not a raw count — the same count can be benign or fatal depending on the missed mass.
- conditions: approximate-solver / discretized likelihood; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe from counting to bias-assessment: decompose tolerability into false- vs true-positive and how much posterior mass is missed" · "Run a stability / sensitivity sweep across nuisance settings and check the decision-relevant summaries plus convergence diagnostics" · "Quantify the bias directly with a simulation-based calibration tool rather than stability heuristics"

**✓ S7** · for **confirming solver/discretization-induced approximation is tolerable** → *[→ entry](../recs/ode-dynamical/S7.md)*
**simulation-based calibration (SBC)** works (over stability heuristics).
- why: SBC quantifies the bias directly rather than inferring it from the stability of summaries.
- conditions: a generative model is available to simulate from; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Quantify the bias directly with a simulation-based calibration tool rather than relying on stability heuristics" · "Run a stability / sensitivity sweep across nuisance settings and check decision-relevant summaries plus convergence diagnostics"

### Structural near-identifiability & posterior ridges

**✗ R1** · for inferring **both gravity g and drag k from light-ball data alone** → the joint fit does *[→ entry](../recs/ode-dynamical/R1.md)*
**NOT** work (near-unidentifiable).
- why: near terminal velocity the trajectory constrains only |v_T|²=mg/k, so a whole ridge of (g,k) pairs producing the same terminal velocity fit equally.
- conditions: ball light enough to be near terminal velocity across the observed heights; only light-ball data (no heavy-ball data to separately identify g).
- tier: 🟢 · source: betanalpha:falling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the converged posterior pairplots for tight ridges; trace each strongly correlated pair back to the single model expression where they co-occur" · "Re-derive the ODE/forward model from first principles (mass conservation per compartment) and analyze for hidden linearity / parameter combinations" · "Run the controlled ablation: fix k at several constants vs free k; observe whether divergences appear only when k is free"

**✓ R2** · for the **g/k ridge** → an **informative/regularizing prior on g and k** works *[→ entry](../recs/ode-dynamical/R2.md)*
(load-bearing).
- why: the data pin only the ratio; the inverse-gamma priors on g and k are what actually resolve the individual values.
- conditions: near-terminal-velocity regime; the prior must carry genuine external information.
- tier: 🟢 · source: betanalpha:falling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Probe prior/boundary effects: beta(1.5,1.5) vs uniform, drop the lower=0 bound on k, widen to U(−1,1); parcoord plots; check whether mass concentrates" · "Add more simulated data points and watch whether divergences shrink and the posterior pulls away from the boundary"

**✗ R3** · for an **SDE model** → leaving **measurement noise σ and diffusion amplitude τ both free** *[→ entry](../recs/ode-dynamical/R3.md)*
does **NOT** work (non-identifiable ridge).
- why: σ (via N(x,σ)) and τ (via the transition N(·,τ√dt)) inject variance by different routes but have a similar effect on observed y; the posterior in (σ,τ) is a ridge.
- conditions: both σ and τ simultaneously free; severity grows when observations are sparse relative to the SDE correlation length; asserted, not demonstrated in the source (medium confidence).
- tier: 🟡 · source: betanalpha:stochastic_differential_equations
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the converged posterior pairplots for tight ridges; trace each strongly correlated pair back to the single model expression where they co-occur"

**✓ R4** · for an **SDE with a σ/τ ridge** → **fixing one of σ or τ** works (substantive modeling *[→ entry](../recs/ode-dynamical/R4.md)*
choice).
- why: it removes a genuine ridge, not a minor technical convenience — the data cannot separate them, so one must be supplied.
- conditions: sparse observations relative to correlation length; the fixed value must be defensible.
- tier: 🟡 · source: betanalpha:stochastic_differential_equations
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the converged posterior pairplots for tight ridges; trace each correlated pair to the model expression where they co-occur"

**✓ R5** · for **localizing a suspected identifiability ridge** → a **controlled ablation** (fix the *[→ entry](../recs/ode-dynamical/R5.md)*
suspect parameter at several constants vs free it, watch whether divergences appear only when free)
works.
- why: if pathology appears only when the parameter is free, it is that parameter's (near-)non-identifiability, not a global problem.
- conditions: a candidate offending parameter (e.g. k); move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1; context betanalpha:falling)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run the controlled ablation: fix k at several constant values (free all other params) vs free k; observe whether divergences appear only when k is free" · "Add more simulated data points and watch whether divergences shrink and the posterior pulls away from the boundary"

**✓ R6** · for **finding which parameters are entangled** → inspect converged **pairplots for tight *[→ entry](../recs/ode-dynamical/R6.md)*
ridges** and trace each correlated pair to the single model expression where they co-occur works.
- why: the ridge in parameter space points directly at the model term (e.g. mg/k) that couples them.
- conditions: converged (or partially converged) draws to plot; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1; context betanalpha:falling)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the converged posterior pairplots for tight ridges; trace each strongly correlated pair back to the single model expression where they co-occur"

**✓ R7** · for **exposing hidden parameter combinations** → **re-derive the ODE/forward model from *[→ entry](../recs/ode-dynamical/R7.md)*
first principles** (e.g. mass conservation per compartment) and analyze its structure for linearity
works.
- why: first-principles re-derivation surfaces the identifiable combination (terminal velocity, a rate ratio) that the black-box model hides.
- conditions: a mechanistically interpretable model; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1; context betanalpha:falling)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Re-derive the ODE/forward model from first principles (mass conservation per compartment) and analyze its structure for hidden linearity and parameter combinations" · "Pin down units and magical scaling constants by matching the equation dimensionally to the figures and table values"

**✓ R8** · for **testing whether a ridge is data-limited vs structural** → **add more (simulated) *[→ entry](../recs/ode-dynamical/R8.md)*
data** and watch whether divergences shrink and the posterior pulls off the boundary works.
- why: if more data collapses the ridge it was data-limited; if it persists, the non-identifiability is structural.
- conditions: ability to simulate additional data; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1; context betanalpha:falling)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Add more simulated data points and watch whether divergences shrink and the posterior pulls away from the boundary"

### Boundary, constraints & reparameterization

**✗ P1** · for a **positive parameter near a boundary** (e.g. drag k with `lower=0`) → treating the *[→ entry](../recs/ode-dynamical/P1.md)*
bound as innocuous does **NOT** work.
- why: a hard `lower=0` bound can trap posterior mass at zero and manufacture divergences; the boundary interacts with the near-identifiability of the ridge.
- conditions: a constrained parameter whose mass piles at the boundary; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1; context betanalpha:falling)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Probe prior/boundary effects: beta(1.5,1.5) vs uniform, drop the lower=0 bound on k, widen to U(−1,1); parcoord plots; check whether mass concentrates" · "Interrogate the truncation: check whether truncation occurs in the prior tail and what it does on the unconstrained scale"

**✓ P2** · for an ODE model with **parameters on wildly different scales** → **manually rescale each *[→ entry](../recs/ode-dynamical/P2.md)*
parameter to O(1) around zero** via a transformed-parameter reparameterization works.
- why: O(1) parameters condition the geometry for HMC; also move ODE constants that don't need sensitivity out of the sampled set.
- conditions: parameters spanning many orders of magnitude; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Manually rescale each parameter to be O(1) around zero via a transformed-parameter reparameterization; move ODE constants that don't need sensitivity out"

**✓ P3** · for **constraint specification** → **separate hard (physical, e.g. positivity) from soft *[→ entry](../recs/ode-dynamical/P3.md)*
(plausible-range)** constraints and replace soft interval bounds with priors works.
- why: hard bounds encode physics; soft plausibility belongs in a prior, not a truncation that distorts the tail on the unconstrained scale.
- conditions: a model mixing physical and plausibility constraints; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit constraints: separate hard (physical) from soft (plausible-range); replace soft interval bounds with priors" · "Interrogate the truncation: check whether truncation occurs in the prior tail and what it does on the unconstrained scale"

**✓ P4** · for a **reparameterized/transformed ODE model** → **audit the generative semantics** (every *[→ entry](../recs/ode-dynamical/P4.md)*
transform square, invertible, with a non-singular / non-zero-determinant Jacobian; a `~` on a derived
quantity is a bug) works.
- why: an illegal transform or a sampling statement on a deterministic quantity silently corrupts the target density.
- conditions: any change-of-variables / non-centering reparameterization; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the generative/probabilistic semantics: every parameter transform must be square, invertible, with a non-singular (non-zero-determinant) Jacobian; a '~' on a derived quantity is a bug"

### Non-differentiable ODE right-hand side

**✗ N1** · for an **ODE RHS with conditionals/switches** that are continuous but **not differentiable *[→ entry](../recs/ode-dynamical/N1.md)*
in a parameter** → gradient-based sampling does **NOT** work cleanly.
- why: HMC needs smooth gradients; a switch whose argument depends on a parameter injects a non-differentiable kink the leapfrog integrator mishandles.
- conditions: ODE RHS with a parameter-dependent switch/conditional; HMC/NUTS; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the ODE right-hand side for conditionals/switches that are continuous but not differentiable in a parameter; confirm whether the switch argument depends on a parameter"

**✓ N2** · for a **non-differentiable ODE switch** → **smoothing the discontinuity** works, but only if *[→ entry](../recs/ode-dynamical/N2.md)*
the smoothing is *genuinely mild*.
- why: a large-slope tanh is numerically still a discontinuity; a mild smoothing restores usable gradients (or eliminate the switch entirely).
- conditions: the smoothing must be mild relative to the solver step; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Smooth the discontinuity, but check that the smoothing is actually mild (large-slope tanh is numerically still a discontinuity); consider eliminating the switch"

### Multimodality

**✗ M1** · for **unexpected multimodality** in a dynamical-model posterior → treating it as a **real *[→ entry](../recs/ode-dynamical/M1.md)*
feature** does **NOT** work (suspect a code bug first).
- why: unexplained multimodality frequently traces to a bug in the parameter constraints/transforms of a non-centering reparameterization, not a genuine model feature.
- conditions: unexpected/unexplained modes; a reparameterized model; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Treat unexpected multimodality as a code-bug suspect (not a real feature); audit the exact parameter constraints/transforms in the non-centering reparameterization"

**✓ M2** · for **genuine multimodality** → **characterize each mode with posterior predictive checks** *[→ entry](../recs/ode-dynamical/M2.md)*
(simulate the ODE trajectory at representative points from each mode) works.
- why: simulating trajectories per mode reveals which modes are physically plausible vs artifacts.
- conditions: a full MCMC run that has visited the modes; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run full MCMC, then characterize each mode with posterior predictive checks — simulate the ODE trajectory at representative points from each mode"

**✓ M3** · for **cheaply locating major and minor modes** → run an **approximate optimization-based *[→ entry](../recs/ode-dynamical/M3.md)*
explorer (Pathfinder)** works.
- why: Pathfinder finds modes cheaply and yields a high-mass starting point for a quick posterior check.
- conditions: a multimodal posterior; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run an approximate/optimization-based explorer (Pathfinder) to locate major and minor modes cheaply, and use a single high-mass point for a quick posterior check"

**✓ M4** · for a **periodic dynamical model with period-induced multimodality** → **reparameterize to *[→ entry](../recs/ode-dynamical/M4.md)*
sample the orbital period** (or a period ratio) and derive the force parameter k via Kepler's 3rd law
works.
- why: the modes are aliases of the period; sampling the period directly (with a transform to k) removes the aliasing.
- conditions: an orbital/periodic ODE where a period↔force relation exists; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize: make orbital period (or a period ratio) the sampled parameter and derive the force parameter k from it via Kepler's 3rd law, with a transform"

**✓ M5** · for **suppressing spurious period-alias modes without changing the model** → **constrain via *[→ entry](../recs/ode-dynamical/M5.md)*
inits and/or a truncated prior** consistent with the one-period hypothesis works.
- why: it keeps the sampler in the intended single-period basin without altering the generative structure.
- conditions: a defensible one-period hypothesis; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Constrain MCMC via inits and/or a truncated prior consistent with the one-period hypothesis (no model-structure change)"

**✓ M6** · for **pruning uninteresting modes before an expensive fit** → a **two-stage *[→ entry](../recs/ode-dynamical/M6.md)*
(multi-resolution) solver strategy** (loose tolerance to weed out modes, then tighten) works.
- why: a cheap approximate model discards uninteresting modes; the expensive accurate solver only refines the survivors.
- conditions: a solve-cost-dominated multimodal problem; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1; context mc-stan:22683)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Two-stage (multi-resolution) solver strategy: sample from an approximate model (loose solver tolerance) to cheaply weed out uninteresting modes, then refine" · "Run an approximate/optimization-based explorer (Pathfinder) to locate major and minor modes cheaply"

### Prior specification & elicitation

**✗ Q1** · for **supplying a prior scale by pre-fitting the data** (empirical-Bayes prior tuning) → *[→ entry](../recs/ode-dynamical/Q1.md)*
does **NOT** work as well as it looks.
- why: tuning the prior to the same data used for inference uses the data twice — the prior should encode information logically independent of the data you then condition on, so double-counting the same data yields overconfident inference; the apparent improvement hides that double-counting.
- conditions: prior scale set from a pre-fit on the inference data; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Name the procedure as empirical-Bayes prior tuning and diagnose WHY it is worse than it looks, invoking the double-use-of-data problem (the prior must be independent of the data you condition on)" · "Challenge the necessity of the pre-fit; ask whether prior experiments or first-principles domain reasoning could supply the scale instead"

**✓ Q2** · for **supplying that scale legitimately** → draw it from **prior experiments or *[→ entry](../recs/ode-dynamical/Q2.md)*
first-principles domain reasoning** (external information) works.
- why: the prior encodes external information whose logical role is independent of temporal order, so previous experiments/domain knowledge are valid sources.
- conditions: genuine external information available; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Challenge the necessity of the pre-fit; ask whether prior experiments or first-principles domain reasoning could supply the scale" · "Reframe 'prior information' as 'external information' — decouple temporal order from logical role"

**✗ Q3** · for **validating a prior** → checking **prior-predictive consequences against the OBSERVED *[→ entry](../recs/ode-dynamical/Q3.md)*
data** does **NOT** work.
- why: prior predictive checks must be judged against implicit domain expertise (what is plausible), not against the data you are about to condition on.
- conditions: the prior-predictive-check step; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Correct the semantics of prior predictive checks: check consequences against IMPLICIT DOMAIN EXPERTISE, not against the observed data"

**✓ Q4** · for **eliciting a prior on an awkwardly-scaled ODE parameter** → elicit on **whatever scale *[→ entry](../recs/ode-dynamical/Q4.md)*
is intuitive, then rescale** the prior/parameter (disentangle measurement units from parameter
magnitude) works.
- why: separating units (measurement scale) from domain belief (parameter magnitude) lets you state the prior where intuition lives and transform it.
- conditions: a parameter whose natural scale differs from the intuitive one; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Disentangle measurement-scale (units) from parameter-magnitude (domain belief): elicit the prior on whatever scale is intuitive, then rescale" · "Pin down units and magical scaling constants by matching the equation dimensionally to the figures and table values"

**✗ Q5** · for **iterative model building** → treating **post-hoc model selection** as no worse than *[→ entry](../recs/ode-dynamical/Q5.md)*
prior tuning does **NOT** work (deeper hazard).
- why: selecting the model after seeing the fit is a separate, deeper hazard than tuning a prior and must be flagged as such.
- conditions: iterative model building on the same data; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Surface and flag post-hoc model selection as a separate, deeper hazard than prior tuning"

### Model specification (zeros, hierarchical centering)

**✗ D1** · for **structural zeros** in the data of a dynamical/count model → treating them as a *[→ entry](../recs/ode-dynamical/D1.md)*
**numeric nuisance** does **NOT** work.
- why: zeros are a model-specification signal; match the likelihood to the data-generating process (discrete count, censoring) rather than patching numerically.
- conditions: data with meaningful zeros; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Treat the zeros as a model-specification issue, not a numeric nuisance: match the likelihood to the data-generating process (discrete count, censoring)"

**✓ D2** · for a **hierarchical ODE model unsure between CP and NCP** → **continuously adapt the *[→ entry](../recs/ode-dynamical/D2.md)*
centeredness during warmup** rather than committing works.
- why: a continuously-adapted centeredness interpolates to the right parameterization instead of a fixed all-CP/all-NCP choice.
- conditions: a hierarchical parameterization with warmup-time adaptation available; move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Adapt the centeredness of the hierarchical parametrization continuously during warmup (rather than committing to fully centered or fully non-centered)"

### Stability & sensitivity validation

**✓ V1** · for **validating an ODE-inference result against nuisance settings** → run a *[→ entry](../recs/ode-dynamical/V1.md)*
**stability/sensitivity sweep** across those settings and check decision-relevant summaries +
convergence diagnostics works.
- why: robustness of the decision-relevant summaries across nuisance settings is the practical proxy for trustworthiness.
- conditions: identifiable nuisance settings (solver tolerance, prior, init); move-derived.
- tier: ⚪ candidate · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a stability / sensitivity sweep across nuisance settings and check the decision-relevant summaries plus convergence diagnostics"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
falling · stochastic_differential_equations

**Dan Simpson blog** (`dansblog:diffusion` →
`https://dansblog.netlify.app/posts/2023-01-30-diffusion/diffusion.html`)

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`):
mc-stan:21018 (`fitting-ode-models-best-efficient-practices`) ·
mc-stan:22683 (`the-monster-model-hierarchical-ode-models`)
