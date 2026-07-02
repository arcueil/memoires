# Measurement-error & missing-data models

## Claims (the *why* — mid-level, ~3–5)

*Five mid-level principles synthesized from 8 granular claims. Tier is the best-supported of the
granular claims each subsumes. Source short-ids resolve to URLs in the Source key at the bottom.*

### C1 · The observational model is the theoretical model convolved with the measurement response — censoring, binning, and contamination are structural, not nuisance 🟢

**Statement.** What you fit is never the theoretical model itself but the theoretical model passed
through the measurement process, so ignoring censoring (continuous energies arriving as binned
counts), contamination (a background process mixed with signal), or extra zero-inflation mechanisms
yields a biased observational model whose parameters are *not* the physical quantities of interest.

**Nuance.** The particle-energy archetype (§3.4) makes it precise: you must integrate the
theoretical spectrum over each bin to get the multinomial cell probabilities ρ_k, and you must carry
an explicit signal/background mixture λ·π(E|θ_S) + (1−λ)·π(E|θ_B). Omit the bin integration and the
continuous→discrete measurement step is unmodeled; omit the background component and background counts
are silently attributed to signal. The distortion is not random noise on top of a good fit — it moves
the estimand.

**Conditions.** Any non-trivial measurement process between the theoretical quantity and the data
(binned counts vs. continuous energies; background mixed with signal; multiple zero-inflation
mechanisms). Least relevant when the measurement response is essentially identity.

**Tier.** 🟢 established (subsumes `measurement-model-must-include-censoring-and-contamination`).

**Sources.** betanalpha:generative_modeling

---

### C2 · Missingness/selection correlated with the outcome process is non-ignorable — it reintroduces confounding in a confounder-free design and can break Bayesian √n-consistency 🟢

**Statement.** A randomized or otherwise designed experiment suppresses confounding only to the
degree the design is *implemented*; dropout, censoring, or non-compliance that is correlated with the
variate-generating process makes the observed covariate distribution a biased subset of the designed
one, reintroducing confounders — and in the survey/stratified analogue (Robins–Ritov) the same
outcome-correlated selection degrades Bayesian consistency, not just efficiency.

**Nuance.** The randomization guarantee is only that the *intended* covariate distribution is
independent of the conditional variate process; once observations are censored MNAR, that guarantee
is void and no amount of balanced design restores it. The adversarial correlation between sampling
probability ξ_j and stratum mean μ_j that drives Robins–Ritov inconsistency is not a theoretical
curiosity — it arises whenever subgroups differ in *both* response propensity and outcome (e.g.
consumer preferences more common in older people, who answer phone surveys, than in younger people,
who do not). Even independent ξ_j and μ_j GP realizations can show substantial empirical correlation.

**Conditions.** Censoring/dropout/sampling mechanism correlated with the conditional variate process
(MNAR); known stratum-dependent sampling probabilities; covariate-defined subgroups differing in both
outcome and selection.

**Tier.** 🟢 established (subsumes `designed-experiment-confounding-from-imperfect-implementation`;
plus supported `rr-adversarial-correlation-arises-in-practice` 🟡).

**Sources.** betanalpha:variate_covariate_modeling · dansblog:robins-ritov

---

### C3 · The Bayesian repair for non-ignorable selection is to model the randomization mechanism and impute the complete sample via the posterior predictive — recovering the design-based (Horvitz–Thompson) estimator without leaving the Bayesian frame 🟢

**Statement.** You do not have to abandon Bayesian principles to get √n-consistent population-mean
estimation under adversarial selection: fit the standard model, then ask what the *complete-sample*
mean would have been under hypothetical realizations of the randomization, and answer with the
posterior predictive — which recovers the Horvitz–Thompson estimator as the imputed sample grows.

**Nuance.** The fix touches neither the prior nor the likelihood. After the ordinary iid
normal–normal fit, impute Ñ_j draws from N(m_j^post, v_j^post + 1) for each stratum j and average
over the imputed sample; as Ñ → ∞ this converges to HT. The load-bearing move is *reframing the
estimand*: the question must be "what would the complete-sample mean be under different realizations
of the randomization r?" — not "what is the parameter μ itself?". The two are the same target only
once the sampling mechanism is inside the model.

**Conditions.** Sampling probabilities ξ_j known; the estimand explicitly framed as the
complete-sample mean under the randomization, not the parameter.

