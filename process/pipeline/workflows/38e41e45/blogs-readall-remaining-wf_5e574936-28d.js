export const meta = {
  name: 'blogs-readall-remaining',
  description: 'Read-everything pass over remaining Betancourt studies + all Dan Simpson posts; skip the write only if genuinely just a tutorial',
  phases: [{ title: 'Read', detail: 'one max-effort agent per post; triage then distill-or-skip' }],
}

const ROOT = '/home/jp/rekursiv/bayesian-catalog'

const ITEMS = [
  // remaining Betancourt studies (pre-dropped as "pedagogy" — now read, agent decides skip)
  { source: 'betanalpha', id: 'probability_theory', figs: 57 },
  { source: 'betanalpha', id: 'probability_densities', figs: 48 },
  { source: 'betanalpha', id: 'probability_on_product_spaces', figs: 33 },
  { source: 'betanalpha', id: 'conditional_probability_theory', figs: 24 },
  { source: 'betanalpha', id: 'probabilistic_computation', figs: 44 },
  { source: 'betanalpha', id: 'stan_intro', figs: 25 },
  { source: 'betanalpha', id: 'pystan_workflow', figs: 2 },
  { source: 'betanalpha', id: 'rstan_workflow', figs: 1 },
  { source: 'betanalpha', id: 'markov_chain_monte_carlo', figs: 66 },
  { source: 'betanalpha', id: 'markov_chain_monte_carlo_basics', figs: 43 },
  { source: 'betanalpha', id: 'sampling', figs: 49 },
  { source: 'betanalpha', id: 'generative_modeling', figs: 43 },
  { source: 'betanalpha', id: 'modeling_and_inference', figs: 30 },
  { source: 'betanalpha', id: 'principled_bayesian_workflow', figs: 100 },
  // all 20 Dan Simpson posts (exact filenames)
  { source: 'dansblog', id: 'posts_2021-12-09-why-wont-you-cheat-with-me-repost_why-wont-you-cheat-with-me-repost', slug: 'dan-why-wont-you-cheat-with-me' },
  { source: 'dansblog', id: 'posts_2022-01-26-barry-gibb-came-fourth-in-a-barry-gibb-look-alike-contest-repost_barry-gi', slug: 'dan-barry-gibb' },
  { source: 'dansblog', id: 'posts_2022-03-22-a-linear-mixed-effects-model_a-linear-mixed-effects-model', slug: 'dan-sparse-matrices-1-mixed-effects' },
  { source: 'dansblog', id: 'posts_2022-03-23-getting-jax-to-love-sparse-matrices_getting-jax-to-love-sparse-matrices.h', slug: 'dan-sparse-matrices-2-jax' },
  { source: 'dansblog', id: 'posts_2022-05-14-jax-ing-a-sparse-cholesky-factorisation-part-3-in-an-ongoing-journey_jax-', slug: 'dan-sparse-matrices-3-failing-jax' },
  { source: 'dansblog', id: 'posts_2022-05-16-design-is-my-passion-sparse-matrices-part-four_design-is-my-passion-spars', slug: 'dan-sparse-matrices-4-design' },
  { source: 'dansblog', id: 'posts_2022-05-18-sparse4-some-primatives_sparse4-some-primatives', slug: 'dan-sparse-matrices-5-primitives' },
  { source: 'dansblog', id: 'posts_2022-05-20-to-catch-a-derivative-first-youve-got-to-think-like-a-derivative_to-catch', slug: 'dan-sparse-matrices-6-derivatives' },
  { source: 'dansblog', id: 'posts_2022-06-03-that-psis-proof_that-psis-proof', slug: 'dan-psis-tail-stabilization' },
  { source: 'dansblog', id: 'posts_2022-08-29-priors4_priors4', slug: 'dan-priors-4-containment' },
  { source: 'dansblog', id: 'posts_2022-09-04-everybodys-got-something-to-hide-except-me-and-my-monkey_everybodys-got-s', slug: 'dan-multilevel-regression' },
  { source: 'dansblog', id: 'posts_2022-09-07-priors5_priors5', slug: 'dan-priors-gaussian-process' },
  { source: 'dansblog', id: 'posts_2022-11-12-robins-ritov_robins-ritov', slug: 'dan-robins-ritov' },
  { source: 'dansblog', id: 'posts_2022-11-23-wrong-mcmc_wrong-mcmc', slug: 'dan-wrong-mcmc-acceptance' },
  { source: 'dansblog', id: 'posts_2022-11-27-sparse7_sparse7', slug: 'dan-sparse-matrices-7-jax' },
  { source: 'dansblog', id: 'posts_2023-01-21-markov_markov', slug: 'dan-markovian-gaussian-processes' },
  { source: 'dansblog', id: 'posts_2023-01-30-diffusion_diffusion', slug: 'dan-diffusion-models' },
  { source: 'dansblog', id: 'posts_2024-05-08-laplace_laplace', slug: 'dan-laplace-symbolic-sparsity' },
  { source: 'dansblog', id: 'posts_2024-09-04-block-matrices_blocks', slug: 'dan-cpp-block-sparse-matrix' },
  { source: 'dansblog', id: 'posts_2024-09-05-partial-inverse_partial-inverse', slug: 'dan-cpp-partial-inverse' },
]

