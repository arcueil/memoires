export const meta = {
  name: 'catalog-opensource-plan',
  description: 'Audit the bayesian-catalog L1 corpus + classify publish/local boundary + run a schema-design panel, to ground an open-sourcing plan',
  phases: [
    { title: 'Audit', detail: 'parallel deep-audit of claims/techniques/moves + provenance + boundary + redundancy' },
    { title: 'Design', detail: 'independent final-artifact schema proposals fed the audit digest' },
  ],
}

const ROOT = "/home/jp/rekursiv/bayesian-catalog"   // note: folder has the 'catalog' typo, to be renamed -> bayesian-catalog
const CONTEXT = `
You are auditing an open-source-candidate Bayesian knowledge catalog at ${ROOT} (READ-ONLY — do NOT edit/create/delete any file).
Goal of the overall project: open-source a human-readable, evidence-graded Bayesian knowledge catalog. The owner (JP, a PyMC/BlackJAX core dev) must be able to REVIEW EVERYTHING and understand it — so "enough detail per entry, NOT too many entries, connections mapped clearly" is the binding constraint.

The canonical L1 corpus (the product):
- claims_consolidated/  — 446 markdown claim files. Frontmatter fields: type,id,statement,naive_version,nuance,reliability(high/medium/low),conditions[],contradicts[],uses_techniques[],libraries[],sources[],source_urls[],folded_from[],evidence{kind,strength,artifacts},status. Body: '## Evidence' (bulleted, source positions) + '## Source' (urls). Reliability split: 310 high / 136 medium.
- techniques/  — 183 markdown technique files. Frontmatter: type,id,name,what,how,caveats[],applies_to[],appears_in[],source_urls[],links[],n_variants,status. Body: '## Source'.
- catalog/move_graph.json  — 1976 canonical "moves" (procedural forking-path strategies). Each: move_id,action,branches[{if_observe,then}],discriminates,expected_findings,leaves[],situations[],sources[](THREAD-IDS like "stan-18700", NOT urls),support,n_threads. Raw moves (pre-merge) at catalog/_intermediate/moves.json (2126, richer per-move text: entry_situation,trigger,terminal,route,qualifiers,topic). Move tier by n_threads: 14 established(>=3) / 87 supported(2) / 1875 candidate(1). The move 'topic' field collapsed to a single value in the canonical graph (likely a bug).
- claims/ (273 files) is a STRICT SUBSET of claims_consolidated/ (446) — redundant to publish both.

Provenance: normalized/*.jsonl (betanalpha,dansblog,pymc) records carry 'uid' + 'url' — the thread-id -> URL map lives here. Embedding indices exist: catalog/e1_index.npz (+ e1_index_meta.json) covers claims+techniques; catalog/move_index.npz covers moves.

Existing scaffolding: README.md (STALE — describes "topic articles, PyMC only, v1 in progress", predates claims/techniques/moves), MANIFEST.md (has a packaging TODO), .gitignore, LICENSE (Apache-2.0, code), LICENSE-CONTENT.md (CC BY-NC, knowledge), PROCESS.md, paper/intuition-engine.md (the capstone research log), catalog/FIELD_GUIDE.md (gitignored — the model-type navigation layer, evidence-graded: 13 model classes, 132 gaps, 91 folklore-to-verify), catalog/L2_MAP.md (gitignored — 40-topic coverage map), experiments/ (NEW: spike_slab_vs_horseshoe.py + RESULTS.md — the "a claim earns its tier by experiment" pattern; the first graded folklore).
Not yet a git repo. Sources crawled read-only; forum content stays local for licensing.
Use python3/grep for whole-corpus aggregate numbers AND read a stratified SAMPLE (~30-50 entries across tiers) for qualitative judgement. Quantify defect rates. Cite concrete entry ids as examples.
`

const AUDIT_SCHEMA = {
  type: "object",
  required: ["area", "report_markdown", "key_numbers", "defects", "recommendations"],
  properties: {
    area: { type: "string" },
    report_markdown: { type: "string", description: "the full qualitative findings, markdown, rich" },
    key_numbers: { type: "array", items: { type: "object", required: ["label","value"], properties: { label:{type:"string"}, value:{type:"string"} } } },
    defects: { type: "array", items: { type: "object", required: ["kind","severity","scope","fix"], properties: {
      kind:{type:"string"}, severity:{type:"string",enum:["blocker","major","minor"]}, scope:{type:"string",description:"how widespread, with a rate/count"}, example_ids:{type:"array",items:{type:"string"}}, fix:{type:"string"} } } },
    recommendations: { type: "array", items: { type: "string" } },
  },
}

