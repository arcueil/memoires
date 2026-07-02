export const meta = {
  name: 'bayesian-consultant-deepen',
  description: 'Ground & develop the Bayesian Agent Consultant brainstorm across the user\'s 4 sharpened answers, using our actual repo material; synthesize a v2 deepening (brainstorm only, no code).',
  phases: [
    { title: 'Ground+Develop', detail: '5 agents: daily-loop, knowledge-graph flywheel, forking-path artifact, cost-optimal search, API-first + templates' },
    { title: 'Synthesize', detail: 'integrate into a v2 deepening for the research doc' },
  ],
}

const CC = '/home/jp/blackjax-devs/claude-config'
const BASE = `${CC}/research/bayesian-agent-consultant.md`
const ROOT = '/home/jp/blackjax-devs'

phase('Ground+Develop')
const dims = [
  {
    label: 'ground:daily-loop',
    p: `Read ${BASE} (the base brainstorm). Then read the statistician workflow IP to ground the user: ${ROOT}/STATISTICIAN_BAYESIAN_WORKFLOW.md and its _ADDENDUM, ${ROOT}/STATISTICIAN_DIAGNOSTICS_RECIPE.md and its _ADDENDUM, and skim ${ROOT}/tuningfork/ (README + top-level structure / what a benchmark run is). ` +
       `The user is a "model builder + Bayesian practitioner who performs tuningfork on the daily." Develop, CONCRETELY and grounded in those files: (1) the actual daily loop of such a practitioner — the real steps (model build → prior pred → fit/warmup → diagnostics → reparametrize/expand → posterior pred → compare), and what "running tuningfork daily" entails (sampler×model benchmarking). (2) EXACTLY where the consultant inserts into that loop — which steps it automates/parallelizes, which stay human-in-the-loop, what the human↔consultant interface looks like for a daily driver (not a one-shot). (3) The mechanical-vs-hard split in that loop (where Feature-1 effort escalation fires). Return a dense, specific markdown section. Quote the workflow files where useful.`,
  },
  {
    label: 'ground:knowledge-graph',
    p: `Read ${BASE}. Then FIND and read whatever exists in the repo about a "Bayesian knowledge graph", "path mapping/exploration", or "knowledge as process / externalized expertise": ${CC}/research/knowledge-as-process.md, ${CC}/research/knowledge-as-process-external.md, ${CC}/research/knowledge-retrieval-eval.md, and grep ${CC}/project/worklog and ${ROOT}/tuningfork ${ROOT}/blackjax for "knowledge graph", "forking path", "path map", "provenance". ` +
       `The user says quality comes from "our Bayesian knowledge graph we are currently building, and path mapping/exploration." Develop: (1) what the knowledge graph IS in our current conception + its actual current state (cite the docs); is there a data model / schema? (2) the path-mapping/exploration concept. (3) THE FLYWHEEL — how the consultant USES the graph for quality (as a search heuristic / prior over good model-development paths) AND how its forking-path output FEEDS BACK to enrich the graph, so quality compounds with daily use. (4) How "knowledge-as-process / externalized expertise" is the theory of this. Be concrete; flag where the graph is aspirational vs built. Dense markdown.`,
  },
  {
    label: 'dev:forking-path-artifact',
    p: `Read ${BASE}. Develop "full forking-path documentation" as a FIRST-CLASS ARTIFACT (the user's win #1): (1) its concrete structure/schema — what a node is (model variant × sampler × parametrization × prior × diagnostic outcome × decision), edges (expand/prune/reparametrize), and the metadata (cost spent, effort level, who-decided-what). (2) How the sagent spawn tree GENERATES it for free (the tree IS the forking path; preemption = pruning edges). (3) Prior art to anchor it: Gelman et al. "Bayesian Workflow" (2020), Gelman & Loken "garden of forking paths" (2013), reproducible-analysis norms. (4) Why it's a MOAT and how it doubles as the knowledge-graph substrate (same object). (5) Reproducibility: can a documented forking path be re-run deterministically? Dense markdown, concrete schema sketch.`,
    effort: 'high',
  },
  {
    label: 'dev:cost-optimal-search',
    p: `Read ${BASE}. Develop "cost-bounded optimal path exploration" (the user's win #2: "optimal with given cost"): frame the model-development tree as a SEARCH problem — best-first / bandit / beam search over (model × sampler × parametrization × prior) under a budget. (1) Operational definition of "optimal given cost" for Bayesian model dev (what's the objective — fastest to clean diagnostics? best ELPD/LOO per dollar? Pareto front of fit-quality vs cost?). (2) How sagent's budget calculation + agent-initiated backend-swap implement "spend reasoning where the search is hard" (escalate thinking/model only on hard branches; cheap parallel sweep otherwise). (3) The critic-as-pruner and the knowledge graph as the search HEURISTIC/prior (steer toward historically-good paths). (4) Concrete: what a budget-bounded run looks like + the stopping rule. Name the real algorithms. Dense markdown.`,
    effort: 'high',
  },
  {
    label: 'dev:api-first-and-templates',
    p: `Read ${BASE}. Also skim ${ROOT}/agent-team (the public framework) and ${CC}/blackjax-profile if present, to ground "the new library should provide very good templates from our learning." Develop: (1) the API-FIRST architecture — WHY the sagent API path (v3) showcases the two unique features (agent-initiated backend swap; arbitrary spawn tree + preemptive peers) cleanly, and WHICH CLI workarounds it drops (reference the materialize / resume-wedge / catalog-timeout saga — all CLI-specific; the API path doesn't rebuild-from-tape, so no re-feed wedge). (2) The BOUNDED TEMPLATES the library ships, distilled from our agent-team learnings: role templates (consultant / sampler-engineer / diagnostician / critic) AND path/recipe templates (the canonical forking-path moves: non-centering, prior-sensitivity sweep, sampler bake-off). (3) What "bounded" buys (reproducibility + budget) vs open-ended trees. Dense markdown.`,
    effort: 'high',
  },
]
const sections = (await parallel(dims.map((d) => () =>
  agent(d.p, { label: d.label, phase: 'Ground+Develop', effort: d.effort })
))).filter(Boolean)

