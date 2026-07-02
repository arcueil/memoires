# Cross-cutting: priors, identifiability & degeneracy

*A cross-cutting computation-diagnostics area — it applies across ALL model classes, not one. The
**claims** spine synthesizes 60 granular claims into 7 mid-level principles about how priors,
identifiability, and posterior degeneracy interact. The **practical** layer is indexed by
DIAGNOSTIC SITUATION / SYMPTOM (not by model): you arrive with a symptom — chains disagree, the
posterior is diffuse, a "non-informative" prior misbehaves — and read off what works / what doesn't.*

## Claims (the *why* — mid-level, 7)

*Seven mid-level principles synthesized from 60 granular claims. Tier is the best-supported of the
granular claims each subsumes. Source short-ids resolve to URLs in the Source key at the bottom.*

### C1 · Identifiability is binary and asymptotic; degeneracy is what bites — and the prior must *regularize*, not merely *permit* 🟢
*[→ full entry](../claims/CC-priors-identifiability/C1.md)*

**Statement.** Identifiability is a binary, asymptotic property of the observational model (do two
distinct parameter values give different sampling distributions), whereas **degeneracy** — how
uniformly a *realized* posterior concentrates — is the preasymptotic quantity that actually governs
inference. An identified model can be severely degenerate on finite data, and when the likelihood is
non-identified (M>N covariates, a weakly-informed shape parameter, an overlapping mixture weight) the
prior must *actively regularize* the parameter scale, not merely permit it: a flat or wide prior
propagates the non-identifiability into an astronomically diffuse posterior.

**Nuance.** Several distinct traps share this root. (a) All non-identified models are degenerate but
not conversely. (b) "Widen the prior to cover the truth" fails under M>N because the *diffuseness is
the pathology* — posterior intervals span thousands when true slopes are ~10, and all diagnostics
fail together (100 % tree-depth saturation, E-BFMI ≈ 0.05–0.16, near-zero ESS/iter, R-hat up to 13).
(c) The opposite over-correction — a narrow weakly-informative prior — buys HMC-clean sampling at the
cost of a *silent* bias: relevant slopes (~±10) shrink below 1 and σ inflates ~10× to absorb the
unexplained signal, which is why the σ posterior is a free *sentinel* for prior misspecification.
(d) Some parameters stay weakly-informed no matter how much data arrives (an overlapping mixture
weight → posterior ≈ prior; a third/skew shape parameter saturates). The disciplined stance:
Bayesian sparsity is a property of the *whole posterior*, not a point-estimate selection — a
horseshoe never yields exact zeros — and elicitation only needs to supply *enough* to suppress the
configurations the likelihood cannot exclude (a finite, adversarial task; no need to see the data).

