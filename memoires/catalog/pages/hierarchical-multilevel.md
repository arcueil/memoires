# Hierarchical / multilevel models

## Claims (the *why* — mid-level, ~3–5)

*Five mid-level principles synthesized from 49 granular claims. Tier is the best-supported
of the granular claims each subsumes. Source short-ids resolve to URLs at the bottom of each claim.*

### C1 · Hierarchical geometry is intrinsic and load-bearing — sampler tuning can't cure it 🟢
*[→ full entry](../claims/hierarchical-multilevel/C1.md)*

**Statement.** The funnel in (θ, log τ) space is a property of the *model* (the product of the
prior and the per-group likelihood), not of the sampler, so it cannot be fixed by turning sampler
knobs, adding cores, or collapsing to a point estimate; and getting it wrong is not merely slow —
it *silently biases* the recovered posterior.

**Nuance.** Several distinct symptoms share this one root. A divergence count that stays roughly
*flat* as `adapt_delta` is swept 0.85→0.99 is the fingerprint of true geometric non-ergodicity —
no step-size reduction restores the CLT the funnel breaks (and a near-zero count at the *largest*
step size is a false negative: the chain never entered the funnel). The centered parameterization
underestimates group-level posterior variance by ~10–30 % even when the posterior *means* look
correct, so standard summaries hide the damage. Parallelization (map_rect/reduce_sum/MPI) cuts cost
*per gradient* but never effective-samples-per-gradient, which geometry alone sets — so a stuck
model must be re-specified, not parallelized. A joint-mode/MAP estimate lands in the funnel neck
where τ collapses to zero and overfits the per-group effects. Conversely, raw dimensionality is
*not* the enemy: NUTS scales from 2→202 parameters cleanly when the latents are conditionally
independent given the hyperparameter (block-diagonal Hessian) — it is *local* geometry, not size,
that governs cost.

**Conditions.** Normal hierarchical model, HMC/NUTS; failure manifests as divergences, low E-BFMI,
extreme leapfrog counts; single-chain diagnostics show the declining-ESS pattern most clearly.

**Tier.** 🟢 established (subsumes `funnel-is-universal`, `curvature-pinch-suspension-bias`,
`flat-divergence-count…non-ergodicity`, `divergence-spatial-location`,
`wrong-hierarchical-parameterization-silently-biases`, `nuts-scales-to-high-d`; plus supported
`forum-c199` parallelization, `forum-c473` MAP).

**Sources.** betanalpha:hierarchical_modeling · betanalpha:divergences_and_bias ·
betanalpha:markov_chain_monte_carlo · betanalpha:rstan_workflow · betanalpha:stan_intro ·
mc-stan:14303 · mc-stan:14300 · mc-stan:7588 · pymc:16512 · pymc:12418 · pymc:760 · pymc:3793

---

### C2 · CP and NCP are exactly complementary and data-dependent — parameterize per-level, not monolithically 🟢
*[→ full entry](../claims/hierarchical-multilevel/C2.md)*

**Statement.** Centered (CP) and non-centered (NCP) parameterizations have *complementary* failure
regimes governed by per-group data richness: CP funnels when data are weak and the prior dominates;
NCP inverts-funnels when data are dense and the likelihood dominates. Neither monolithic choice is
universally safe — the correct parameterization is chosen per level/per group.

**Nuance.** The funnel is always present in the CP prior; the posterior is prior × likelihood, so a
diffuse likelihood leaves it exposed while a sharp one suppresses it. NCP works by writing
θ = μ + τ·θ̃ with θ̃ ~ N(0,1), decoupling τ from the sampling geometry — but under strong data it
just relocates a τ·η = const hyperbolic (inverted) funnel into the likelihood. Hence the resolution
for *unbalanced* data is a **mixed** parameterization (CP for the data-rich groups, NCP for the
sparse ones), with a problem-specific threshold — not a tuned global rule. In *nested* hierarchies
the same rule reads off data-aggregation depth (shallow/root levels → CP, deep/disaggregated levels
→ NCP). Adding higher-order interactions to an overlapping model can *retroactively* destabilize
main effects that were well-behaved, forcing re-centering. And NCP has **no analogue** when the
funnel is likelihood-induced (underdetermined regression: σ couples all coefficients in
y ~ N(Xβ, σ), with no scale parameter in a prior to decouple).

**Conditions.** Normal hierarchical model, HMC/NUTS; complementarity is exact for conjugate normal
hierarchies; per-level assessment required; a discretized SDE is the same structure (N groups of
size 1 → observed states CP, unobserved states NCP).

**Tier.** 🟢 established (subsumes `cp-ncp-complementary`, `ncp-resolves-cp-funnel`,
`ncp-restores-ergodicity`, `ncp-does-not-fix-likelihood-induced-funnel`,
`mixed-parameterization-is-the-correct-solution`, `nested-hierarchy-depth`,
`interaction-terms-retroactively-destabilize`, `sde-inference-as-hierarchical`,
`hierarchical-funnel-is-prior-x-likelihood` ⚪).

**Sources.** betanalpha:hierarchical_modeling · betanalpha:factor_modeling ·
betanalpha:divergences_and_bias · betanalpha:pystan_workflow · betanalpha:rstan_workflow ·
betanalpha:underdetermined_linear_regression · betanalpha:stochastic_differential_equations

---

### C3 · With few groups the pathology moves up to the population scale τ, whose weakly-informed prior is load-bearing 🟢
*[→ full entry](../claims/hierarchical-multilevel/C3.md)*

**Statement.** τ (the between-group SD) is informed only by the *scatter of group means*, so far
less data flows to it than to likelihood-linked parameters; with few groups or few observations per
group its prior becomes load-bearing — it actively shapes both the inference *and* the funnel
geometry.

**Nuance.** When the number of groups K is small (~2–5), a funnel appears in the *population*
parameters (μ, τ) that is independent of the individual-level parameterization — reparameterizing to
NCP does not fix it and can make it worse, because the non-identifiability is at the population
level. The τ prior's *shape* is a design choice: infinity-suppressing (half-normal) priors cut the
NCP inverted funnel at large τ; zero-suppressing priors cut the CP neck at small τ; a flat prior
leaves both parameterizations fragile. Vague/uniform priors (uniform(0,10), normal(0,10)) on scale
hyperparameters are *not* non-informative — they leave group effects unconstrained and chains
meander around initialization. Where τ=0 is a plausible base model, the PC prior for a Gaussian SD
is *exactly* Exponential(λ) (KL distance = τ), which is why an Exponential prior on a random-effect
SD is principled — but only τ, not the data-noise σ, is a genuine "flexibility parameter" (σ=0 is
implausible).

**Conditions.** Exchangeable hierarchical model with a between-group scale; sharpens as K small or
n_j small; base value must collapse to a plausible simpler model.

**Tier.** 🟢 established (subsumes `tau-prior-load-bearing`, `tau-prior-shape-modulates`,
`small-k-population-funnel`, `pc-prior-for-gaussian-sd-is-exactly-exponential`,
`flexibility-param-is-contextual`; plus supported `forum-c345` vague-priors).

**Sources.** dansblog:monkey · dansblog:priors4 · betanalpha:hierarchical_modeling · mc-stan:39435

---

### C4 · Partial pooling is the structural payoff — and its shrinkage artifacts are features, not bugs 🟢
*[→ full entry](../claims/hierarchical-multilevel/C4.md)*

