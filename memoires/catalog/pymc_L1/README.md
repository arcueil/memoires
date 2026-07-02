# pymc-labs skills — incorporated as a peer L1 layer

Source: `github.com/pymc-labs/python-analytics-skills` (human-curated Claude skills for PyMC modeling) — treated as a
**peer L1** (already-distilled expert knowledge), not raw source. Cross-compared against our catalog (152 findings: 62 new · 75 enriches · 7 contradicts · 8 already-covered). **Complementary strengths:** pymc-L1 is stronger on the constructive/API/default
side (prior menus, thresholds, tooling, elicitation); our catalog is deeper on geometry/theory/failure-modes
(5 of 7 contradicts resolved in our favor). Everything here is attributed to pymc-labs and tagged 📐 portable (mergeable
as claims/recs) vs 🔧 PyMC-specific (the technique/library layer).

- `CLAIMS.md` — new portable principles (fill gaps: Box's loop, maxent, VI families, censored/truncated…)
- `RECS.md` — new model-specific recs + model classes we lacked (BART, hurdle/Tobit/ordinal/quantile, GARCH, structural-TS, elicitation protocols)
- `TECHNIQUES.md` — the PyMC how: API, thresholds, tooling (technique + library-note)
- `ENRICHMENTS.md` — nuance/moves to graft onto existing entries
- `CONTRADICTIONS.md` — the 7 disagreements, adjudicated (external expert check on us)

## Source resolution + license
`pymc-labs:<topic>` short-ids used across the catalog pages resolve to skills in
[pymc-labs/python-analytics-skills](https://github.com/pymc-labs/python-analytics-skills)
(e.g. `pymc-labs:prior-elicitation` → `skills/prior-elicitation/`). That repo is **MIT-licensed**
(per its README); content derived here is attributed accordingly.
