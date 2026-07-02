export const meta = {
  name: 'pymc-skills-crosscompare',
  description: 'Cross-compare the pymc-labs human-curated modeling skills against our catalog, per file: classify each knowledge unit covered/new/enriches/contradicts and propose incorporation into claim/rec/technique/move',
  phases: [{ title: 'Compare', detail: 'one agent per pymc reference file → our mapped catalog page(s)' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const SRC = "/tmp/claude-1000/-home-jp-blackjax-devs/38e41e45-dc96-450d-83aa-043e64cfaf75/scratchpad/python-analytics-skills"
const MAP = [
  {f:'skills/pymc-modeling/references/priors.md', pages:['CC-priors-identifiability']},
  {f:'skills/pymc-modeling/references/gp.md', pages:['gaussian-process']},
  {f:'skills/pymc-modeling/references/mixtures.md', pages:['mixture']},
  {f:'skills/pymc-modeling/references/timeseries.md', pages:['time-series-state-space']},
  {f:'skills/pymc-modeling/references/diagnostics.md', pages:['CC-convergence-diagnostics']},
  {f:'skills/pymc-modeling/references/troubleshooting.md', pages:['CC-geometry-sampling','CC-convergence-diagnostics']},
  {f:'skills/pymc-modeling/references/inference.md', pages:['CC-geometry-sampling'], hint:'samplers/backends — much is library-specific'},
  {f:'skills/pymc-modeling/references/workflow.md', pages:['CC-model-evaluation'], hint:'iterative build→check→expand — a flagged GAP in our GAPS.md'},
  {f:'skills/pymc-modeling/references/causal.md', pages:['regression'], hint:'causal identification — partial GAP; maps to super-axiom SA2'},
  {f:'skills/pymc-modeling/references/custom_models.md', pages:['CC-geometry-sampling'], hint:'implementation/library layer'},
  {f:'skills/pymc-modeling/references/bart.md', pages:[], hint:'BART — likely a NEW model class we lack'},
  {f:'skills/pymc-modeling/references/specialized_likelihoods.md', pages:['measurement-error-missing']},
  {f:'skills/pymc-modeling/references/arviz.md', pages:['CC-model-evaluation'], hint:'tooling/library layer'},
  {f:'skills/model-evaluation/SKILL.md', pages:['CC-model-evaluation']},
  {f:'skills/prior-elicitation/SKILL.md', pages:['CC-priors-identifiability'], hint:'prior elicitation from substance — a flagged GAP in our GAPS.md'},
]
const SCHEMA = {
  type:"object", required:["file","overlap_pct","findings"],
  properties:{
    file:{type:"string"},
    overlap_pct:{type:"integer", description:"rough % of this file's knowledge already in our catalog"},
    findings:{type:"array", items:{
      type:"object", required:["topic","classification","layer","proposal"],
      properties:{
        topic:{type:"string"},
        classification:{type:"string", enum:["covered","new","enriches","contradicts"]},
        layer:{type:"string", enum:["super-axiom","claim","rec","technique","move","library-note","none"]},
        proposal:{type:"string", description:"for new/enriches/contradicts: the draft entry or the specific edit; for contradicts: what they say vs what we say"},
        pymc_specific:{type:"boolean", description:"true if it's PyMC-API/tooling (→ technique/library), false if a portable statistical principle"} } } } },
}
const results = await parallel(MAP.map(m => () => agent(
`Cross-compare one human-curated pymc-labs skill file against our distilled catalog, and propose what to incorporate.

READ: (1) the pymc skill file: ${SRC}/${m.f}  ${m.hint?('[hint: '+m.hint+']'):''}
      (2) our corresponding catalog page(s): ${m.pages.length?m.pages.map(p=>`${ROOT}/dist/target_sample/${p}.md`).join(', '):'(none — we may lack this area entirely)'}
      (3) if useful, our gap list ${ROOT}/dist/GAPS.md.

For each substantive knowledge unit in the pymc file, classify vs our catalog:
- **covered** — we already have this principle (even if worded differently). Do NOT propose; just count it.
- **new** — a portable statistical principle or a model/method we lack → propose a claim (if abstract) or rec (if model/setup-specific).
- **enriches** — we have the principle but they add real nuance, a PyMC-specific *how*, an API, or a threshold → propose a technique / move / library-note (set pymc_specific=true when it's PyMC API/tooling, not portable stats).
- **contradicts** — they disagree with one of our claims/recs → flag it precisely (what they say vs what we say). HIGH VALUE: this is an external expert check on us.

IMPORTANT: the domain is semantically homogeneous, so 'sounds similar' ≠ 'covered'. Judge by whether the SPECIFIC mechanism / method / API / threshold is actually present in our catalog. Be honest about overlap_pct. Only propose for new/enriches/contradicts (skip covered). Keep proposals concrete and short (a draftable entry or a one-line edit). Return {file, overlap_pct, findings:[...]}. One-line summary.`,
  { label:`cmp:${m.f.split('/').pop().replace('.md','')}`, phase:"Compare", schema:SCHEMA }
)))
const all=results.filter(Boolean)
const flat=all.flatMap(r=>r.findings||[])
return { files:all.length, findings:flat.length,
  new:flat.filter(f=>f.classification==='new').length,
  enriches:flat.filter(f=>f.classification==='enriches').length,
  contradicts:flat.filter(f=>f.classification==='contradicts').length,
  results:all }