**Tier.** 🟢 established (subsumes `degeneracy-is-not-identifiability`,
`casestudy-non-identified-likelihood-requires-prior-to-identify-posterior`,
`casestudy-narrow-wip-biases-relevant-slopes-and-inflates-sigma`,
`casestudy-sigma-posterior-is-a-sentinel…`, `casestudy-bayesian-sparsity-is-not-frequentist-sparsity`,
`casestudy-global-scale-must-account-for-n-and-m0`,
`casestudy-mixture-weight-is-uninformed-by-overlapping-components`, `defensive-prior-elicit-enough-not-all`;
plus supported `forum-c483` skew-shape, `forum-c255` horseshoe-doesn't-remove-covariate).

**Sources.** betanalpha:identifiability · betanalpha:bayes_sparse_regression ·
betanalpha:identifying_mixture_models · mc-stan:17586 · mc-stan:16321 · mc-stan:29012 · mc-stan:26200

---

### C2 · Likelihood symmetries create structural, data-invariant multimodality — you must break the symmetry in the *model* 🟢
*[→ full entry](../claims/CC-priors-identifiability/C2.md)*

**Statement.** When the likelihood is invariant under a transform of the parameters — relabeling
components (K! modes), sign flips of factor loadings, rotation/reflection of a latent space, a joint
shift of a location against a set of offsets, or splitting an observable into additive latent pieces —
the posterior is structurally multimodal (or a continuous ridge). This is a *theorem about the model*,
not a convergence failure: more data, longer warmup, and higher `adapt_delta` cannot fix it.

**Nuance.** The main distinction is discrete vs continuous symmetry. Discrete symmetry (K! label
modes, sign flips) gives isolated equal-mass modes a single chain cannot traverse in finite time;
continuous symmetry (rotation/MDS; the additive `y = a + b`; a summed observable `rt = rt₁ + rt₂`; the
affinity–cutpoint difference `c_k − γ`) gives a connected ridge with near-perfect parameter
correlations. Diagnostic signatures are specific and shared: R-hat in the 20s–50s, tree-depth
saturation, tiny n_eff (<10), low E-BFMI. The correct *first* move is to classify whether the modes
are symmetry-equivalent (fixable by a constraint on a permutation-invariant estimand, see C6) or
genuinely different solutions. A crucial sub-distinction: breaking the symmetry *with a prior* only
works at small N — at large N the likelihood swamps even a heavily asymmetric prior and all K! modes
retain mass. A global-intercept + zero-mean group-effect location non-identifiability is the mildest
instance and still inflates the group scale; and even after the global ridge is broken, cutpoints
adjacent to sparse/empty categories keep wandering to ±∞.

**Tier.** 🟢 established (subsumes `casestudy-label-switching-is-structural-not-computational`(+`-2`),
`casestudy-affinity-cutpoint-non-identifiability`, `casestudy-sparse-category-cutpoint-wandering`,
`casestudy-asymmetric-prior-insufficient-against-large-n-likelihood`,
`casestudy-non-exchangeable-prior-fails-at-large-n`, `additive-gp-components-require-nonoverlapping-length-scale-priors`;
plus supported `forum-c3` sign-flip, `forum-c417` rotation/reflection, `forum-c204` sum-of-latents,
`forum-c498` sign-ambiguous-transform, `forum-c15` location-non-id).

**Sources.** betanalpha:identifying_mixture_models · betanalpha:mixture_models ·
betanalpha:ordinal_regression · mc-stan:1483 · pymc:1324 · mc-stan:16945 · mc-stan:37414 ·
mc-stan:8028 · pymc:16375 · mc-stan:39536 · mc-stan:17086

---

### C3 · "Non-informative" priors are a myth; the weakly-informative alternative is deliberate scale/shape/tail engineering 🟢
*[→ full entry](../claims/CC-priors-identifiability/C3.md)*

**Statement.** Flat, improper, and diffuse-but-proper priors are not non-informative — they actively
bias the posterior toward extreme values and can wreck sampling. The operative choice is always a
*weakly-informative* prior whose scale, shape, and tails are chosen on purpose, because each choice
has distinct — and sometimes silent — failure modes.

**Nuance.** The "non-informative" myth breaks several ways. Flat priors are formally incompatible with
being proper (the stereographic projection concentrates all mass at infinity); diffuse-proper priors
replicate the pathology empirically (N=5 with Normal(0,1000) pushes coefficients to ±15k and collapses
n_eff(σ) to 821/10000); vague uniform(0,10)/wide normals on scale hyperparameters leave group effects
unconstrained so chains meander around initialization (non-convergence *as non-mixing*, not an error).
Even a "standard" default can be pathological on the wrong support — Beta(α,β) with a shape < 1
diverges at the boundary and stresses HMC leapfrog — and independence is not neutrality: i.i.d. Cauchy
priors in Rᴺ violate the rotational symmetry they are invoked to express (only i.i.d. Normal is
rotationally symmetric). On the positive-engineering side, the distinctions are precise: a light-tailed
Gaussian fails *silently* when the true value exceeds its scale (concentrating at the shoulder while
every diagnostic passes), whereas a Cauchy fails *loudly* (NaN-gradient tail excursions); Gamma and
Inverse-Gamma suppress *opposite* tails; the GIN half-order families and the log-normal are
near-interchangeable soft-containment defaults (max density difference ≈ 1.3e-3). And a shrink-to-zero
(PC) prior is only appropriate when the base value collapses to a *plausible* simpler model (τ=0 yes,
σ=0 no — "flexibility" is contextual, not formal). The frequentist escape hatch (worst-case
calibration) is itself unavailable for unbounded scale parameters, so some prior-like bound is
unavoidable.

**Tier.** 🟢 established (subsumes `diffuse-priors-push-mass-to-extremes`,
`beta-small-shape-boundary-diverging-prior`, `cauchy-product-prior-violates-rotational-symmetry`,
`frequentist-worst-case-unbounded-for-scale`, `gaussian-vs-cauchy-prior-shape-tradeoff`,
`gamma-vs-invgamma-opposite-tail-suppression`, `gin-half-order-subfamilies-interchangeable`,
`gin-half-order-vs-lognormal-slightly-tighter-containment`,
`gin-half-order-better-conditioned-delta-initialization`,
`containment-prior-parameter-tuning-requires-numerical-solver`, `flexibility-param-is-contextual`;
plus supported `forum-c345` vague-priors).

**Sources.** betanalpha:prior_modeling · betanalpha:weakly_informative_shapes ·
betanalpha:probability_densities · betanalpha:some_containment_prior_models ·
betanalpha:modeling_and_inference · dansblog:priors4 · mc-stan:39435 · mc-stan:31567 · mc-stan:31668 ·
mc-stan:13289

---

### C4 · A prior lives on the model's *internal* (parameterized) scale, not the natural scale — push it forward and check it there 🟢
*[→ full entry](../claims/CC-priors-identifiability/C4.md)*

**Statement.** A prior is a statement on the model's internal parameterization — the link/log scale,
a precision matrix, a basis-coefficient space, a non-centered z-scale — not on the natural quantity
you have intuitions about. The only reliable specification workflow is to *push the prior forward* to
the interpretable quantity and inspect it there.

**Nuance.** The mechanisms are distinct. (a) Link/transform mismatch: a prior on a logit/log/centered
-intercept parameter is read on *that* scale, so a [0,1]-bounded prior on a log-odds coefficient is
incoherent and a default student_t on log-σ can blow up under pushforward. (b) Named-argument traps:
LogNormal(μ,σ) describes log(X), so natural-scale mean/sd must be transformed (σ²=log(1+s²/m²),
μ=log(m)−σ²/2). (c) Parameterization gaps: a GMRF/CAR precision τ does *not* control any component's
marginal variance (var(x_j)=τ⁻¹[Q⁻¹]_jj, and [Q⁻¹]_jj depends on graph structure). (d) Basis spaces:
spline/GAM coefficients are interpretable only *locally* — the prior pushforward produces wild global
functions — and a power-scaling sensitivity flag on the fixed N(0,1) coefficients of a non-centered
spline/GP term is a meaningless artifact (the scale is carried by separate terms). (e) Constructive
fixes: an induced Dirichlet on ordinal probabilities pushed back to cutpoints gives an interpretable,
jointly-regularizing cutpoint prior; and a hand-written constraining transform must consume exactly
the target's intrinsic degrees of freedom (K−1 for a K-simplex) or the Jacobian is rank-deficient.

**Tier.** 🟢 established (subsumes `casestudy-induced-dirichlet-prior-on-cutpoints`,
`gmrf-precision-parameter-does-not-equal-inverse-marginal-variance`; plus supported `forum-c37`
link-scale, `forum-c495` lognormal-log-space, `forum-c443` spline-global-behavior, `forum-c147`
power-scaling-NCP-artifact, `forum-c398` transform-DOF).

**Sources.** betanalpha:ordinal_regression · dansblog:why-wont-you-cheat · mc-stan:34027 ·
mc-stan:27338 · mc-stan:10344 · pymc:6890 · mc-stan:28836 · mc-stan:24759 · mc-stan:34721 ·
pymc:6235 · mc-stan:29945 · mc-stan:24102 · mc-stan:35748 · mc-stan:40314

---

### C5 · Scaling a prior to the experimental design is principled, not cheating — and GP length scales are the sharpest, design-bounded case 🟢
*[→ full entry](../claims/CC-priors-identifiability/C5.md)*

**Statement.** There are at least three *mechanistically independent* reasons a principled Bayesian
must scale a prior to the design — placing a-priori mass on sparse signals (via the downstream
decision), the gap between a GMRF precision parameterization and the elicitable marginal SD, and
data-spacing limits on GP length-scale identifiability. GP length scales are the extreme case: their
identifiability is bounded by the covariate geometry itself, so no data-only procedure resolves them.

**Nuance.** The three design-dependence mechanisms are structurally independent, not one idea. For
GPs specifically: the EQ kernel has *two* distinct flat regions requiring different fixes — an upper
plateau where ρ exceeds the maximum covariate span (ρ drifts to ∞) and a lower plateau where ρ falls
below the minimum inter-point distance (interpolation degeneracy). The two regimes are asymmetric in
risk: long-range is uninformative but *low*-risk, short-range is uninformative *and high*-risk.
Marginal ρ and σ posteriors can each be very wide while the combination σ²/ρ is tightly determined,
so the honest diagnostic is the 2D joint (ρ,σ) ridge, not the marginals. Maximum marginal likelihood
is structurally inadequate (seed-dependent across plateaus — e.g. ρ=1.14/σ=0.20 vs ρ=0.234/σ=2.40),
and reference priors merely reproduce the ridge at ~8.5× the wall time of a PC prior. Using the
observed span to set ρ-prior bounds is only principled when the *design itself* was motivated by
length-scale knowledge — retroactive span-fitting overfits the prior.

**Tier.** 🟢 established (subsumes `design-dependent-priors-three-distinct-mechanisms`,
`gp-eq-dual-plateau-degeneracy`, `gp-marginal-posterior-ridge-diagnostic`,
`gp-mml-structurally-inadequate`, `gp-reference-prior-reproduces-ridge-not-resolves`,
`gp-prior-bound-requires-domain-expertise-not-data`; plus supported
`gp-length-scale-prior-data-spacing-asymmetry`, `forum-c314` GP-length-scales-weakly-informed).

**Sources.** dansblog:why-wont-you-cheat · dansblog:priors5 · betanalpha:gaussian_processes ·
mc-stan:35930

---

### C6 · The device you use to *break* a non-identifiability is itself a modeling decision — some are exact, others silently change the model 🟢
*[→ full entry](../claims/CC-priors-identifiability/C6.md)*

**Statement.** Breaking a non-identifiability is never free. Some devices are exact and
target-preserving (an ordering constraint for permutation-invariant estimands; a non-centered
fully-exchangeable form for a location non-identifiability); others silently change the generative
model or fail to do what they appear to (a hard sum-to-zero constraint, a sign-pin on a weak anchor,
an lkj-at-identity "decorrelation").

**Nuance.** The distinctions are sharp. An ordering constraint on a scalar component is
*mathematically exact* for any permutation-invariant function (the K! pyramids are rotations of one
another) — but it does *not* remove the continuous bowtie geometry of overlapping components (it
reduces a bowtie to a half-bowtie; only a *repulsive* prior fixes overlap). A hard sum-to-zero /
zero_sum_vector is *not* a neutral reparameterization: it pins the population mean to the sample
average of the group effects and breaks infinite exchangeability / conditional independence, so it
misfires exactly when you predict new groups or put priors on μ,σ — the soft fix α_k~N(μ,σ) with a
*separate* intercept preserves both. A sign constraint on a single factor loading is the *worst*
option when that anchor loading is weak (the constraint is satisfied at ~0 without a likelihood
penalty). And fixing a random-effect correlation to zero (brms `||`, lkj-at-identity) constrains only
the correlation *parameter* — the *empirical* correlation of the estimated effects can still be large.

**Tier.** 🟢 established (subsumes `casestudy-ordering-constraint-exact-identification-with-correct-inferences`,
`casestudy-parameter-ordering-exactly-resolves-label-switching`,
`casestudy-repulsive-priors-needed-for-overlapping-component-regime`; plus supported `forum-c17`
hard-sum-to-zero, `forum-c15` location-fix, `forum-c3` sign-pin-facet, `forum-c47` RE-correlation).

**Sources.** betanalpha:mixture_models · betanalpha:identifying_mixture_models · mc-stan:26215 ·
mc-stan:1382 · mc-stan:39536 · mc-stan:17086 · mc-stan:1483 · mc-stan:17273

---

### C7 · Parameters are "polite fictions"; linking a posterior to a population or causal estimand needs extra-Bayesian structure 🟢
*[→ full entry](../claims/CC-priors-identifiability/C7.md)*

**Statement.** Within a Bayesian model, parameters are "polite fictions" for describing data; linking
a posterior to a *population* or *causal* estimand always requires extra-Bayesian structure — an
exchangeability assumption, a known sampling/selection mechanism, or an explicit coupling model for
confounding — and that structure is a modeling commitment the likelihood does not supply.

**Nuance.** Even the "no ancillary information" case smuggles in exchangeability; the strict-Likelihood
-Principle Bayesian who refuses sampling information is a straw man, because post-processing a
posterior into a population answer is categorically distinct from parameter inference (Robins–Ritov).
Confounding is not a property of data or of any single model component but of the *coupling* between
the conditional variate model and the marginal covariate model (ψ is a confounder precisely when it
enters both) — so randomization suppresses it only to the degree the design is implemented, and
dropout/censoring correlated with the variate process reintroduces it. Exchangeability is the
operational bridge that lets τ be *learned* rather than fixed (partial pooling); "phylogenetic signal"
is exactly the ICC/heritability ratio h²=σ_a²/(σ_a²+σ_e²), identifiable only against a *competing*
unstructured variance component and non-identified with one observation per group; and in online
updating the previous posterior *becomes* the prior — the full prior+likelihood is kept, not dropped
"to avoid double-counting".

**Tier.** 🟢 established (subsumes `bayesian-parameters-are-fictions-population-inference-needs-extra-baye`,
`confounding-as-parameter-coupling`, `designed-experiment-confounding-from-imperfect-implementation`,
`exchangeability-enables-tau-to-adapt`; plus supported `forum-c257` phylogenetic-signal, `forum-c266`
online-updating).

**Sources.** dansblog:robins-ritov · betanalpha:variate_covariate_modeling · dansblog:monkey ·
mc-stan:16457 · pymc:13225 · pymc:956

---

---

### C8 · Maximum-entropy priors are the least-committal distribution given elicited constraints — "least-informative" means *given the constraints*, not flat 🟢
*[→ full entry](../claims/CC-priors-identifiability/C8.md)*

**Statement.** Given constraints — bounds plus a probability mass, or a set of moments — the
maximum-entropy distribution is the unique least-committal choice consistent with them. It is
constructed, not chosen by feel: `pz.maxent(family, lower, upper, mass)` (PreliZ) returns the member of
a chosen family that spreads probability as widely as possible subject to the elicited constraint.

**Nuance.** Maxent is NOT a "non-informative" prior in the C3 sense — the *constraints* carry the
information, so it is a principled *weakly-informative* construction, not a flat/vague default.
"Least-informative" here means "least-informative GIVEN the constraints", not flat. It still lives on
the model's internal scale, so push it forward (per C4) and run a prior-predictive check before
trusting it.

**Conditions.** You can state the constraints explicitly (a bounded interval with a probability mass,
or moments) and you have chosen a distributional family for the maxent solution to select within.

**Tier.** 🟢 established (source: pymc-labs L1, human-curated)

**Sources.** pymc-labs:prior-elicitation

---

### C9 · Prior-data conflict is a diagnosable post-fit situation — fix the prior, not the sampler 🟢
*[→ full entry](../claims/CC-priors-identifiability/C9.md)*

**Statement.** A posterior piled against a prior boundary, a prior that disagrees with the posterior,
divergences concentrated near prior boundaries, or low ESS on a single parameter all point to
**prior-data conflict**: the prior is too narrow or on the wrong scale. Diagnose it by overlaying prior
and posterior (`az.plot_dist_comparison`); resolve it by rescaling or widening the prior from domain
knowledge (or by checking the data for errors) — NOT by tuning the sampler.

**Nuance.** This is a distinct situation from a geometry/tuning failure: the remedy is on the prior
side, not `target_accept` / warmup / step size. The same symptoms (boundary-piling, boundary-concentrated
divergences, single-parameter low ESS) that a tuning-first reflex would chase with the sampler are here
read as a prior mis-scale; the alternative non-prior cause worth ruling out first is a data error.

**Conditions.** Post-fit; symptom is prior≠posterior overlap, posterior piled against a prior boundary,
divergences concentrated near prior boundaries, or low ESS localized to one parameter.

**Tier.** 🟢 established (source: pymc-labs L1, human-curated)

**Sources.** pymc-labs:convergence-diagnostics

---

### C10 · Prior sourcing is a strategy-selection problem — route the elicitation method by epistemic state (expert access x scale precision) 🟢
*[→ full entry](../claims/CC-priors-identifiability/C10.md)*

**Statement.** There is no single correct way to source a prior from substance; choosing the elicitation *strategy* is itself a modeling decision, routed by the practitioner's epistemic state — whether a domain expert is available and how precisely the scale/quantiles can be stated. Each regime has a matched method (precise expert quantiles -> structured elicitation SHELF/roulette/quartile; expert-but-imprecise -> maxent/constrained priors; no expert but rough scale -> weakly-informative scale/tail engineering; no scale knowledge -> prior-predictive iteration), and the strategy must be selected *before* the technical calibration of C3/C4/C8 is applied.

**Nuance.** A mid-level principle consolidated (2026-07-02) from the practical recs it governs on this page (EL1); see the recs below for the concrete instances and conditions.

**Conditions.** As per the governed recs.

**Tier.** 🟢 (new claim; generalizes 1 recs; NOT yet in the human-review packet).

**Sources.** (inherited from governed recs)

## Practical — what works / what doesn't (comprehensive, SITUATION-indexed)

*55 recs (37 ✗ / 13 ✓ / 5 bidirectional), indexed by the diagnostic situation or symptom you arrive
with — NOT by model. `efficacy` is the benchmark-shaped slot `{divergences, min_ess, ess_per_sec,
rmse, coverage}`, filled ONLY from a metric present in the input, else `pending`. Attached `moves`
are the diagnostic "how", matched by relevance; single-witness moves are the searchable tail.*

### Symptom: chains disagree / high R-hat / conflicting modes, and more data · longer warmup · higher `adapt_delta` don't help

**✗ S1** · when **chains land in conflicting sign/label/orientation modes and tuning doesn't help** → *[→ entry](../recs/CC-priors-identifiability/S1.md)*
treating it as a **sampler-tuning** problem does **NOT** work — it is *structural* non-identifiability
(a likelihood symmetry: K! relabelings, loading sign flips, latent-space rotation).
- why: the posterior is genuinely multimodal by a theorem; no step size or warmup crosses low-probability barriers between symmetric modes.
- conditions: any likelihood invariant under a discrete parameter transform; single chains agree internally but disagree across seeds.
- tier: 🟢 · source: betanalpha:identifying_mixture_models, mc-stan:1483, pymc:1324
- efficacy: {divergences: pending · min_ess: R-hat in the 20s–50s across cases (factor loadings 20s–30s) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the symptom as suspected non-identifiability rather than a tuning/geometry problem" · "Classify the multimodality: symmetry-induced vs genuinely different solutions" · "Inspect the parameterization for invariances — is the map to the target quantity one-to-one?"

**✓ S2** · when **the modes are symmetry-equivalent** (permutation-invariant estimand) → an **ordering *[→ entry](../recs/CC-priors-identifiability/S2.md)*
constraint on one scalar component** works (exact — identical expectations to the unconstrained posterior).
- why: the K parameter regions are K! rotated "pyramids"; ordering selects one and the symmetry guarantees equal expectations for any permutation-invariant f.
- conditions: scalar (orderable) component; inference sought is permutation-invariant; exchangeable priors.
- tier: 🟢 · source: betanalpha:mixture_models, betanalpha:identifying_mixture_models
- efficacy: pending (no metric in input)
- moves: "Classify the multimodality: symmetry-induced vs genuine" · "Inspect the parameterization for invariances — is the map one-to-one?"

**✗ S3** · when **mixture components overlap** (separation within ~1σ) → an **ordering constraint** does *[→ entry](../recs/CC-priors-identifiability/S3.md)*
**NOT** fully work — it reduces the bowtie to a half-bowtie but the continuous ridge remains; a
**repulsive prior** is the only structural fix.
- why: overlap generates a continuous manifold of near-equal configurations parameterized by a rotation angle; ordering removes labels, not the manifold.
- conditions: substantial overlap; ordering already applied; no external info on which component is larger.
- tier: 🟢 · source: betanalpha:identifying_mixture_models
- efficacy: pending (no metric in input)
- moves: "Classify the multimodality: symmetry-induced vs genuine" · "Count degrees of freedom: parameter dimension vs intrinsic dimension of the target manifold"

**✗ S4** · when **a label/mixture degeneracy persists at large N** → an **asymmetric / non-exchangeable *[→ entry](../recs/CC-priors-identifiability/S4.md)*
prior** does **NOT** break it (the likelihood swamps the prior; all K! modes keep mass).
- why: at large N the mixture likelihood is highly informative and its K! symmetry overwhelms even a strong, finite prior.
- conditions: large N; components well-separated in data; priors asymmetric but finite.
- tier: 🟢 · source: betanalpha:mixture_models, betanalpha:identifying_mixture_models
- efficacy: {divergences: pending · min_ess: R-hat 49–58 even with priors 4 SD from the true means; N=1000 fails vs N=100 succeeds (μ~N(±4,0.5)) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify the multimodality: symmetry-induced vs genuine" · "Reframe prior-improbable posteriors as data-vs-prior conflict; check the magnitude in the right units"

**✓ S5** · when **the same degeneracy occurs at small N** → an **asymmetric prior** *does* suppress the *[→ entry](../recs/CC-priors-identifiability/S5.md)*
disfavored modes.
- why: at small N the likelihood curvature between modes is weak enough that a strong prior wins.
- conditions: small N (N=100 in the example); components separated; no ordering constraint.
- tier: 🟢 · source: betanalpha:identifying_mixture_models
- efficacy: {divergences: pending · min_ess: N=100 succeeds with μ[1]~N(4,0.5), μ[2]~N(−4,0.5) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify the multimodality: symmetry-induced vs genuine"

**✓/✗ S6** · when **a factor/loading sign is non-identified** → constraining **ONE loading's sign** *[→ entry](../recs/CC-priors-identifiability/S6.md)*
works only if that anchor loading is strongly nonzero; it does **NOT** work when the anchor is weak
(the constraint is met at ~0 without a likelihood penalty). ✓ alternative: **orient all loadings
positive**, a **sparse (witch-hat) prior**, or **post-hoc relabeling**.
- why: sign/rotation invariance makes the unconstrained posterior multimodal; a weak anchor lets modes coexist where the anchor is ~0.
- conditions: factor/SEM/IRT/PPCA/MDS; most acute with weak anchor, many indicators, or 2+ factors.
- tier: 🟡 · source: mc-stan:1483, pymc:1324
- efficacy: {divergences: pending · min_ess: R-hat in the 20s–30s (unconstrained) · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Classify the multimodality: symmetry-induced vs genuine" · "Inspect the parameterization for invariances — is the map one-to-one?"

**✓/✗ S7** · when **a correlation's sign is encoded through `abs()` / squaring / a shared unconstrained *[→ entry](../recs/CC-priors-identifiability/S7.md)*
factor** → the sign is non-identified and the posterior is bimodal; extra warmup / higher `adapt_delta`
do **NOT** help. ✓ reparameterize with an **LKJ-Cholesky on an MVN latent** (or a copula).
- why: +σ and −σ give (near-)identical likelihoods for the symmetric piece → a label-switching-style split into two modes.
- conditions: latent/hierarchical models with a signed quantity behind a sign-ambiguous transform; diagnose via overdispersed multi-chain starts.
- tier: 🟡 · source: mc-stan:37414
- efficacy: {divergences: pending · min_ess: large between-chain log-lik gap, R-hat stays high regardless of warmup/adapt_delta · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the symptom as suspected non-identifiability rather than tuning" · "Classify the multimodality: symmetry-induced vs genuine"

**✗ S8** · when **an observable is the SUM of ≥2 free latent additive components** (`rt = rt₁ + rt₂`) → *[→ entry](../recs/CC-priors-identifiability/S8.md)*
decomposing them **without shared / anchoring structure** does **NOT** work (the data inform only the
sum → a ray/ridge of equivalent solutions).
- why: r₁+r₂=r_t is one equation in two unknowns; with noise it becomes a long, near-linear ridge (an ill-conditioned / anisotropic ellipsoid) with near-perfect parameter correlations — a linear degeneracy, not a curved geometry.
- conditions: additive/many-to-one measurement models; worst when components are exchangeable in form with no cross-item shared structure.
- tier: 🟡 · source: mc-stan:16945
- efficacy: {divergences: divergences + max-treedepth hits reported · min_ess: n_eff often <10, low E-BFMI · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the symptom as suspected non-identifiability rather than tuning" · "Demand the concrete generative structure: full likelihood, what indexes the configs, a tiny worked example" · "Diagnose identifiability with pairs plots at BOTH global and subject level"

**✗ S9** · when **two additive model components share a function class** (overlapping GP length scales, *[→ entry](../recs/CC-priors-identifiability/S9.md)*
a global trend specified like the local trends, level + seasonal frequencies) → inferring both freely
does **NOT** work (aliasing / variance-trading, the canonical `y = a + b`); give each a
**non-overlapping length-scale / frequency prior**.
- why: two components that can represent the same behavior are exchangeable, so the posterior must explore all assignments of signal to components — no data resolves the swap.
- conditions: additive decompositions with inferred component hyperparameters in overlapping function classes; stiffens further when a component is shared across many series/time points.
- tier: 🟢 · source: mc-stan:8028, pymc:16375
- moves: "Classify the multimodality: symmetry-induced vs genuine" · "Diagnose identifiability with pairs plots at BOTH global and subject level"
- efficacy: pending (no metric in input)

**✗ S10** · when **a latent affinity/location and cutpoints/offsets appear only as differences** *[→ entry](../recs/CC-priors-identifiability/S10.md)*
(`c_k − γ`) with **flat priors** → leaving both free does **NOT** work (a 1-D ridge extending to ±∞).
- why: the ordinal probabilities depend only on the differences, so any joint shift by δ leaves the likelihood unchanged.
- conditions: free intercept/affinity AND free interior cut points; flat/diffuse cutpoint prior; any N.
- tier: 🟢 · source: betanalpha:ordinal_regression
- efficacy: {divergences: pending · min_ess: 96.5 % of 4000 iterations saturate tree-depth 10; the (c_k, γ) ridge spans ≈ ±3000 · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Treat divergent/non-mixing prior-predictive as a non-identifiability symptom and interrogate the anchor/offset term φ" · "Reframe the symptom as suspected non-identifiability rather than tuning"

**✗ S11** · when **a global intercept AND zero-mean group effects are both freely centered** (no *[→ entry](../recs/CC-priors-identifiability/S11.md)*
sum-to-zero / pin) → the **location is non-identified**: they trade off and the group scale σ_u
inflates, **even on balanced fully-observed data**.
- why: a constant shifts freely from the intercept into the group means without changing the likelihood.
- conditions: hierarchical/varying-effects regression with two co-centered-at-zero terms.
- tier: 🟡 · source: mc-stan:39536, mc-stan:17086
- efficacy: pending (no metric in input)
- moves: "Diagnose identifiability with pairs plots at BOTH global and subject level" · "Compare prior mass under the (now correct) prior against the hard constraint and the plausible range"

**✗ S12** · when **the global ridge is already broken** (Gaussian prior on the affinity) → cutpoints *[→ entry](../recs/CC-priors-identifiability/S12.md)*
**adjacent to sparse or empty categories** still do **NOT** identify — they wander to ±∞ (heavy-tailed,
improper-looking) unless neighboring cut points are coupled.
- why: c_k is informed only by observations in categories k and k+1; an empty category leaves it unconstrained on one side.
- conditions: at least one category with zero observations; uniform/diffuse cutpoint prior with no coupling.
- tier: 🟢 · source: betanalpha:ordinal_regression
- efficacy: pending (no metric in input)
- moves: "Treat divergent/non-mixing prior-predictive as a non-identifiability symptom; interrogate the anchor/offset φ" · "Check that every estimated parameter actually receives a proper prior"

### Symptom: posterior is catastrophically diffuse, or a parameter just sits at its prior (weak / non-identification)

**✗ W1** · when **M > N** (more covariates than observations) and you **widen the prior to cover the *[→ entry](../recs/CC-priors-identifiability/W1.md)*
truth** → does **NOT** work (a non-identified likelihood propagates to an astronomically diffuse
posterior; all diagnostics fail together).
- why: widening merely *permits* the correct scale; it does not *regularize*, so the posterior stays as diffuse as the likelihood is flat.
- conditions: collinear/underdetermined design; flat or wide Gaussian slope priors.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: pending · min_ess: 100 % tree-depth saturation, E-BFMI ≈ 0.05–0.16, near-zero ESS/iter, R-hat up to 13 (wide σ=10: 93 % saturation) · ess_per_sec: pending · rmse: posterior intervals span thousands when true slopes ~10 · coverage: pending}
- moves: "Audit every parameter for an explicit prior; replace any default uniform/improper prior" · "Reframe the prior onto the latent linear predictor and put the scale on TOTAL model variance"

**✗ W2** · when **you fix that sampling with a narrow WIP** (Normal(0,1) on all slopes) → HMC is clean *[→ entry](../recs/CC-priors-identifiability/W2.md)*
but **inference is biased**: relevant slopes shrink and σ inflates to absorb the signal.
- why: the narrow prior over-regularizes the genuinely large slopes; the unexplained variance is dumped into σ.
- conditions: collinear M>N with a mix of large and near-zero slopes; prior scale ≪ true relevant magnitude.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: 0 (all diagnostics pass) · min_ess: pending · ess_per_sec: pending · rmse: relevant slopes true ≈ ±10 shrunk to <1; σ true=1 inflated to ≈ 10–12 · coverage: pending}
- moves: "Reframe the prior onto the latent linear predictor; scale TOTAL model variance" · "Reframe prior-improbable posteriors as data-vs-prior conflict; check magnitude in the right units"

**✓ W3** · when **the M>N regression is genuinely sparse** → a **Finnish horseshoe** with the global *[→ entry](../recs/CC-priors-identifiability/W3.md)*
scale **τ₀=(m₀/(M−m₀))·(σ/√N)** works (concentrates σ near the truth).
- why: the σ/√N factor makes the threshold data-size-aware; the m₀/(M−m₀) factor stops M heavy-tailed local scales from pushing spurious slopes above threshold by chance.
- conditions: horseshoe/Finnish horseshoe; covariates ≈ unit-variance; expected m₀ relevant slopes (modify σ/√N for non-linear likelihoods).
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: σ concentrates near the true value (contrast W2's ~10×) · coverage: pending}
- moves: "Reframe the prior onto the latent linear predictor; put the scale on TOTAL model variance"

**✓ W4** · when **you want a free diagnostic for prior misspecification in sparse regression** → read *[→ entry](../recs/CC-priors-identifiability/W4.md)*
the **σ posterior as a sentinel**.
- why: unexplained variance from over-shrunk slopes must go somewhere — it lands in σ; a wildly biased σ signals a bad slope prior.
- conditions: linear regression with an inferred σ that has its own WIP; collinear M>N design.
- tier: 🟢 · source: betanalpha:bayes_sparse_regression
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: narrow-prior σ posterior peaks ≈ 10 when true σ=1 · coverage: pending}
- moves: "Reframe prior-improbable posteriors as data-vs-prior conflict; check magnitude in the right units" · "Decide whether the gap is a real model difference or estimator noise; probe the diffuseness mechanism"

**✗ W5** · when **you add a third / skew shape parameter** (skew-normal α) and see divergences + *[→ entry](../recs/CC-priors-identifiability/W5.md)*
R-hat>1.05 → **collecting more data does NOT shrink the pathology** (weak, complex identifiability; α
saturates beyond |α|≈2–4).
- why: the shape parameter is only weakly informed and non-identified in its saturated limit; the CI runs to values the data can't resolve.
- conditions: location-scale-shape regression; symptoms persist/worsen as n grows; most acute when data are only mildly skewed.
- tier: 🟡 · source: mc-stan:29012
- efficacy: {divergences: divergent transitions + R-hat>1.05 that persist or worsen as n grows · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reframe the symptom as suspected non-identifiability rather than tuning" · "Compare the parameter's actual data/inferential scale against the prior's assumed unit scale"

**✗ W6** · when **mixture components overlap substantially** → the data do **NOT** inform the **mixture *[→ entry](../recs/CC-priors-identifiability/W6.md)*
weight θ** (posterior ≈ prior, regardless of N).
- why: with overlap each datum is nearly equally consistent with either component, so the likelihood ratio barely varies across the data.
- conditions: separation ≪ component spread; component parameters not tightly constrained a priori.
- tier: 🟢 · source: betanalpha:identifying_mixture_models
- efficacy: pending (no metric in input)
- moves: "Visualize the prior→posterior movement of the weight under power-scaling — a prior-dominated posterior confirms the weight is uninformed by the data" · "Refit and run a prior predictive check on the combined prior to see how informative it is"

**✗ W7** · when **you put a horseshoe on the fixed-effect coefficients** to remove a covariate that *[→ entry](../recs/CC-priors-identifiability/W7.md)*
**also has a random slope** → does **NOT** work (the fixed effect →~0 while the random-slope SD keeps
the covariate influential; the horseshoe never gives exact zeros). ✓ use **projection-predictive
selection**.
- why: shrinking one term below a relevance threshold is not removal; genuine deletion is a separate decision problem.
- conditions: fixed + correlated random slopes for the same covariates; goal is whole-covariate removal.
- tier: 🟡 · source: mc-stan:26200
- efficacy: pending (no metric in input)
- moves: "Audit every parameter / random-effects structure: does each term vary within the grouping factor?"

**✓ W8** · when **the likelihood cannot inform some directions** → elicit only **ENOUGH** domain *[→ entry](../recs/CC-priors-identifiability/W8.md)*
expertise to suppress the configurations the likelihood cannot exclude (a finite, adversarial task; no
need to see the data).
- why: information the likelihood already provides is redundant in the prior; the residual task is targeted at the weak-data regime, and a measurement-scale argument fixes numeric values without the data.
- conditions: pre-data construction; parameters with physical/scientific interpretation.
- tier: 🟢 · source: mc-stan:17586, mc-stan:16321
- efficacy: pending (no metric in input)
- moves: "Refit and run a prior predictive check on the combined prior to see how informative it is" · "Audit every parameter for an explicit prior; replace defaults"

### Situation: you reached for a "non-informative" / vague / flat / diffuse prior

**✗ N1** · when **you use a flat / improper prior "to be non-informative"** → does **NOT** work *[→ entry](../recs/CC-priors-identifiability/N1.md)*
(formally improper; the stereographic projection concentrates all mass at infinity; biases to extremes).
- why: a flat density is incompatible with being a proper probability distribution; "no information" is not neutrality.
- conditions: any parameter; worse in high dimensions. A flat prior can approximate a proper one *locally* only when the likelihood is guaranteed narrow — verify per dataset.
- tier: 🟢 · source: betanalpha:prior_modeling
- efficacy: pending (no metric in input)
- moves: "Audit every parameter for an explicit prior; replace any default uniform/improper prior" · "Type-check the proposed prior: can a parameter even carry a prior over this object?"

**✗ N2** · when **you use a diffuse-but-proper prior** (Normal(0,1000), U(−1000,1000)) → does **NOT** *[→ entry](../recs/CC-priors-identifiability/N2.md)*
work (still biases toward extremes; sampling degrades).
- why: the pathology scales with the ratio of prior scale to the likelihood-identified width; diffuse-proper replicates flat-prior behavior locally.
- conditions: any parameter; concentration at extremes is more severe in high dimensions.
- tier: 🟢 · source: betanalpha:prior_modeling, betanalpha:weakly_informative_shapes
- efficacy: {divergences: pending · min_ess: n_eff(σ) collapses to 821/10000 · ess_per_sec: pending · rmse: N=5 with Normal(0,1000) pushes (α,β) to ≈ ±15k · coverage: pending}
- moves: "Audit every parameter for an explicit prior; replace defaults" · "Reframe prior-improbable posteriors as data-vs-prior conflict; check magnitude in the right units"

**✗ N3** · when **you put uniform(0,10) / wide normals on scale hyperparameters** with little data per *[→ entry](../recs/CC-priors-identifiability/N3.md)*
group → does **NOT** work (group effects unconstrained; chains meander around init — non-convergence
as non-mixing, not an error). ✓ **std normal on locations, half-normal / gamma / lognormal on scales**.
- why: uniform(0,10) treats 0 and 10 as equally plausible on σ; when data per group is small the hyperparameter is barely constrained.
- conditions: hierarchical model, little data per group; failure presents as non-mixing chains.
- tier: 🟡 · source: mc-stan:39435
- efficacy: pending (no metric in input)
- moves: "Inspect the implied prior spread across the scale parameters and add a partial-pooling layer" · "Audit every parameter for an explicit prior; replace defaults"

**✗ N4** · when **you use a Beta with a shape parameter < 1** (e.g. Beta(0.5,0.5) Jeffreys) as a prior *[→ entry](../recs/CC-priors-identifiability/N4.md)*
on a proportion → does **NOT** work (the density diverges at the boundary; HMC leapfrog fragility).
- why: x^(α−1) → ∞ as x→0 when α<1; mass piles against the hard boundary.
- conditions: sharpest as a prior (a data-rich likelihood may pull the posterior off the boundary); Beta(0.5,0.5) and vague small-shape specifications.
- tier: 🟢 · source: betanalpha:probability_densities
- efficacy: pending (no metric in input)
- moves: "Compare the parameter's data/inferential scale against the prior's assumed scale" · "Refit and run a prior predictive check to expose the mass piling against the boundary"

**✗ N5** · when **you use i.i.d. Cauchy priors in Rᴺ to express rotational / domain ignorance** → does *[→ entry](../recs/CC-priors-identifiability/N5.md)*
**NOT** work (mass concentrates along coordinate axes; only i.i.d. Normal is rotationally symmetric).
- why: rotational symmetry requires the density to depend on the radius alone — Normals satisfy this, the Cauchy product does not.
- conditions: applies when domain ignorance genuinely encodes rotational invariance; not when axes carry distinct meaning.
- tier: 🟢 · source: betanalpha:prior_modeling
- efficacy: pending (no metric in input)
- moves: "Compare the parameter's data/inferential scale against the prior's assumed unit scale"

**✗ N6** · when **you try to calibrate an unbounded scale parameter by frequentist worst-case** → does *[→ entry](../recs/CC-priors-identifiability/N6.md)*
**NOT** work (worst-case expected squared error diverges for any fixed N; only a finite upper bound
rescues it, which is itself a prior-like constraint).
- why: Ū(μ,σ)=−C_N·σ² → −∞ as σ grows; no finite worst-case exists without a bound.
- conditions: parameters unbounded above (scale/variance/unbounded coefficients); bounded spaces (probabilities) avoid it; specific to squared-error utility.
- tier: 🟢 · source: betanalpha:modeling_and_inference
- efficacy: pending (no metric in input)
- moves: "Type-check the proposed prior: what object is it and can a parameter carry a prior over it?"

### Situation: choosing the prior's shape, tails, and scale (weakly-informative engineering)

**✗ E1** · when **the true value may exceed your chosen scale and you use a light-tailed Gaussian WIP** *[→ entry](../recs/CC-priors-identifiability/E1.md)*
→ risks a **SILENT, diagnostically-invisible bias** (the posterior concentrates at the prior shoulder
while R-hat / divergences / n_eff all pass).
- why: a light tail cannot let the posterior reach a truth beyond the scale, and nothing flags it.
- conditions: light-tailed prior with a scale possibly below the true magnitude.
- tier: 🟢 · source: betanalpha:weakly_informative_shapes, betanalpha:probability_densities
- efficacy: pending (no metric in input)
- moves: "Reframe prior-improbable posteriors as data-vs-prior conflict; check magnitude in the right units" · "Compare the parameter's data/inferential scale against the prior's assumed scale"

**✓/✗ E2** · when **the likelihood is numerically sensitive** (ODE solver, GP kernel, sparse-matrix ops) *[→ entry](../recs/CC-priors-identifiability/E2.md)*
and you use a **heavy-tailed Cauchy WIP** → the failure is at least **LOUD** (tail excursions → NaN
gradients) rather than silent; and when the scale is correct, **Cauchy and Gaussian give near-identical
bulk posteriors**.
- why: shape differences matter only near/beyond the scale; the Cauchy's dangerous mode is a visible numerical blow-up, unlike the Gaussian's silent bias.
- conditions: numerically fragile likelihoods for the tail-excursion risk; correct scale for the bulk-equivalence.
- tier: 🟢 · source: betanalpha:weakly_informative_shapes, betanalpha:probability_densities
- efficacy: pending (no metric in input)
- moves: "Compare the parameter's data/inferential scale against the prior's assumed scale" · "Reframe prior-improbable posteriors as data-vs-prior conflict; check magnitude in the right units"

**✓ E3** · when **you need to suppress a specific tail on a positive parameter** → choose **Gamma vs *[→ entry](../recs/CC-priors-identifiability/E3.md)*
Inverse-Gamma by tail**: Gamma suppresses the *upper* tail (heavier near 0), Inverse-Gamma suppresses
the *lower* tail (heavier upper).
- why: the two families have opposite tail-suppression profiles at any matched-bulk parameterization.
- conditions: positively-constrained 1-D parameter; tail comparison at matched bulk mass.
- tier: 🟢 · source: betanalpha:probability_densities, betanalpha:some_containment_prior_models
- efficacy: pending (no metric in input)
- moves: "Compare the parameter's data/inferential scale against the prior's assumed scale"

**✓ E4** · when **you want symmetric soft containment of both tails on a positive parameter** → the *[→ entry](../recs/CC-priors-identifiability/E4.md)*
**GIN half-order families (inverse-normal p=−½, plus-one-half p=+½) are practically interchangeable**,
and the **log-normal is a valid alternative default**.
- why: once tuned to the same symmetric tail conditions the two half-order densities coincide; half-order families contain slightly tighter than lognormal but the practical gap is small.
- conditions: same [θ_l, θ_u] and ρ; symmetric soft containment desired.
- tier: 🟢 · source: betanalpha:some_containment_prior_models
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: max absolute density difference ≈ 1.3e-3 between the two half-order families · coverage: pending}
- moves: "Compare the parameter's data/inferential scale against the prior's assumed scale"

**✓ E5** · when **you tune a containment prior by moment-matching and δ is large** → prefer the **GIN *[→ entry](../recs/CC-priors-identifiability/E5.md)*
half-order families** (better-conditioned; tolerate δ up to 2) over gamma/inverse-gamma (need δ≤1).
- why: the half-order moment systems are more well-posed, so the numerical solver doesn't diverge at larger δ.
- conditions: moment-matching init with heuristic δ; positively-constrained 1-D parameter; Stan algebra_solver.
- tier: 🟢 · source: betanalpha:some_containment_prior_models
- efficacy: pending (no metric in input)
- moves: "Compare the parameter's data/inferential scale against the prior's assumed scale"

**✓/✗ E6** · when **a family's CDF/quantile has no closed form** → for **fixed-parameter tuning** a *[→ entry](../recs/CC-priors-identifiability/E6.md)*
numerical solver works but moment-matching is only an *initialization*; when a **shape parameter is
SAMPLED inside the model**, the inverse-CDF AD derivative is ill-conditioned → HMC is slow and biased
(even though optimization recovers the parameters).
- why: two regimes — a one-time forward-convergent solve vs a per-leapfrog AD through an ill-conditioned special-function inverse.
- conditions: regime 1 for fixed-parameter tail-condition tuning; regime 2 for gradient-based sampling with a sampled shape parameter (algebra_solver / inv_inc_beta inverses).
- tier: 🟢 · source: mc-stan:31567, mc-stan:31668, mc-stan:13289
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: gamma moment-match guess α=5.0625,β=0.84375 vs exact α=45.63,β=7.85 (~10×) · coverage: pending}
- moves: "Read the exception as a domain violation; correct CDF-vs-inverse-CDF confusion" · "Make the Jacobian (ρ = latent PDF) link-consistent with the CDF; verify via change-of-variables"

**✓ E7** · when **you are deciding whether a shrink-to-zero (PC) prior is appropriate** → check the *[→ entry](../recs/CC-priors-identifiability/E7.md)*
**base value collapses to a plausible simpler model** (τ=0 "all groups identical" YES; σ=0 "no data
noise" NO — flexibility is contextual, not formal).
- why: a PC prior is principled only when its base value is a practically plausible alternative; σ=0 signals misspecification, not a flexibility axis.
- conditions: any hierarchical/mixed model, before blindly assigning PC priors to every variance component.
- tier: 🟢 · source: dansblog:priors4
- efficacy: pending (no metric in input)
- moves: "Refit and run a prior predictive check on the combined prior" · "Audit every parameter for an explicit prior; replace defaults"

### Situation: the prior is being read on the wrong (internal / parameterized) scale

**✗ X1** · when **a parameter is fit through a non-identity link / transform** (logit, log, *[→ entry](../recs/CC-priors-identifiability/X1.md)*
centered-intercept, log-σ) and **you specify the prior on the natural scale** → does **NOT** work (the
prior is read on the internal scale; a [0,1]-bounded prior on a log-odds coefficient is incoherent; a
default student_t on log-σ can blow up under pushforward). ✓ **push the prior forward and check it there**.
- why: under a link the coefficient (and its prior) is meaningful only in the context of the whole model, not in isolation.
- conditions: logit/probit/log links, distributional (dpar) parameters, lognormal families, internally centered intercepts.
- tier: 🟡 · source: mc-stan:34027, mc-stan:27338, mc-stan:10344
- efficacy: pending (no metric in input)
- moves: "Reframe: under a non-identity link the coefficient and its prior are not interpretable in isolation" · "Build the likelihood as prior-density-of-implied-parameter × |Jacobian|"

**✗ X2** · when **you set LogNormal(μ,σ) using a natural-scale mean/sd** → does **NOT** work (μ,σ *[→ entry](../recs/CC-priors-identifiability/X2.md)*
describe log(X)); transform **σ²=log(1+s²/m²), μ=log(m)−σ²/2**.
- why: LogNormal is the pushforward of a Normal through exp, so its named arguments live in log space, a different scale and units from X.
- conditions: any LogNormal / log-/exp-transformed prior or likelihood specified by (μ,σ) with natural-scale beliefs.
- tier: 🟡 · source: pymc:6890, mc-stan:28836
- efficacy: pending (no metric in input)
- moves: "Compare the parameter's data/inferential scale against the prior's assumed scale" · "Build the likelihood as prior-density-of-implied-parameter × |Jacobian|"

**✗ X3** · when **you place a prior on a GMRF / CAR precision τ as if it were an inverse marginal *[→ entry](../recs/CC-priors-identifiability/X3.md)*
variance** → does **NOT** work (var(x_j)=τ⁻¹[Q⁻¹]_jj, and [Q⁻¹]_jj depends on graph structure and
scales with J).
- why: the model is defined through the precision Q, but the elicitable quantity is the marginal SD τ⁻¹ᐟ²[Q⁻¹]_jj¹ᐟ² — a pure parameterization gap.
- conditions: GMRF/CAR with a non-trivially structured Q (graph Laplacian, not scalar × identity).
- tier: 🟢 · source: dansblog:why-wont-you-cheat
- efficacy: pending (no metric in input)
- moves: "Build the likelihood as prior-density-of-implied-parameter × |Jacobian|" · "Compare the parameter's data/inferential scale against the prior's assumed scale"

**✗ X4** · when **you reason about a spline / GAM smooth via its coefficients or default wiggliness *[→ entry](../recs/CC-priors-identifiability/X4.md)*
priors** → does **NOT** work globally (locally interpretable only; the prior pushforward yields wild
global functions). ✓ **simulate functions from the prior pushforward**.
- why: the penalty controls short-scale rigidity, but the global function space a spline supports under its prior is surprising; GP interpretability does not transfer.
- conditions: Bayesian penalized-spline / GAM smooths where the user reasons via coefficients or defaults.
- tier: 🟡 · source: mc-stan:24759, mc-stan:34721, pymc:6235
- efficacy: pending (no metric in input)
- moves: "Refit and run a prior predictive check on the combined prior" · "Build the likelihood as prior-density-of-implied-parameter × |Jacobian|"

**✗ X5** · when **a power-scaling / prior-sensitivity diagnostic flags the fixed N(0,1) basis *[→ entry](../recs/CC-priors-identifiability/X5.md)*
coefficients of a non-centered spline / GP term** → treating it as real prior-data conflict does **NOT**
work (those coefficients are nuisances; the amplitude/wiggliness is carried by separate scale terms —
assign the sensitivity to the focus level).
- why: the coefficients carry a deliberately fixed standard-normal prior scaled by separately-estimated spectral/scale terms, so power-scaling them is meaningless.
- conditions: brms smooths / Hilbert-space GP approximations with non-centered basis coefficients × estimated scales.
- tier: 🟡 · source: mc-stan:29945
- efficacy: pending (no metric in input)
- moves: "Visualize the prior→posterior movement of specific coefficients under power-scaling rather than reasoning analytically" · "Reframe the prior onto the latent linear predictor; scale TOTAL model variance"

**✓ X6** · when **you need an interpretable, jointly-regularizing prior on ordinal cut points** → put a *[→ entry](../recs/CC-priors-identifiability/X6.md)*
**Dirichlet on the induced category probabilities** and push it back through the inverse map (numerical
Jacobian).
- why: it regularizes all cut points through their shared simplex constraint and is parameterized in interpretable probability space.
- conditions: K≥2 categories; fix an anchor φ; smooth Dirichlet hyperparameters; Jacobian computed numerically (O(K³)).
- tier: 🟢 · source: betanalpha:ordinal_regression
- efficacy: pending (no metric in input)
- moves: "Port the induced-Dirichlet log-density as a user-defined function and attach it as the cutpoint prior" · "Replace the explicit Jacobian-matrix log_determinant with the closed-form analytic log|det J|" · "Audit the Jacobian term algebraically and dimensionally"

**✗ X7** · when **you hand-write a constraining transform for a K-element simplex with K unconstrained *[→ entry](../recs/CC-priors-identifiability/X7.md)*
inputs** → does **NOT** work (non-injective; the K×K Jacobian is rank-deficient, det 0); use exactly
**K−1 inputs**.
- why: a K-simplex is a (K−1)-manifold, so a correct change-of-variables must consume K−1 unconstrained parameters; the last element is determined.
- conditions: custom constrained-type transforms (ordered/ragged simplexes) instead of a built-in type; DOF is type-specific.
- tier: 🟡 · source: mc-stan:24102, mc-stan:35748, mc-stan:40314
- efficacy: pending (no metric in input)
- moves: "Reason carefully about the change-of-variables: Jacobian, constant, and bijection on the (K−1)-dim space" · "Count degrees of freedom: parameter dimension vs intrinsic dimension of the manifold" · "Audit the Jacobian term algebraically and dimensionally"

### Symptom: GP hyperparameters won't identify (length-scale / marginal-SD ridge)

**✗ G1** · when **you estimate an EQ-kernel length scale ρ by maximum marginal likelihood** → does *[→ entry](../recs/CC-priors-identifiability/G1.md)*
**NOT** work (seed-dependent across flat plateaus).
- why: the marginal likelihood has multiple flat plateau regions with vanishing gradients; distinct seeds land in genuinely different solutions, not perturbed local optima.
- conditions: EQ kernel; inference over ρ and marginal SD; multiple degeneracy plateaus.
- tier: 🟢 · source: betanalpha:gaussian_processes
- efficacy: {divergences: pending · min_ess: two MML solutions ρ=1.14/σ=0.20 vs ρ=0.234/σ=2.40 across seeds · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Diagnose identifiability with pairs plots at BOTH global and subject level; probe redundancy by perturbing and watching trajectories"

**✗ G2** · when **you judge GP identifiability from the marginal ρ and σ posteriors** → misleading *[→ entry](../recs/CC-priors-identifiability/G2.md)*
(both can be very wide while σ²/ρ is tight); ✓ **read the 2D joint (ρ,σ) ridge instead**.
- why: the parameter combination σ²/ρ (or σ²/ρ^{2ν} for Matérn) can be tightly estimated while both marginals are broad.
- conditions: Matérn/EQ GP, d≤3; fixed/bounded-domain where the likelihood ridge exists.
- tier: 🟢 · source: dansblog:priors5
- efficacy: pending (no metric in input)
- moves: "Diagnose identifiability with pairs plots at BOTH global and subject level"

**✗ G3** · when **you reach for a reference prior to "let the data speak" for GP hyperparameters** → *[→ entry](../recs/CC-priors-identifiability/G3.md)*
reproduces the likelihood ridge (mass near ρ=0) at a heavy cost.
- why: the reference prior is derived under an asymptotic regime irrelevant to the fixed-domain (infill) case and structurally reproduces rather than resolves the ridge.
- conditions: Matérn GP d≤3; fixed-domain, low-n; Gaussian likelihood (it isn't derived for non-Gaussian).
- tier: 🟢 · source: dansblog:priors5
- efficacy: {divergences: pending · min_ess: lower ESS than a PC prior · ess_per_sec: ≈ 8.5× wall time and 2× warmup iterations vs a PC prior · rmse: pending · coverage: pending}
- moves: "Diagnose identifiability with pairs plots at BOTH global and subject level"

**✓ G4** · when **ρ drifts to ∞ or the GP interpolates** → recognize these as **two distinct EQ *[→ entry](../recs/CC-priors-identifiability/G4.md)*
plateaus** needing different fixes.
- why: the upper plateau (ρ > max covariate span) is a design bound — the data can't distinguish length scales above the max observed distance; the lower plateau (ρ < min inter-point distance) is an interpolation degeneracy.
- conditions: EQ kernel; finite observation set with a defined covariate span.
- tier: 🟢 · source: betanalpha:gaussian_processes, dansblog:priors5
- efficacy: pending (no metric in input)
- moves: "Diagnose identifiability with pairs plots at BOTH global and subject level"

**✓/✗ G5** · when **you set ρ-prior bounds from the observed covariate span** → works **only if** the *[→ entry](../recs/CC-priors-identifiability/G5.md)*
design was itself motivated by length-scale knowledge; retroactive span-fitting does **NOT** work
(overfits the prior and prematurely constrains future inference).
- why: the degeneracy thresholds are properties of the design, not the prior; retrofitting the prior to them is circular in observational studies.
- conditions: observational (non-designed) study vs a length-scale-motivated design.
- tier: 🟢 · source: betanalpha:gaussian_processes
- efficacy: pending (no metric in input)
- moves: "Refit and run a prior predictive check on the combined prior"

**✗ G6** · when **you use GP ARD inverse-length-scales for variable selection** (especially under a *[→ entry](../recs/CC-priors-identifiability/G6.md)*
Bernoulli likelihood) → does **NOT** work (length scales are weakly informed; posteriors stay wide);
GP length scales **require informative priors**.
- why: length scales enter only through the covariance shape, which finite noisy data (thinner still under Bernoulli) constrains poorly.
- conditions: GP regression with inferred covariance hyperparameters, ARD over several covariates, weakly-informative/non-Gaussian likelihood.
- tier: 🟡 · source: mc-stan:35930
- efficacy: pending (no metric in input)
- moves: "Diagnose identifiability with pairs plots at BOTH global and subject level" · "Refit and run a prior predictive check on the combined prior"

### Situation: adding a constraint or reparameterization to break a non-identifiability

**✗ K1** · when **a hierarchical model is non-identified and you add a hard sum-to-zero *[→ entry](../recs/CC-priors-identifiability/K1.md)*
(zero_sum_vector) "to identify it"** and then **predict new groups or put priors on μ,σ** → does
**NOT** work as a neutral fix (it pins the population mean to the sample average of the group effects
and breaks infinite exchangeability / conditional independence). ✓ use the **non-centered exchangeable
α_k~N(μ,σ) with a separate intercept**.
- why: a hard constraint changes the generative/population model; the soft, prior-resolved fix keeps you able to draw new groups from N(μ,σ).
- conditions: matters when predicting new groups or interpreting/priors-on population hyperparameters; fine for ordering constraints on permutation-invariant inferences.
- tier: 🟡 · source: mc-stan:26215, mc-stan:1382
- efficacy: pending (no metric in input)
- moves: "Compare prior mass under the (now correct) prior against the hard constraint and the plausible range" · "Build the likelihood as prior-density-of-implied-parameter × |Jacobian|"

**✓ K2** · when **you need a permutation-invariant estimand from an exchangeable degenerate posterior** *[→ entry](../recs/CC-priors-identifiability/K2.md)*
→ an **ordering constraint on one scalar component** is exact (identical expectations to the
unconstrained posterior).
- why: the K! pyramids are rotations of one another; ordering selects one and the expectation over it equals the full posterior's for any permutation-invariant f.
- conditions: scalar orderable component; permutation-invariant estimand; exchangeable priors.
- tier: 🟢 · source: betanalpha:mixture_models, betanalpha:identifying_mixture_models
- efficacy: pending (no metric in input)
- moves: "Classify the multimodality: symmetry-induced vs genuine" · "Inspect the parameterization for invariances — is the map one-to-one?"

**✗ K3** · when **you fix a random-effect correlation to zero** (brms `||`, lkj-at-identity) expecting *[→ entry](../recs/CC-priors-identifiability/K3.md)*
the estimated effects to be uncorrelated → does **NOT** work (it constrains the correlation PARAMETER,
not the empirical posterior correlation of the effects).
- why: estimating-then-fixing to zero is statistically equivalent to simply not modeling the correlation; the empirical correlation of the estimated effects is a separate posterior property.
- conditions: any model with multiple correlated REs per grouping factor (varying intercepts+slopes, testlet IRT).
- tier: 🟡 · source: mc-stan:17273
- efficacy: pending (no metric in input)
- moves: "Start from a uniform LKJ(η=1) Cholesky then ADD normal density on the off-diagonal correlation elements"

### Situation: linking the posterior to a population or causal estimand

**✗ P1** · when **a committed subjective Bayesian refuses the known sampling mechanism** (strict *[→ entry](../recs/CC-priors-identifiability/P1.md)*
Likelihood Principle) and puts an i.i.d. exchangeable prior on stratum means → does **NOT** recover the
population mean (Robins–Ritov); linking parameters to a population quantity needs extra-Bayesian info.
- why: parameters are "polite fictions"; post-processing a posterior into a population answer is categorically distinct from likelihood-based parameter inference, and even the no-coin case smuggles in exchangeability.
- conditions: known stratum-dependent sampling probabilities; target = population mean.
- tier: 🟢 · source: dansblog:robins-ritov
- efficacy: pending (no metric in input)
- moves: "Disambiguate the estimand — separate the MLE (likelihood-only) from Bayes estimators" · "Re-scope the diagnostic to the question and hand off to the right tool"

**✗ P2** · when **you treat confounding as a property fixable inside one model component** → does *[→ entry](../recs/CC-priors-identifiability/P2.md)*
**NOT** work (confounding is the *coupling* between the conditional variate model and the marginal
covariate model; ψ is a confounder iff it enters both).
- why: the formal definition is strictly more general than "common cause" — selection, shared resources, and mobility mechanisms all qualify.
- conditions: any variate/covariate model where a parameter appears in both π(y|x,…) and π(x|…).
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: pending (no metric in input)
- moves: "Diagnose identifiability with pairs plots at BOTH global and subject level"

**✗ P3** · when **you assume randomization alone suppresses confounding** → does **NOT** hold if *[→ entry](../recs/CC-priors-identifiability/P3.md)*
**dropout / censoring is correlated with the variate process** (the observed covariate distribution is
then a biased subset of the designed one).
- why: randomization guarantees the *intended* covariate distribution is independent of the variate process; censoring correlated with that process reintroduces a confounder.
- conditions: designed experiment with a censoring/dropout mechanism correlated with the conditional variate process.
- tier: 🟢 · source: betanalpha:variate_covariate_modeling
- efficacy: pending (no metric in input)
- moves: "Diagnose identifiability with pairs plots at BOTH global and subject level"

**✓/✗ P4** · when **you read "phylogenetic signal"** from (1|gr(sp,cov=phy)) as *[→ entry](../recs/CC-priors-identifiability/P4.md)*
**h²=σ_a²/(σ_a²+σ_e²)=ICC** → it **works** *provided* a competing unstructured variance component
exists; it does **NOT** work (non-identified, prior-driven) with a **Gaussian / identity-link**
likelihood and one observation per group — but this ✗ is on the **response** scale, where the residual
variance σ_e² is a *free* parameter. On the **latent** scale of a non-Gaussian link the residual
variance is *fixed* by the link (logistic π²/3, probit 1), so the latent-scale h² is identified even
with one observation per group, with no competing unstructured term required.
- why: the structured RE is a variance component (cov σ_a²·C); when the residual variance is free a competing unstructured term is what lets the data split the variance (= Pagel's λ), and one observation per group cannot supply it — but a non-Gaussian link that pins the latent residual variance supplies that second component by construction, so the ratio identifies.
- conditions: phylogenetic/animal/pedigree/spatial CAR-ICAR/kinship; the non-identification bites specifically for Gaussian/identity-link responses with one observation per group; structured slopes need an explicit unstructured slope term.
- tier: 🟡 · source: mc-stan:16457
- efficacy: pending (no metric in input)
- moves: "Audit every parameter / random-effects structure: does each term vary within the grouping factor?"

**✓ P5** · when **you exploit exchangeability** → it is the extra-Bayesian bridge that lets **τ be *[→ entry](../recs/CC-priors-identifiability/P5.md)*
learned from data** (partial pooling: shrink when groups are similar, separate when different), not
fixed by the analyst.
- why: re-labelling exchangeable groups should not change the prior, which (usually) yields the hierarchical form and an adaptive τ.
- conditions: exchangeable groups.
- tier: 🟢 · source: dansblog:monkey
- efficacy: pending (no metric in input)
- moves: "Inspect the implied prior spread across the scale parameters and add a partial-pooling layer"

**✗ P6** · when **you drop the prior term on subsequent online / streaming updates "to avoid *[→ entry](../recs/CC-priors-identifiability/P6.md)*
double-counting"** → does **NOT** work (the previous posterior *is* the prior; keep the full
prior+likelihood logp each update).
- why: once you update, your posterior becomes your prior; dropping it gives terrible parameter recovery.
- conditions: sequential/online/streaming inference carrying forward earlier inference; also reusing serialized inference artifacts for prediction.
- tier: 🟡 · source: pymc:13225, pymc:956
- efficacy: pending (no metric in input)
- moves: "Audit every parameter for an explicit prior; replace defaults"

---

## Source key

**Betancourt case studies** (`betanalpha:<id>` → `https://betanalpha.github.io/assets/case_studies/<id>.html`):
identifiability · degeneracy · bayes_sparse_regression · identifying_mixture_models · mixture_models ·
ordinal_regression · prior_modeling · weakly_informative_shapes · probability_densities ·
some_containment_prior_models · modeling_and_inference · gaussian_processes · variate_covariate_modeling

**Dan Simpson blog** (`dansblog:<id>` → `https://dansblog.netlify.app/posts/…`):
robins-ritov · monkey (`everybodys-got-something-to-hide…`) · priors4 · priors5 ·
why-wont-you-cheat (`2021-12-09-why-wont-you-cheat-with-me-repost`)

**Forums** (`mc-stan:N` → `https://discourse.mc-stan.org/t/…/N`; `pymc:N` → `https://discourse.pymc.io/t/…/N`):
mc-stan:8028 · 31567 · 31668 · 13289 · 17586 · 16321 · 39536 · 17086 · 26215 · 1382 · 16945 · 26200 ·
16457 · 1483 · 35930 · 39435 · 34027 · 27338 · 10344 · 24102 · 35748 · 40314 · 24759 · 34721 · 17273 ·
29012 · 28836 · 37414 · 29945 · pymc:16375 · 13225 · 956 · 1324 · 6235 · 6890

**✓ E8** · when **you need a starting weakly-informative prior and want a constructive default table (not just "why vague fails")** → use the **standardized-scale default MENU by parameter type**. *[→ entry](../recs/CC-priors-identifiability/E8.md)*
- menu:
  - coefficients: N(0,1) (standardized linear) / N(0,2.5) (logistic / log-odds, allows OR ≈ 0.01–100); StudentT(nu=3–7) coefficients for outlier robustness
  - intercepts: N(0,2.5), or domain-centered on the original scale
  - scale params: HalfNormal(1) or HalfStudentT(nu=3–4)
  - probabilities: Beta(1,1) / Beta(2,2), or logit-Normal(0,1.5)
  - rates: Gamma / LogNormal
- why: these are engineered weakly-informative defaults on the standardized scale — the constructive table the catalog was missing; cross-ref C3 for the *why-vague-fails* / tail-engineering rationale. Domain instances fold in directly: biostat log-OR / log-HR, econ elasticity / treatment, physics LogNormal+constraint.
- conditions: predictors standardized (≈ unit variance) for the N(0,1) / N(0,2.5) coefficient scales to be meaningful; adjust intercept centering on the original scale.
- tier: 🟢 (source: pymc-labs)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ EL1** · when **you must choose HOW to source a prior (which elicitation strategy)** → route by **expert access + scale knowledge**. *[→ entry](../recs/CC-priors-identifiability/EL1.md)*
- decision tree:
  - expert access & can quantify precisely → SHELF / PreliZ roulette / quartile (see EL2)
  - expert but imprecise → constrained / maxent priors (see C8)
  - no expert but know rough scale → weakly-informative (routes into C3 scale/tail engineering + the E8 menu)
  - no scale knowledge → iterate via prior-predictive check
- why: this is the *routing* layer the catalog lacks — it covers the technical calibration of a prior once chosen, but not how to select the sourcing strategy in the first place.
- conditions: pre-data prior construction; the branch is picked by whether a domain expert is available and how precisely the scale is known.
- tier: 🟢 (source: pymc-labs)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ EL2** · when **you have expert access and want a structured elicitation protocol** → run the **SHELF-like 7-step protocol**. *[→ entry](../recs/CC-priors-identifiability/EL2.md)*
- steps: (1) define parameter + units → (2) establish plausible min/max → (3) elicit quantiles (25 / 50 / 75) → (4) elicit tail behavior → (5) fit distribution (`find_constrained_prior` / `pz.quartile`) → (6) validate by showing the fitted distribution back to the expert → (7) close with a prior-predictive check ("do these predictions look realistic?").
- why: portable structured expert-interview mechanics; fills the "prior elicitation from substance" gap that the catalog leaves open on the sourcing side.
- conditions: an available domain expert; a parameter with an interpretable scale / units.
- tier: 🟢 (source: pymc-labs)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}

**✓ EL3** · when **you have verbal domain knowledge and need to turn it into a distribution family / parameters** → use the **verbal→distribution translation table**. *[→ entry](../recs/CC-priors-identifiability/EL3.md)*
- table:
  - "roughly A–B" → constrained mass=0.90 on [A, B]
  - "usually around X, rarely above Y" → LogNormal / Gamma with median ≈ X and 95th pct ≈ Y
  - "positive, diminishing for large values" → HalfNormal / Exponential / HalfCauchy
  - "could go either way ~50–50" → Beta(1,1) or symmetric Normal(0,·)
  - "no more than X in absolute value" → TruncatedNormal or Uniform(−X, X)
- why: maps words → family; complementary to C3 / C4, which assume the family is already chosen.
- conditions: verbal statements can be pinned to a quantile / mass or to a qualitative shape.
- tier: 🟢 (source: pymc-labs)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