phase('Synthesize')
const v2 = await agent(
  `You are synthesizing a v2 DEEPENING of a brainstorm doc on a "Bayesian Agent Consultant" — a daily driver for a Bayesian practitioner, built API-first on sagent, whose three wins are full forking-path documentation, cost-bounded-optimal exploration, and quality via a Bayesian knowledge graph; bounded templates shipped by a new library. Development is ON HOLD — this is brainstorm, NOT a plan.\n\n` +
  `The unifying thesis to foreground: the consultant is a KNOWLEDGE-GRAPH FLYWHEEL — the forking path is simultaneously the documentation (win 1), the search trace (win 2), and the knowledge-graph input (win 3), so quality compounds with daily use.\n\n` +
  `Five developed sections follow:\n\n` +
  sections.map((s, i) => `===== SECTION ${i + 1} (${dims[i].label}) =====\n${s}`).join('\n\n') +
  `\n\nProduce a single markdown "## v2 deepening (2026-06-20)" addendum for the doc with:\n` +
  `1. **The crystallized thesis** — the flywheel, stated tightly, and how the user's 4 answers collapse into it.\n` +
  `2. **The daily-practitioner framing** — the loop + where the consultant inserts (from section 1).\n` +
  `3. **The forking path as the central object** — its schema + how it unifies the 3 wins (sections 2,3).\n` +
  `4. **Cost-bounded search** — the search framing + budget/backend-swap/critic/graph-heuristic (section 4).\n` +
  `5. **API-first + bounded templates** — architecture + the templates the library ships (section 5).\n` +
  `6. **Sharpened risks/unknowns** — keep the §4.1 pushback that still applies; ADD the new ones these sections surface (esp: is the knowledge graph real or aspirational? can a forking path re-run deterministically? what's the search objective?).\n` +
  `7. **Refined smallest-first slice** — for the daily-practitioner + API-first, scored on tuningfork.\n` +
  `8. **Next open questions** to keep brainstorming.\n\n` +
  `Be dense, specific, intellectually honest (flag where claims are aspirational). Prefer concrete schemas/objectives over hand-waving. This will be appended to the research doc.`,
  { label: 'synthesize-v2', phase: 'Synthesize', effort: 'high' }
)
return v2
