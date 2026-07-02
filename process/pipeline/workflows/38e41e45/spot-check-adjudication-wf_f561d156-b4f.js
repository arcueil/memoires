export const meta = {
  name: 'spot-check-adjudication',
  description: 'Neutral adjudication of QA flags against the source — fair vs over-strict, with quoted evidence, for a spot-check doc',
  phases: [{ title: 'Adjudicate', detail: 'one neutral adjudicator per sampled article; rule each flag against source' }],
}

const ROOT = '/home/jp/rekursiv/bayesian-catalog'
const SLUGS = [
  'factor-modeling', 'dan-cpp-block-sparse-matrix', 'dan-wrong-mcmc-acceptance',
  'probability-densities', 'some-containment-prior-models', 'principled-bayesian-workflow',
  'general-taylor-models', 'dan-sparse-matrices-2-jax',
  'hierarchical-parameterization', 'divergences-and-bias',
]

const SCHEMA = {
  type: 'object',
  required: ['slug', 'adjudications', 'qa_calibration'],
  properties: {
    slug: { type: 'string' },
    source: { type: 'string' },
    adjudications: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          claim: { type: 'string' },
          reviewer_objection: { type: 'string' },
          source_evidence: { type: 'string', description: 'short exact quote or precise figure description that settles it' },
          adjudication: { type: 'string', enum: ['fair', 'over-strict', 'partial'] },
        },
      },
    },
    qa_calibration: { type: 'string', enum: ['accurate', 'over-strict', 'mixed'] },
    notes: { type: 'string' },
  },
}

function prompt(slug) {
  return `You are a NEUTRAL ADJUDICATOR. An automated fidelity reviewer flagged claims in a catalog article as unsupported / overclaimed. Determine, for EACH flag, whether the reviewer was RIGHT (the article genuinely overclaims or errs) or OVER-STRICT (the article is actually defensible from the source) — by going to the SOURCE and laying out the evidence. Be impartial: the reviewer can be wrong too. Do NOT defer to the reviewer.

INPUT: read ${ROOT}/catalog/spot_check_targets.json and find the entry where "slug" == "${slug}". It lists: source, all_flags (each {claim, issue (the reviewer's objection), severity}), figure_citation_errors.

MATERIALS:
- Article (context): ${ROOT}/articles/${slug}.md
- SOURCE (ground truth): parse the "source" field.
    • betanalpha:<id> → body = "text" field of ${ROOT}/raw/betanalpha/<id>.json; figures = ${ROOT}/raw/betanalpha/<id>_figs/figNNN.png — READ (with the Read tool, you see images) any figure named in a claim or objection.
    • dansblog:<id> → body = "text" field of ${ROOT}/raw/dansblog/<id>.json; Dan's figures are external (skip figure checks, note it).

For EACH flagged claim AND each figure_citation_error: go to the source, find the exact passage or figure that bears on it, and rule:
  • fair — reviewer is right; the article's claim is unsupported / overclaims / misreads the figure.
  • over-strict — reviewer is wrong; the source DOES support the article's claim (quote it) or the objection is pedantic.
  • partial — partly right.
Put the decisive SOURCE EVIDENCE in source_evidence (a short EXACT quote from the source text, or a precise description of what the figure actually shows) — this is the most important field, so a human can verify in seconds.

Then judge qa_calibration: across this article's flags, was the QA reviewer accurate, over-strict, or mixed?

Return ONLY: {slug:"${slug}", source, adjudications:[{claim, reviewer_objection, source_evidence, adjudication}], qa_calibration, notes}.`
}

phase('Adjudicate')
const results = await parallel(
  SLUGS.map((slug) => () =>
    agent(prompt(slug), { label: `adjudicate:${slug}`, phase: 'Adjudicate', agentType: 'statistician', effort: 'max', schema: SCHEMA })
  )
)

const ok = results.filter(Boolean)
let fair = 0, over = 0, partial = 0
for (const r of ok) for (const a of (r.adjudications || [])) {
  if (a.adjudication === 'fair') fair++
  else if (a.adjudication === 'over-strict') over++
  else partial++
}
log(`adjudicated ${ok.length} articles — flags ruled: ${fair} fair, ${over} over-strict, ${partial} partial`)
return ok