const SCHEMA = {
  type: 'object',
  required: ['slug', 'skipped'],
  properties: {
    slug: { type: 'string' },
    skipped: { type: 'boolean' },
    reason: { type: 'string', description: 'if skipped, one line why (tutorial)' },
    central_insight: { type: 'string' },
    figures_read: { type: 'number' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    software_patterns: { type: 'string' },
  },
}

function prompt(it) {
  const isBeta = it.source === 'betanalpha'
  const slug = it.slug || it.id.replace(/_/g, '-')
  const bodyPath = `${ROOT}/raw/${it.source}/${it.id}.json`
  const figBlock = isBeta
    ? `- Figures: ${ROOT}/raw/betanalpha/${it.id}_figs/fig000.png … ${it.figs} PNGs. READ the DISTINCT data/diagnostic figures with the Read tool (you can see images); skip decorative section-divider illustrations and near-identical repeats; track how many you read.`
    : `- Figures: external image files (not stored locally) — focus on the full text (prose, math, and CODE). Dan's posts are often software/engineering (sparse matrices, JAX/C++ bridging) or methodology/failure stories.`
  const srcDesc = isBeta
    ? `Michael Betancourt's case study "${it.id}"`
    : `a Dan Simpson blog post`
  const url = isBeta ? `https://betanalpha.github.io/assets/case_studies/${it.id}.html` : `(the "url" field in the record)`
  const kind = isBeta ? 'case-study' : 'blog_post'
  const src = isBeta ? `betanalpha:${it.id}` : `dansblog:${it.id}`
  const figFm = isBeta ? `figures_total: ${it.figs}\nfigures_read: <n>\n` : ''
  return `Read ${srcDesc} for the Bayesian Catalog — an expert-curated, FAILURE-PATH-focused knowledge base whose end product is a consultant that gives actionable statistical AND software/engineering recommendations (e.g. "this is slow; bridge a custom C++ kernel into JAX because JAX lacks that op").

SOURCE (already local — do NOT re-download):
- Body: the "text" field of ${bodyPath} — read it fully (python or Read).
${figBlock}
- Source URL: ${url}

STEP 1 — TRIAGE. Decide whether this post is GENUINELY just a pedagogical tutorial / theory primer / syntax-or-tooling intro, with NO actionable failure-path/debugging insight AND NO implementation/engineering pattern a practitioner could act on.
  - If YES (pure pedagogy, nothing actionable): SKIP — write NO file — return {slug:"${slug}", skipped:true, reason:"<one line>"}.
  - Otherwise: go to STEP 2. WHEN IN DOUBT, PROCEED — we prefer inclusion; downstream filtering handles duds.

STEP 2 — WRITE a self-contained first-class article to ${ROOT}/articles/${slug}.md (a practitioner shouldn't need to open the source):
---
title: <concise>
topic: <slug-ish>
subtopics: [...]
libraries: [<stan|jax|pymc|general as appropriate>]
source: ${src}
source_url: ${url}
kind: ${kind}
tier: first-class
${figFm}curation: draft
curator: Junpeng Lao
confidence: <high|medium|low>
last_updated: 2026-06-21
---
## TL;DR
## Mechanism / what's going on
## When it works vs when it BREAKS (the failure path)
## Software / implementation notes   <- engineering patterns, numerical pitfalls, framework limits, code tricks — ESPECIALLY important for Dan's sparse-matrix / JAX / C++ posts; write "None notable." only if truly absent
## Key figures   <- ${isBeta ? 'cite figNNN.png + one-line finding' : 'describe any decisive figure'}
## Recommended approach
## Caveats / open questions
## Source

Be rigorous and specific; use $...$ for math; ${isBeta ? 'cite figures as figNNN.png; ' : ''}quote concrete artifacts/numbers.

Return the structured object: {slug:"${slug}", skipped:false, central_insight (2-3 sentences), ${isBeta ? 'figures_read, ' : ''}confidence, software_patterns}.`
}

phase('Read')
const results = await parallel(
  ITEMS.map((it) => () =>
    agent(prompt(it), {
      label: `read:${it.slug || it.id}`,
      phase: 'Read',
      agentType: 'statistician',
      effort: 'max',
      schema: SCHEMA,
    })
  )
)

const ok = results.filter(Boolean)
const written = ok.filter((r) => !r.skipped)
const skipped = ok.filter((r) => r.skipped)
log(`${written.length} written, ${skipped.length} skipped as tutorials, of ${ITEMS.length}`)
return { written, skipped }