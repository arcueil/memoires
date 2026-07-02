export const meta = {
  name: 'forum-cluster-routing-b',
  description: 'Route forum-thread clusters (ranks 250-499) against claims: covered / contradicts / novel / out-of-scope',
  phases: [{ title: 'Route', detail: 'one agent per cluster; verify candidate claims against the threads' }],
}

const ROOT = '/home/jp/rekursiv/bayesian-catalog'
const RANKS = Array.from({ length: 250 }, (_, i) => i + 250)   // bottom-250 clusters (smaller)

const DRAFT = {
  type: 'object',
  properties: {
    id: { type: 'string' }, statement: { type: 'string' }, naive_version: { type: 'string' },
    nuance: { type: 'string' }, evidence: { type: 'string' },
    libraries: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
  },
}
const SCHEMA = {
  type: 'object', required: ['cluster_id', 'verdict'],
  properties: {
    cluster_id: { type: 'number' }, rank: { type: 'number' },
    verdict: { type: 'string', enum: ['covered', 'contradicts', 'novel', 'out-of-scope'] },
    matched_claim: { type: 'string' }, note: { type: 'string' }, draft_claim: DRAFT,
  },
}

function prompt(rank) {
  return `Route a CLUSTER of forum threads against the catalog's claims. Decide: COVERED by an existing claim, CONTRADICTS one, NOVEL Bayesian-modeling topic (→ draft a new claim), or OUT-OF-SCOPE (software/install/usage/admin Q&A, no transferable claim).

INPUT: read ${ROOT}/catalog/forum_clusters.json, entry at index ${rank} (array sorted by size desc): cluster_id, size, sample_uids ("forum:tid"), candidate_claims (loose embedding CANDIDATES — verify, usually only topical neighbours).

MATERIALS:
- ~5 sample threads: read ${ROOT}/raw/<forum>/<tid>.json — posts[0].cooked (question) + the accepted/most-liked answer's cooked (NOT every post).
- Candidate claims: ${ROOT}/claims/<id>.md.

VERDICT: "covered" (core topic genuinely IS a candidate claim → matched_claim) · "contradicts" (threads contradict a candidate → matched_claim+note) · "novel" (coherent idea NOT covered → DRAFT a claim: nuanced statement, naive_version, nuance, evidence=what threads show, libraries, kebab id) · "out-of-scope" (pure usage Q&A / incoherent → skip). The embedding candidates are usually NOT real matches; never default to "covered".

Return ONLY: {cluster_id, rank:${rank}, verdict, matched_claim, note, draft_claim (only if novel)}.`
}

phase('Route')
const results = await parallel(
  RANKS.map((r) => () =>
    agent(prompt(r), { label: `route:cluster-rank-${r}`, phase: 'Route', agentType: 'statistician', effort: 'medium', schema: SCHEMA })
  )
)
const ok = results.filter(Boolean)
const v = {}
for (const r of ok) v[r.verdict] = (v[r.verdict] || 0) + 1
log(`routed ${ok.length}/250 (ranks 250-499): ${JSON.stringify(v)}`)
return ok