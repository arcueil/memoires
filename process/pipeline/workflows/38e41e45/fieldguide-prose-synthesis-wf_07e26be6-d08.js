export const meta = {
  name: 'fieldguide-prose-synthesis',
  description: 'Synthesize the View-A FIELD_GUIDE prose page for each of the 14 observed-data leaves: thesis, structure cross-cut, common problems -> tiered fixes, gaps, folklore-to-verify',
  phases: [{ title: 'Synthesize', detail: 'one agent per observed-data leaf page' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const DIR = ROOT + "/catalog/_intermediate/fieldguide_v2"
const LEAVES = ["count","proportion-of-n","binary","categorical","ordinal","real-valued","positive",
  "bounded-unit-interval","censored-survival","multivariate-observed","geometry-sampling",
  "convergence-diagnostics","model-evaluation","priors-identifiability"]

const results = await parallel(LEAVES.map(leaf => () => agent(
`Synthesize one FIELD GUIDE page for the observed-data family "${leaf}". READ-ONLY except the one .md file you write.

Read ${DIR}/${leaf}.json — it has: leaf, branch, total, tier_counts (🟢established/🟡supported/⚪candidate; entries with kind=technique have tier "technique"), structure_crosscut (which model-structures co-occur), and items[] (capped) each = {id, kind(claim|technique|move), tier, structure, text}. Note most candidate items are single-witness machine-mined moves — treat the ⚪ tier honestly as the unverified tail.

Write ${DIR}/${leaf}.md — a markdown page, STRICTLY ORGANIZING the items (do NOT invent fixes/claims not present), in this shape:

## ${leaf}  ·  <total> entries  ·  🟢<e> 🟡<s> ⚪<c>
*<one-paragraph thesis: what this observed-data family is and its single most characteristic modeling challenge>*

**Structure cross-cut:** <1-2 sentences: which model structures (from structure_crosscut) show up in this family and why — e.g. "count data here is usually hierarchical (overdispersion as a random effect) or a GP (smooth rate)">

**Common problems → fixes:**
- **<problem / failure mode>** (<how common: many/several/few items>) → 🟢<established fix> · 🟡<supported fix> · ⚪<candidate fix>
  (frequency-rank the problems; each fix tagged with its tier glyph; pull fixes from claims+techniques+moves in the items)

**🕳 Gaps:** <problems an expert guide for "${leaf}" SHOULD cover but the items are missing or only candidate-tier — use domain knowledge to name the holes>

**🔬 Folklore to verify:** <candidate-tier asserted claims that read like received wisdom and need an experiment to earn reliability — be skeptical>

RULES: honesty about the tail — if this page is mostly ⚪candidate (e.g. a modeling page that is nearly all single-witness moves), SAY SO in the thesis ("coverage here is largely community-sourced / thin on established results") and lean on the Gaps section. Frequency and tier come from the DATA; gaps/folklore use your judgement. Keep it tight and reviewable. Return one line: "${leaf}: <n_problems> problems, <n_gaps> gaps".`,
  { label: `fg:${leaf}`, phase: 'Synthesize' }
)))
log(`field-guide pages synthesized: ${results.filter(Boolean).length}/${LEAVES.length}`)
return { done: results.filter(Boolean).length }
