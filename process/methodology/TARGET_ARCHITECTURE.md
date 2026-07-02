# Target architecture (from the 2026-07-01 quiz, Q1–Q5)

The corpus splits the **review burden**: a small, human-reviewable, abstract **claims** spine over a comprehensive,
searchable **practical** depth. Claims hold the *why*; the practical layer holds *what works / what doesn't, for this
model*.

## Layer 1 — CLAIMS (~120, reviewed) — the durable *why*
- **Altitude:** mid-level (Q1) — ~3 claims per problem-family capturing the main distinctions. Not one-liners, not granular.
- **Size:** ~120 (Q2) — soft aim below ~130; altitude wins over hitting exactly <100; nothing dropped for count.
- **Organization:** by model class (observed × structure taxonomy → the FIELD_GUIDE spine).
- **This is the reviewed spine** — small enough for a human to hold and vouch for.
- Each claim: `statement · naive_version · nuance · conditions · tier · sources` (existing schema, at mid-level altitude).

## Layer 2 — PRACTICAL (comprehensive, ~400+, searchable) — *what works / doesn't, for this model*
- **Unit = a bidirectional rec** (Q3): model-indexed, both directions:
  - ✓ `"for model X (+ setup) → Y works"`
  - ✗ `"for model X (+ setup) → K does NOT work"` — **failure-path is first-class**, each ✗ rec carries its `conditions`
    (e.g. spike-slab: "discrete formulation doesn't work under HMC — conditioned on a gradient-based sampler").
- **Density = comprehensive** (Q5): every documented works/doesn't-work finding becomes a rec (~400+). The tail is
  **searchable + spot-checked, not individually reviewed** (like the candidate-move tail).
- **Each rec carries:**
  - `model_class` (+ setup/conditions) · `direction` (works | doesn't-work) · `why` · `tier` (graded like claims) ·
    `sources`
  - **`efficacy` SLOT** (Q4): structured on our current experiment metrics — `{divergences, min_ess, ess_per_sec, rmse,
    coverage, source}` — filled from `experiments/` today; a **benchmark-shaped hole** for a future tuningfork run or
    one-off experiment to plug into (no coupling now).
  - **attached `moves`** (Q3): the forking-path diagnostic *how* (the current move-graph, re-indexed under the rec it
    serves). Deepest detail; searchable.
- **Techniques fold in** here as the "how" attached to recs.

## Build sequence (self-validate → scale)
1. **Feed the audit forward as guidance** (not pre-applied): the 49 de-fabrications, 73 downgrades, 105 re-source
   proposals become *inputs* so the re-abstraction excludes fabricated content and respects corrected tiers.
2. **Re-abstract claims:** cluster the 446 (audited) granular claims into ~40 problem-families → synthesize ~3
   mid-level claims each (~120), model-organized. The demoted specifics flow into Layer 2.
3. **Build Layer 2:** from the granular claims + moves + experiments, mine bidirectional recs per model class
   (works/doesn't + conditions + efficacy-slot), attach the moves.
4. **Review** the new ~120 claims + spot-check recs through the pipeline (with the cross-model Gemini gate).
5. **Organize** into the model-class FIELD_GUIDE.
- **Validate on ONE model class end-to-end first** (I check it), then fan out.

## What this supersedes / preserves
- The published **claim corpus shrinks 446 → ~120** (mid-level). The 446 granular claims are **not deleted** (never-delete
  rule) — they become Layer-2 recs + kept-local detail.
- The whole **review system** (2× are-you-sure, cross-model gate, evidence tiers) carries over — now applied to the new
  claims + as spot-check on the rec tail.