**Tier.** 🟢 established (subsumes `rr-posterior-predictive-imputation-recovers-ht`).

**Sources.** dansblog:robins-ritov

---

### C4 · The variate/covariate partition is defined by which component goes missing in the application, not by generative priority — the same joint factors two ways into different conditional models 🟢

**Statement.** Which variable is the "variate" (modeled conditionally) and which is the "covariate"
(conditioned on) is an *application* decision driven by which component is prone to missingness in the
deployment context — not by which was generated first or has narrative generative priority; the same
joint distribution can be correctly decomposed in two opposite directions.

**Nuance.** For the bivariate normal π(y, x | μ, τ, σ): decompose as π(y|x, σ)·π(x|μ, τ) when *y* is
prone to missingness (forward model), or as π(x|y, μ, τ, σ)·π(y|σ) when *x* is prone to missingness
(reverse model). These are not cosmetic re-writes — they yield entirely different conditional variate
models with different parameters, so committing to the wrong direction bakes in a model that cannot
represent the missingness you actually face.

**Conditions.** Any joint where a component can go missing; pick the factorization by the deployment
missingness pattern, not by generative narrative.

**Tier.** 🟢 established (subsumes `variate-covariate-role-is-application-not-generative`).

**Sources.** betanalpha:variate_covariate_modeling

---

### C5 · Imputation adds information (and cost) only when the missing variable carries it — impute covariates (two relationships), never re-condition on a noisy or already-fitted value, and mask the log-probability when you only need the observed-data likelihood 🟡

**Statement.** Whether imputing a missing value helps depends on how that variable enters the model:
a missing *covariate* figures in two relationships (predictor of the outcome and response of its own
submodel) so imputing it is legitimate, whereas imputing a missing *response* and re-fitting
double-counts the data; and conditioning on a *noisy* observed value as if it were error-free (e.g. a
baseline on the RHS) is the same illegitimate move — while computationally, full imputation adds one
latent parameter per missing entry, so mask the log-density instead when you don't need the draws.

**Nuance.** Imputing a response and refitting is "conditioning twice" — a missing response carries no
information beyond a single joint fit (in brms, `bf(Y ~ X1*mi(X2)) + bf(X2 | mi() ~ …)` is the
*covariate* case that *is* valid). Entering baseline T1 as a RHS predictor of T2 treats T1 as
measured without error, biasing the baseline coefficient and inducing regression-to-the-mean; the
long-format response model avoids it. Under HMC/NUTS, auto-imputation expands the sampled dimension
and slows NUTS — but you must mask the *log-probability* term (`logp(...)*mask`, `logp(...)[mask]`, or
`pm.Potential`), not the residual: zeroing `mu=(y_hat−y)*mask` leaves the masked points in the
likelihood with finite logp, still informing σ.

**Conditions.** Bayesian missing-data problems; legitimacy hinges on the missing variable's role
(covariate vs. pure response); baseline measured with non-negligible error; gradient-based sampler
where you don't need posterior draws of the missing entries; discrete missing covariates handled by
finite-mixture marginalization, not the response-feedback loop.

**Tier.** 🟡 supported (subsumes `forum-c354-imputing-a-missing-response…`,
`forum-c394-in-hmc-nuts-models-automatic-imputation…`, `forum-c156-when-analyzing-pre-post-t1-t2…`).

**Sources.** mc-stan:21644 · mc-stan:5135 · pymc:12450 · pymc:4926 · pymc:8478 · pymc:5705 ·
mc-stan:8691

---

---

### C6 · Censoring and truncation are distinct likelihood treatments — censoring integrates the tail mass at the bound (a CDF term, N fixed); truncation renormalizes the density by P(in-bounds) (N varies); picking the wrong one biases parameters 🟢

**Statement.** Censoring and truncation are two different measurement processes with two different
likelihoods, not interchangeable labels. Under **censoring** the out-of-bound values ARE in the
dataset — recorded at the bound — so the likelihood integrates the tail mass at the bound (a CDF
term) and the sample size is fixed. Under **truncation** the out-of-bound values are never observed
at all, so the likelihood renormalizes the in-bounds density by P(in-bounds) and the realized sample
size varies.

