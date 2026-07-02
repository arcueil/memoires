export const meta = {
  name: 'phase1-channel-reconcile-spec',
  description: 'Verified reconciliation spec + exhaustive learning-derived test matrix for relocating the sagent channel into claude-config against the maintainer\'s reworked API',
  phases: [
    { title: 'Reconcile', detail: 'file-by-file deltas + new sagent API contract + survivors audit' },
    { title: 'TestMatrix', detail: 'concrete tests per learning cluster, adversarial applicability' },
    { title: 'Synthesize', detail: 'merge into one spec + adversarial completeness critic' },
  ],
}

const WT = '/home/jp/rekursiv/sagent-pr'
const JOSH = 'origin/pr/anthropic-cli-sessions'   // head 81226b7 — the reconciliation base (his simplified version)
const MINE = '703fdaf'                              // my version (materializer/urgent) — for diffing what was removed
const EX = 'examples/blackjax-ai-devs-channel'
const DEST = '/home/jp/blackjax-devs/claude-config/sagent-channel'
const DATA = '/home/jp/blackjax-devs/claude-config/experimental/sagent'

const COMMON = `You are a READ-ONLY analyst. Repo worktree: ${WT} (a git worktree). The maintainer's reworked channel + sagent live at git ref ${JOSH}; my older version is ${MINE}; current upstream is upstream/main. Read the maintainer's files with: git -C ${WT} show ${JOSH}:<path>  and diff what changed with: git -C ${WT} diff ${MINE} ${JOSH} -- <path>. The channel example is at ${EX}/. It will be relocated to ${DEST}/ (a NEW dir in the claude-config git repo), with runtime data staying at ${DATA} via SAGENT_DATA_DIR. Do NOT edit anything; produce analysis only.`

const RECON_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['area', 'keep', 'remove', 'rewrite', 'host_calls', 'files', 'risks'],
  properties: {
    area: { type: 'string' },
    keep: { type: 'array', items: { type: 'string' }, description: 'behaviors/code in the maintainer version to preserve verbatim in the relocated copy' },
    remove: { type: 'array', items: { type: 'string' }, description: 'things present in MY version that are gone in the maintainer version and must NOT be carried over' },
    rewrite: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['what','detail'], properties: { what: { type: 'string' }, detail: { type: 'string' } } }, description: 'edits needed for the claude-config relocation (paths, env, deps)' },
    host_calls: { type: 'array', items: { type: 'string' }, description: 'exact sagent API calls the host serve.py must make (signatures)' },
    files: { type: 'array', items: { type: 'string' } },
    risks: { type: 'array', items: { type: 'string' } },
  },
}

const API_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['symbols', 'removed', 'survivors'],
  properties: {
    symbols: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['name','signature','semantics','host_usage'], properties: { name: {type:'string'}, signature: {type:'string'}, semantics: {type:'string'}, host_usage: {type:'string'} } } },
    removed: { type: 'array', items: { type: 'string' }, description: 'public API I relied on that the maintainer removed (e.g. seed_session, session_id, urgent, preempt_in_flight)' },
    survivors: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['hardening','present','evidence'], properties: { hardening: {type:'string'}, present: {type:'boolean'}, evidence: {type:'string'} } }, description: 'for each hardening from our arc, is it still in the maintainer anthropic_cli.py?' },
  },
}

const TEST_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['cluster', 'tests'],
  properties: {
    cluster: { type: 'string' },
    tests: { type: 'array', items: { type: 'object', additionalProperties: false,
      required: ['id','learning','applies','rationale','setup','steps','expected','failure_signal','severity'],
      properties: {
        id: { type: 'string' },
        learning: { type: 'string', description: 'the failure mode / lesson this test exercises' },
        applies: { type: 'boolean', description: 'does this risk STILL apply under the maintainer reworked API? (adversarially decided)' },
        rationale: { type: 'string', description: 'why it applies or was eliminated by the rework' },
        setup: { type: 'string' },
        steps: { type: 'string', description: 'concrete commands / probes / UI actions' },
        expected: { type: 'string' },
        failure_signal: { type: 'string', description: 'what a regression looks like' },
        severity: { type: 'string', enum: ['blocker','high','medium','low'] },
      } } },
  },
}

