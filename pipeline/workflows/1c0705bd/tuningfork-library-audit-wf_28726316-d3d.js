export const meta = {
  name: 'tuningfork-library-audit',
  description: 'Full-library audit of tuningfork against lightweight-wrapper + logic-free-codegen principles; report only, no edits',
  phases: [
    { title: 'Audit', detail: 'parallel per-subsystem auditors' },
    { title: 'Verify', detail: 'adversarially verify top refactor claims' },
    { title: 'Synthesize', detail: 'single prioritized refactor proposal' },
  ],
}

const REPO = '/home/jp/blackjax-devs/tuningfork'

const PRINCIPLE = `tuningfork is meant to be a LIGHTWEIGHT wrapper over the BlackJAX top-level API.
GOVERNING DESIGN PRINCIPLES to evaluate everything against:
1. emit_recipe / the codegen must RESOLVE all routing and branching AT GENERATION TIME, and emit straight-line BlackJAX "glue" code with MINIMAL if/elif/else in the OUTPUT snippet. Any conditional logic that ships in the EMITTED output (rather than being resolved at emit time) is a DEFECT to flag.
2. The bulk of the code should be MODEL definitions + DIAGNOSIS, NOT codegen/runner plumbing.
3. Wrapper layers should thinly pass through to the BlackJAX top-level API, not reimplement or branch over BlackJAX internals.
4. Repetition/duplication (e.g., parallel MCMC vs SMC stacks) is bloat to consolidate.
Recon already done: tuningfork = 29.2k LOC. recipes/ 8142 (recipes/_recipe_runner.py 2824 LOC with ~159 if/elif/else; recipes/_emit_script.py 653), warmup/ 3807, base_method/ 3722, calibration/ 3011, model/ 2956, catalog/ 2672, smc/ 1688, metrics/ 574.
Use your Read/Grep/Bash tools to read the actual files under ${REPO}/tuningfork. Quote file:line. Do NOT edit any files — analysis only.`

const MODULES = [
  { key: 'codegen-emit', label: 'recipe codegen / emit path', files: 'recipes/_emit_script.py, recipes/_templates/, and the emit-producing parts of recipes/_recipe_runner.py. CENTRAL QUESTION: does the EMITTED output contain if/else, or is routing resolved at emit time?' },
  { key: 'recipe-runner', label: 'recipe runner harness', files: 'recipes/_recipe_runner.py (orchestration/harness), recipes/_sweep_runner.py, recipes/sequential_run_recipe_pipeline.py, recipes/_generate_starter.py, recipes/_generate_groundtruth.py' },
  { key: 'smc-vs-mcmc', label: 'SMC stack & MCMC/SMC duplication', files: 'smc/, recipes/_smc_runner.py, recipes/_base_smc.py compared against recipes/_base.py and recipes/_recipe_runner.py. Quantify duplicated logic; what unifies into a shared core?' },
  { key: 'wrapper-thinness', label: 'wrapper thinness over BlackJAX', files: 'base_method/, warmup/. Is each a thin pass-through to the BlackJAX top-level API, or does it reimplement/branch over internals?' },
  { key: 'model-diagnosis', label: 'model + diagnosis (intended bulk)', files: 'model/, calibration/, metrics/. Confirm these are the healthy bulk; flag any bloat, dead code, or branchiness that does not belong here.' },
  { key: 'catalog-cli', label: 'catalog / cli / inspect', files: 'catalog/ (diagnostics.py, inspect.py, notebooks/catalog_explorer.py), cli.py, _cache_io.py, runner/. Branchiness and duplication.' },
]

const AUDIT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    module: { type: 'string' },
    summary: { type: 'string', description: 'overall health of this subsystem vs the principles' },
    findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          category: { type: 'string', enum: ['branchiness-in-emitted-output', 'branchiness-in-harness', 'duplication', 'bloat-dead-code', 'wrapper-reimplementation', 'healthy'] },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          location: { type: 'string', description: 'file:line or file' },
          description: { type: 'string' },
        },
        required: ['category', 'severity', 'location', 'description'],
      },
    },
    refactor_opportunities: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          title: { type: 'string' },
          what: { type: 'string', description: 'concrete change' },
          loc_delta: { type: 'number', description: 'estimated net LOC change, negative = reduction' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          risk: { type: 'string', enum: ['low', 'medium', 'high'] },
          principle: { type: 'string', description: 'which governing principle it serves' },
        },
        required: ['title', 'what', 'loc_delta', 'severity', 'risk', 'principle'],
      },
    },
  },
  required: ['module', 'summary', 'findings', 'refactor_opportunities'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    holds: { type: 'boolean', description: 'does the refactor claim survive scrutiny against the real code?' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    reasoning: { type: 'string' },
    caveats: { type: 'string', description: 'risks, dependencies, what could break' },
    revised_loc_delta: { type: 'number' },
  },
  required: ['holds', 'confidence', 'reasoning', 'caveats'],
}

