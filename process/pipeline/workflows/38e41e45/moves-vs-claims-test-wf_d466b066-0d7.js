export const meta = {
  name: 'moves-vs-claims-test',
  description: 'Step 4 milestone: on 6 held-out divergence questions, does serving MOVES (the induced move-graph) beat serving CLAIMS (E1) to a Sonnet agent? Frontier judge vs the thread resolution',
  phases: [{ title: 'Solve', detail: 'per case: B-claims vs B-moves (Sonnet)' }, { title: 'Judge', detail: 'which diagnostic plan is better vs the gold' }],
}

const D = "/home/jp/rekursiv/bayesian-catalog/catalog/_intermediate/moves_test"
const SONNET = "sonnet"
const IDX = [0,1,2,3,4,5]

const SOLVE = { type:"object", required:["first_diagnostic","first_solution","key_insight"], properties:{
  first_diagnostic:{type:"string", description:"what you'd check first and why"},
  first_solution:{type:"string"}, key_insight:{type:"string"} } }
const JUDGE = { type:"object", required:["case","winner","moves_score","claims_score","reasoning"], properties:{
  case:{type:"integer"},
  winner:{type:"string", enum:["moves","claims","tie"]},
  moves_score:{type:"integer", description:"0-5: how well B-moves' diagnostic plan matches the thread's actual resolution AND is actionable"},
  claims_score:{type:"integer"},
  moves_gave_a_plan:{type:"boolean", description:"did serving moves yield an ordered diagnostic PLAN (vs a list of facts)?"},
  reasoning:{type:"string"} } }

const results = await pipeline(
  IDX,
  (i) => parallel([
    () => agent(
`You are a Bayesian-modeling expert helping with a real divergence/HMC-geometry question. Read ${D}/case${i}_agent.json — use the \`question\` and the \`claims_served\` (knowledge the catalog retrieved — statements of relevant claims). Give first_diagnostic (what to check first), first_solution, key_insight. Use the served claims if they apply.`,
      { label:`claims:c${i}`, phase:"Solve", schema:SOLVE, model:SONNET }),
    () => agent(
`You are a Bayesian-modeling expert helping with a real divergence/HMC-geometry question. Read ${D}/case${i}_agent.json — use the \`question\` and \`moves_served\`: each is a MOVE the catalog's intuition-engine suggests — an action, what it discriminates, the expected findings under each hypothesis, the resolution it leads to (leaves), and how many expert threads used it (support_threads). Treat them as an ordered diagnostic PLAN: run the highest-support discriminating move first, use its expected_findings to decide the branch. Give first_diagnostic (the first move + why), first_solution, key_insight.`,
      { label:`moves:c${i}`, phase:"Solve", schema:SOLVE, model:SONNET }),
  ]).then(([claims, moves]) => agent(
`Judge a knowledge-format comparison on a real divergence question. Read ${D}/case${i}.json for the \`question\` and \`gold\` (the thread's actual resolution). Both answers are the SAME model (Sonnet); the only difference is what the catalog served:
B-claims (served claim statements): ${JSON.stringify(claims)}
B-moves (served diagnostic moves): ${JSON.stringify(moves)}
Score each 0-5 on how well its first_diagnostic + first_solution match the gold resolution AND give an actionable diagnostic PLAN. Pick the winner. Note whether the moves format yielded an ordered plan vs the claims format yielding facts. Be calibrated — 'tie' if neither is clearly better.`,
    { label:`judge:c${i}`, phase:"Judge", schema:JUDGE }).then(j=>({...j, case:i})))
)

const ok = results.filter(Boolean)
const wins = {moves:0,claims:0,tie:0}; for (const r of ok) wins[r.winner]++
return {
  n: ok.length, winners: wins,
  mean_moves: +(ok.reduce((s,r)=>s+r.moves_score,0)/ok.length).toFixed(2),
  mean_claims: +(ok.reduce((s,r)=>s+r.claims_score,0)/ok.length).toFixed(2),
  per_case: ok.map(r=>({case:r.case, winner:r.winner, moves:r.moves_score, claims:r.claims_score, plan:r.moves_gave_a_plan, why:r.reasoning})),
}