**Nuance.** The distinction is mechanical and shows up in both the data and the likelihood: because a
censored observation is recorded at the bound, censoring keeps N fixed and adds a CDF (tail-mass)
term for the boundary observations; because a truncated observation is simply absent, truncation
makes the realized N variable and divides the in-bounds density by P(in-bounds) to renormalize.
Picking the wrong one — fitting a truncated likelihood to censored data, or a censored likelihood to
truncated data — biases the parameters, because each encodes a different story about the out-of-bound
region.

**Conditions.** Any bounded/limited observation process where out-of-bound values are either recorded
at the bound (censoring) or omitted (truncation). The page's existing A2 (selection-truncation of
covariates) is an instance where this likelihood distinction had not been made explicit.

**Tier.** 🟢 established (source: pymc-labs L1, human-curated).

**Sources.** pymc-labs:censored-truncated

---

## Practical — what works / what doesn't (comprehensive, bidirectional)

*27 recs (14 ✓ / 12 ✗, plus 1 bidirectional). `efficacy` is the benchmark-shaped slot
`{divergences, min_ess, ess_per_sec, rmse, coverage}` — the input carries no measured metrics, so
every slot is `pending` (a benchmark hole for a future run to plug into). Attached `moves` are the
diagnostic "how" from the input. Move-only recs (no subsuming claim) are tiered ⚪ and kept as the
searchable tail.*

### Non-ignorable missingness & selection (confounding, Robins–Ritov)

**✗ A1** · for a randomized/designed experiment with **dropout, censoring, or non-compliance
correlated with the outcome process** → analyzing only the observed (non-censored) cases as if the
design still holds does **NOT** work.
- why: the observed covariate distribution is a biased subset of the designed distribution; when the censoring probability depends on the variate-generating mechanism, confounders re-enter even though the design was confounder-free.
- conditions: MNAR censoring/dropout correlated with the conditional variate process; balanced randomization no longer protects you.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Refuse to give code; force the asker to restate units, the random variable, and exactly what data is observed before any modeling" · "Apply the deterministic-skeleton heuristic: strip all randomness and ask whether the unknowns are solvable from the observed quantities" · "Demand a minimal synthetic-data simulator (R/Python) that encodes the data-generating process, instead of more prose"

**✓ A2** · for that designed experiment → **explicitly modeling the censoring/selection mechanism**
(so the observational covariate model matches the observed, truncated distribution) works.
- why: randomization only guarantees the *intended* covariate distribution is independent of the conditional variate process; restoring that guarantee under censoring requires modeling how observations were removed.
- conditions: the selection mechanism is knowable/model-able; MNAR.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Sanity-check the likelihood structure against the generative process; question whether the pdf+cdf 'censoring' terms and a free mixing weight belong" · "Inspect the transformed-parameter that computes the mixing weight for a type/domain error before blaming the model"

**✗ A3** · for population-mean estimation under **covariate-dependent sampling where ξ_j and μ_j are
correlated** (Robins–Ritov) → treating the adversarial correlation as a purely theoretical pathology
and ignoring the sampling indicator does **NOT** work.
- why: the ξ_j–μ_j correlation arises naturally whenever subgroups differ in both response propensity and outcome (consumer preferences more common in older people, who answer phone surveys), so an iid prior that ignores the sampling weights loses √n-consistency in practice.
- conditions: survey/clinical settings, differential selection across covariate-defined subgroups; known stratum-dependent sampling probabilities.
- tier: 🟡 · source: dansblog:robins-ritov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the implied prior spread across the independent scale parameters and add a hierarchical (partial-pooling) layer so groups borrow information" · "Demand a minimal synthetic-data simulator (R/Python) that encodes the data-generating process, instead of more prose"

**✓ A4** · for that covariate-dependent-sampling problem → **modeling the randomization mechanism and
imputing the complete sample via the posterior predictive** (recovering the Horvitz–Thompson
estimator) works — √n-consistent, without abandoning Bayesian principles.
- why: after the standard iid normal–normal fit, ask what the complete-sample mean would be if every r_i were observed; impute Ñ_j draws from N(m_j^post, v_j^post+1) per stratum and average as Ñ grows → recovers HT. Prior and likelihood are untouched.
- conditions: ξ_j known; estimand framed as "the complete-sample mean under realizations of the randomization r," not "the parameter μ itself."
- tier: 🟢 · source: dansblog:robins-ritov
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe: separate the model-to-fit from the algorithm-used-to-fit-it; ask whether Gibbs is a requirement or just the reference implementation"

