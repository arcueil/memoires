export const meta = {
  name: 'distill-new-casestudies',
  description: 'Distill the 4 newly-fetched (forum-referenced) Betancourt case studies into first-class claims',
  phases: [{ title: 'Distill', detail: 'one agent per new case study; full body + figures' }],
}
const ROOT = '/home/jp/rekursiv/bayesian-catalog'
const STUDIES = ['ordinal_regression', 'bayes_sparse_regression', 'identifying_mixture_models', 'mixture_models']

const CLAIM = {
  type: 'object',
  properties: {
    id: { type: 'string' }, statement: { type: 'string' }, naive_version: { type: 'string' },
    nuance: { type: 'string' }, conditions: { type: 'array', items: { type: 'string' } },
    evidence_items: { type: 'array', items: { type: 'object', properties: { what: { type: 'string' }, pointer: { type: 'string' } } } },
    evidence: { type: 'object', properties: { kind: { type: 'string', enum: ['empirical', 'derivation', 'assertion'] }, strength: { type: 'string', enum: ['strong', 'medium', 'weak'] }, figures_read: { type: 'number' } } },
    contradicts: { type: 'array', items: { type: 'string' } }, uses_techniques: { type: 'array', items: { type: 'string' } },
    libraries: { type: 'array', items: { type: 'string' } },
  },
}
const SCHEMA = { type: 'object', required: ['study', 'claims'], properties: { study: { type: 'string' }, claims: { type: 'array', items: CLAIM } } }

const prompt = (s) => `Distill Michael Betancourt's case study "${s}" into FIRST-CLASS catalog claims (this study is heavily forum-referenced — a real gap we just filled). Failure-path focus: the mechanism, the regimes where it BREAKS, the diagnostics.

SOURCE: ${ROOT}/raw/betanalpha/${s}.json — read the "text" field fully; figures at ${ROOT}/raw/betanalpha/${s}_figs/figNNN.png — READ the data figures with the Read tool (skip decorative dividers), count how many.

Emit the BIG-IDEA claims (not micro-claims): each with statement, naive_version it corrects, nuance/conditions, evidence_items (grounded in the source + figures), the two-axis profile (reliability=high [Betancourt], evidence={kind: empirical/derivation, strength, figures_read}), contradicts, uses_techniques, libraries ([stan]). Use kebab-case ids.

Return ONLY: {study:"${s}", claims:[...]}.`

phase('Distill')
const results = await parallel(STUDIES.map((s) => () =>
  agent(prompt(s), { label: `distill:${s}`, phase: 'Distill', agentType: 'statistician', effort: 'max', schema: SCHEMA })))
const ok = results.filter(Boolean)
const n = ok.reduce((a, r) => a + (r.claims?.length || 0), 0)
log(`distilled ${ok.length} new case studies -> ${n} claims`)
return ok