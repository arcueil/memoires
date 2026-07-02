export const meta = {
  name: 'fix-precise-technical-recs',
  description: 'Systematically validate + surgically fix the 82 precise-technical recs (the error-dense subpopulation: formulas, thresholds, theorems) against source + expert knowledge, returning targeted old→new corrections',
  phases: [{ title: 'Validate', detail: 'one agent per page over its precise-technical recs' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const PAGES = ["CC-convergence-diagnostics","CC-priors-identifiability","hierarchical-multilevel","gaussian-process",
  "spatial-areal","regression","sparse-shrinkage","time-series-state-space","CC-model-evaluation","ode-dynamical",
  "measurement-error-missing","latent-factor","mixture"]
const SCHEMA = {
  type:"object", required:["page","fixes"],
  properties:{ page:{type:"string"},
    fixes:{type:"array", items:{
      type:"object", required:["rid","verdict"],
      properties:{
        rid:{type:"string"},
        verdict:{type:"string", enum:["sound","wrong"]},
        old:{type:"string", description:"for wrong: the EXACT verbatim substring from the rec that is incorrect (copy it character-for-character so it can be string-replaced)"},
        new:{type:"string", description:"for wrong: the corrected replacement text"},
        issue:{type:"string", description:"for wrong: one line on the error"} } } } },
}
const results = await parallel(PAGES.map(pg => () => agent(
`You are a meticulous Bayesian statistician auditing the PRECISE-TECHNICAL recommendations on one catalog page for MATHEMATICAL/STATISTICAL CORRECTNESS. Read ${ROOT}/catalog/_intermediate/precise_recs.json and work ONLY the recs whose "page" == "${pg}". Also open ${ROOT}/dist/target_sample/${pg}.md for full context, and ${ROOT}/dist/pymc_L1/ if a pymc-vetted value helps.

For EACH such rec, scrutinize every precise claim — formulas, numerical thresholds, exponents, rates, probability-theory statements, big-O costs, named theorems — for correctness. These recs are the error-dense class; real errors already found in siblings include: "Laplace has a uniform tail" (it's exponential), "exp(−300)≈0" (underflow is ~exp(−745)), "Geometric((1+δ̄)⁻¹) mean = 1+δ̄⁻¹" (it's 1+δ̄), "not divisible by the period" (must be coprime), "L-BFGS recovers true curvature" (low-rank only), a separate intercept + free μ "works" (it's confounded).

For each rec return verdict sound|wrong. If WRONG: give \`old\` = the EXACT verbatim substring to replace (copy it precisely from the rec, including any unicode/superscripts) and \`new\` = the corrected text; keep the fix minimal and surgical. Do NOT rewrite sound recs. Be rigorous but do not manufacture errors — if a claim is correct, mark sound. Return {page:"${pg}", fixes:[...]}. One-line summary: "${pg}: <n> checked, <n> wrong".`,
  { label:`fix:${pg.slice(0,16)}`, phase:"Validate", schema:SCHEMA }
)))
const all=results.filter(Boolean)
const wrong=all.flatMap(r=>(r.fixes||[]).filter(f=>f.verdict==='wrong'))
return { pages:all.length, wrong:wrong.length, fixes:all }
