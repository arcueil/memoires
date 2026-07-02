export const meta = {
  name: 'frozen-llm-research',
  description: 'Light-medium web research: Dwarkesh "frozen LLM"/continual-learning argument + LeCun dead-end + the technical substance + the external-memory path — grounded in real sources',
  phases: [{ title: 'Research', detail: 'parallel web-grounded angles' }],
}
const SCHEMA = {
  type: "object",
  required: ["angle","key_points","counterpoints","sources","summary"],
  properties: {
    angle: { type: "string" },
    key_points: { type: "array", items: { type: "object", required: ["point","source"], properties: {
      point: { type: "string" }, source: { type: "string", description: "url or 'memory (flag as unverified)'" } } } },
    counterpoints: { type: "array", items: { type: "string" } },
    sources: { type: "array", items: { type: "object", properties: { title: {type:"string"}, url: {type:"string"} } } },
    summary: { type: "string" },
  },
}
const COMMON = "Use WebSearch + WebFetch to ground every claim in a real source (fetch the actual page; quote/paraphrase faithfully). The triggering source is a Dwarkesh Patel podcast (youtube.com/watch?v=20p5-kQXF_Q, ~mid-2025+). If a claim can't be web-verified, mark its source as 'memory (unverified)'. Be accurate about what these people actually argue — do not strawman or invent positions.";

const angles = [
 ["Dwarkesh frozen-LLM / continual-learning", `${COMMON}
ANGLE: Dwarkesh Patel's argument that LLMs are "frozen". Find and read his actual writing/talks (his blog post "Why I don't think AGI is right around the corner" / the 2025 podcast). Capture precisely: the static-weights claim; "gradient descent is brutally sample-inefficient so one session can't generate enough to train on"; "in-context learning is sample-efficient but lives in the activations and evaporates when the session ends"; the trilemma that every unfreezing mechanism is either too data-hungry (SFT/RL) or too ephemeral (context); what he thinks is needed (continual / on-the-job learning). Get his exact framing + any concrete examples he uses.`],
 ["LeCun LLMs-are-a-dead-end", `${COMMON}
ANGLE: Yann LeCun's long-running argument that autoregressive LLMs are a dead-end for AGI. Capture: why (no world model, no planning, no persistent memory, error accumulation in autoregression, can't do System-2); his proposed alternative (JEPA / world models / energy-based, objective-driven AI); his recent (2024-2026) statements. Distinguish his argument from Dwarkesh's — they overlap but aren't identical.`],
 ["technical substance + counterarguments", `${COMMON}
ANGLE: the technical claims, steelmanned AND challenged. (1) Is gradient descent really sample-inefficient vs in-context learning? (2) ICL-as-implicit-finetuning (von Oswald 2022 "Transformers learn in-context by gradient descent", Dai 2022) — what it does/doesn't show. (3) Continual learning / catastrophic forgetting — why folding session-learning into weights is hard. (4) Test-time training / TTT, test-time RL, and recent "continual learning" attempts (2024-2026) — do they crack the frozen problem? (5) Bayesian framing of ICL (Xie et al. "ICL implicitly does Bayesian inference"). Report the strongest counterarguments to "LLMs are permanently frozen".`],
 ["the external-memory / structured-knowledge path", `${COMMON}
ANGLE: the "give the model persistent external knowledge" path as a response to the frozen-weights problem. Cover: RAG, agent memory architectures (CoALA's declarative/procedural memory split, MemGPT, Voyager's skill library, Memp, A-MEM, Generative Agents), and the distinction between knowledge-in-weights vs knowledge-in-an-external-store the agent reads. Is external structured memory a genuine "fourth option" beyond Dwarkesh's trilemma (weights-SFT/RL vs ephemeral-context), or is it just a flavor of "ephemeral context"? What does the literature say about persistent + procedural (not just declarative) external memory?`],
];
const results = await parallel(angles.map(([a, p]) => () => agent(p, { label: `res:${a.slice(0,22)}`, phase: "Research", schema: SCHEMA })));
return { research: results.filter(Boolean) };
