# Roadmap

## M1 — the searchable evidence graph (current)
- [x] Per-entry files with explicit clickable edges: recs↑claims↑super-axioms, sources→URLs
      (307/307 resolve), cross-page related links (2,886).
- [x] `memoires` package + CLI: FTS5 search (`search`), entry view (`show`), edges (`graph`),
      `stats`. Zero-dependency core.
- [x] Repo restructure: `memoires/` package · `process/` build story · `data/` provenance.
- [x] Merge `pymc_L1/` techniques/enrichments/contradictions into the per-entry graph (96 placed, 5 honest unplaced).
- [x] 27 unassigned recs resolved → 10 re-routed + 6 new claims (0 forced gaps); render made idempotent.
- [x] Maintainer human-gate review (2026-07-02, 19-item quiz): signed off; 4 corrections + 3 policies (audits/HUMAN_GATE.md).
- [ ] pymc-labs attribution courtesy ping; then publish (push, PyPI name, release notes).

## M2 — semantic search & the L2 index
- [ ] `memoires[semantic]`: embedding search over entries (precomputed vectors shipped;
      query embedded on the fly; hybrid re-rank over FTS5 candidates).
- [ ] L2 embedding index over *full entry bodies + sources* (not just headlines) — the
      "better than forum search" promise at full strength.
- [ ] Query→symptom routing: map free-text symptoms onto the cross-cutting pages' situation
      index (the diagnostic entry point).
- [ ] Evaluation: held-out real forum threads — does `memoires search` surface the accepted
      diagnosis in the top-k? (Multi-witness moves are natural test cases.)

## M3 — the robot interface
- [ ] MCP server (`memoires serve-mcp`): `investigate` / `next_move` / `explain` tools over
      the same index — the foundation [jaynes-robot](https://github.com/arcueil/jaynes-robot)
      builds on.
- [ ] Efficacy integration: tuningfork-shaped benchmark results land in the `efficacy` slots;
      search ranking prefers empirically-grounded recs and says so.

## Continuous
- [ ] `process/update.md` pipeline on a cadence (new forum threads, new case studies).
- [ ] Move-tail curation: promote multi-witness moves into first-class graph nodes.
- [ ] Close remaining apex gap: formal decision theory / utility (needs real sources).
