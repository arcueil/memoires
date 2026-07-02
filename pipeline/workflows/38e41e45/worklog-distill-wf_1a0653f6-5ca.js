export const meta = {
  name: 'worklog-distill',
  description: 'Distill catalog-relevant worklog lessons/decisions into the unified claim/technique format; skip pure dev-machinery',
  phases: [{ title: 'Distill', detail: 'one agent per worklog file' }],
}
const ROOT = '/home/jp/rekursiv/bayesian-catalog'
const RANKS = Array.from({ length: 67 }, (_, i) => i)

const SCHEMA = {
  type: 'object',
  required: ['rank', 'verdict'],
  properties: {
    rank: { type: 'number' }, path: { type: 'string' },
    verdict: { type: 'string', enum: ['claim', 'technique', 'skip'] },
    reason: { type: 'string' },
    claim: { type: 'object', properties: { id: { type: 'string' }, statement: { type: 'string' }, naive_version: { type: 'string' }, nuance: { type: 'string' }, evidence: { type: 'string' }, libraries: { type: 'array', items: { type: 'string' } }, confidence: { type: 'string', enum: ['high', 'medium', 'low'] } } },
    technique: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, what: { type: 'string' }, how: { type: 'string' }, caveat: { type: 'string' }, libraries: { type: 'array', items: { type: 'string' } } } },
  },
}

const prompt = (r) => `Distill an internal BlackJAX worklog entry into the catalog's unified format — IF it is Bayesian-catalog material.

INPUT: read ${ROOT}/catalog/worklog_files.json and take the path at index ${r}. Read that markdown file (an already-distilled worklog lesson or decision: frontmatter + body, often with **Why:** / **How to apply:**).

DECIDE:
- If it is a **Bayesian / statistical / MCMC / VI / numerical-method** insight (a real inference or algorithm-correctness finding, or a reusable diagnostic/implementation move) → emit a \`claim\` (nuanced statement + naive_version + nuance + evidence + libraries like blackjax/jax) OR a \`technique\` (name/what/how/caveat).
- If it is pure **dev-machinery** — test antipatterns, type-checking/tooling, CI, agent/subagent process, packaging, cosmetic-diff, BlackJAX-internal API drift with no statistical content → **skip** (reason: one line). Most worklog entries are machinery; skip is the common, correct answer.

Use kebab-case ids. Return ONLY: {rank:${r}, path, verdict, reason, claim (if claim), technique (if technique)}.`

phase('Distill')
const results = await parallel(
  RANKS.map((r) => () => agent(prompt(r), { label: `worklog:${r}`, phase: 'Distill', agentType: 'statistician', effort: 'medium', schema: SCHEMA }))
)
const ok = results.filter(Boolean)
const v = {}; for (const x of ok) v[x.verdict] = (v[x.verdict] || 0) + 1
log(`worklog: ${JSON.stringify(v)} of ${ok.length}`)
return ok