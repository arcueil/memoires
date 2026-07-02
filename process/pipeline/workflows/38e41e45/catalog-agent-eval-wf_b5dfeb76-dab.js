export const meta = {
  name: 'catalog-agent-eval',
  description: 'End-to-end test: can an agent with ONLY claims/techniques retrieval solve resolved forum threads? Blind solve → grade vs accepted answer',
  phases: [{ title: 'Solve' }, { title: 'Grade' }],
}

const ROOT = '/home/jp/rekursiv/bayesian-catalog'
const RANKS = Array.from({ length: 18 }, (_, i) => i)

const SOLVER = {
  type: 'object',
  required: ['retrieved_helpful', 'solution_direction'],
  properties: {
    retrieved_helpful: { type: 'boolean' },
    best_id: { type: 'string' },
    solution_direction: { type: 'string' },
    follow_up: { type: 'string' },
  },
}
const GRADER = {
  type: 'object',
  required: ['rank', 'retrieval_relevant', 'solution_aligned', 'score'],
  properties: {
    rank: { type: 'number' },
    retrieval_relevant: { type: 'boolean', description: 'did the retrieved set contain a genuinely relevant claim/technique' },
    solution_aligned: { type: 'boolean', description: 'does the solver direction match the actual accepted answer' },
    score: { type: 'number', description: '0-5 overall usefulness' },
    note: { type: 'string' },
  },
}

const solverPrompt = (r) => `You are a Bayesian-modeling assistant. A user posted the following forum question. You have a RETRIEVAL result from a knowledge catalog (claims + techniques) — and NOTHING else (no web, no forum answers, no raw threads).

Read ${ROOT}/catalog/eval_threads.json and take the entry at index ${r}. Use ONLY its \`title\`, \`op\` (the user's question), and \`retrieved\` (the catalog hits, each with id/layer/text). IGNORE the \`accepted_answer\` field entirely — that is the held-out ground truth; do NOT read or use it.

Decide, from the retrieved claims/techniques alone:
- retrieved_helpful: does the retrieved set actually contain something that helps solve THIS question?
- best_id: the single most relevant retrieved id (or "" if none fits).
- solution_direction: the concrete direction you'd advise the user (2-4 sentences), grounded in the retrieved knowledge.
- follow_up: the one clarifying question you'd ask the user.

Return ONLY: {retrieved_helpful, best_id, solution_direction, follow_up}.`

const graderPrompt = (r, solver) => `Grade a catalog-only assistant's answer to a resolved forum thread.

Read ${ROOT}/catalog/eval_threads.json index ${r}: use \`accepted_answer\` (the GROUND TRUTH resolution), \`retrieved\` (what the assistant had), \`url\`.

The assistant (which saw ONLY the question + retrieved claims) produced:
${JSON.stringify(solver)}

Grade impartially:
- retrieval_relevant: did \`retrieved\` contain at least one claim/technique genuinely on-point for this thread's actual resolution?
- solution_aligned: does the assistant's solution_direction point at the SAME fix as the accepted_answer (even if less detailed)?
- score: 0-5 overall (0 = useless/misleading, 5 = would have solved it).
- note: one line — what it got right/wrong, and (if retrieval_relevant is false) what claim SHOULD have existed.

Return ONLY: {rank:${r}, retrieval_relevant, solution_aligned, score, note}.`

phase('Solve')
const results = await pipeline(
  RANKS,
  (r) => agent(solverPrompt(r), { label: `solve:${r}`, phase: 'Solve', agentType: 'statistician', effort: 'high', schema: SOLVER }),
  (solver, r) => agent(graderPrompt(r, solver), { label: `grade:${r}`, phase: 'Grade', agentType: 'statistician', effort: 'high', schema: GRADER })
)

const ok = results.filter(Boolean)
const rr = ok.filter((g) => g.retrieval_relevant).length
const sa = ok.filter((g) => g.solution_aligned).length
const avg = ok.reduce((s, g) => s + (g.score || 0), 0) / ok.length
log(`eval: retrieval-relevant ${rr}/${ok.length}, solution-aligned ${sa}/${ok.length}, mean score ${avg.toFixed(2)}/5`)
return ok