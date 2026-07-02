export const meta = {
  name: 'build-target-crosscutting',
  description: 'Render the 4 cross-cutting computation-diagnostics leaves as mid-level claims + situation-indexed bidirectional recs + attached moves',
  phases: [{ title: 'Synthesize', detail: 'one agent per computation leaf' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const LEAVES = ["geometry-sampling","priors-identifiability","model-evaluation","convergence-diagnostics"]

const results = await parallel(LEAVES.map(lf => () => agent(
`Build the target-architecture rendering for the CROSS-CUTTING computation-diagnostics area "${lf}" (applies across ALL models, not one). Read the exemplar ${ROOT}/dist/target_sample/hierarchical-multilevel.md for structure/quality and ${ROOT}/TARGET_ARCHITECTURE.md for the design, then the input ${ROOT}/catalog/_intermediate/target_input/CC-${lf}.json.

Produce ${ROOT}/dist/target_sample/CC-${lf}.md with:

# Cross-cutting: <human title for ${lf}>

## Claims (the *why* — mid-level, ~4–7)
Synthesize the granular claims into ~4–7 MID-LEVEL principles. Each: statement + nuance + tier (best-supported subsumed) + aggregated sources + "subsumes [...]". Capture the main DISTINCTIONS.

## Practical — what works / what doesn't (comprehensive, SITUATION-indexed)
KEY DIFFERENCE from model-class pages: these recs are indexed by DIAGNOSTIC SITUATION/SYMPTOM, not by model. Each rec:
- **✓ or ✗** + \`when <symptom/situation> → <action/interpretation> works | does NOT work\`  (e.g. "when divergences cluster at a boundary → they localize the pathology, works" · "when divergences scatter uniformly → treating each as THE location does NOT work")
- \`why:\` · \`conditions:\` the situation it holds in · \`tier:\` glyph · \`source:\` short-id
- \`efficacy: {divergences, min_ess, ess_per_sec, rmse, coverage}\` — fill ONLY from a metric present in the input, else \`pending\`
- \`moves:\` 1–3 attached diagnostic moves from the input
Comprehensive (this is the searchable depth); both ✓ and ✗; group by problem.

RULES: strict faithfulness — ground everything in the input; NEVER invent numbers/techniques/sources. Single-witness → ⚪, keep. Return a 3-line summary: #claims, #recs (✓/✗), #move-attachments.`,
  { label: `cc:${lf.slice(0,16)}`, phase: "Synthesize" }
)))
log(`cross-cutting renderings built: ${results.filter(Boolean).length}/${LEAVES.length}`)
return { done: results.filter(Boolean).length }
