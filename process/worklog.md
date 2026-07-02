# Worklog — the forking path

*Written so a fresh session (human or agent) can pick up exactly where we are: what we did, what
we tried, and which turns we took and why. Chronological; the repo's git history is the
fine-grained trail from 2026-07-02 onward.*

## The build (2026-05 → 2026-06)
1. **Ingest (L0):** ≈27.5k Discourse threads (Stan 17,598 · PyMC 7,038 · Pyro 2,910) fetched
   read-only + the Betancourt (37) and Simpson (20) corpora read in full. Raw stays local
   (`data/` is gitignored; see `data/sources/`).
2. **Distill (L1):** 446 granular claims, 183 techniques, 1,976 forking-path moves; two-axis
   taxonomy (observed × structure); nomic-embed semantic index.
3. **First review wave:** 273 established claims → adversarial panel + independent verify →
   105 confirmed major (49 fabricated quotes/numbers). *Lesson that shaped everything after:*
   **the distiller's signature failure is imported specifics** — sound general advice, wrong
   precise numbers/mechanisms.

## The pivot (2026-07-01) — compression, decided by quiz + measured by data
- Maintainer decisions extracted via structured quiz (mid-level altitude · ~120 target ·
  bidirectional recs · efficacy slots · comprehensive tail).
- Embedding analysis: dendrogram top ≈6 clusters real; rate–distortion below claims smooth →
  **3 layers, thin apex, nothing deeper**. Redundancy trim 76→72; 4 most-abstract claims
  *promoted* to the apex rather than cut.
- Built per page (validate-one-then-fan-out): 14 pages → 82 claims + 640 recs.

## Wrong turns (kept so you don't repeat them)
- **Cross-model audit tallies are inflated.** Three Gemini audit rounds read 28%/17%/46% raw
  rec-error; a rigorous per-rec expert sweep of the full error-dense class found the true rate
  in low single digits. Never tally by verdict token; judge by substantiated, file-checked
  reasoning. (A false flag even claimed CP *over*estimates variance — the source says the
  opposite.)
- **General fix-sweeps miss the dominant error class.** Targeted sweeps on named failure
  patterns did little; what worked was isolating the *precise-technical* subpopulation
  (formulas/thresholds/theorems, 82 recs) and validating each against sources.
- **Rec-id grammar drift.** Extraction regexes silently missed `✓/✗`, `✗/✓`, `⚪` marks
  (616 vs the true 640). Grammar now centralized in `process/pipeline/render_graph.py::MARK`.

## External cross-check (2026-07-01)
pymc-labs `python-analytics-skills` treated as a human-curated peer L1: 152 findings —
62 new · 75 enriches · 7 contradicts · 8 covered. **5/7 contradictions resolved in our favor**
(the theory spine held); +10 claims +25 recs merged in, attributed. Closed the flagged gaps
(Box's loop, elicitation) → SA7.

## Release hardening (2026-07-02)
- Adversarial 50-entry release review, double-verified → 10 defects (5 major), all fixed.
- Apex refresh → 7 super-axioms ↔ 82 claims, verified bijection.
- First first-party efficacy fill (mixture M1, from `process/experiments/`).

## M1: the evidence graph (2026-07-02)
- All 307 source short-ids resolved to clickable URLs (Discourse slugs from raw JSON;
  betanalpha/dansblog canonical; pymc-labs GitHub).
- rec→claim edges assigned per page by agents: 613 edges + **27 honest gap-signals**
  (`memoires/catalog/data/unassigned_recs.json`) + 2,886 cross-page related links (embeddings).
- Rendered 722 per-entry files (`memoires/catalog/{claims,recs}/`); link validator: 0 broken
  of 741 files.
- Repo restructured: `memoires/` (pip package + FTS5 search CLI) · `process/` (this) ·
  `data/` (gitignored raw + per-source provenance).

## Where we are / what's next
See `process/roadmap.md`. M1 fold done (2026-07-02): 68 techniques → 54 entries, 21 enrichments → 35, 7 contradiction records → 8 (5 unplaced, documented in pymc_L1/UNPLACED.md). Still open:
maintainer human-gate review (deliberately last); pymc-labs attribution courtesy ping;
publish (repos exist locally with remotes set, nothing pushed).
