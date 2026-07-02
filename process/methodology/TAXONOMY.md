# The catalog taxonomy — two axes

Every entry (claim · technique · move) is placed on **two orthogonal axes**.

- **Axis 1 — Observed-data family** (`observed`): *what is the outcome you are modeling?* This is the **primary
  navigation spine** (the FIELD_GUIDE table of contents). Exactly **one** primary leaf per entry (a second is added
  only when two are within a small similarity margin). Recognition-primed: "I'm modeling a proportion" lands you here
  before you know the fix.
- **Axis 2 — Model structure** (`structure`): *how is the model built / what latent structure does it have?* **Zero or
  more** tags, orthogonal to Axis 1 (a hierarchical GP on count data is `gaussian-process` + `hierarchical-multilevel`
  on Axis 2, `discrete-observed/count` on Axis 1).

`forum-c81` = **observed:** `discrete-observed/proportion-of-n` · **structure:** `regression`. The claim lives on the
`proportion-of-n` vs `continuous/bounded-unit-interval` boundary — which is exactly the contrast it teaches.

---

## Axis 1 — Observed-data family (primary TOC)

Three top-level branches. The first two are observation families; the third holds everything that has **no** outcome
type (geometry, sampling, convergence, comparison) — the old `cross-cutting-computation`, now a proper peer instead of
a catch-all that swallows half the catalog.

### `discrete-observed`
- **`count`** — the outcome is an unbounded count of events (0,1,2,…) with no fixed maximum; Poisson / Negative-Binomial likelihood; overdispersion, excess zeros (zero-inflation / hurdle), the log link. *Negative-Binomial spans two senses — overdispersed counts, and the "trials-until-k-successes" stopping rule (geometric when k=1). Note an **aggregated** set of Bernoulli trials is itself count data; when the trial count n is fixed and known it is the `proportion-of-n` sibling (binomial), so `count` ⟷ `proportion-of-n` differ by whether n is a fixed denominator.*
- **`proportion-of-n`** — the outcome is k successes out of n trials (a proportion/percentage formed by aggregating binary or count data); Binomial / Beta-Binomial on a logit link; the trial count n carries the observation's precision.
- **`binary`** — the outcome is a single 0/1 yes-no success/failure event; Bernoulli / logistic likelihood; separation, rare events, calibration.
- **`categorical`** — the outcome is one of K unordered categories; categorical / multinomial softmax likelihood; reference coding, independence of irrelevant alternatives.
- **`ordinal`** — the outcome is an ordered category (Likert / rating / stage); cumulative / ordered-logit likelihood with cutpoints; proportional-odds assumption, cutpoint identifiability.

### `continuous-observed`
- **`real-valued`** — the outcome is an unbounded real number; Normal / Student-t likelihood; heavy tails, robustness, heteroscedasticity.
- **`positive`** — the outcome is a strictly positive continuous quantity (durations, amounts, concentrations); Gamma / LogNormal / Weibull on a log link.
- **`bounded-unit-interval`** — the outcome is a genuinely continuous value in [0,1] (a rate/fraction that is NOT a count ratio); Beta likelihood; distinct from a count-derived `proportion-of-n`.
- **`censored-survival`** — the outcome is a time-to-event or a censored/truncated measurement; survival / censored likelihoods; right/left censoring, competing risks, the hazard.
- **`multivariate-observed`** — the outcome is a vector observed jointly (multivariate normal, compositional / simplex, joint multinomial); a covariance / correlation structure is part of the observation.

### `computation-diagnostics` (no observation family)
- **`geometry-sampling`** — posterior geometry and HMC/NUTS behavior independent of the data family: funnels, divergences, step-size / adapt_delta, tree depth, E-BFMI, mass-matrix / metric, reparameterization (CP↔NCP).
- **`convergence-diagnostics`** — did it converge / can I trust the draws: R̂, ESS, trace plots, warmup, multi-chain agreement, MCMC standard error.
- **`model-evaluation`** — is the model any good: prior/posterior predictive checks, LOO/WAIC/PSIS, calibration (SBC), model comparison, k-hat.
- **`priors-identifiability`** — prior construction and identifiability that is not tied to one outcome family: weakly-informative / PC priors, prior pushforward, non-identifiability, label/sign switching, regularization.

---

## Axis 2 — Model structure (orthogonal tags, 0+)

- **`regression`** — a linear predictor / GLM mapping covariates to the outcome (the default structural skeleton).
- **`hierarchical-multilevel`** — partial pooling / random effects / group-level parameters.
- **`mixture`** — latent discrete components / clustering / finite or infinite mixtures.
- **`gaussian-process`** — GP priors over functions; kernels, length-scales.
- **`time-series-state-space`** — temporal dependence; AR/MA, state-space, latent dynamic states, filtering.
- **`spatial-areal`** — spatial / areal dependence; CAR/ICAR/BYM, distance kernels.
- **`latent-factor`** — factor models, latent traits, IRT, dimensionality reduction.
- **`ode-dynamical`** — mechanistic ODE / dynamical-system models.
- **`measurement-error-missing`** — measurement-error models, missing-data / imputation, errors-in-variables.
- **`sparse-shrinkage`** — variable selection / shrinkage priors (horseshoe, spike-slab, Laplace, R2D2).

---

## Assignment rules
1. Every entry gets **exactly one** primary `observed` leaf (the argmax over the 14 leaf anchors), **plus** a second
   leaf only if its similarity is within `0.03` of the top.
2. Every entry gets **0+** `structure` tags (any structure anchor within `0.05` of that entry's top structure anchor,
   capped at 2).
3. Assignment is by cosine of the entry embedding (reuse `e1_index.npz` / `move_index.npz`) to the **anchor description**
   above (embedded as `search_document:` text). Low-confidence assignments (top observed cosine `< 0.35`, or ambiguous
   ties) are flagged `_needs_review` for an LLM/human pass — embedding is the first gate, not the last word.
4. The FIELD_GUIDE is generated from `observed` (the TOC) with `structure` as within-page facets.
