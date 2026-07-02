export const meta = {
  name: 'materializer-integration-spec',
  description: 'Map the materializer integration surface across both repos and synthesize a host-side wiring + test spec',
  phases: [
    { title: 'Map', detail: '5 parallel readers map materializer API, original wiring, pinned provider seams, agent-team resume, and the drift canary' },
    { title: 'Spec', detail: 'synthesize a precise host-side integration + test plan' },
  ],
}

const FORK = '/home/jp/rekursiv/sagent'
const MOD = `${FORK}/sagent/providers/anthropic_cli_session`
const AT = '/home/jp/blackjax-devs/agent-team'
const PINNED = `${AT}/.venv/lib/python3.13/site-packages/sagent`
const THREAD = '/home/jp/blackjax-devs/worklog/threads/v2.1-cli-session-materialize.md'

phase('Map')
const readers = [
  () => agent(
    `Read ${MOD}/materializer.py and ${MOD}/format_spec.md and ${MOD}/parser.py. ` +
    `Produce a precise contract reference for vendoring + host-side use:\n` +
    `1. materialize_session(...) — every param, what it returns, side effects (atomic write).\n` +
    `2. session_jsonl_path(session_id, *, cwd, home) — the EXACT path formula (how cwd is encoded into the dir name; claude's "-home-jp-..." convention). Give the literal string transformation.\n` +
    `3. The exact JSONL ENTRY shapes _build_entries emits (preamble/metadata entries vs user/assistant/tool_result; the fields per entry: type, uuid, parentUuid, sessionId, cwd, gitBranch, version, timestamp, message{...}).\n` +
    `4. cli_version / git_branch / timestamp semantics — what must match the live CLI and why.\n` +
    `5. tool_result coalescing + thinking/thought_signature handling.\n` +
    `Return a dense, accurate spec. Quote signatures verbatim.`,
    { label: 'map:materializer-api', phase: 'Map', agentType: 'Explore' }
  ),
  () => agent(
    `In the git repo at ${FORK}, run \`git show c4f9024\` (the commit "wire materializer into AnthropicCLI + SAGENT_CLI_OWN_SESSION opt-in") and read ${THREAD}. ` +
    `Explain EXACTLY how the materializer was originally wired into the provider so I can replicate it HOST-SIDE (Josh later removed the in-provider hook):\n` +
    `1. The materialize_session kwarg flow into AnthropicCLI.model(); where _materialize_prior_state was called (before each --resume spawn) and what slice of messages it wrote.\n` +
    `2. The _session_initialized gate semantics: "first-ever spawn uses --session-id (claude creates the file); materialization fires only AFTER at least one turn has hit disk." Quote the relevant logic.\n` +
    `3. How SAGENT_CLI_OWN_SESSION was read + forwarded (roles/common.py).\n` +
    `4. The v2.1-alpha vs beta vs gamma boundaries (what landed, what was stubbed).\n` +
    `Return the original wiring mechanism in enough detail to replicate it from agent-team without modifying sagent source.`,
    { label: 'map:original-wiring', phase: 'Map', agentType: 'Explore' }
  ),
  () => agent(
    `Read the PINNED sagent provider at ${PINNED}/providers/anthropic_cli.py (this is the post-Josh-rework version we actually ship). Map the seams needed to make turn-1 a clean \`--resume\` of a PRE-WRITTEN session file instead of delete+\`--session-id\` rebuild:\n` +
    `1. _session_initialized: where it is initialized, set True, and read; what it gates (--session-id vs --resume). Quote line numbers.\n` +
    `2. _delete_session_jsonl: when/where it is called (esp. the "construction (rebuild from tape)" delete) and what guards it.\n` +
    `3. How the on-disk session path is computed inside the provider (does it match the materializer's session_jsonl_path?).\n` +
    `4. The cleanest HOST-SIDE injection: which attribute(s) on the model/provider object to set (and WHEN, relative to _build_all_agents construction and the first turn) so that after we materialize the file, turn-1 uses --resume <uuid> and does NOT delete/rebuild. Note any ordering hazards.\n` +
    `Be exact about attribute names and call order.`,
    { label: 'map:pinned-provider', phase: 'Map', agentType: 'Explore' }
  ),
  () => agent(
    `Read ${AT}/agent_team/serve.py (functions _build_all_agents, _resume_agents_from_session_dir, _warmup_agents) and ${AT}/agent_team/roles/common.py (the per-role session-id derivation _session_id_for, session_dir wiring, cwd/sandbox/workspace). Return:\n` +
    `1. role -> session-id (UUIDv5) derivation: the exact namespace + name inputs. How to compute a role's claude session uuid from agent-team.\n` +
    `2. role -> session_dir path (where the sagent tape lives).\n` +
    `3. The cwd each agent's claude subprocess spawns in (workspace root / sandbox) — what to pass as materialize_session(cwd=...).\n` +
    `4. Where exactly model() is built per role and where the model/provider object is reachable from _resume_agents_from_session_dir (so I can flip the provider seam after materializing).\n` +
    `5. The current _resume_agents_from_session_dir flow + the _slim_resume_tape helper already added.\n` +
    `Give exact symbol names and the precise insertion point for materialize-on-resume.`,
    { label: 'map:agent-team-resume', phase: 'Map', agentType: 'Explore' }
  ),
  () => agent(
    `Read ${MOD}/tripwire.py and ${MOD}/tripwire_test.py. Return the drift-canary contract for a boot-time safety check:\n` +
    `1. structural_diff(left, right) -> list[DiffFinding]: what inputs (Path vs message list), what fields it ignores (volatile), what a finding contains.\n` +
    `2. is_safe_to_enable(findings) -> bool semantics.\n` +
    `3. run_canary_against_live_cli / arun_canary_against_live_cli: full signature, what it spawns, what it needs (creds, a throwaway session-id, cwd, timeout), what it returns (CanaryResult), and cleanup responsibilities.\n` +
    `4. A recommended boot hook: run the canary ONCE at serve startup against a throwaway session, compute is_safe_to_enable; if unsafe, disable materialize for this boot and fall back to slim, logging findings. Sketch the control flow + the exact functions to call.\n` +
    `Be precise about signatures and the version-pin in format_spec.md.`,
    { label: 'map:canary', phase: 'Map', agentType: 'Explore' }
  ),
]
const findings = (await parallel(readers)).filter(Boolean)