phase('Audit')
const audits = (await parallel(MODULES.map(m => () =>
  agent(
    `${PRINCIPLE}\n\n=== YOUR SUBSYSTEM: ${m.label} ===\nFiles in scope: ${m.files}\n\nRead the actual code, then return structured findings. Be thorough and cross-file; do not stop at the first plausible file. Set module="${m.key}".`,
    { label: `audit:${m.key}`, phase: 'Audit', schema: AUDIT_SCHEMA }
  )
))).filter(Boolean)

const sevRank = { high: 3, medium: 2, low: 1 }
const opps = audits.flatMap(a => (a.refactor_opportunities || []).map(o => ({ ...o, module: a.module })))
const ranked = opps.slice().sort((x, y) =>
  (sevRank[y.severity] - sevRank[x.severity]) || (Math.abs(y.loc_delta) - Math.abs(x.loc_delta))
)
const toVerify = ranked.slice(0, 16)
log(`Audit complete: ${audits.length} subsystems, ${opps.length} refactor opportunities; verifying top ${toVerify.length}`)

phase('Verify')
const verified = (await parallel(toVerify.map(o => () =>
  agent(
    `${PRINCIPLE}\n\nAdversarially VERIFY this proposed refactor against the real code in ${REPO}/tuningfork. Try hard to REFUTE it — read the relevant files and check for hidden dependencies, callers, or correctness reasons it cannot be done as stated. Default to holds=false if uncertain.\n\nMODULE: ${o.module}\nTITLE: ${o.title}\nPROPOSED CHANGE: ${o.what}\nCLAIMED LOC DELTA: ${o.loc_delta}\nCLAIMED RISK: ${o.risk}\nPRINCIPLE SERVED: ${o.principle}`,
    { label: `verify:${o.module}:${o.title.slice(0, 30)}`, phase: 'Verify', schema: VERDICT_SCHEMA }
  ).then(v => ({ ...o, verdict: v }))
))).filter(Boolean)

const confirmed = verified.filter(o => o.verdict && o.verdict.holds)
log(`Verified ${verified.length}; ${confirmed.length} opportunities survived scrutiny`)

phase('Synthesize')
const report = await agent(
  `${PRINCIPLE}\n\nYou are writing the FINAL audit report for the tech lead. Synthesize the per-subsystem audits and the verified refactor opportunities into ONE coherent, prioritized refactor proposal in Markdown.\n\nStructure:\n# tuningfork library audit — findings & refactor proposal\n## Executive summary (3-6 bullets: how far has the library drifted from the north star; biggest wins)\n## Health by subsystem (one short para each; call out which are healthy bulk vs bloat)\n## Findings by principle\n  - P1 emitted-output branchiness (the central concern): what ships logic in emitted code, with file:line\n  - P2 codegen/runner bloat vs model+diagnosis balance\n  - P3 wrapper-thinness violations\n  - P4 MCMC/SMC duplication\n## Prioritized refactor plan (a numbered, sequenced list; for each: change, est LOC delta, risk, principle, and whether it survived adversarial verification)\n## Estimated total LOC reduction and a suggested sequencing (what to do first, dependencies)\n## Open questions / risks for the TL+user to decide\n\nGround every claim in file:line where possible. Distinguish VERIFIED opportunities (survived scrutiny) from unverified.\n\n=== PER-SUBSYSTEM AUDITS ===\n${JSON.stringify(audits)}\n\n=== VERIFIED OPPORTUNITIES (with verdicts) ===\n${JSON.stringify(verified)}`,
  { label: 'synthesize-report', phase: 'Synthesize' }
)

return {
  report,
  subsystems_audited: audits.length,
  total_opportunities: opps.length,
  verified: verified.length,
  confirmed: confirmed.length,
}