### Measurement / observational model (censoring, contamination, binning)

**✗ B1** · for **count/spectral data observed through a non-trivial measurement process** → fitting
the theoretical model directly to the observations (ignoring binning, contamination/background, or
zero-inflation) does **NOT** work.
- why: the observational model is the theoretical model convolved with the measurement response; omitting the background mixture conflates background with signal, and omitting bin integration ignores that continuous energies arrive as binned counts → the fitted parameters are not the physical quantities.
- conditions: binned counts vs. continuous energies; background mixed with signal; multiple zero-inflation mechanisms.
- tier: 🟢 · source: betanalpha:generative_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the transformed-parameter that computes the mixing weight for a type/domain error before blaming the model" · "Sanity-check the likelihood structure against the generative process; question whether the pdf+cdf 'censoring' terms and a free mixing weight belong"

**✓ B2** · for such data → building the observational model as **theoretical-spectrum-integrated-over-
each-bin** (multinomial probabilities ρ_k) **plus a signal/background mixture** λ·π(E|θ_S) +
(1−λ)·π(E|θ_B) works.
- why: bin integration yields the correct multinomial cell probabilities (the continuous→discrete measurement step) and the mixture separates background from signal, so the recovered parameters are the physical ones.
- conditions: known bin structure; a background-process model available; particle-energy (§3.4) archetype.
- tier: 🟢 · source: betanalpha:generative_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect the transformed-parameter that computes the mixing weight for a type/domain error before blaming the model" · "Sanity-check the likelihood structure against the generative process; question whether the pdf+cdf 'censoring' terms and a free mixing weight belong"

### Baseline measurement error (pre/post)

**✗ C1** · for **pre/post (T1/T2) repeated measurements** → entering the baseline **T1 as a right-
hand-side predictor of T2** to "control for baseline" does **NOT** work.
- why: it treats T1 as measured without error; conditioning on the noisy observed baseline biases the baseline coefficient and induces regression-to-the-mean.
- conditions: baseline measured with non-negligible error (the usual case); any RE grouping (nested, cross-classified, multiple-membership); less harmful only if the baseline is near-noiseless. In a *randomized* design the treatment-effect estimate stays unbiased (randomization breaks the baseline↔treatment correlation) — the bias concerns the baseline *coefficient* and observational contrasts.
- tier: 🟡 · source: mc-stan:8691
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Offer the latent-true-value alternative: model the noisy (error-prone) observed baseline as generated by a latent true value and estimate that latent value with a measurement-error term (e.g. brms me()), instead of conditioning on the raw baseline"

**✓ C2** · for pre/post repeated measures → modeling **both timepoints as the response in long
format** (time predictor + per-subject random effect) works.
- why: avoids conditioning on a noisy baseline; separates within-subject change from measurement error.
- conditions: repeated-measures design with a baseline of the same outcome.
- tier: 🟡 · source: mc-stan:8691
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Offer the latent-true-value alternative: model the noisy (error-prone) observed baseline as generated by a latent true value and estimate that latent value with a measurement-error term (e.g. brms me()), instead of conditioning on the raw baseline"

### Imputation legitimacy (response vs covariate)

**✗ D1** · for a **missing RESPONSE** → imputing it and re-fitting the model on the imputed values
does **NOT** work.
- why: it double-counts the data ("conditioning twice") — a missing response carries no inferential information beyond what a single joint fit already extracts → meaningless inferences.
- conditions: pure-response missingness (single relationship); the impute-then-refit temptation.
- tier: 🟡 · source: mc-stan:21644, mc-stan:5135, pymc:12450
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Explain that under ignorable (MAR) missingness a fully-missing response contributes nothing to the likelihood, so imputing it and refitting only re-injects the model's own predictions as data (the double-count) — a single joint fit already extracts all available information" · "Reframe: separate the model-to-fit from the algorithm-used-to-fit-it; ask whether Gibbs is a requirement or just the reference implementation"

