# Provenance — how this catalog was made

The full lineage from raw sources to the adopted corpus, with the quality bounds measured at each
step. The orchestration scripts that executed every stage are preserved verbatim in
[`pipeline/workflows/`](pipeline/workflows/) (grouped by session id). The working archive (raw
source dumps, intermediates, granular predecessors) is kept locally and is not part of this repo.

## 1 · Sources (L0)
- **Forums:** PyMC / Stan / Pyro Discourse — ≈27.5k threads, fetched read-only (Stan alone
  ≈17.6k). Raw thread JSON kept in the local archive.
- **Blogs:** Michael Betancourt (betanalpha case studies) and Dan Simpson (dansblog) — read in full.
- All source references in the catalog resolve to this corpus (verified exhaustively: 362 distinct
  short-ids, 0 unresolvable), except `pymc-labs:*` ids which resolve to the external repo below.

## 2 · Distillation (L1, granular)
LLM distillation of L0 into granular units: **446 claims**, **183 techniques**, **1,976
forking-path moves** (diagnostic actions with witnessed findings; 95% single-witness tail).
Two-axis taxonomy (`observed` × `structure`, see `methodology/TAXONOMY.md`); semantic index via
nomic-embed-text-v1.5 (768-d).

## 3 · First review wave (on the granular corpus)
Adversarial panel + independent verify (the 2× "are-you-sure" pipeline,
`methodology/REVIEW_SYSTEM.md`): 273 established-tier claims reviewed → 134 flags → verify pass
(402 refuters, 2-of-3 majority) → **105 confirmed major** (49 fabricated quotes/numbers, 73 tier
downgrades, 73 re-sourcings) and 29 refuted flags (22% reviewer over-flag). A cross-model
(Gemini) re-check of the refuted pile recovered 3 genuine issues. These results were **fed forward
as guidance** into the re-abstraction below (fabricated content excluded, corrected tiers respected).

## 4 · Target architecture (compression, data-driven)
Design decisions extracted via a structured maintainer quiz; depth and layer sizes measured from
the embeddings rather than guessed:
- Dendrogram merge-gap analysis → a real ~6-cluster top level; rate–distortion below the claims is
  smooth (no elbow) → **3 layers, thin apex above, no extra depth below**.
- Redundancy/coverage audit of the mid-level claims → 5 near-duplicate pairs merged, 4
  most-abstract claims promoted into the apex; granular coverage 100% (0 orphans).
Result: **6 super-axioms → mid-level claims → bidirectional practical recs → moves**
(`methodology/TARGET_ARCHITECTURE.md`).

## 5 · Build
Per model class / computation area (14 pages): cluster the granular claims → synthesize mid-level
claims (traceable "subsumes" lists) → mine claims+moves+experiments into bidirectional recs
("for X, Y works" / "for X, K does NOT work (conditions)") with attached moves and a
benchmark-shaped `efficacy` slot. One class was built and hand-validated end-to-end before fan-out.
Scripts: `build-target-all-classes`, `build-target-crosscutting`.

## 6 · Quality measurement (the bounds)
- **Claims (82):** per-claim over-generalization review against subsumed granulars — **75/76
  faithful** at the time of review; the 1 over-reach fixed. (`audits/`)
- **Recs (639):** three sampled cross-model audit rounds gave noisy raw rates (28% / 17% / 46%) —
  later shown **inflated by cross-model over-flagging** (documented guardrail: never tally by
  verdict token). A rigorous per-rec expert sweep of the full precise-technical class (82 recs:
  formulas, thresholds, theorems — where errors cluster) found and fixed **14 genuine errors
  total**; residual error assessed at low single digits. (`audits/REC_AUDIT.md`)
- **Moves:** stakes-weighted deep validation of the 40 most-witnessed moves — **~39/40 sound as
  diagnostic advice**; actions witnessed in cited threads, while attached *specific findings*
  (numbers/timings) are illustrative rather than individually certified. The single-witness tail
  (95%) is searchable, unreviewed. (`audits/MOVE_AUDIT.md`)

## 7 · External cross-check (pymc-labs peer L1)
Cross-compared against the human-curated
[`pymc-labs/python-analytics-skills`](https://github.com/pymc-labs/python-analytics-skills)
(MIT-licensed; treated as an already-distilled peer L1): **152 findings — 62 new · 75 enriches · 7 contradicts · 8 already-covered.** Of the 7 contradictions, **5 resolved in this catalog's favor** (the external
check validated the theory spine); 2 were reconciled (standard loo `elpd_diff` gate adopted; the
pragmatic divergence-tolerance threshold recorded alongside the strict stance). **+10 claims and
+25 recs** merged in, faithfully transcribed and attributed (`pymc_L1/`), closing previously
flagged coverage gaps (iterative model-building, prior elicitation, several model classes — see
`GAPS.md`).

## 8 · Adoption and post-adoption
Adopted 2026-07-01: **6 super-axioms → 82 claims → 639 recs → 1,976 moves** + the pymc-L1 peer
layer. The 446 granular claims are retained in the local archive (nothing produced is deleted).
Post-adoption hardening (this repo's commit history is the authoritative trail from here):
- **Apex refresh (2026-07-02):** the 4 dangling subsumes references removed, all entries
  page-qualified, the 10 merged pymc-labs claims folded in, and **SA7** (iterative practice +
  priors-from-substance) added — the apex is now **7 super-axioms ↔ 82 claims, a verified
  bijection**.
- **Adversarial release review (2026-07-02):** 50 entries sampled across every asset class, every
  flag double-verified — 10 confirmed defects (5 major, incl. two directional errors and a Stan
  API misuse), **all fixed**; the apex sampled clean. Full table:
  `audits/ADVERSARIAL_REVIEW.md`.

## Known limitations
- `GAPS.md` — remaining thin areas (formal decision theory / utility).
- Move-level specific findings are illustrative; the move tail is unreviewed by design.
- Most `efficacy` slots are `pending` — they are benchmark-shaped holes awaiting tuningfork /
  one-off experiment integration (`experiments/` holds the first: spike-slab vs horseshoe).
- The catalog reflects its sources' emphases (computation-heavy); the model-class organization is
  a navigation aid, orthogonal to the corpus's natural computation-themed clustering.