phase('Audit')
const audits = await parallel([
  () => agent(`${CONTEXT}
AREA = CLAIMS audit (claims_consolidated/, 446 files).
Assess: (1) schema completeness & consistency — are required fields populated, are statement/naive_version/nuance genuinely distinct and well-formed, is 'status: draft' everywhere (publication-blocking)? (2) TONE consistency — voice, hedging, person, length variance across entries. (3) ACCURACY red-flags — statements that look statistically wrong/overconfident/folklore-y (flag, don't fully verify). (4) REDUNDANCY — near-duplicate or heavily-overlapping claims (sample + reason; note clusters). (5) READABILITY for a reviewer who wants to understand without clicking through. Give defect rates and concrete ids.`,
    { label: 'audit:claims', phase: 'Audit', schema: AUDIT_SCHEMA }),

  () => agent(`${CONTEXT}
AREA = TECHNIQUES audit (techniques/, 183 files) + claim<->technique linkage integrity.
Assess schema completeness/tone/redundancy/accuracy as for claims. SPECIFICALLY: do claims' uses_techniques[] ids resolve to real technique files, and do techniques' applies_to[] ids resolve to real claim ids? Quantify dangling links both directions. Is the technique vs claim boundary clean (any entries miscategorized)? Concrete ids.`,
    { label: 'audit:techniques', phase: 'Audit', schema: AUDIT_SCHEMA }),

  () => agent(`${CONTEXT}
AREA = MOVES audit (catalog/move_graph.json 1976 canonical; catalog/_intermediate/moves.json 2126 raw) — the HARDEST layer for open-sourcing.
The move layer is JSON-only, gitignored, NOT human-readable, sources are thread-ids not URLs, and 1875/1976 are candidate-tier (single-thread). The 'topic' field collapsed to one value (investigate: is it a real bug? compare raw moves.json topics vs canonical).
Assess: (1) what it takes to make moves PUBLISHABLE + REVIEWABLE — render to .md? how many should JP actually review given the 14+87 established/supported spine vs the 1875 candidate tail? (2) REDUNDANCY among moves (the 2126->1976 merge barely deduped — sample for true near-dups). (3) QUALITY of move text (action/trigger/discriminates/branches) — are they genuinely useful procedural knowledge or noise? (4) provenance: can sources[] thread-ids be resolved to URLs via normalized/*.jsonl? Quantify. Concrete move_ids/examples.`,
    { label: 'audit:moves', phase: 'Audit', schema: AUDIT_SCHEMA }),

  () => agent(`${CONTEXT}
AREA = PROVENANCE & CROSS-LINK INTEGRITY across all three layers (this is the "map the connections clearly" feasibility check).
Compute: (1) do claim/technique source_urls[] resolve to real entries in normalized/*.jsonl (or are they external blog urls that 404-risk)? sample-fetch is NOT needed; check structural validity + coverage (% entries with >=1 source_url). (2) contradicts[] graph: do targets resolve to real claim ids? how many dangling? is it bidirectional/consistent? (3) the full id namespace: are claim/technique/move ids globally unique and stable? (4) for moves, the thread-id -> URL resolution rate via normalized/*.jsonl. Produce the connection-graph health report + what's needed to make every published entry cite a clickable, valid source.`,
    { label: 'audit:provenance', phase: 'Audit', schema: AUDIT_SCHEMA }),

  () => agent(`${CONTEXT}
AREA = REPO BOUNDARY CLASSIFICATION + typo-fix scope (read-only; just classify).
Walk the top-level tree (ls the root + key subdirs). For EVERY top-level path classify: PUBLISH (tracked, ships) / LOCAL (gitignored, stays) / DELETE (cruft/superseded, propose removal) / DECIDE (needs JP). Give rationale + licensing note (code=Apache-2.0, knowledge=CC BY-NC, raw forum content=local-only). Identify all superseded/duplicate dirs (claims/ vs claims_consolidated/, claims_draft_v2/, claims_worklog/, claims_casestudies_new/, _superseded/, distilled/, articles/). SEPARATELY: scope the 'catalog'->'catalog' typo fix — the folder rename + the ~39 files containing it (note most are the hardcoded ROOT path in *.py; list the non-path occurrences too). Put the path table in report_markdown as a clean table and the verdict counts in key_numbers.`,
    { label: 'audit:boundary', phase: 'Audit', schema: AUDIT_SCHEMA }),

  () => agent(`${CONTEXT}
AREA = REDUNDANCY & ENTRY-COUNT BUDGET (the crux of "not too many entries / JP reviews everything").
Use the existing embedding indices to be exhaustive: load catalog/e1_index.npz (claims+techniques, with e1_index_meta.json for the id order) and catalog/move_index.npz; compute cosine-similarity near-duplicate pairs above ~0.90 within each layer (python: numpy, normalize rows, X@X.T, threshold, exclude self). Report estimated near-dup pair counts + merge-candidate counts per layer. THEN do the budget math: total is ~2605 entries (446 claims + 183 techniques + 1976 moves); JP must review everything. Propose a realistic REVIEWABLE published entry count per layer and HOW to get there (consolidate? publish only established+supported moves? two-layer nav+detail so the reviewable unit is the navigation layer + the graded spine, with the candidate tail marked-but-not-individually-reviewed?). Give concrete target numbers and the consolidation mechanism. This analysis directly feeds the schema design.`,
    { label: 'audit:redundancy', phase: 'Audit', schema: AUDIT_SCHEMA }),
])

