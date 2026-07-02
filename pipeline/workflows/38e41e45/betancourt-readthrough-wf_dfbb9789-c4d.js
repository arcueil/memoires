export const meta = {
  name: 'betancourt-readthrough',
  description: 'Max-effort first-class distillation of curated Betancourt case studies (full body + figure vision), failure-path + implementation focus',
  phases: [{ title: 'Distill', detail: 'one max-effort statistician agent per case study' }],
}

const STUDIES = [
  { id: 'identifiability', figs: 65 },
  { id: 'modeling_sparsity', figs: 125 },
  { id: 'fitting_the_cauchy', figs: 13 },
  { id: 'underdetermined_linear_regression', figs: 5 },
  { id: 'qr_regression', figs: 7 },
  { id: 'factor_modeling', figs: 250 },
  { id: 'gaussian_processes', figs: 68 },
  { id: 'prior_modeling', figs: 49 },
  { id: 'some_containment_prior_models', figs: 15 },
  { id: 'survival_modeling', figs: 42 },
  { id: 'stochastic_differential_equations', figs: 15 },
  { id: 'taylor_models', figs: 214 },
  { id: 'general_taylor_models', figs: 87 },
  { id: 'variate_covariate_modeling', figs: 107 },
  { id: 'brownian_bridge', figs: 12 },
  { id: 'falling', figs: 33 },
]

const SCHEMA = {
  type: 'object',
  required: ['slug', 'central_insight', 'figures_read', 'confidence'],
  properties: {
    slug: { type: 'string' },
    central_insight: { type: 'string', description: '2-3 sentences: the core failure-path insight' },
    figures_read: { type: 'number' },
    figures_total: { type: 'number' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    software_patterns: { type: 'string', description: 'any implementation/engineering pattern captured, or "none"' },
  },
}

const ROOT = '/home/jp/rekursiv/bayesian-catalog'

function prompt(s) {
  const slug = s.id.replace(/_/g, '-')
  return `Produce a FIRST-CLASS catalog article from Michael Betancourt's "${s.id}" case study for the Bayesian Catalog — an expert-curated, FAILURE-PATH-focused knowledge base. Polished restatement is NOT the goal; capture the MECHANISM, the diagnostics, the geometry, and the exact conditions under which the model/sampler BREAKS. ALSO capture any software/implementation or computational-engineering pattern (custom code, parameterization/reparameterization tricks, numerical pitfalls, what a framework can or cannot do) — the end-product Bayesian consultant must give actionable engineering recommendations, so these patterns are first-class, not an afterthought.

SOURCE (already local — do NOT re-download):
- Body: the "text" field of ${ROOT}/raw/betanalpha/${s.id}.json — read it fully (use python or Read).
- Figures: ${ROOT}/raw/betanalpha/${s.id}_figs/fig000.png … there are ${s.figs} PNGs. READ them with the Read tool — you can see images. Read the DISTINCT data/diagnostic figures (pairs/scatter plots locating divergences, geometry, retrodictive checks, rank/trace plots); SKIP decorative section-divider illustrations (planetary-symbol cards) and near-identical repeats. You need not read every one of ${s.figs}; read enough to capture every distinct insight and failure mode. Track how many you actually read.
- URL: https://betanalpha.github.io/assets/case_studies/${s.id}.html

WRITE a self-contained article (a practitioner shouldn't need to open the source) to ${ROOT}/articles/${slug}.md with this frontmatter + sections:
---
title: <concise>
topic: <slug-ish>
subtopics: [...]
libraries: [stan]
source: betanalpha:${s.id}
source_url: https://betanalpha.github.io/assets/case_studies/${s.id}.html
kind: case-study
tier: first-class
figures_total: ${s.figs}
figures_read: <n>
curation: draft
curator: Junpeng Lao
confidence: <high|medium|low>
last_updated: 2026-06-21
---
## TL;DR
## Mechanism
## When it works vs when it BREAKS (the failure path)   <- the core: regimes, geometry, diagnostics
## Software / implementation notes   <- engineering patterns, numerical pitfalls, parameterization/code tricks, framework limits (write "None notable." only if genuinely absent)
## Key figures   <- cite figNNN.png + one-line finding, especially failure-mode plots
## Recommended approach
## Caveats / open questions
## Source

Be rigorous and specific: name diagnostics (divergences, E-BFMI/E-FMI, R-hat), geometry, parameter regimes; use $...$ for math; quote concrete numbers/artifacts; cite figures as figNNN.png so they're traceable.

Your FINAL MESSAGE is the structured return value (not shown to a human): {slug:"${slug}", central_insight, figures_read, figures_total:${s.figs}, confidence, software_patterns}.`
}

phase('Distill')
const results = await parallel(
  STUDIES.map((s) => () =>
    agent(prompt(s), {
      label: `distill:${s.id}`,
      phase: 'Distill',
      agentType: 'statistician',
      effort: 'max',
      schema: SCHEMA,
    })
  )
)

const ok = results.filter(Boolean)
log(`${ok.length}/${STUDIES.length} articles written`)
return ok