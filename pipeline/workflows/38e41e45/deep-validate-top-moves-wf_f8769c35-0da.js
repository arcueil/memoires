export const meta = {
  name: 'deep-validate-top-moves',
  description: 'Stakes-weighted deep validation of the 40 highest-count moves: soundness (statistical correctness of the diagnostic advice) + faithfulness (witnessed by cited threads, not fabricated)',
  phases: [{ title: 'Validate', detail: 'batches of high-count moves, with source access' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const BATCHES = [[0,4],[5,9],[10,14],[15,19],[20,24],[25,29],[30,34],[35,39]]
const SCHEMA = {
  type: "object", required: ["moves"],
  properties: { moves: { type: "array", items: {
    type: "object", required: ["i","sound","faithful","note"],
    properties: {
      i: { type: "integer", description: "move index" },
      sound: { type: "string", enum: ["yes","minor","no"], description: "is the diagnostic advice statistically correct?" },
      faithful: { type: "string", enum: ["yes","partial","unwitnessed","no-source"], description: "traceable to the cited threads?" },
      note: { type: "string", description: "if not fully sound/faithful: the specific issue" } } } } },
}
const results = await parallel(BATCHES.map(([a,b]) => () => agent(
`Deep-validate high-count diagnostic MOVES for a Bayesian catalog. Read ${ROOT}/catalog/_intermediate/top_moves.json and process ONLY moves with index ${a}..${b} (inclusive). Each move has: action (the diagnostic step), discriminates (what it distinguishes), expected_findings, n_threads (how many forum threads witnessed it), sources (thread ids), raw_files (readable paths to those threads under ${ROOT}/raw/).

For each move in your range, judge TWO things:
1. **sound** — is the diagnostic advice statistically CORRECT as stated? (yes / minor / no). You are a Bayesian statistician; flag backwards mechanisms, wrong knob directions, category errors. These are high-count (load-bearing) moves, so correctness matters.
2. **faithful** — read the raw_files (grep/skim them for the move's key terms — do NOT full-read giant threads) and judge whether the move's action+finding is actually WITNESSED in those threads (yes / partial / unwitnessed / no-source if raw_files empty). This catches fabricated moves.

Default to sound=yes / faithful=yes unless you find a specific problem; quote the issue in \`note\`. Return {moves:[{i,sound,faithful,note}]} for your range. One-line summary: "moves ${a}-${b}: <n> validated, <n> flagged".`,
  { label: `mv:${a}-${b}`, phase: "Validate", schema: SCHEMA }
)))
const all = results.filter(Boolean).flatMap(r => r.moves||[])
return { validated: all.length, flagged: all.filter(m => m.sound!=='yes' || (m.faithful!=='yes'&&m.faithful!=='no-source')).length, moves: all }