const ok = audits.filter(Boolean)
log(`audits done: ${ok.length}/6`)

// Build a compact digest for the design panel (genuine barrier: designers need ALL audit findings together)
const digest = ok.map(a => {
  const nums = (a.key_numbers||[]).map(n => `${n.label}=${n.value}`).join('; ')
  const defs = (a.defects||[]).map(d => `[${d.severity}] ${d.kind} (${d.scope})`).join(' | ')
  const recs = (a.recommendations||[]).map(r => `- ${r}`).join('\n')
  return `### AUDIT: ${a.area}\nKEY NUMBERS: ${nums}\nDEFECTS: ${defs}\nRECOMMENDATIONS:\n${recs}\n\nFINDINGS:\n${(a.report_markdown||'').slice(0, 3500)}`
}).join('\n\n---\n\n')

const DESIGN_SCHEMA = {
  type: "object",
  required: ["name","one_line","published_entry_schema","navigation_layer","candidate_tail_handling","experiment_attachment","connection_mapping","reviewability_argument","tradeoffs","sample_rendered_entry"],
  properties: {
    name: { type: "string" },
    one_line: { type: "string" },
    published_entry_schema: { type: "string", description: "field-by-field FINAL schema for claim, technique, AND move as published .md — what changes from current, what's dropped/added/renamed, frontmatter + body structure" },
    navigation_layer: { type: "string", description: "how a user navigates / searches / sees the whole; what the top-level index is (field guide? topic map? graph?)" },
    candidate_tail_handling: { type: "string", description: "what happens to the 1875 candidate moves + low-evidence entries so JP can review everything without reviewing 2605 items" },
    experiment_attachment: { type: "string", description: "how experiment results (like spike_slab RESULTS.md) attach to entries and upgrade their tier" },
    connection_mapping: { type: "string", description: "how contradicts/uses_techniques/move-graph edges are surfaced to a human reader" },
    reviewability_argument: { type: "string", description: "the concrete entry-count budget under this design and why JP can review it all" },
    tradeoffs: { type: "string" },
    sample_rendered_entry: { type: "string", description: "one fully-rendered example published entry (a claim) under this schema" },
  },
}

phase('Design')
const designs = await parallel([
  () => agent(`${CONTEXT}\n\nAUDIT DIGEST (use this — it is the ground truth):\n${digest}\n\nDESIGN ANGLE = MINIMALIST ESTABLISHED-SPINE-FIRST. Propose the FINAL published artifact schema where the published, JP-reviewed product is the SMALL evidence-graded spine (established+supported claims/techniques/moves), the candidate tail is shipped but clearly quarantined as "unreviewed/community-sourced". Optimize hard for the "JP reviews everything" bar — fewest entries that still cover the field. Fill every schema field with specifics + a sample rendered entry.`,
    { label: 'design:spine-first', phase: 'Design', schema: DESIGN_SCHEMA }),

  () => agent(`${CONTEXT}\n\nAUDIT DIGEST (use this — it is the ground truth):\n${digest}\n\nDESIGN ANGLE = TWO-LAYER NAVIGATION+DETAIL. Propose the FINAL schema as a navigation layer (the model-type FIELD_GUIDE + topic map, the thing JP reviews to understand the WHOLE) over a detail layer (claims/techniques/moves as cited leaves). The reviewable unit is the navigation layer + graded spine; the detail layer is searchable but not all individually reviewed. Specify how the field guide indexes into entries, how search works on keywords, how experiment results attach. Fill every field + sample rendered entry.`,
    { label: 'design:two-layer', phase: 'Design', schema: DESIGN_SCHEMA }),

  () => agent(`${CONTEXT}\n\nAUDIT DIGEST (use this — it is the ground truth):\n${digest}\n\nDESIGN ANGLE = MODEL-TYPE FIELD GUIDE AS THE SPINE, claims/techniques/moves folded UNDER each model class as graded sub-entries, with explicit gaps + folklore-to-verify + experiment-graded entries inline (per the existing FIELD_GUIDE.md). The catalog IS the field guide; entries are its evidence. Specify the per-model-class page schema, how an entry renders inside it, how the candidate tail + connections + experiments appear. Fill every field + a sample rendered (a model-class page excerpt with one claim under it).`,
    { label: 'design:fieldguide-spine', phase: 'Design', schema: DESIGN_SCHEMA }),
])

return { audits: ok, designs: designs.filter(Boolean) }
