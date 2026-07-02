export const meta = {
  name: 'build-target-all-classes',
  description: 'Scale the validated target-architecture rendering to all 9 remaining model classes: mid-level claims + comprehensive bidirectional recs + attached moves',
  phases: [{ title: 'Synthesize', detail: 'one agent per model class' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const CLASSES = ["regression","mixture","gaussian-process","time-series-state-space","spatial-areal",
  "latent-factor","ode-dynamical","measurement-error-missing","sparse-shrinkage"]

const results = await parallel(CLASSES.map(cls => () => agent(
`Build the target-architecture rendering for model class "${cls}", following the VALIDATED pattern (an exemplar already exists at ${ROOT}/dist/target_sample/hierarchical-multilevel.md — read it to match structure and quality). Read the design at ${ROOT}/TARGET_ARCHITECTURE.md, then the input at ${ROOT}/catalog/_intermediate/target_input/${cls}.json (its claims + moves).

Produce ${ROOT}/dist/target_sample/${cls}.md with EXACTLY this structure:

# <human title for ${cls}>

## Claims (the *why* — mid-level, ~3–5)
Synthesize the granular claims into ~3–5 MID-LEVEL abstract principles (durable *why*). Each: one-sentence statement + short nuance + tier (🟢/🟡/⚪, = best-supported granular claim it subsumes) + aggregated source short-ids + a "subsumes [...]" list for traceability. Capture the main DISTINCTIONS, not one-liners, not granular. (If a class has few claims, 2–3 is fine.)

## Practical — what works / what doesn't (comprehensive, bidirectional)
Mine claims + moves into as MANY concrete recs as the material supports (comprehensive — the searchable depth). Each rec:
- **✓ or ✗** + \`for <model + setup> → <technique> works | does NOT work\`
- \`why:\` one line · \`conditions:\` the setup (critical for ✗) · \`tier:\` glyph · \`source:\` short-id
- \`efficacy: {divergences, min_ess, ess_per_sec, rmse, coverage}\` — fill ONLY from a metric present in the input, else \`pending\` (benchmark slot)
- \`moves:\` 1–3 attached diagnostic moves from the input (the "how")
Include BOTH ✓ and ✗ recs (failure-path first-class). Group by problem.

RULES: strict faithfulness — ground every claim/rec/number in the provided input; NEVER invent techniques, numbers, or sources. Single-witness moves → tier ⚪, keep (searchable tail). Return a 3-line summary: #claims, #recs (✓/✗), #move-attachments.`,
  { label: `tgt:${cls.slice(0,18)}`, phase: "Synthesize" }
)))
log(`target renderings built: ${results.filter(Boolean).length}/${CLASSES.length}`)
return { done: results.filter(Boolean).length }