**Statement.** The defining feature of a multilevel model is that τ is *learned from data* rather
than fixed, so groups borrow strength (shrink together when similar, separate when different); this
is a real predictive and inferential win over no-pooling, and the visible consequences of shrinkage
must not be mistaken for misspecification.

**Nuance.** No-pooling fails at sparse groups (n_j=1–2): each group estimated in isolation produces
astronomically large SEs and high-leverage cross-validation points, which partial pooling collapses.
But shrinkage leaves fingerprints that look like problems and are not: a positive slope in a
residuals-vs-fitted plot is a *mechanical* consequence of extreme groups being pulled toward the
global mean (steeper at n_j=1–2, attenuating but never vanishing with larger n_j), not evidence of a
bad model; and a random intercept that dominates the variance partition (high ICC / R²) is *not* a
reason to drop it — dropping it just discards the grouping structure and leaves within-group
residual correlation, while adding genuinely predictive covariates simply *reattributes* variance
away from the random effect.

**Conditions.** Any partial-pooling model with shrinkage; effects most extreme at very small n_j;
exchangeable groups.

**Tier.** 🟢 established (subsumes `exchangeability-enables-tau-to-adapt`,
`no-pooling-fails-at-sparse-groups`, `haunted-residual-vs-fitted-is-shrinkage`; plus supported
`forum-c452` don't-drop-random-intercept).

**Sources.** dansblog:monkey · mc-stan:33138

---

### C5 · Hierarchical structure is riddled with identifiability degeneracies that priors don't neutrally fix and derived summaries don't resolve uniquely 🟢
*[→ full entry](../claims/hierarchical-multilevel/C5.md)*

**Statement.** Multilevel structure creates location and decomposition non-identifiabilities that a
prior only *softens*, and downstream quantities (ICC, R², marginal effects, "signal") are
definition- and scale-dependent — there is no single right number.

**Nuance.** A global intercept plus zero-mean group effects is location non-identified: a constant
shifts freely between them, so they trade off and the group-level scale inflates. The natural fix is the non-centered exchangeable form α_k ~ N(0, σ) about a *separate* intercept (a free μ *together with* a separate intercept is itself the confounded pair — maintainer gate 2026-07-02, aligning the claim with the corrected rec D2) — *not* a hard
sum-to-zero constraint, which is not a neutral reparameterization: it changes the generative model
(pins the population mean to the sample average, breaks conditional independence / infinite
exchangeability). Residual decompositions θ_l = θ + δ_l are mathematically arbitrary — neither piece
has independent meaning, so counterfactuals ("baseline is what θ_l would be if δ_l=0") mislead; this
worsens with interaction levels, whose counts explode multiplicatively (L₁×L₂×…) into sparse,
prior-fixed, non-identified cells. Fixing a random-effect *correlation* to zero (`||`, lkj-at-
identity) constrains only the parameter, not the empirical correlation of the estimated effects. And
derived summaries are not unique: ICC/VPC = var_group/(var_group+var_resid) holds *only* for the
Gaussian identity-link case; "Bayesian R²" has two non-equivalent estimators that disagree and can
even reverse the conditional>marginal ordering for mixed models; marginal effects depend on
averaging *before* summarizing; and phylogenetic "signal" is just the ICC/heritability ratio.

**Conditions.** Hierarchical/varying-effects models; matters most when predicting new groups or
interpreting/putting priors on population hyperparameters, or reporting variance-partition summaries.

**Tier.** 🟢 established (subsumes `residual-parameters-no-independent-meaning`,
`interaction-level-combinatorial-explosion`; plus supported `forum-c15` location-non-id,
`forum-c17` hard-constraint, `forum-c47` RE-correlation, `merged-4` ICC/VPC, `forum-c342` R²,
`forum-c335` marginal-effects, `forum-c257` phylogenetic-signal).

**Sources.** betanalpha:factor_modeling · mc-stan:39536 · mc-stan:17086 · mc-stan:26215 ·
mc-stan:1382 · mc-stan:17273 · mc-stan:4409 · mc-stan:19723 · mc-stan:34029 · mc-stan:20461 ·
mc-stan:24172 · mc-stan:16457

---

## Practical — what works / what doesn't (comprehensive, bidirectional)

*62 recs (31 ✓ / 31 ✗, plus 2 bidirectional). `efficacy` is the benchmark-shaped slot
`{divergences, min_ess, ess_per_sec, rmse, coverage}` — filled from any metric present in the input,
else `pending`. Attached `moves` are the diagnostic "how", matched by relevance. Single-witness
candidate moves are tiered ⚪ and kept as the searchable tail.*

### Parameterization (CP vs NCP)

**✓ P1** · for a normal hierarchical model with **weak per-group data** (few obs/group, diffuse *[→ entry](../recs/hierarchical-multilevel/P1.md)*
likelihood) → **non-centered parameterization (NCP)** works.
- why: relocates the τ-coupling into a deterministic transform θ=μ+τ·θ̃, leaving an isotropic space; eliminates the CP funnel's divergences.
- conditions: weakly-informative data; half-Cauchy/half-normal τ prior; HMC/NUTS. Advantage shrinks/reverses under strong data.
- tier: 🟢 · source: betanalpha:divergences_and_bias, betanalpha:rstan_workflow, betanalpha:pystan_workflow
- efficacy: {divergences: ~0 (Eight Schools NCP) · min_ess: n_eff/iter≈1.0 for μ & θ̃ (vs ≈0.007 for CP τ) · ess_per_sec: pending · rmse: running-mean log τ converges to truth ≈0.77 · coverage: pending}
- moves: "Identify the centered parameterization as root cause and prescribe non-centered" · "Reparameterize the group-level effects to non-centered form (gamma_raw ~ std_normal…)" · "Verify the reparameterized geometry is decoupled"

**✗ P2** · for a normal hierarchical model with **strong/dense per-group data** → NCP does **NOT** *[→ entry](../recs/hierarchical-multilevel/P2.md)*
work (inverts the funnel).
- why: fixing θ̃ enforces the hyperbolic constraint η_k·τ=const in the likelihood → an inverted funnel that worsens as the likelihood narrows.
- conditions: dense per-group data / likelihood dominates; mirror image of CP's failure.
- tier: 🟢 · source: betanalpha:hierarchical_modeling, betanalpha:factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Recognize the centered/non-centered tradeoff as data-regime-dependent — name the two failure modes" · "Treat the NCP regression as evidence, not noise — check whether NCP is even the right regime" · "Try a centered parameterization for strongly-informed elements (per-element choice)"

**✓ P3** · for a normal hierarchical model with **strong per-group data** → **centered *[→ entry](../recs/hierarchical-multilevel/P3.md)*
parameterization (CP)** works (and is preferable to NCP).
- why: a sharp likelihood pins group parameters and suppresses the prior funnel; CP is well-conditioned in this regime.
- conditions: dense per-group data; choice is data-regime-dependent, not universal.
- tier: 🟢 · source: betanalpha:hierarchical_modeling, betanalpha:divergences_and_bias
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try a centered parameterization for strongly-informed upsilon (per-element choice)" · "Probe the per-group likelihood strength via occupancy / observation count" · "Flip the global parameterization and compare which warnings appear"

**✗ P4** · for a normal hierarchical model with **weak per-group data** → CP does **NOT** work *[→ entry](../recs/hierarchical-multilevel/P4.md)*
(funnels; silently biases posterior variance).
- why: as τ→0, θ~N(μ,τ) concentrates into a high-curvature neck the sampler can't resolve; CP underestimates group-level posterior variance ~10–30 % even when means are correct.
- conditions: weakly-informed data (Eight Schools K=8, σ_n up to 18); half-normal/half-Cauchy τ.
- tier: 🟢 · source: betanalpha:divergences_and_bias, betanalpha:hierarchical_modeling
- efficacy: {divergences: ~235–315 across adapt_delta 0.85–0.99 (Eight Schools CP) · min_ess: n_eff/iter≈0.007 for τ · ess_per_sec: pending · rmse: running var θ₁ settles ~27–29 vs true ~29.78 (~10–30 % under) · coverage: pending}
- moves: "Locate the divergences: pairs-plot the offending parameters and highlight divergent transitions" · "Identify the centered parameterization as root cause and prescribe non-centered" · "Attribute the curvature to the centered/non-centered scale-vs-intercept funnel, not the marginal prior shape"

**✓ P5** · for **unbalanced** hierarchical data (mixed per-group sample sizes) → a **per-group mixed *[→ entry](../recs/hierarchical-multilevel/P5.md)*
parameterization** (CP for data-rich groups, NCP for data-sparse) works.
- why: no monolithic choice is safe under imbalance; center the well-informed groups, non-center the sparse ones.
- conditions: unbalanced data; threshold problem-specific (N_k=25 in the K=9 example), shifts with likelihood family; needs index arrays (theta_cp/theta_ncp).
- tier: 🟢 · source: betanalpha:hierarchical_modeling
- efficacy: {divergences: 0 (mixed fit, K=9, threshold N_k=25) · min_ess: clean E-FMI; step sizes match monolithic CP · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Localize the pathology to specific contexts and tie it to likelihood strength" · "Apply a mixed (per-context) parameterization" · "Probe the per-group likelihood strength via occupancy / observation count"

**✗ P6** · for **unbalanced** data → a **monolithic** (all-CP *or* all-NCP) parameterization does *[→ entry](../recs/hierarchical-multilevel/P6.md)*
**NOT** work.
- why: any single global choice leaves either the sparse groups (under CP) or the dense groups (under NCP) in their failure regime.
- conditions: unbalanced groups.
- tier: 🟢 · source: betanalpha:hierarchical_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Run a controlled data-strength sweep: vary dataset size and watch divergence incidence" · "Flip the global parameterization and compare which warnings appear"

**✓ P7** · for **nested** multifactor hierarchies → parameterize by **data-aggregation depth** *[→ entry](../recs/hierarchical-multilevel/P7.md)*
(shallow/root levels CP, deep/disaggregated levels NCP).
- why: shallow/root levels aggregate more data per level → data-rich → CP; deeper/disaggregated levels have few unique observations each → data-poor → NCP.
- conditions: strict-subset nested hierarchies; per-level (a block may need mixed); HMC.
- tier: 🟢 · source: betanalpha:factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Locate the hierarchical scale parameter that a coordinate could funnel into" · "Apply a mixed (per-context) parameterization" · "Locate where the funnel-forming parameter actually enters the program"

**✗ P8** · for **overlapping (cross-classified)** models with higher-order interactions → assuming a *[→ entry](../recs/hierarchical-multilevel/P8.md)*
once-and-for-all main-effect parameterization does **NOT** work.
- why: interaction terms soak up residual cell variation, sharpening the effective likelihood on the lower-order main effects and pushing them into the strong-data regime → inverted-funnel geometry that did not exist before; re-center main effects after each expansion.
- conditions: overlapping designs; affects data-rich main factors; requires the interaction posterior to be non-negligible.
- tier: 🟢 · source: betanalpha:factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Flip the global parameterization and compare which warnings appear" · "Inspect bivariate pairs plots, intercept-vs-slope within and across groups, for ridges/funnels" · "Incrementally add complexity back, one block at a time, watching diagnostics"

**✗ P9** · for an **underdetermined / rank-deficient Gaussian regression** → NCP does **NOT** *[→ entry](../recs/hierarchical-multilevel/P9.md)*
work (the pathology is likelihood ill-conditioning, not a prior-scale funnel).
- why: at fixed σ the rank-deficient (or near-collinear) design gives a degenerate ridge / ill-conditioned, anisotropic coefficient *ellipsoid* in the likelihood y~N(Xβ,σ) — an ill-conditioning/anisotropy pathology, not a hyperparameter↔latent funnel; NCP only relocates a *prior* scale, so it cannot decouple coefficients whose degeneracy lives in the likelihood (unlike τ in a hierarchy). Whitening the design (QR) reconditions the geometry — that is the fix.
- conditions: standard Gaussian observational model; ill-conditioning/degeneracy from a rank-deficient (or collinear) design matrix.
- tier: 🟢 · source: betanalpha:underdetermined_linear_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Recommend QR decomposition of the predictor matrix; recover raw coefficients via R⁻¹" · "Move the removed column-mean content out of the basis and into the intercept's prior" · "Classify the densities by which variable is the sampled parameter"

**✓ P10** · for a **discretized SDE** fit as a hierarchical chain of latent states → **CP for *[→ entry](../recs/hierarchical-multilevel/P10.md)*
observed-time states, NCP for unobserved intermediate states** works.
- why: Euler–Maruyama makes each transition normal → structurally a hierarchical normal model with N groups of size 1; observed states are likelihood-pinned (CP), unobserved states are prior-only (NCP).
- conditions: fine temporal grid mixing observed/unobserved; pre-computed obs_idx/unobs_idx (mis-specified arrays silently revert to all-CP or all-NCP).
- tier: 🟢 · source: betanalpha:stochastic_differential_equations
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Locate the hierarchical scale parameter that a coordinate could funnel into" · "Apply a mixed (per-context) parameterization" · "Locate where the funnel-forming parameter actually enters the program"

**✓ P11** · for **correlated random effects** (varying intercepts + slopes) → a **non-centered *[→ entry](../recs/hierarchical-multilevel/P11.md)*
Cholesky** form (`gamma = mu + gamma_raw * diag_pre_multiply(sigma, L)'`, `gamma_raw ~ std_normal`)
works.
- why: decouples the correlated group-level effects from their scale/correlation in the sampler's working space.
- conditions: correlated REs per grouping factor; HMC.
- tier: ⚪ candidate (move-derived "how") · source: mc-stan:17273 (context)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize the group-level effects to non-centered form (gamma_raw ~ std_normal…)" · "Verify the reparameterized geometry is decoupled"

### Priors on variance / scale components

**✗ B1** · for a hierarchical model with **few obs/group** → **vague/uniform priors** on the *[→ entry](../recs/hierarchical-multilevel/B1.md)*
scale hyperparameters (uniform(0,10), normal(0,10)) do **NOT** work.
- why: they leave group-level effects nearly unconstrained; HMC chains meander around initialization instead of mixing (non-convergence as non-mixing, not an error).
- conditions: little data per group; most acute when groups are small so the likelihood barely constrains the hyperparameters.
- tier: 🟡 · source: mc-stan:39435
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Add priors on the scale hyperparameters; escalate wide → genuinely informative (lighter tails than Cauchy)" · "Replace very-wide priors with weakly-informative bounded ones (half-normal scaled to plausible max)" · "Audit every parameter for an explicit prior; replace any default uniform/improper prior"

**✓ B2** · for a hierarchical **scale parameter** → **weakly-informative bounded priors** (standard *[→ entry](../recs/hierarchical-multilevel/B2.md)*
normal on locations, half-normal/gamma/lognormal on scales) work.
- why: constrain the scale to a plausible range so prior+likelihood identify the hyperparameter; fixes the meandering.
- conditions: hierarchical model, small data per group.
- tier: 🟡 · source: mc-stan:39435
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Replace very-wide priors with weakly-informative bounded ones (half-normal scaled to plausible max)" · "Add priors on the scale hyperparameters; escalate wide → informative" · "Tighten the hierarchical scale prior and re-fit, checking the induced prior"

**✓ B3** · for a **Gaussian random-effect SD** where τ=0 is a plausible base model → an *[→ entry](../recs/hierarchical-multilevel/B3.md)*
**Exponential(λ) (PC) prior** on the SD works (it is *exactly* the PC prior).
- why: the PC-prior distance d(τ)=√(2·KLD) from the τ=0 base is exactly linear in τ (a literal KL to the point mass N(μ,0) diverges; the PC construction uses the √(2·KLD) distance) → an exponential prior on that distance, change of variables, gives p(τ)=λe^(−λτ); rigorous, not a heuristic.
- conditions: base model τ=0 must be plausible; SD is the flexibility parameter of interest; extends to precision via change of variables.
- tier: 🟢 · source: dansblog:priors4
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Simulate from the prior (prior predictive) to inspect the induced individual-level distribution" · "Tighten the hierarchical scale prior and re-fit, checking the induced prior"

**✗ B4** · for the **data-level noise SD σ** in a simple random-intercept model → treating it as a *[→ entry](../recs/hierarchical-multilevel/B4.md)*
"flexibility parameter" and putting a shrink-to-zero (PC) prior on it does **NOT** work.
- why: σ=0 (zero data noise given the group mean) is implausible / signals misspecification; only τ (τ=0 = all groups identical) is a genuine flexibility parameter.
- conditions: base value must collapse to a plausible simpler model; applies before blindly assigning PC priors to every variance component.
- tier: 🟢 · source: dansblog:priors4
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit every parameter for an explicit prior; replace any default uniform/improper prior" · "Check that every estimated parameter actually receives a proper prior"

**✓ B5** · for **small K** (few groups, K~2–5) → an **informative prior on τ** works (cuts the *[→ entry](../recs/hierarchical-multilevel/B5.md)*
population-funnel neck).
- why: with few group-mean draws τ is weakly identified; the (μ,τ) funnel is irreducible by reparameterization, but an informative τ prior cuts off the neck.
- conditions: small K; a weakly-informative half-normal leaves it fragile.
- tier: 🟢 · source: betanalpha:hierarchical_modeling
- efficacy: {divergences: CP 57/40000 vs NCP 239/40000 at K=2 (reparam makes it worse) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose WHERE the funnel lives: subject↔population (reparameterizable) vs between population hyperparameters" · "Recognize the few-groups hierarchical-variance pathology and switch the 2-level factor from random to fixed; compare convergence" · "Add priors on the scale hyperparameters; escalate to informative"

**✗ B6** · for a **small-K population funnel** → switching CP→NCP does **NOT** work (makes it worse). *[→ entry](../recs/hierarchical-multilevel/B6.md)*
- why: the funnel is population-level non-identifiability of τ across too few groups, not individual parameterization; NCP superimposes its inverted funnel on top.
- conditions: K~2 demonstrated; individual likelihoods may be strongly informed.
- tier: 🟢 · source: betanalpha:hierarchical_modeling
- efficacy: {divergences: NCP 239/40000 vs CP 57/40000 (K=2 strongly-informed) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose WHERE the funnel lives (subject↔population vs population-hyperparameter funnel)" · "Recognize the few-groups pathology; switch the 2-level factor from random to fixed" · "Recognize the CP/NCP tradeoff as data-regime-dependent, not a bug to optimize away with a third trick"

**✓ B7** · for the **population scale τ** → choosing the prior **shape** deliberately *[→ entry](../recs/hierarchical-multilevel/B7.md)*
(infinity-suppressing half-normal to cut the NCP inverted funnel at large τ; zero-suppressing to cut
the CP neck at small τ) works.
- why: τ's prior actively modulates *both* funnel geometries; a flat prior leaves both parameterizations fragile.
- conditions: normal hierarchical model, scalar τ; matters most at small K.
- tier: 🟢 · source: betanalpha:hierarchical_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Add priors on the scale hyperparameters; escalate to lighter-than-Cauchy tails" · "Replace very-wide priors with weakly-informative bounded ones" · "Diagnose the funnel orientation between an individual z-score and the population log-scale"

**✓ B8** · for an intended **bimodal beta prior** → re-express it as a **Mixture of Betas** (single *[→ entry](../recs/hierarchical-multilevel/B8.md)*
draw stays in [0,1]) rather than summing two RVs.
- why: summing two beta RVs can leave the valid range; a mixture keeps every draw in [0,1].
- conditions: bounded-support prior specification.
- tier: ⚪ candidate (single-witness move) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Re-express the intended bimodal beta prior as a Mixture of Betas instead of summing the two RVs" · "Check whether the proposed value can leave the parameter's valid range"

### Pooling & shrinkage

**✗ C1** · for **sparse groups** (n_j=1–2) → **no-pooling** (fixed group effects) does **NOT** work. *[→ entry](../recs/hierarchical-multilevel/C1.md)*
- why: each group estimated in isolation → astronomically large SEs and high-leverage CV points; each obs acts as a leverage point.
- conditions: n_j=1–2; estimates recoverable when n_j ≫ 5.
- tier: 🟢 · source: dansblog:monkey
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: SE ~1.47→4.69 on a response scaled to [−1,1] · coverage: 63/485 obs with LOO Pareto-k>0.7 (vs 2/485 partial pooling)}
- moves: "Inspect the implied prior spread across the independent scale parameters and add a hierarchical (partial-pooling) layer" · "Prefer a regression (design-matrix) structure over an explicit normal-variate hyperprior on the scales"

**✓ C2** · for **sparse groups** → **partial pooling** (a hierarchical/random-effect layer) works. *[→ entry](../recs/hierarchical-multilevel/C2.md)*
- why: groups borrow strength; τ adapts (shrink when similar, separate when different); collapses high-leverage CV points.
- conditions: exchangeable groups; sparse data.
- tier: 🟢 · source: dansblog:monkey
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: LOO Pareto-k>0.7 drops 63→2/485}
- moves: "Add a hierarchical (partial-pooling) layer so groups borrow information" · "Prefer a regression (design-matrix) structure over an explicit normal-variate hyperprior"

**✗ C3** · for a **partial-pooling model** → reading a positive **residuals-vs-fitted slope** as *[→ entry](../recs/hierarchical-multilevel/C3.md)*
misspecification does **NOT** work (it's a shrinkage artifact).
- why: fitted values for extreme groups are pulled toward the global mean → positive residuals for high-mean groups, negative for low-mean groups — the slope is mechanical even under a correct model.
- conditions: any partial-pooling model; steeper at n_j=1–2; attenuates (not vanishes) with larger n_j.
- tier: 🟢 · source: dansblog:monkey
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Set the interpretation policy before chasing — separate 'predictive metric looks fine' from 'posterior is unbiased'" · "Triage residual diagnostics; reframe what is a problem versus a healthy chain" · "Simulate a dataset from the model with known parameters and refit"

**✗ C4** · for a model where the **random intercept dominates the variance** (high ICC/R²) → *[→ entry](../recs/hierarchical-multilevel/C4.md)*
**dropping the random intercept** "to free variance for covariates" does **NOT** work.
- why: dropping it discards the grouping structure and leaves within-group residual correlation; adding real covariates instead *reattributes* variance while total explanatory power rises.
- conditions: hierarchical regression with a dominant (1|group) term and few/no covariates.
- tier: 🟡 · source: mc-stan:33138
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the random-effects structure: check whether every term inside (…|group) actually varies within that grouping factor" · "Add a hierarchical (partial-pooling) layer so groups borrow information"

**✓ C5** · for a **grouped/repeated-measures contrast** (A/B test with per-day data) → modeling the *[→ entry](../recs/hierarchical-multilevel/C5.md)*
**structured shared component** (GP or shared RE on the group intercept) works (sharpens the effect).
- why: structured day-to-day variation otherwise gets dispersed across "difference" and "noise", inflating both; a GP on the intercept attributes it.
- conditions: plausible structured baseline variation; concurrent/parallel design; scales awkwardly to many conditions.
- tier: 🟡 · source: mc-stan:26490
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Add a hierarchical (partial-pooling) layer / GP on the intercept so structured variation is attributed" · "Prefer a regression (design-matrix) structure over an explicit normal-variate hyperprior"

### Identifiability & constraints

**✗ D1** · for a **hierarchical/varying-effects regression** → placing a zero-centered prior on a *[→ entry](../recs/hierarchical-multilevel/D1.md)*
global intercept **and** a zero-mean prior on group effects **without** a sum-to-zero/pin constraint
does **NOT** work (location non-identified).
- why: a constant shifts freely between intercept and group means without changing the likelihood → they trade off and σ_u inflates.
- conditions: global intercept + group-level effect both freely centered; even fully-observed balanced data.
- tier: 🟡 · source: mc-stan:39536, mc-stan:17086
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the joint posterior of sigma and sd(Intercept) with pairs(fit); look for a degenerate ridge/arc" · "Hypothesize a degeneracy among the systematic-trend terms and the unstructured-heterogeneity term, then propose a verification plot" · "Check identifiability: data volume at the group level and prior scale"

**✓ D2** · for that **location non-identifiability** → the **non-centered fully-exchangeable form** *[→ entry](../recs/hierarchical-multilevel/D2.md)*
α_k ~ N(0,σ) with a *separate* intercept works.
- why: keeps conditional independence, lets you draw new groups from N(0,σ) about the separate intercept (a *free* μ **together with** a separate intercept is exactly the confounded, location-non-identified pair — zero-mean the group effects); the natural (soft, prior-resolved) Bayesian fix.
- conditions: when you must predict for new groups or interpret population hyperparameters.
- tier: 🟡 · source: mc-stan:26215
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize the group-level effects to non-centered form" · "Move the removed content into the intercept's prior so the marginal prior is preserved"

**✗ D3** · for a non-identified hierarchical model where you **predict new groups or interpret *[→ entry](../recs/hierarchical-multilevel/D3.md)*
population hyperparameters** → a **hard sum-to-zero** (zero_sum_vector) constraint does **NOT** work
as a neutral fix.
- why: it changes the generative model — pins the population mean to the sample average of the group effects and breaks infinite exchangeability / conditional independence.
- conditions: matters when predicting new groups or putting priors on μ,σ; fine for ordering constraints on permutation-invariant inferences.
- tier: 🟡 · source: mc-stan:26215, mc-stan:1382
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the proposed shortcut analytically — write out the math and ask whether it changes the target or merely reparameterizes" · "Separate likelihood from posterior and write out both log-posteriors term by term"

**✗ D4** · for **residual hierarchical decompositions** (θ_l = θ + δ_l) → **counterfactual *[→ entry](../recs/hierarchical-multilevel/D4.md)*
interpretation** ("baseline = θ_l if δ_l=0") does **NOT** work.
- why: the split is mathematically arbitrary — a constant shifts between θ and δ_l without changing the likelihood; neither has independent meaning.
- conditions: any additive θ = baseline + δ; exact non-id when one level observed; worse in higher-order interactions.
- tier: 🟢 · source: betanalpha:factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the proposed shortcut analytically — write out the math of the transformed model" · "Separate likelihood from posterior and write out both log-posteriors term by term"

**✗ D5** · for **cross-classified overlapping** designs with higher-order interactions → assuming *[→ entry](../recs/hierarchical-multilevel/D5.md)*
interaction levels are **identifiable** does **NOT** work when configurations are unobserved.
- why: interaction level counts grow multiplicatively (L₁×L₂×…), sparsely occupied; empty cells are fixed by the prior → non-identification.
- conditions: overlapping designs, unobserved level combinations; tighter interaction priors reduce but don't eliminate.
- tier: 🟢 · source: betanalpha:factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Check identifiability: data volume at the group level and prior scale" · "Diagnose identifiability with pairs plots at BOTH global and subject level"

**✗ D6** · for **multiple correlated random effects** → an "estimate-then-fix-to-zero" procedure *[→ entry](../recs/hierarchical-multilevel/D6.md)*
(or reading `||` / lkj-at-identity as forcing the *empirical* correlation to zero) does **NOT** work.
- why: forcing the correlation *parameter* to zero is statistically equivalent to not modeling it (redundant); the empirical posterior correlation of the estimated effects can still be substantially nonzero.
- conditions: any model with correlated REs (varying intercepts+slopes, testlet/multidim IRT).
- tier: 🟡 · source: mc-stan:17273
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Start from a uniform LKJ(eta=1) Cholesky then ADD normal density on the off-diagonal correlation elements" · "Triage the pinned Cholesky/correlation entries as structural vs pathological" · "Inspect bivariate pairs plots, intercept-vs-slope within and across groups"

**✓/✗ D7** · for a **known-covariance multilevel model** (phylogenetic `(1|gr(sp, cov=phy))`) → *[→ entry](../recs/hierarchical-multilevel/D7.md)*
reading "phylogenetic signal" as the ICC/heritability h²=σ_a²/(σ_a²+σ_e²) **works** *provided* a
competing unstructured variance component exists; it does **NOT** work (non-identified, prior-driven)
with a Gaussian likelihood and one observation per group.
- why: the structured RE is a variance component (cov σ_a²·C); with a competing unstructured term the data inform the split (= Pagel's λ) — but a single observation per group cannot split structured vs unstructured.
- conditions: phylogenetic/animal/pedigree/spatial CAR-ICAR/kinship; structured slopes need an explicit unstructured slope term.
- tier: 🟡 · source: mc-stan:16457
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Check identifiability: data volume at the group level and prior scale" · "Inspect the joint posterior of the structured vs unstructured variance components with pairs(fit); look for a degenerate ridge/arc"

### Model encoding / specification

**✗ F1** · for a **strictly nested** hierarchy in array/plate PPLs (NumPyro/Pyro; PyMC dims) → *[→ entry](../recs/hierarchical-multilevel/F1.md)*
**nesting plates** over parent and child dimensions does **NOT** work.
- why: nested plates index the Cartesian product → one parameter per (parent×child) cell = a *crossed* design; most cells have no data and are prior-fixed, wasting parameters.
- conditions: strictly nested (each child one parent); does not apply to genuinely crossed/multi-membership effects.
- tier: 🟡 · source: pyro:3022, pyro:3695
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the random-effects structure: check whether every term actually varies within the grouping factor" · "Locate the hierarchical scale parameter that a coordinate could funnel into"

**✓ F2** · for a **strictly nested** hierarchy in plate PPLs → an explicit **child→parent index *[→ entry](../recs/hierarchical-multilevel/F2.md)*
array** (`groupby(child)[parent].first()`) works.
- why: maps each child group to its unique parent, encoding the nesting without allocating empty crossed cells.
- conditions: strictly nested; child→parent map must be exact.
- tier: 🟡 · source: pyro:3022, pyro:3695
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the random-effects structure (does each term vary within the grouping factor)" · "Locate where the funnel-forming parameter actually enters the program"

**✗ F3** · for **pre/post (T1/T2)** repeated measures → entering **T1 as a RHS predictor** of T2 *[→ entry](../recs/hierarchical-multilevel/F3.md)*
does **NOT** work.
- why: it treats T1 as measured without error → biases the baseline coefficient and induces regression-to-the-mean.
- conditions: baseline measured with non-negligible error (the usual case); less harmful if the baseline is near-noiseless.
- tier: 🟡 · source: mc-stan:8691
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Shift from sampler diagnostics to model validation workflow" · "Audit the random-effects structure"

**✓ F4** · for **pre/post** repeated measures → modeling **both timepoints as the response in long *[→ entry](../recs/hierarchical-multilevel/F4.md)*
format** (time predictor + per-subject random effect) works.
- why: avoids conditioning on a noisy baseline; separates within-subject change from measurement error.
- conditions: repeated-measures design with a baseline of the same outcome.
- tier: 🟡 · source: mc-stan:8691
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Shift from sampler diagnostics to model validation workflow" · "Reframe the estimand (what change/covariate-effect are we quantifying)"

**✗ F5** · for a **Bayesian dynamic panel / hierarchical AR(1)** with individual random intercepts → *[→ entry](../recs/hierarchical-multilevel/F5.md)*
`y ~ lag(y) + (1|individual)` conditioning on the first obs as exogenous does **NOT** work (biased AR
coefficient — Nickell bias).
- why: the lagged DV contains u_i (correlated with the random intercept by construction), and the first observation is itself a process draw correlated with μ_i.
- conditions: short-to-moderate T (bias worst at small T, shrinks as T grows); stationary |δ|<1.
- tier: 🟡 · source: mc-stan:5136
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Hypothesize a degeneracy and propose a direct verification plot" · "Audit the random-effects structure"

**✓ F6** · for a **hierarchical AR(1)** → the **mean-centered lag** generative form *[→ entry](../recs/hierarchical-multilevel/F6.md)*
(y_it = μ_i + δ·(y_{i,t−1}−μ_i) + ε_it) with the **stationary initial condition**
N(μ_i, σ_e/√(1−δ²)) works.
- why: models the initial condition's marginal rather than conditioning on it, removing the correlation that biases δ.
- conditions: stationary AR(1), |δ|<1; unit-root/nonlinear processes need a different initial-condition treatment.
- tier: 🟡 · source: mc-stan:5136
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the proposed reformulation analytically — write out the generative math" · "Reframe the estimand"

**✗ F7** · for a hierarchical model with **fixed effects + correlated random slopes** where the goal *[→ entry](../recs/hierarchical-multilevel/F7.md)*
is **variable selection** → a **horseshoe on the fixed-effect coefficients** does **NOT** work.
- why: you can shrink the fixed effect to ~0 while a sizeable random-slope SD keeps the covariate influential; the horseshoe never gives exact zeros; genuine removal is a separate decision problem.
- conditions: fixed + group-varying effects for the same covariates; use projection-predictive selection instead.
- tier: 🟡 · source: mc-stan:26200
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the random-effects structure (fixed + group-varying for the same covariate)" · "Inspect the importance-weight distribution via Pareto k for each alternative specification"

**✓/✗ F8** · for **marginalizing a sum of independent binomial** latent counts against an observed *[→ entry](../recs/hierarchical-multilevel/F8.md)*
total in HMC → a **Poisson (or NegBin) approximation works** when each success probability is small
relative to its count; it does **NOT** work when probabilities are large and counts small.
- why: exact marginalization is an O(count²) discrete convolution dominating runtime; the Poisson approx collapses it — but introduces dispersion error when p is large.
- conditions: gradient-based sampler; small p relative to count for the approximation; else use the exact convolution with the log_sum_exp running-prefix speedup.
- tier: 🟡 · source: mc-stan:3012
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize: split the count matrix into sub-matrices, estimate a per-row baseline μ and φ"

### Derived quantities & interpretation

**✗ G1** · for a **GLMM with a non-identity link** (logistic/Poisson/ordinal) → reading a **response-scale ICC/VPC** *[→ entry](../recs/hierarchical-multilevel/G1.md)*
as var_group/(var_group+var_resid) does **NOT** work (but the **latent-scale ICC does**).
- why: the additive variance split holds only for the Gaussian identity-link case; on the **response** scale the variance is a nonlinear function of the predictor, so there is no single level-1 variance. On the **latent** scale, though, the residual variance is a known constant (logistic π²/3; probit 1), and the latent-scale ICC = var_group/(var_group+π²/3) **is** the valid standard (Snijders–Bosker threshold/latent-variable) approach — so the trap is reporting a *response-scale* single number, not the latent-scale ICC.
- conditions: non-Gaussian family or non-identity link; random slopes → no single ICC (varies with the slope covariate).
- tier: 🟡 · source: mc-stan:4409, mc-stan:19723, mc-stan:34029
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate (epred vs …)" · "Reframe the estimand: conditional-on-sampled-groups vs integrate-the-random-effects-out"

**✗ G2** · for a **mixed-effects model** → assuming a single **"Bayesian R²"** does **NOT** work. *[→ entry](../recs/hierarchical-multilevel/G2.md)*
- why: residual-based (brms/rstantools: Var(pred)/(Var(pred)+Var(pred−y))) and model-based (rstanarm: Var(pred)/(Var(pred)+σ²)) disagree in magnitude AND can reverse the conditional>marginal ordering.
- conditions: mixed models (the ordering reversal is specific to the random-effect variance term); the two coincide for ordinary linear regression.
- tier: 🟡 · source: mc-stan:20461
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate" · "Reframe the estimand: conditional vs marginal (re.form=NULL vs NA)"

**✓ G3** · for **marginal effects/predictions** from random-slope or correlated-RE models → derive *[→ entry](../recs/hierarchical-multilevel/G3.md)*
the quantity **per posterior draw and average over the empirical covariate/RE distribution BEFORE
summarizing** works.
- why: the order of operations is load-bearing — AME (average per-unit predictions) ≠ MEM (average covariates first); nonlinear links make the two diverge.
- conditions: nonlinear/non-identity link; summaries formed from posterior draws of derived quantities.
- tier: 🟡 · source: mc-stan:24172, mc-stan:3914, mc-stan:11531
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Choose the posterior-summary primitive by which uncertainty must propagate (epred/fitted vs predict)" · "Reframe the estimand: prediction conditional on the sampled groups' REs vs integrating them out"

### Model comparison / cross-validation

**✗ H1** · for hierarchical models with **~one random effect per observation** (effective params ≈ N) *[→ entry](../recs/hierarchical-multilevel/H1.md)*
→ **exact LOO** (leave-one-observation-out) does **NOT** work to assess adding a covariate.
- why: each left-out point's own RE predicts it almost regardless of the covariate → LOO barely changes; PSIS-LOO is also unreliable (high Pareto k).
- conditions: per-observation REs (OLRE, network meta-analysis, few obs/subject); fine when groups have many observations each.
- tier: 🟡 · source: mc-stan:12335, mc-stan:30254, mc-stan:36639
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read the headline LOO diagnostics first: compare p_loo against N and the nominal parameter count" · "Inspect the importance-weight distribution via the Pareto k diagnostic" · "Treat the warning as signal: switch from WAIC to LOO for the Pareto-k diagnostic"

**✓ H2** · for **per-observation-RE** models → **integrate out the random effect** (conjugate mixing: *[→ entry](../recs/hierarchical-multilevel/H2.md)*
Gamma→NegBin, Beta→beta-binomial) or use **grouped K-fold CV** chosen by the prediction goal.
- why: marginalizing the RE removes the "each point predicts itself" degeneracy; K-fold sidesteps unreliable importance sampling.
- conditions: conjugate mixing form for the integrate-out route; fold-splitting matched to the prediction target.
- tier: 🟡 · source: mc-stan:12335, mc-stan:36639
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Fall back to brute-force K-fold cross-validation; choose the fold-splitting scheme by the prediction goal" · "Compute the true log pointwise predictive density from scratch and compare"

### MRP / poststratification

**✗ I1** · for **MRP** → poststratifying over a covariate whose **population joint distribution is *[→ entry](../recs/hierarchical-multilevel/I1.md)*
unknown** does **NOT** work.
- why: poststratification reweights model predictions by population cell sizes; a variable with no known N_j cannot be in the frame.
- conditions: choosing poststratification dimensions.
- tier: 🟡 · source: mc-stan:13028, mc-stan:37666
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the estimand (population target vs sample-conditional)" · "Audit the random-effects / design structure"

**✓ I2** · for **MRP** with a strong predictor known only in the sample → **include it in the *[→ entry](../recs/hierarchical-multilevel/I2.md)*
multilevel model** (so it shrinks the varying intercepts and improves fit) but **do not
poststratify over it**; use **MrsP/raking** when only marginals exist.
- why: the predictor still helps inference via shrinkage even though it can't be a poststratification dimension.
- conditions: population joint unknown but marginals available → raking fallback.
- tier: 🟡 · source: mc-stan:13028, mc-stan:37666
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Add the predictor to the multilevel model to shrink the varying intercepts" · "Reframe the estimand"

### Variational inference (SVI/ADVI)

**✗ J1** · for **minibatch/stochastic VI** (SVI/ADVI) → treating it like frequentist minibatched SGD *[→ entry](../recs/hierarchical-multilevel/J1.md)*
(no rescaling) does **NOT** work (biased ELBO).
- why: the subsampled ELBO is unbiased only if every under-counted log-prob term (per-datapoint likelihood AND per-datapoint local latents) is rescaled by N/b — the prior must compete against the full likelihood.
- conditions: subsampling outside the PPL's plate/subsample machinery (torch DataLoader, pre-sliced batches); the silent size==subsample no-scaling bug.
- tier: 🟡 · source: pyro:3041, pyro:895, pyro:8826
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the proposed shortcut analytically — write out the ELBO estimator and check unbiasedness"

**✓ J2** · for **minibatch VI** → apply the **N/b correction** to all subsampled terms, or use the *[→ entry](../recs/hierarchical-multilevel/J2.md)*
framework's **plate/subsample_size** machinery (which scales automatically).
- why: restores the ELBO as an unbiased estimator of the full-data ELBO.
- conditions: global latents and/or per-datapoint local latents; needed whenever comparing a minibatch ELBO's magnitude to a full-batch one.
- tier: 🟡 · source: pyro:3041, pyro:895, pyro:8826
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the shortcut analytically — confirm which terms subsampling under-counts"

### Scaling / performance

**✗ K1** · for a hierarchical MCMC fit that **stalls or runs pathologically slowly** → *[→ entry](../recs/hierarchical-multilevel/K1.md)*
**parallelization** (map_rect/reduce_sum/MPI/more cores) as the *first* move does **NOT** work.
- why: a stuck model is usually misspecified/non-identified/over-parameterized; parallelism cuts cost per gradient, never effective-samples-per-gradient, which geometry alone sets.
- conditions: stalls in warmup / super-linear runtime; over-parameterized or NCP-needing models. Once well-specified & conditioned, reduce_sum/map_rect IS the right tool.
- tier: 🟡 · source: mc-stan:14303, mc-stan:14300
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe persistent slowness as a diagnostic signal — short cheap runs + posterior inspection of parameter correlations" · "Reframe via the folk theorem: build up complexity one layer at a time" · "Reduce to a minimal reproducer"

**✗ K2** · for **large hierarchical data** → a **MAP / joint-mode** point estimate as a scaling *[→ entry](../recs/hierarchical-multilevel/K2.md)*
shortcut does **NOT** work (severe overfitting).
- why: the joint mode over (hyperparams, REs) sits in the funnel neck where τ collapses to zero → per-group effects fit to noise; the RE dimension grows with the data.
- conditions: non-conjugate hierarchical GLMs; EXCEPTION: conjugate BTYD/CLV models (BG/NBD, Pareto/NBD).
- tier: 🟡 · source: mc-stan:7588, pymc:16512, pymc:12418
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Audit the proposed shortcut analytically — does it change the target or merely reparameterize?" · "Decouple expensive warmup/metric estimation from production sampling by saving/reusing the adapted metric"

**✓ K3** · for a hierarchical model whose **latents are conditionally independent given the *[→ entry](../recs/hierarchical-multilevel/K3.md)*
hyperparameter** → **dynamic HMC (NUTS)** scales to a large parameter-space expansion (2→202 params)
without difficulty.
- why: conditional independence → block-diagonal Hessian that leapfrog integrates efficiently; it is local geometry's conditional simplicity, not raw dimensionality, that governs NUTS.
- conditions: plate structure with Normal likelihood on the latents; regularizing priors.
- tier: 🟡 · source: pymc:760, pymc:3793
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: all five diagnostic checks passing at 202 parameters}
- moves: "Reason about what the mass-matrix adaptation can structurally represent" · "Decouple/save+reuse the adapted metric + step-size" · "Reason about dense-metric reach versus the actual geometry"

### Consistency / theory

**✗ L1** · for **population-mean estimation under high-stratum covariate-dependent randomization** *[→ entry](../recs/hierarchical-multilevel/L1.md)*
(Robins–Ritov) → an **iid/exchangeable prior on stratum means that ignores the sampling indicator**
(strict Likelihood Principle) does **NOT** work (fails √n-consistency).
- why: the posterior only updates observed strata; with J large and no shared structure the estimate is a moving target, converging as slowly as O((log log n)²·log n).
- conditions: J large vs n; known stratum-dependent sampling probabilities; iid prior; target = population mean.
- tier: 🟢 · source: dansblog:robins-ritov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Prefer a structured (design-matrix / regression) pooling over an iid hyperprior on the scales" · "Add a hierarchical (partial-pooling) layer so strata borrow information"

**✓ L2** · for the same setting → a **structured prior that borrows strength across strata** (smooth *[→ entry](../recs/hierarchical-multilevel/L2.md)*
GP over stratum index, or a true parametric model) **recovers √n-consistency**.
- why: unobserved strata can be predicted from observed ones without using the sampling weights.
- conditions: the smoothness must genuinely reflect structural regularity in μ_j (not be imposed ad hoc to patch the inconsistency).
- tier: ⚪ candidate · source: dansblog:robins-ritov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Prefer a structured GP / parametric prior that borrows strength across strata" · "Add a hierarchical (partial-pooling) layer"

### Prediction for unobserved configurations

**✓ M1** · for **overlapping multifactor** models → predicting **new (unobserved) factor *[→ entry](../recs/hierarchical-multilevel/M1.md)*
configurations** by additively reconstructing from separately estimated main effects + observed
lower-order interactions works.
- why: the additive residual decomposition lets you sum the contributions of A9, B5, C3, A9+B5, … estimated from other configurations, with uncertainty propagated.
- conditions: all individual levels observed in some lower-order configuration; additive approximation reasonable; unobserved higher-order interaction posteriors stay wide (prior-dominated).
- tier: 🟢 · source: betanalpha:factor_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the estimand: prediction conditional on sampled REs vs integrating them out" · "Choose the posterior-summary primitive by which uncertainty must propagate"

### Diagnostics workflow (geometry can't be tuned away)

**✗ E1** · for a **hierarchical funnel** → sweeping **adapt_delta / shrinking step size** to fix it *[→ entry](../recs/hierarchical-multilevel/E1.md)*
does **NOT** work when the count is flat across the sweep.
- why: a divergence count that stays ~flat as adapt_delta goes 0.85→0.99 is the signature of true geometric non-ergodicity — no step-size reduction restores it; the near-zero count at the *largest* step size (adapt_delta=0.80) is a false negative (the chain never entered the funnel).
- conditions: 10k post-warmup, single chain, CP Eight Schools; must sweep a RANGE (one adapt_delta cannot distinguish ergodic from non-ergodic).
- tier: 🟢 · source: betanalpha:divergences_and_bias
- efficacy: {divergences: ~0 (0.80, false neg), ~295 (0.85), ~315 (0.90), ~235 (0.95), ~255 (0.99) · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Tighten the integrator: raise adapt_delta toward 0.99 — and observe it fails to help" · "Inspect adapt_delta sensitivity and read the geometry against a known case study" · "Run a controlled data-strength sweep"

**✓ E2** · for **divergences** → **pairs-plotting** the offending parameters and checking whether *[→ entry](../recs/hierarchical-multilevel/E2.md)*
they **cluster** (e.g. at the funnel neck) vs scatter like non-divergent draws works to identify the
geometric bottleneck.
- why: spatial clustering identifies the bottleneck; uniformly-scattered divergences are false positives; count alone is insufficient.
- conditions: requires scatter visualization in parameter space; the analyst must choose which parameters to examine.
- tier: 🟢 · source: betanalpha:rstan_workflow
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Locate the divergences: pairs-plot the offending parameters and highlight divergent transitions" · "Treat divergences as a posterior-geometry problem: look at the pairs plot, not a code bug" · "Localize with targeted pairs plots: each group param against its own hyper-mean and hyper-sd"

**✗ E3** · for a **high-curvature pinch (CP funnel)** on a finite run → relying on the chain's *[→ entry](../recs/hierarchical-multilevel/E3.md)*
**sticky excursions to self-correct** does **NOT** work.
- why: frozen excursions are the only asymptotic bias-correction, but on finite runs they produce oscillating signed bias and declining ESS-per-iteration, not convergence (the MCMC CLT needs the geometric ergodicity the funnel breaks).
- conditions: curvature high relative to step length; single-chain diagnostic context.
- tier: 🟢 · source: betanalpha:divergences_and_bias, betanalpha:markov_chain_monte_carlo
- efficacy: {divergences: pending · min_ess: declining ESS-per-iteration (oscillating running mean) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Plot the lp__ trace and contrast across datasets to characterize the residual signal" · "Set the interpretation policy for divergence counts before chasing them" · "Treat the anomalously fast chain as the suspect and inspect its per-iteration sampler params"

**✗ E4** · for the **wrong monolithic parameterization** → trusting **standard summaries** (means look *[→ entry](../recs/hierarchical-multilevel/E4.md)*
right) does **NOT** work.
- why: CP underestimates group-level posterior variance ~10–30 % even with correct means; both CP and monolithic NCP distort tails invisibly.
- conditions: CP weakly-informed; NCP strong/unbalanced; consequential when tails/intervals are used downstream.
- tier: 🟢 · source: betanalpha:divergences_and_bias, betanalpha:hierarchical_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: running var θ₁ ~27–29 vs true ~29.78 (mean ~6.25 correct) · coverage: pending}
- moves: "Simulate a dataset from the model with known parameters and refit; check divergences reproduce and parameters recover" · "Read out the actual E-BFMI value (not the boolean) and validate against ground truth via simulation" · "Set the interpretation policy: separate 'predictive metric fine' from 'posterior unbiased'"

**✓ E5** · for **per-unit posterior-predictive residuals plotted across a covariate** → reading the *[→ entry](../recs/hierarchical-multilevel/E5.md)*
residual band's **shape** works to identify missing structure (flat-band offset → missing unit-level
RE; arch/dome → missing functional dependence on the covariate).
- why: coherent displacement/shape across the covariate range (not point-by-point zero-containment) fingerprints the missing term.
- conditions: repeating-unit structure; residuals plotted per unit vs covariate; evaluate coherence across the range.
- tier: 🟢 · source: betanalpha:falling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Shift from sampler diagnostics to model validation workflow" · "Incrementally add complexity back, one block at a time, watching diagnostics"

**✓ E6** · for a **slow/pathological** hierarchical fit → treating slowness as a **geometry/ *[→ entry](../recs/hierarchical-multilevel/E6.md)*
identifiability symptom** and isolating by **building complexity one layer at a time** (or stripping
to Neal's funnel / eight-schools) works.
- why: the folk theorem — computational trouble signals a model problem; a minimal reproducer localizes it.
- conditions: general; pairs plots in the space the sampler actually works in.
- tier: 🟡 · source: mc-stan:14303
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe via the folk theorem: isolate by building up complexity one layer at a time" · "Reduce to a minimal reproducer (strip to Neal's funnel) and test both parameterizations at the worst-case data size" · "Reproduce on the eight-schools archetype and inspect pairs plots"

**✓ E7** · for chains **starting in pathological tails** → **constraining the random init range** *[→ entry](../recs/hierarchical-multilevel/E7.md)*
(`init_r` below its default of 2, or an explicit init sweep) works — cheap, try first.
- why: keeps starting points out of the funnel tails so warmup can find the typical set.
- conditions: pathological-tail initialization; a starting-point, not a geometry, fix.
- tier: ⚪ candidate · source: (move-only)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Constrain the random initialization range — set init_r below its default of 2 — START with this" · "Test the initialization hypothesis directly by setting an explicit init and sweeping across the threshold"

**✓ E8** · for confirming whether **divergences reflect a real model problem** vs a fluke → *[→ entry](../recs/hierarchical-multilevel/E8.md)*
**simulate-and-refit** (generate data from the model with known parameters, refit) works.
- why: checks whether the divergences reproduce and whether the generative parameters are recovered — an SBC-style validation.
- conditions: known/recovered generative parameters available.
- tier: 🟡 · source: (move-derived; corroborates betanalpha:divergences_and_bias)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Simulate a dataset from the model with known/recovered parameters and refit" · "Read out the actual E-BFMI value and validate inference against ground truth via simulation"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
hierarchical_modeling · divergences_and_bias · factor_modeling · rstan_workflow · pystan_workflow ·
stan_intro · markov_chain_monte_carlo · underdetermined_linear_regression ·
stochastic_differential_equations · falling

**Dan Simpson blog** (`dansblog:<id>` → `https://dansblog.netlify.app/posts/…`):
priors4 · monkey (`everybodys-got-something-to-hide…`) · robins-ritov

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pyro:N` → `https://forum.pyro.ai/t/…/N`;
`pymc:N` → `https://discourse.pymc.io/t/…/N`).
