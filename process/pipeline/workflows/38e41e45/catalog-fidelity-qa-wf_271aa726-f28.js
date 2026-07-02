export const meta = {
  name: 'catalog-fidelity-qa',
  description: 'Independent fidelity review of each catalog article vs its source (+ figures), with "are you sure?" x2 self-critique',
  phases: [{ title: 'Review', detail: 'one independent reviewer per article; verify claims, then are-you-sure x2' }],
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

const SCHEMA = {
  type: 'object',
  required: ['slug', 'verdict', 'changed_after_are_you_sure'],
  properties: {
    slug: { type: 'string' },
    source: { type: 'string' },
    verdict: { type: 'string', enum: ['clean', 'minor', 'flag'] },
    confidence_in_review: { type: 'string', enum: ['high', 'medium', 'low'] },
    flagged_claims: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          claim: { type: 'string' },
          issue: { type: 'string' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
      },
    },
    figure_citation_errors: {
      type: 'array',
      items: { type: 'object', properties: { figure: { type: 'string' }, issue: { type: 'string' } } },
    },
    counter_intuitive_claims: { type: 'array', items: { type: 'string' } },
    changed_after_are_you_sure: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

function prompt(slug) {
  return `You are an INDEPENDENT fidelity reviewer for the Bayesian Catalog. You did NOT write this article. Be adversarial: your job is to catch where it MISREPRESENTS its source — hallucinated numbers, miscited figures, and overclaims.

ARTICLE: ${ROOT}/articles/${slug}.md — read it. Its frontmatter has \`source:\` (either betanalpha:<id> or dansblog:<id>) and \`source_url\`.

SOURCE (ground truth — derive the path from the frontmatter \`source:\`):
- Body: the "text" field of ${ROOT}/raw/<betanalpha|dansblog>/<id>.json — read it fully.
- Figures (betanalpha only): for EACH figNNN.png the article cites, READ ${ROOT}/raw/betanalpha/<id>_figs/figNNN.png with the Read tool (you can see images) and verify the article's claim about that figure is accurate. Dan's figures are external/not local — skip figure verification for dansblog and note that.

CHECK every specific claim in the article against the source:
- Numbers/quantities (e.g. "E-FMI < 0.2", "20x speedup", "ECRPS 4814", divergence counts): actually stated in / directly supported by the source?
- Figure citations: does figNNN.png actually show what the article says?
- Generalizations & recommendations: supported, or overclaimed beyond the source?
- Software/implementation claims: accurate?

Form an INITIAL verdict: clean (faithful), minor (small imprecisions, no material error), or flag (a material unsupported/wrong claim or miscited figure).

THEN, before concluding, ask yourself "ARE YOU SURE?" and re-examine — TWICE:
  • Round 1 "Are you sure?": For each flag — is it REALLY unsupported, or did you miss where the source supports it (avoid false positives)? AND did you MISS any error — a number or figure claim you didn't actually verify (avoid false negatives)? Adjust.
  • Round 2 "Are you sure?": Once more, calibrated. Don't flag correct claims; don't clear wrong ones. Settle the final verdict.
Set changed_after_are_you_sure = true if either round changed your verdict or flags.

Also list counter_intuitive_claims: claims that ARE supported by the source but are surprising/non-obvious — where the human curator should focus even though they're correct.

Return ONLY the structured object (your final message is the return value): {slug:"${slug}", source, verdict, confidence_in_review, flagged_claims, figure_citation_errors, counter_intuitive_claims, changed_after_are_you_sure, notes}.`
}

phase('Review')
const verdicts = await parallel(
  SLUGS.map((slug) => () =>
    agent(prompt(slug), { label: `qa:${slug}`, phase: 'Review', agentType: 'statistician', effort: 'max', schema: SCHEMA })
  )
)

const ok = verdicts.filter(Boolean)
const flagged = ok.filter((v) => v.verdict === 'flag')
const minor = ok.filter((v) => v.verdict === 'minor')
const changed = ok.filter((v) => v.changed_after_are_you_sure)
log(`${ok.length}/${SLUGS.length} reviewed — ${flagged.length} flag, ${minor.length} minor; ${changed.length} changed verdict after "are you sure?"`)
return ok