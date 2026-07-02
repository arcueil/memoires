export const meta = {
  name: 'claim-consolidation-merge',
  description: 'Merge each multi-atom claim cluster into canonical claim node(s): merge same-idea atoms across posts, split over-merged clusters, demote moves to techniques, profile evidence from source',
  phases: [{ title: 'Merge', detail: 'one agent per multi-atom cluster' }],
}

const ROOT = '/home/jp/rekursiv/bayesian-catalog'
// clusters sorted by size desc; ids 0..76 are the multi-atom clusters (n>=2)
const CLUSTER_IDS = Array.from({ length: 77 }, (_, i) => i)

const CLAIM_NODE = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    statement: { type: 'string' },
    naive_version: { type: 'string' },
    nuance: { type: 'string' },
    conditions: { type: 'array', items: { type: 'string' } },
    evidence_items: { type: 'array', items: { type: 'object', properties: { what: { type: 'string' }, pointer: { type: 'string' }, source: { type: 'string' } } } },
    reliability: { type: 'string', enum: ['high', 'medium', 'low'] },
    evidence: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['empirical', 'derivation', 'assertion'] },
        artifacts: { type: 'object', properties: { figures: { type: 'number' }, diagnostic_runs: { type: 'number' }, simulations: { type: 'boolean' }, external_refs: { type: 'number' } } },
        strength: { type: 'string', enum: ['strong', 'medium', 'weak'] },
      },
    },
    contradicts: { type: 'array', items: { type: 'string' } },
    uses_techniques: { type: 'array', items: { type: 'string' } },
    libraries: { type: 'array', items: { type: 'string' } },
    sources: { type: 'array', items: { type: 'string' } },
    folded_from: { type: 'array', items: { type: 'string' } },
  },
}
const SCHEMA = {
  type: 'object',
  required: ['cluster_id', 'claim_nodes'],
  properties: {
    cluster_id: { type: 'number' },
    claim_nodes: { type: 'array', items: CLAIM_NODE },
    demoted_techniques: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, what: { type: 'string' } } } },
  },
}

function prompt(cid) {
  return `CONSOLIDATE a cluster of extracted claim-atoms into canonical CLAIM NODE(S) for the Bayesian Catalog knowledge graph. The cluster groups atoms an embedding thought related — it may be COARSE (lumping DISTINCT ideas). Produce the RIGHT number of nodes: merge atoms that are genuinely the SAME idea (even across posts), SPLIT distinct ideas into separate nodes, and DEMOTE any atom that is really a reusable MOVE (a diagnostic/visualization/code pattern) to a technique instead of a claim.

INPUT:
- Read ${ROOT}/catalog/claim_clusters.json and find the object with cluster_id == ${cid}. Its \`atoms\` list each {gid, slug, idx, statement}.
- For each atom, get the FULL atom from ${ROOT}/catalog/extracted.json: find the post by slug, then its claims[idx] (statement, naive_version, nuance, conditions, evidence, contradicts, uses_techniques, confidence).
- GROUND TRUTH for the evidence profile: read the SOURCE of each contributing post — betanalpha:<id> -> "text" of ${ROOT}/raw/betanalpha/<id>.json + figures ${ROOT}/raw/betanalpha/<id>_figs/figNNN.png (READ figures that back a claim); dansblog:<id> -> "text" of ${ROOT}/raw/dansblog/<id>.json.

For EACH distinct idea in the cluster, emit a claim node:
- merge the same-idea atoms across posts into ONE node; fold sub-aspects into \`nuance\`/\`conditions\`; collect \`evidence_items\` from ALL contributing posts (multi-source).
- TWO AXES (keep separate):
  - \`reliability\`: trust in the source(s), judged on content, TONE-INDEPENDENT (Dan's playful style is not a signal).
  - \`evidence\`: {kind (empirical=sim/figures/diagnostics, derivation=math argument, assertion=stated/referenced), artifacts:{figures, diagnostic_runs, simulations, external_refs}, strength (strong/medium/weak)} — judged from the SOURCE. A claim shown by simulation+figures is strong; "X et al. say Y" in two sentences is weak.
- fill contradicts (naive views / disagreeing sources), uses_techniques (kebab ids), libraries, sources (all contributing post sources), folded_from (the atom gids you merged).
- kebab-case \`id\` for each node.

Return ONLY: {cluster_id:${cid}, claim_nodes:[...], demoted_techniques:[...]}.`
}

phase('Merge')
const results = await parallel(
  CLUSTER_IDS.map((cid) => () =>
    agent(prompt(cid), { label: `merge:cluster-${cid}`, phase: 'Merge', agentType: 'statistician', effort: 'max', schema: SCHEMA })
  )
)

const ok = results.filter(Boolean)
const nodes = ok.reduce((s, r) => s + (r.claim_nodes?.length || 0), 0)
const demoted = ok.reduce((s, r) => s + (r.demoted_techniques?.length || 0), 0)
const strong = ok.flatMap((r) => r.claim_nodes || []).filter((n) => n.evidence?.strength === 'strong').length
log(`${ok.length}/77 clusters merged -> ${nodes} claim nodes (${strong} strong-evidence), ${demoted} atoms demoted to techniques`)
return ok