// ---- Phase 1: Reconcile (parallel) ----
phase('Reconcile')
const recon = await parallel([
  () => agent(`${COMMON}\n\nTASK: Reconcile the host server glue (bin/serve.py + bin/merge_jsonl.py) for the relocation. Diff ${MINE}..${JOSH} for ${EX}/bin/serve.py. The maintainer replaced my _rehydrate_agents_from_jsonl + _run_materializer_tripwire with _resume_agents_from_session_dir (load_session + Agent.resume per role, using each role's session_dir). Determine EXACTLY: what boot/registry/HTTP/warmup/resume code the relocated serve.py must keep verbatim from the ${JOSH} version; what materializer/tripwire/urgent code from MY version must NOT be carried; what must be rewritten for living in ${DEST} (the _PLUGIN_DIR self-anchor, SAGENT_DATA_DIR default, SAGENT_WEB_DIR, absolute-path assumptions, the session_dir wiring under SAGENT_DATA_DIR/sessions/<role>/, cwd-launch requirements). Quote the _resume_agents_from_session_dir body and the route table. Return the RECON object.`, { label: 'recon:serve', phase: 'Reconcile', schema: RECON_SCHEMA }),
  () => agent(`${COMMON}\n\nTASK: Reconcile roles/common.py + mcp_sagent/delivery.py + mcp_sagent/server.py + sandboxed_tools.py + roles/*.py for the relocation. Diff ${MINE}..${JOSH} for ${EX}/roles/common.py and ${EX}/mcp_sagent/delivery.py. Determine EXACTLY: how build_agent now wires session_dir + the per-role model map (still MODEL_OPUS/SONNET/HAIKU/FABLE? did the maintainer change defaults?); how urgent= was removed from delivery.py /api/post and what operator-message semantics remain (queue vs preempt); whether Model.close() must be called on shutdown and where; the statistician sandbox wiring (the 5-level _monorepo_root walk + tuningfork/experiments — note it but DO NOT generalize, that's Phase 2). Return the RECON object for these files.`, { label: 'recon:roles', phase: 'Reconcile', schema: RECON_SCHEMA }),
  () => agent(`${COMMON}\n\nTASK: Produce the new sagent API CONTRACT the host depends on, and audit survivors. Read on ${JOSH}: sagent/agent/agent.py (Agent.resume, session_dir, clear), sagent/agent/session_io.py (load_session, save_session), sagent/types/model.py (Model.close contract), sagent/providers/anthropic_cli.py (session handling). 1) Give exact signatures + semantics for: Agent(session_dir=...), Agent.resume(...), load_session(...), Model.close(), Agent.clear(). 2) List the public API I relied on that is REMOVED (seed_session, session_id property, UserMessage.urgent, AgentSendMessage.urgent, preempt_in_flight, cancel_in_flight, the anthropic_cli_session package). 3) SURVIVORS AUDIT — for EACH of these hardenings from our arc, is it still present in the ${JOSH} sagent/providers/anthropic_cli.py (grep + cite line): (a) signature_delta capture on thinking blocks; (b) per-request usage normalization (last-round message_start, not cumulative — the 5.6M compaction-over-trigger fix); (c) --disallowedTools SendMessage deny; (d) Subproc stream_limit 16 MiB; (e) subprocess_read_timeout_sec kwarg for long tool calls; (f) cwd-aware resume-vs-mint session probe. Return the API object.`, { label: 'recon:api', phase: 'Reconcile', schema: API_SCHEMA }),
])

const reconText = JSON.stringify(recon.filter(Boolean), null, 1)

// ---- Phase 2: TestMatrix (parallel per cluster) ----
phase('TestMatrix')
const LEARNINGS = `Failure modes / lessons accumulated across the multi-day arc (the channel must be tested against ALL still-applicable ones). Lessons live at /home/jp/blackjax-devs/claude-config/project/worklog/lessons/tool-harness/ (read them for detail):
- RESUME/RESTART: resume-from-memory after serve.py restart (now via session_dir/load_session/Agent.resume, NOT my materializer); CROSS-MODEL resume (a role resumed under a DIFFERENT model over its prior tape — opus<->fable proven live); cwd footgun (claude session JSONL path is encoded-cwd; launch from the right cwd or resume silently misses); resume-vs-mint probe bug (globbing across project dirs matched another deployment's uuid -> 'No conversation found' wedge — fixed cwd-aware).
- INTERRUPT: graceful mid-turn preempt+redirect (my urgent/preempt_in_flight) was REMOVED by the maintainer; only Agent.clear() (hard wipe+preempt via /api/restart) remains; operator messages now queue. Test what interrupt actually does now.
- RELIABILITY: subscription 429 session-limit wedges agents in error state past quota reset (not retryable; defers consumed by dying turns) [claude-session-limit-429-wedges-agents.md]; one agent's spawns instant-die 'stdout closed before result' from a dead/unhealthy per-model MCP bridge, never health-checked [spawn-instant-death-diagnosis.md]; the maintainer just added an MCP-connect race fix (81226b7) + detached-tool drain (f5f7b5b) — verify these; long synchronous tool calls (pre-commit/ty) exceeding 60s read-timeout -> divergence cascade (subprocess_read_timeout_sec lever); warmup must reach 5/5 ready (first-turn MCP fumble otherwise); Model.close() on shutdown must leave NO leaked claude subprocesses; SendMessage built-in routes to an empty registry -> silent message loss (deny).
- CORRECTNESS/WIRE: unsigned thinking blocks -> HTTP 400 thinking.signature on the stdin re-feed (signature_delta capture); role-alternation InvalidPayloadError on compaction (now upstream coalesce_roles); compaction over-trigger from cumulative usage reading 5.6M (usage normalization); UI/web hot-reload (edit web/index.html, change shows without restart); stale launch path / README correctness.`

