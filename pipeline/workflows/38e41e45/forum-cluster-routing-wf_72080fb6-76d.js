export const meta = {
  name: 'forum-cluster-routing',
  description: 'Route each forum-thread cluster against claims: covered / contradicts / novel (draft a claim) / out-of-scope',
  phases: [{ title: 'Route', detail: 'one agent per cluster; verify candidate claims against the threads' }],
}

const ROOT = '/home/jp/rekursiv/bayesian-catalog'
const RANKS = Array.from({ length: 250 }, (_, i) => i)   // top-250 clusters by size (forum_clusters.json is size-sorted)

const DRAFT = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    statement: { type: 'string' },
    naive_version: { type: 'string' },
    nuance: { type: 'string' },
    evidence: { type: 'string', description: 'what the cluster threads collectively show' },
    libraries: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
  },
}
const SCHEMA = {
  type: 'object',
  required: ['cluster_id', 'verdict'],
  properties: {
    cluster_id: { type: 'number' },
    rank: { type: 'number' },
    verdict: { type: 'string', enum: ['covered', 'contradicts', 'novel', 'out-of-scope'] },
    matched_claim: { type: 'string' },
    note: { type: 'string' },
    draft_claim: DRAFT,
  },
}

function prompt(rank) {
  return `Route a CLUSTER of forum threads against the catalog's claims. Decide: is the cluster COVERED by an existing claim, does it CONTRADICT one, is it a NOVEL Bayesian-modeling topic (→ draft a new claim), or OUT-OF-SCOPE (software/install/usage/admin Q&A with no transferable statistical or implementation-pattern claim)?

INPUT: read ${ROOT}/catalog/forum_clusters.json and take the entry at index ${rank} (0-based; the array is sorted by size desc). Fields: cluster_id, size, sample_uids ("forum:tid"), sample_titles, candidate_claims (nearest claims by EMBEDDING — these are loose CANDIDATES, verify them, they are often only topical neighbors).

MATERIALS:
- Sample threads: for each of ~5 sample_uids "forum:tid", read ${ROOT}/raw/<forum>/<tid>.json. Read posts[0].cooked (the question) and the accepted/most-liked answer's cooked — NOT every post (some threads are long). That's enough to grasp the cluster's shared topic + the forking path.
- Candidate claims: read ${ROOT}/claims/<id>.md for each candidate.

VERDICT:
- "covered" — the cluster's core topic genuinely IS a candidate claim → set matched_claim (adds prevalence).
- "contradicts" — the threads consistently contradict a candidate claim → matched_claim + note.
- "novel" — a coherent Bayesian-modeling idea NOT covered by any candidate → DRAFT a new claim: a real nuanced statement the threads collectively establish (with naive_version it corrects, nuance/conditions, evidence = what the threads show, libraries). This is the high-value output. Use a kebab-case id.
- "out-of-scope" — pure software/usage/install/admin Q&A, or too incoherent → skip (no draft).

Be honest: the embedding candidates are usually NOT real matches. If none truly fits, it is novel or out-of-scope, never "covered" by default.

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
log(`routed ${ok.length}/250 clusters: ${JSON.stringify(v)}`)
return ok