**✓ D2** · for a **missing COVARIATE** → imputing it inside a single joint fit
(`bf(Y ~ X1*mi(X2)) + bf(X2 | mi() ~ …)`) works.
- why: a missing covariate enters two relationships — predictor of the outcome AND response of its own submodel — so its imputations carry genuine information; imputation is legitimate.
- conditions: continuous missing covariate; discrete missing covariates handled separately by finite-mixture marginalization or latent-variable imputation, not the response-feedback loop.
- tier: 🟡 · source: mc-stan:21644, mc-stan:5135, pymc:12450
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Offer the latent-continuous alternative: model the discrete observation as generated by a latent continuous trait and impute the trait with mi()" · "Hand off the concrete marginalization recipe: condition on observed values, and for missing rows add the log_sum_exp of the support-weighted likelihood"

### Imputation mechanics under HMC/NUTS

**✗ E1** · for **missing entries in an array-valued observed variable under HMC/NUTS where you don't
need the missing draws** → full auto-imputation (or masking the residual/data) does **NOT** work well.
- why: auto-imputation adds one latent free parameter per missing entry, expanding the sampled dimension and slowing NUTS; and zeroing the residual (`mu=(y_hat−y)*mask`) keeps masked points in the likelihood with finite logp, so they still inform σ and the parameters.
- conditions: gradient-based sampler; array-valued observed with missing entries; you do NOT need posterior draws of the missing values.
- tier: 🟡 · source: pymc:4926, pymc:8478, pymc:5705
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Show that zeroing the residual (mu=(y_hat−y)*mask) still leaves the masked entries contributing a finite Normal log-density that depends on σ (so they keep informing σ), and that full auto-imputation adds one latent free parameter per missing entry — expanding the sampled dimension and slowing NUTS"

**✓ E2** · for that case → **masking the log-PROBABILITY of the missing entries** (`logp(...)*mask`,
`logp(...)[mask]`, or `pm.Potential` over the masked logp) works.
- why: it drops exactly the missing entries' likelihood contribution without allocating latent dimensions or leaking them into σ — masks the log-density term, not the data.
- conditions: you don't need the missing draws; the multivariate-conditional case remains limited; constrained-imputation instability is version-dependent (older PyMC; modern PyMC transforms imputed variables).
- tier: 🟡 · source: pymc:4926, pymc:8478, pymc:5705
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Mask the log-probability term itself (logp(...)*mask, logp(...)[mask], or a pm.Potential over the masked logp) so the missing entries add exactly zero to the density" · "Verify no latent dimensions are allocated for the missing entries and that σ is estimated from the observed data only — you are masking the density term, not the data array"

### Variate/covariate factorization direction

**✓/✗ F1** · for a **bivariate (or joint) model where one component can go missing** → choosing the
factorization direction **by which variable is prone to missingness** works; choosing it **by
generative priority** (which was "generated first") does **NOT**.
- why: for π(y, x | μ, τ, σ), decompose as π(y|x, σ)·π(x|μ, τ) when y is prone to missingness (forward) or π(x|y, μ, τ, σ)·π(y|σ) when x is prone to missingness (reverse); these yield different conditional variate models with different parameters, so the role is an application choice, not a generative one.
- conditions: the same joint can be decomposed both ways; pick by the deployment missingness pattern.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Refuse to give code; force the asker to restate units, the random variable, and exactly what data is observed before any modeling" · "Apply the deterministic-skeleton heuristic: strip all randomness and ask whether the unknowns are solvable from the observed quantities"

### Mixture vs. convolution identifiability (latent component missing)

**✗ G1** · for a model **labeled a "mixture" whose component weights are actually KNOWN** → treating
it as a mixture with something to infer does **NOT** work.
- why: with known weights there is nothing "mixture" to infer — it is a weighted average / convolution (sum of weighted RVs), and summation can erase the information needed to recover the component parameters.
- conditions: known component weights; sum-of-RVs structure; single-witness thread.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Challenge the mixture label directly — note the weights are known, so there is nothing 'mixture' to infer; reframe as weighted average" · "Reclassify the model from 'mixture' to 'convolution' (sum of weighted RVs) and assess identifiability via information-erasure under summation" · "Apply the deterministic-skeleton heuristic: strip all randomness and ask whether the unknowns are solvable from the observed quantities"

