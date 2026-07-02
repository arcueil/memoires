export const meta = {
  name: 'intuition-engine-research',
  description: 'Research how to represent/teach temporal/procedural "intuition" knowledge (how-to-investigate) to LLM agents, vs atomic facts — six conceptual anchors, web-grounded',
  phases: [{ title: 'Research', detail: 'one agent per anchor: key ideas + sources + actionable takeaway for the catalog' }],
}

const ANCHORS = [
  { key: "naturalistic-decision-making", q: "How do human EXPERTS actually make decisions under uncertainty and time pressure — Recognition-Primed Decision making (Gary Klein), naturalistic decision making, fast-and-frugal heuristics (Gigerenzer), and medical 'illness scripts' / diagnostic schemas. The CONTRAST that matters: recognitional/intuitive path-finding (recognize situation -> simulate the single most-promising action -> revise) vs compensatory/exhaustive analysis (enumerate and score all options/diagnostics). Why exhaustive checklists fail to capture expertise." },
  { key: "icl-as-implicit-finetuning", q: "Is IN-CONTEXT LEARNING a substitute for fine-tuning / reinforcement learning? Evidence that in-context learning approximates gradient descent or meta-learning (von Oswald et al., Dai et al. 'Why Can GPT Learn In-Context'), 'task vectors' / function vectors, activation steering, in-context reinforcement learning (Algorithm Distillation), and the broader claim: can you install/customize a foundation model's behavior (a 'policy' or 'way of thinking') via retrieved context instead of weight updates? Limits and failure modes." },
  { key: "process-supervision", q: "Process supervision and process reward models for LLM reasoning: 'Let's Verify Step by Step' (OpenAI), process reward models vs outcome reward models, reasoning-trace distillation, behavioral cloning of expert reasoning traces, and the idea of teaching/rewarding the PATH (sequence of reasoning steps) rather than the final answer. How is a good reasoning PROCESS represented and transferred?" },
  { key: "procedural-knowledge-agents", q: "Procedural / 'how-to' knowledge representation for LLM agents (vs declarative facts): skill libraries that grow and compose (Voyager), case-based reasoning for LLMs, agentic memory architectures (MemGPT, Generative Agents, A-MEM, reflection), and Standard-Operating-Procedure / playbook-driven agents (MetaGPT SOPs). How do these encode reusable PROCEDURES and when-to-apply triggers?" },
  { key: "diagnostic-reasoning-representation", q: "How do expert fields ENCODE 'how to investigate' knowledge for reuse: differential diagnosis and clinical decision support systems, diagnostic decision trees / flowcharts, troubleshooting runbooks and decision-flows (SRE/ops), and 'cognitive task analysis'. What are the representations (decision graphs, scripts, schemas) that capture symptom -> hypotheses -> discriminating test -> branch, and how is the most-informative next test chosen (value of information)?" },
  { key: "process-knowledge-graphs", q: "Representing PROCESS/temporal knowledge as a graph for retrieval and reasoning: knowledge graphs with typed reasoning edges (precondition-of, discriminates, refutes, refines, escalates-to), GraphRAG and reasoning-path retrieval over graphs, hierarchical task networks (HTN), and 'workflow/procedure graphs'. How to represent and RETRIEVE the connective tissue (which node leads to which, and under what condition) — not just the nodes." },
]

const SCHEMA = {
  type: "object",
  required: ["anchor","core_ideas","key_sources","actionable_for_intuition_engine","sharpest_insight"],
  properties: {
    anchor: { type: "string" },
    core_ideas: { type: "array", items: { type: "string" }, description: "the 3-6 load-bearing ideas, each one sentence" },
    key_sources: { type: "array", items: { type: "object", properties: { title: {type:"string"}, who_year: {type:"string"}, url: {type:"string"}, why: {type:"string"} } }, description: "5-8 seminal + recent (2023-2025) sources with URLs" },
    actionable_for_intuition_engine: { type: "array", items: { type: "string" }, description: "concrete takeaways for building a layer that teaches an LLM agent HOW to investigate a Bayesian-modeling problem (temporal/process knowledge), not atomic facts" },
    sharpest_insight: { type: "string", description: "the single most useful or surprising thing for our specific goal" },
  },
}

const results = await parallel(ANCHORS.map(a => () => agent(
`You are a research analyst. Use web search + fetch real sources (cite URLs). Research this question thoroughly and return structured notes:

${a.q}

We are building an "intuition engine": a knowledge layer (served via an MCP server to specialized LLM agents) that teaches an agent HOW to investigate a Bayesian-modeling question — the temporal/procedural "best path" of expert reasoning — rather than serving atomic facts (single answer to a question). We currently represent knowledge as atomic CLAIMS (one nuanced idea each) and TECHNIQUES, and we've found this insufficient: agents need to know how the nodes CONNECT and which path to take. Frame every takeaway toward that goal. Prefer primary sources and recent (2023-2025) work; verify claims against the actual sources, don't hallucinate citations.`,
  { label: `research:${a.key}`, phase: 'Research', schema: SCHEMA }
)))

return { anchors: results.filter(Boolean) }