phase('Spec')
const spec = await agent(
  `You are synthesizing a precise, host-side implementation spec for reviving the CLI session materializer INSIDE agent-team (vendored module + host-side wiring), default-off behind a resume mode selector (full|slim|materialize), with a boot drift-canary that falls back to slim on drift. Josh removed the in-provider hook, so all wiring must be host-side in agent-team/agent_team/serve.py via setting attributes on the already-constructed model/provider objects (we already monkeypatch _MCP_CONNECT_TIMEOUT_SEC there, so provider attribute-poking is established).\n\n` +
  `Here are five mapping reports:\n\n` +
  findings.map((f, i) => `===== REPORT ${i + 1} =====\n${f}`).join('\n\n') +
  `\n\nProduce a single markdown spec with these sections:\n` +
  `## A. Mode selector — AGENT_TEAM_RESUME_MODE in {full,slim,materialize}; how it dispatches in _resume_agents_from_session_dir; defaults (slim now, materialize once canary-proven).\n` +
  `## B. materialize-on-resume — the exact function to add: build ModelRequest from the resumed runtime context, compute session_jsonl_path with the right cwd, probe claude --version, call materialize_session, then flip the provider seam so turn-1 uses --resume. Give the exact attribute names/order from the reports and the precise insertion point. Call out ordering hazards (construction delete vs our write).\n` +
  `## C. Drift canary boot hook — run once at startup, is_safe_to_enable, fall back to slim on drift, log. The exact functions + control flow.\n` +
  `## D. Vendoring — files to copy to agent_team/cli_session/, the import rewrites, and whether the pinned sagent exposes every external symbol the module imports (_AnthropicCLIModel, lib.cost.{ModelProfile,Pricing}, types.model.ModelRequest, types.runtime.*). Flag any that may be MISSING/renamed in our pin.\n` +
  `## E. Test plan — "clean the tape to before our last restart" (how to find the pre-restart truncation point given tape records have no timestamps; use BOOTSTRAP PROBE markers / a tape backup) + the live materializer-restart test (boot mode=materialize, assert: session file materialized at the role path, turn-1 uses --resume not --session-id, NO full-tape re-feed / fast warm, agent resumes mid-thread). Concrete assertions + how to verify each from logs/traces.\n` +
  `## F. Risks + open questions — esp. claude session-format coupling, the construction-delete ordering, and anything the reports left ambiguous.\n\n` +
  `Be concrete and implementation-ready. Prefer exact symbol names and line-precise insertion points over prose. Flag every assumption that needs verifying against live code.`,
  { label: 'synthesize-spec', phase: 'Spec', effort: 'high' }
)
return spec