**✓ G2** · for assessing whether a **convolution/compound model's component parameters are
recoverable** → deriving the marginal density analytically (order statistics; or the compound-Poisson/
Tweedie marginal of S) and validating against ground truth works.
- why: writing the marginal of the observed sum and checking recoverability — or refitting across known truth — catches non-identifiability before wasting sampling effort.
- conditions: sum/convolution/compound structure; single-witness thread.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Evaluate the specific compound-Poisson/Tweedie reformulation: write the marginal density of S and check whether component parameters are recoverable" · "Derive the marginal density analytically via order statistics instead of patching the mixture" · "Refit across several true (alpha1, alpha2) pairs and run many chains; watch P1 and the chain traces"

### Discrete-state marginalization under missingness

**✗ H1** · for a model with **missing/latent DISCRETE values under HMC** → accumulating the sum over
discrete states on the **linear scale** (or trying to sample the discrete parameter with HMC) does
**NOT** work.
- why: linear-scale addition instead of proper log-domain marginalization is numerically wrong/unstable, and HMC cannot sample discrete parameters; a failed marginalization is usually implemented-but-wrong, not merely unimplemented.
- conditions: discrete missing covariate / latent state; gradient-based sampler.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads≤2)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose the failed marginalization attempt: ask whether it failed to IMPLEMENT vs implemented-but-wrong-results, and reframe the task as a finite mix" · "Inspect how the sum over discrete states is accumulated — linear-scale addition of log-likelihood contributions vs proper log-domain marginalization" · "Assess computational scaling of the explicit discrete sum, and consider reparameterizing to model observed frequencies/probabilities directly"

**✓ H2** · for a **missing discrete covariate** → **marginalize it out** (condition on observed
values; for each missing row add the `log_sum_exp` of the support-weighted likelihood), or offer a
latent-continuous alternative imputed with `mi()`.
- why: exact finite-mixture marginalization removes the discrete latent without the response-feedback loop; the latent-continuous route imputes a continuous trait that generates the discrete observation.
- conditions: finite/known support for the marginalization; latent-continuous route when a continuous trait is plausible.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Hand off the concrete marginalization recipe: condition on observed values, and for missing rows add the log_sum_exp of the support-weighted likelihood" · "Offer the latent-continuous alternative: model the discrete observation as generated by a latent continuous trait and impute the trait with mi()" · "Diagnose the failed marginalization attempt: ask whether it failed to IMPLEMENT vs implemented-but-wrong-results, and reframe the task as a finite mix"

### Interval / block-censored likelihoods

