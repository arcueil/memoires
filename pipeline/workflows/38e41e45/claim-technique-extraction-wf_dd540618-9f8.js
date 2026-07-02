export const meta = {
  name: 'claim-technique-extraction',
  description: 'Re-read each source post and extract claim-level knowledge: 0..N claims + 0..M reusable techniques, with a content-reliability (tone-independent) assessment',
  phases: [{ title: 'Extract', detail: 'one agent per post; ground in source, emit claims + techniques' }],
}

const ROOT = '/home/jp/rekursiv/bayesian-catalog'
const SLUGS = [
  'brownian-bridge', 'dan-barry-gibb', 'dan-cpp-block-sparse-matrix', 'dan-cpp-partial-inverse',
  'dan-diffusion-models', 'dan-laplace-symbolic-sparsity', 'dan-markovian-gaussian-processes',
  'dan-multilevel-regression', 'dan-priors-4-containment', 'dan-priors-gaussian-process',
  'dan-psis-tail-stabilization', 'dan-robins-ritov', 'dan-sparse-matrices-1-mixed-effects',
  'dan-sparse-matrices-2-jax', 'dan-sparse-matrices-3-failing-jax', 'dan-sparse-matrices-4-design',
  'dan-sparse-matrices-5-primitives', 'dan-sparse-matrices-6-derivatives', 'dan-sparse-matrices-7-jax',
  'dan-why-wont-you-cheat-with-me', 'dan-wrong-mcmc-acceptance', 'divergences-and-bias',
  'factor-modeling', 'falling', 'fitting-the-cauchy', 'gaussian-processes', 'general-taylor-models',
  'generative-modeling', 'hierarchical-parameterization', 'identifiability',
  'markov-chain-monte-carlo-basics', 'markov-chain-monte-carlo', 'modeling-and-inference',
  'modeling-sparsity', 'principled-bayesian-workflow', 'prior-modeling', 'probabilistic-computation',
  'probability-densities', 'pystan-workflow', 'qr-regression', 'rstan-workflow', 'sampling',
  'some-containment-prior-models', 'stan-intro', 'stochastic-differential-equations',
  'survival-modeling', 'taylor-models', 'underdetermined-linear-regression',
  'variate-covariate-modeling', 'weakly-informative-priors',
]

const CLAIM = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    statement: { type: 'string' },
    naive_version: { type: 'string', description: 'the oversimplification this corrects, or "" if none' },
    nuance: { type: 'string' },
    conditions: { type: 'array', items: { type: 'string' } },
    evidence: { type: 'array', items: { type: 'object', properties: { what: { type: 'string' }, pointer: { type: 'string' } } } },
    contradicts: { type: 'array', items: { type: 'string' } },
    uses_techniques: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
  },
}
const TECH = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    what: { type: 'string' },
    how: { type: 'string' },
    caveat: { type: 'string' },
    applies_to: { type: 'array', items: { type: 'string' } },
    links: { type: 'array', items: { type: 'string' } },
  },
}
const SCHEMA = {
  type: 'object',
  required: ['slug', 'post_assessment', 'claims', 'techniques'],
  properties: {
    slug: { type: 'string' },
    source: { type: 'string' },
    post_assessment: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['claim-driven', 'exploration', 'tutorial', 'weak-unreliable', 'mixed'] },
        reliability: { type: 'string', enum: ['high', 'medium', 'low'], description: 'trust in the CONTENT (reasoning sound + supported), judged on substance NOT writing tone' },
        note: { type: 'string' },
      },
    },
    claims: { type: 'array', items: CLAIM },
    techniques: { type: 'array', items: TECH },
  },
}

function prompt(slug) {
  return `Extract the CLAIM-LEVEL knowledge from one source post for the Bayesian Catalog knowledge graph. We are moving from "1 article per post" to a claim-centric graph: CLAIMS (single nuanced ideas, may later span multiple posts) + reusable TECHNIQUES (investigation devices / diagnostics / visualizations / code patterns).

BE FLEXIBLE — do not force a count:
- a post may argue MULTIPLE big claims, ONE, or ZERO;
- a pure EXPLORATION post may have 0 claims but many reusable techniques — extract the techniques;
- a TUTORIAL/primer may yield few/no claims, maybe a technique or two.

RELIABILITY IS ABOUT CONTENT, NOT TONE. Judge \`reliability\` only by whether the reasoning is sound and the claims are supported. CRITICAL: Dan Simpson writes in a deliberately PLAYFUL, colorful style (jokes, song-title headers, asides) — this is NOT a reliability signal. A playful or irreverent post can be fully reliable; treat his content as rigorous unless the substance itself is shaky. Reserve low reliability / "weak-unreliable" for posts whose CONTENT is genuinely tentative, speculative, or wrong — never for style.

GROUND TRUTH = the SOURCE post, NOT our existing article (our article may contain fidelity errors — the QA found several; verify everything against source).
- Guide only: ${ROOT}/articles/${slug}.md — read its frontmatter for \`source:\`, but treat its specific claims SKEPTICALLY.
- SOURCE (truth): parse \`source:\` — betanalpha:<id> -> body = "text" of ${ROOT}/raw/betanalpha/<id>.json + figures ${ROOT}/raw/betanalpha/<id>_figs/figNNN.png (READ the figures that matter); dansblog:<id> -> body = "text" of ${ROOT}/raw/dansblog/<id>.json (Dan's figures are external).
- Techniques may link to the agent's working checklist at ${ROOT}/raw/worklog/ (e.g. the statistician checklist) — note the link if a technique already lives there.

A CLAIM = one nuanced IDEA the post argues (its thesis), ideally correcting a naive version. Make the statement specific and the nuance real (regimes/conditions), not a platitude.
A TECHNIQUE = a reusable MOVE usable beyond this post (a diagnostic, a visualization, a parameterization/code trick). Include its caveat / scope-of-validity — that is itself knowledge.

Use kebab-case ids. Ground each claim's evidence in the SOURCE (what reasoning / forking-path / figure supports it).

Return ONLY: {slug:"${slug}", source, post_assessment:{type, reliability, note}, claims:[...], techniques:[...]}.`
}

phase('Extract')
const results = await parallel(
  SLUGS.map((slug) => () =>
    agent(prompt(slug), { label: `extract:${slug}`, phase: 'Extract', agentType: 'statistician', effort: 'max', schema: SCHEMA })
  )
)

const ok = results.filter(Boolean)
const nClaims = ok.reduce((s, r) => s + (r.claims?.length || 0), 0)
const nTech = ok.reduce((s, r) => s + (r.techniques?.length || 0), 0)
const types = {}
for (const r of ok) { const t = r.post_assessment?.type || '?'; types[t] = (types[t] || 0) + 1 }
log(`${ok.length} posts -> ${nClaims} claims, ${nTech} techniques. types: ${JSON.stringify(types)}`)
return ok