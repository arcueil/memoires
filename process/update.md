# How to add new knowledge

*The ingestion path for new sources (forum threads, blog posts, case studies, curated skill
repos). Every step exists to protect the two properties the catalog sells: faithful-to-sources
and evidence-graded. Never skip the review gates.*

## The path

1. **Fetch (L0).** Raw source → `data/<source>/` (gitignored). Add/extend the provenance note
   in `data/sources/<source>.md` (what, where, how fetched, license/ToS, counts).
2. **Distill (L1).** Extract granular claims/moves with per-item source ids. *Known failure
   mode:* imported specifics (fabricated numbers/mechanisms beyond the source). Distill
   faithfully; prefer quoting.
3. **Review gates (non-negotiable).**
   a. Adversarial review (lens-matched) + independent verify — the 2× "are-you-sure"
      (`process/methodology/REVIEW_SYSTEM.md`).
   b. Cross-model check only by substantiated reasoning, never by verdict tallies.
   c. Precise-technical content (formulas, thresholds, theorems) gets per-item expert
      validation against the source — this is where errors cluster.
4. **Place in the graph.**
   - New evidence for an existing rec/claim → add the source link; strengthen tier if warranted.
   - New rec → assign its governing claim(s); bidirectional (✓/✗ + conditions); efficacy slot.
   - New claim → assign its super-axiom; only add a claim the sources actually support.
   - Contradicts an existing entry → record the contradiction explicitly (both sides +
     conditions); do not silently overwrite. Re-source, don't delete.
5. **Resolve sources.** Extend `memoires/catalog/data/source_map.json` (every short-id must
   resolve to a clickable URL — the validator enforces zero bare ids).
6. **Re-render + validate.**
   ```bash
   python process/pipeline/render_graph.py memoires/catalog
   python process/pipeline/validate_links.py memoires/catalog   # must PASS
   ```
7. **Log + version.** Append to `process/worklog.md`; bump the package version; commit with
   the finding/fix story in the message (enriched-history convention).

## Tier discipline for new material
- Human-curated expert source (a pymc-labs-like repo) → may enter 🟢 with attribution.
- Single forum thread → ⚪ candidate (searchable tail) until corroborated.
- First-party experiment (`process/experiments/`) → fills `efficacy` slots verbatim; an
  experiment only grounds the *exact* model/setup it ran (no propagation to cousins).