**✓ I1** · for **interval/block-censored discrete observations** (periodic inspection detecting a
failure that already occurred) → building a **custom block/interval-censored likelihood keyed to the
observation semantics** works.
- why: the observed value is the inspection index (inspection j = the (k·j)th unit; failure detected at a block boundary), so a block-censored geometric likelihood places the failure in its interval rather than at a point — provided you first interrogate the DGP (independent Bernoulli per unit vs. a failure ONSET after which all fail).
- conditions: interval/periodic censoring; exact observation semantics pinned down; identifiability fails when the censoring block exceeds the geometric mean (the data can't constrain p).
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Interrogate the data-generating process: is each widget an independent Bernoulli, or does the machine have a failure ONSET after which all widgets are affected" · "Build a block/interval-censored geometric likelihood (a custom discrete dist) whose value indexes the inspection at which failure is first detected" · "Probe identifiability by sweeping k and the observations; check whether the data can constrain p when the censoring block exceeds the geometric mean"

**✗ I2** · for **turning a solved censored inference into an action** → using a fixed **percentile
rule** instead of an explicit cost model does **NOT** work.
- why: the inferential problem and the decision problem are separate; a percentile threshold hides the cost tradeoff that should actually drive the decision.
- conditions: a decision follows a censored-failure inference; single-witness thread.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Separate the (solved) inferential problem from the decision problem; introduce an explicit cost model rather than a percentile rule"

### Misclassification / annotator (label measurement-error)

**✗ J1** · for a **misclassification / annotator (label measurement-error) model** → the naive
**constant-add pattern** and a **simple per-test product likelihood** do **NOT** work.
- why: the constant-add pattern for gold labels is wrong (pin the latent true label, or model gold sources as high-accuracy annotators); the per-test product likelihood assumes conditional independence across tests that may not hold.
- conditions: misclassification/annotator models with latent true labels; multiple noisy tests/annotators.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reject the constant-add pattern; pin the latent true label instead, or model gold sources as high-accuracy annotators" · "Examine the conditional-independence assumption underlying the simple per-test product likelihood" · "Inspect the transformed-parameter that computes the mixing weight for a type/domain error before blaming the model"

**✓ J2** · for the **misclassification-row simplex under HMC** → reparameterize the rows onto the
**unconstrained log-odds scale** (draw log-odds from a (multivariate) normal, then softmax to the
simplex), watching the three classic logistic-normal/softmax defects, works.
- why: sampling the simplex directly is ill-conditioned; the log-odds→softmax form is HMC-friendly, provided you check the known logistic-normal pitfalls and break symmetry.
- conditions: confusion-matrix / misclassification rows on the simplex; gradient-based sampler.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reparameterize misclassification rows onto the unconstrained log-odds scale: draw log-odds from a (multivariate) normal, then softmax to the simplex" · "Diagnose the three classic logistic-normal/softmax reparameterization defects" · "Set reasonable initial values and constrain parameters to break symmetry"

### Diagnosing divergences in latent/mixture measurement fits

**✗ K1** · for a **latent/mixture measurement model that diverges** → **pure sampler tuning**
(adapt_delta→0.999, more iters, max_treedepth→18, smaller stepsize) as the fix does **NOT** work when
the geometry is the problem.
- why: brute-force tuning only tests the tuning-insufficiency hypothesis; it does not cure a funnel between the shared scale and the component locations.
- conditions: mixture/latent measurement model; divergences + low E-BFMI; geometry-driven.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Try pure tuning: bump adapt_delta toward 0.999 and increase iterations" · "Brute-force more computation first (raise iters/warmup, adapt_delta->0.99, max_treedepth->18, smaller stepsize) to test the tuning-insufficiency hypothesis" · "Sampler-tuning triage first: raise adapt_delta, shrink initial stepsize, lengthen warmup"

**✓ K2** · for that diverging mixture/latent fit → **non-center the components** (z~std_normal,
value=μ+σ·z) and **reparameterize the correlated hyperparameters** (bivariate log-normal on (ν,τ)
with ρ; or swap to the centered form where the likelihood is strong) works.
- why: non-centering decouples the shared σ from the component locations (removing the funnel proper); the (ν,τ) coupling is not a funnel but a correlation between two hyperparameters — an elongated, ill-conditioned ellipsoid — which a joint bivariate-log-normal with estimated ρ whitens/absorbs; the right parameterization is data-regime-dependent.
- conditions: mixture/latent measurement geometry; HMC/NUTS.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Non-center the mixture components: introduce z ~ std_normal() and set component value = mu + sigma*z (transformed parameters), so the shared sigma no longer couples the locations" · "Reparameterize the (nu, tau) joint directly to absorb their correlation (e.g. bivariate log-normal on (nu,tau) with an estimated correlation rho)" · "Swap parameterization of the group effects (try the centered form theta~normal(mu,tau) instead of non-centered)"

**✓ K3** · for such a fit → **diagnose the geometry first** — pairs/scatter of (μ1 vs μ2, σ vs
locations) and the energy/joint (lp__, energy__) — and cross-check the reparameterized fit before
trusting it works.
- why: pairs plots reveal correlation/funnel shapes and the energy diagnostic reveals the mismatch; cross-checking against the centered fit and simulated ground truth confirms the geometry actually improved.
- conditions: mixture/latent measurement geometry; single-witness thread.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Inspect a pairs/scatter plot of the parameters (mu1 vs mu2, and sigma vs locations) for correlation or funnel shapes" · "Inspect the energy/joint geometry: pairs plot of the scale hyperparameters together with lp__ and the per-iteration energy__ (extract via get_sampler_params)" · "Cross-check the reparameterized fit against the centered fit (and against simulated ground-truth parameters) on multiple datasets"

**✓ K4** · for a mixture measurement model with **label-switching / prior-induced pathology** →
**relaxing over-tight priors** (drop beta(2,2) on p; widen μ sd 0.2→1), **setting reasonable inits**,
and **constraining to break symmetry** works.
- why: over-tight priors and unbroken label symmetry create multimodality/divergences; relaxing priors and imposing an ordering/init breaks the symmetry.
- conditions: exchangeable mixture components; label-switching risk.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Relax/remove priors (drop beta(2,2) on p; widen mu prior sd 0.2 -> 1) and rerun; compare divergence count and E-BFMI" · "Reparameterize mu as (mu1, delta) with mu2 = mu1 + delta and a prior on the difference; rerun" · "Set reasonable initial values and constrain parameters to break symmetry"

### Count-likelihood engineering / large counts (custom family)

**✗ L1** · for a **custom count likelihood in brms/Stan on large-count data** → the default integer-
outcome density does **NOT** work (overflow at large outcome magnitude).
- why: the fragile density term overflows; localizing by shrinking rows and bisecting the outcome magnitude finds the breaking scale, and the extra real datum may be mis-declared (`offset()` vs `vreal()`).
- conditions: custom count family; large counts; brms `vreal`/`offset` declaration; multithreading may confound the error.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Interrogate the error semantics and ask whether it reproduces without threading and whether the data is even representable upstream in R" · "Audit how the brms formula declares the extra real datum: offset() term vs vreal() term" · "Localize the new overflow: shrink the problem (subset rows, drop predictors) and bisect the outcome magnitude to find the breaking scale"

**✓ L2** · for such large-count overflow → **re-express the count likelihood on REAL outcomes** via a
custom log-density, offer a **large-count approximation**, and **upgrade the toolchain** (update
cmdstan) works.
- why: operating on doubles and/or a large-count approximation sidesteps the fragile term; a newer cmdstan ships the improved density.
- conditions: custom-family count model; large counts; toolchain upgradeable.
- tier: ⚪ candidate (move-only) · source: (move-only, n_threads=1)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Re-express the count likelihood to operate on REAL (double) outcomes instead of int, via a custom log-density" · "Offer two parallel resolutions: (a) a large-count APPROXIMATION that sidesteps the fragile term, and (b) upgrade the toolchain to get the improved density" · "Update cmdstan and re-run the custom-family model on the large-count data"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
generative_modeling · variate_covariate_modeling

**Dan Simpson blog** (`dansblog:<id>` → `https://dansblog.netlify.app/posts/…`):
robins-ritov (`2022-11-12-robins-ritov/robins-ritov.html`)

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pymc:N` → `https://discourse.pymc.io/t/…/N`):
mc-stan:8691 (cross-classified-multiple-membership-models-with-brms) ·
mc-stan:21644 (imputing-missing-responses-in-multivariate-ordinal-data) ·
mc-stan:5135 (missing-data-of-main-effects-in-model-with-interaction-terms) ·
pymc:12450 (calculating-conditional-posterior-predictive-samples-in-high-dimensional-observation-spaces) ·
pymc:4926 (disabling-missing-data-imputation) ·
pymc:8478 (beta-distribution-failing-for-missing-value-imputation) ·
pymc:5705 (multivariate-normal-with-missing-data-imputation-operands-could-not-be-broadcast)

### Censored likelihoods (Tobit / left-censoring at a bound)

**✓ M1** · for **limited/corner outcomes piled at a bound** (expenditure, hours worked, demand
censored at 0) → **Tobit regression = a linear model with a Normal likelihood wrapped in censoring at
the bound** (`pm.Censored(pm.Normal.dist(mu=X·β, sigma), lower=0)`) works.
- why: fitting an ordinary Gaussian ignores the point mass at the bound and biases the slope; wrapping the Normal in `pm.Censored` places the boundary observations' mass in the tail integral (the CDF term of C6), so the recovered coefficients are unbiased.
- conditions: limited/corner outcome with a known censoring bound (left-censored at 0 in the Tobit case); out-of-bound values recorded AT the bound (censoring, not truncation — cf C6).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

### Robust / contamination likelihoods (implicit-mixture route)

**✓ N1** · for **outliers you want to downweight without explicitly flagging them** (implicit
contamination) → **swapping the Normal likelihood for Student-t** works.
- why: Student-t is an infinite scale-mixture of Normals, so it downweights outliers implicitly — the implicit-mixture complement to C1's EXPLICIT signal/background contamination mixture; ν sets tail heaviness (ν=1 is Cauchy, very heavy; ν>30 ≈ Normal).
- conditions: outlier-contaminated continuous outcome; choose the ν prior — Gamma(2, 0.1) (mode ≈10) weakly-informative, or Exponential(1/29)+1 (heavy-tail-leaning; the +1 offset keeps ν>1 for a finite mean), or fix ν≈4; compare vs Normal by LOO (`az.compare`).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