const CLUSTERS = [
  { key: 'resume-restart', focus: 'resume-from-session_dir after restart, cross-model resume, cwd footgun, resume-vs-mint probe' },
  { key: 'interrupt', focus: 'what interrupt survives (Agent.clear hard-preempt via /api/restart vs the removed graceful redirect), operator-message queue semantics, mid-turn behavior' },
  { key: 'reliability', focus: '429 quota-wedge recovery, MCP bridge health / spawn-instant-death, MCP-connect race (new fix), detached-tool drain (new), long-tool read-timeout, warmup 5/5, Model.close no leaked procs' },
  { key: 'correctness-wire', focus: 'signature_delta signed-thinking on re-feed, role-alternation/compaction (coalesce_roles), compaction over-trigger (usage normalization), SendMessage deny, UI hot-reload' },
]

const matrices = await parallel(CLUSTERS.map(c => () =>
  agent(`${COMMON}\n\nYou design CONCRETE, EXECUTABLE channel tests for ONE cluster: "${c.key}" — focus: ${c.focus}.\n\nFull learnings catalog for reference:\n${LEARNINGS}\n\nReconciliation findings so far (the new API + what was removed):\n${reconText}\n\nFor EVERY learning in your cluster: (1) adversarially decide if the risk STILL APPLIES under the maintainer's reworked API (read the ${JOSH} code to justify — e.g. does removing the materializer eliminate the cwd-probe bug? does coalesce_roles eliminate the role-alternation wedge? is signature_delta still needed when resume re-feeds via stdin?); (2) write a concrete test — setup, exact steps (commands / curl /api/post / web edit / restart sequence / synthetic trace injection), expected result, and the failure_signal of a regression; (3) severity. Prefer tests runnable against a LIVE channel on a scratch port + scratch SAGENT_DATA_DIR (cheap model where turns cost money; note where a real model turn is unavoidable). Mark applies=false (with rationale) for risks the rework genuinely eliminated — do NOT invent tests for removed behavior. Return the TEST object for cluster "${c.key}".`,
    { label: `tests:${c.key}`, phase: 'TestMatrix', schema: TEST_SCHEMA })
))

const matrixText = JSON.stringify(matrices.filter(Boolean), null, 1)

// ---- Phase 3: Synthesize + adversarial completeness critic ----
phase('Synthesize')
const critique = await agent(`${COMMON}\n\nADVERSARIAL COMPLETENESS CRITIC. Below are (A) the reconciliation findings and (B) the test matrix produced by other analysts.\n\nRECON:\n${reconText}\n\nTEST MATRIX:\n${matrixText}\n\nFind the GAPS: (1) anything in the maintainer's example/serve.py/common.py delta (${MINE}..${JOSH}) that the reconciliation MISSED and the relocated copy would get wrong; (2) any learning from the catalog that has NO test or is mis-marked applies=true/false; (3) any test that asserts a behavior the maintainer REMOVED (a false test that would fail by design); (4) any ordering/dependency between tests (e.g. resume test must precede interrupt test). Be specific with file:line where possible. Read the actual ${JOSH} code to verify your claims — do not speculate.`, { label: 'critic', phase: 'Synthesize', effort: 'high' })

const spec = await agent(`${COMMON}\n\nSYNTHESIZER. Produce the FINAL Phase-1 execution spec as clean markdown, ready for an engineer to execute. Inputs:\n\nRECON:\n${reconText}\n\nTEST MATRIX:\n${matrixText}\n\nCOMPLETENESS CRITIQUE (incorporate its fixes):\n${critique}\n\nOutput exactly these sections:\n1. RELOCATION STEPS — ordered, file-by-file: what to copy from ${JOSH}:${EX} into ${DEST}, what to strip, what to rewrite (paths/env/deps/pyproject sagent pin), the session_dir wiring, Model.close shutdown. Concrete enough to execute.\n2. NEW API the host calls — the exact signatures (Agent(session_dir), resume, load_session, Model.close, clear) + the removed API to scrub.\n3. SURVIVORS — table of the 6 hardenings (signature_delta, usage-normalization, SendMessage-deny, stream_limit, read-timeout, cwd-aware-probe): present? if any are GONE in the maintainer version, flag as a regression risk for the channel.\n4. TEST MATRIX — the full ordered list of applies=true tests, grouped by cluster, each with id / setup / steps / expected / failure_signal / severity. Drop applies=false ones into a short 'eliminated by rework (no test needed)' appendix with rationale.\n5. OPEN RISKS & DECISIONS — interrupt-semantics decision, any survivor regressions, sagent dependency pin, anything needing operator input.\nBe complete and exact; this drives the implementation + live validation.`, { label: 'synth', phase: 'Synthesize', effort: 'high' })

return { spec, critique }