# The Bayesian Catalog — entry schema (the contract)

Every published entry is a markdown file: **YAML frontmatter** + a structured **body**. There is exactly
**one schema per layer** (claim · technique · move), and the publish gate (`validate_schema.py`) fails the build on
any violation. This is what makes "read the full content in a fixed schema" (M1 acceptance #1) true.

Field legend: **R** = required · **O** = optional (defaults to `[]`/null) · **D** = derived at build (do not hand-edit) ·
**S** = build-only sidecar (not in the published file).

---

## Shared fields (all three layers)

| field | req | type | notes |
|---|---|---|---|
| `type` | R | `claim`\|`technique`\|`move` | matches the layer |
| `id` (`move_id` for moves) | R | slug | claims/techniques: `id == filename` stem. moves: content-hash of `action+discriminates` (stable across regen) |
| `tier` | R | `established`\|`supported`\|`candidate`\|`graded` | the single grading axis; = the FIELD_GUIDE 🟢🟡⚪ badge. `graded` = earned by an experiment (see below). Drives the review-surface split. |
| `observed` | R | list[leaf-slug] | the **primary navigation axis** (FIELD_GUIDE TOC). Exactly 1 leaf (a 2nd only if genuinely dual), from the observed-data-family hierarchy in `TAXONOMY.md`. The guide is generated from this. |
| `structure` | O | list[tag-slug] | 0–2 model-structure tags (orthogonal axis), from `TAXONOMY.md` Axis 2. |
| `source_urls` | R | list[absolute https] | ≥1, clickable, **locally verified** (resolves to a `raw/` thread or blog). Exception: internal-experiment entries (see `evidence.experiment`). |
| `status` | R | `published`\|`draft` | the only publish gate value. Replaces the old 8-value `status` vocabulary. |

**Global rules (linter-enforced):** `conditions` is always a list · no `/home/jp` or other machine-local path in any
tracked file · every `id`/`move_id` unique within its layer · every cross-reference resolves (see Link integrity).

---

## CLAIM — *statistical knowledge*

Frontmatter (in addition to the shared fields):

| field | req | type | notes |
|---|---|---|---|
| `statement` | R | str | **≤ ~60 words.** The claim, stated plainly. Overflow goes to `nuance`. |
| `naive_version` | R | str | the tempting wrong/incomplete belief this corrects |
| `nuance` | R | str | the conditions, the mechanism, the evidence-in-prose |
| `conditions` | R | list[str] | when the claim applies / its scope (may be empty list, never a string) |
| `antithesis` | O | list[str] | free-text naive positions this opposes. **This is where the old free-text `contradicts` content goes** — prose, honestly not a link. |
| `contradicts_ids` | O | list[claim-id] | real claim↔claim contradiction edges only. CI-resolved **and bidirectional** (A⇒B implies B⇒A). |
| `uses_techniques` | O | list[technique-id] | CI-resolved (every id is a real `techniques/` file) |
| `reliability` | O | `high`\|`medium`\|`low` | advisory only; `tier` is the published grade. (Kept for continuity; may be dropped.) |
| `evidence` | R | object | `{kind, strength, artifacts, experiment?}` — see below |
| `sources` | O | list[source-short-id] | e.g. `betanalpha:rstan_workflow`; resolves to a `normalized/` uid |
| `libraries` | O | list[str] | e.g. `[stan, pymc]` |
| `folded_from` / `provenance` / `supersedes` | S | — | consolidation lineage → build-only sidecar, not shipped frontmatter |

`evidence` object: `kind ∈ {empirical, derivation, assertion, experiment, mixed}` · `strength ∈ {strong, medium, weak}` ·
`artifacts` (free object: figures/diagnostic_runs/simulations/external_refs) · `experiment` (O): a slug under
`experiments/` — present iff the claim is graded by a first-party experiment.

`tier` derivation rule (frozen once): `experiment` ⇒ **graded** · `kind∈{empirical,derivation}` & `strength∈{strong,medium}`
⇒ **established** · `strength=medium` (else) ⇒ **supported** · `kind∈{assertion}` or `strength=weak` ⇒ **candidate**.
*This auto-reconciles the 27 "reliability:high on weak/assertion" contradictions — they fall to candidate.*

Body (all required):
- `## Evidence` — bulleted; each bullet `**[source-id]** quoted source text — \`pos NNNN\` / §x.y`
- `## Source` — clickable source URLs
- `## Connections` **(D — auto-generated)** — techniques used · contradicts ⇄ · the naive view (antithesis) · related moves · FIELD_GUIDE class breadcrumb

---

## TECHNIQUE — *practical modeling practice*

Frontmatter (+ shared): `name` R · `what` R · `how` R · `caveats` R list[str] · `applies_when` O str (free-text scope) ·
`applies_to_claims` **D** list[claim-id] (the exact inverse of claims' `uses_techniques`; never hand-maintained) ·
`source_refs` O list[source-uid] (renamed from `appears_in` — it points at sources, never claims) · `n_variants` O int.
`links` must be public `source_urls`, never local FS paths.

Body: `## Source` (+ optional `## Connections` D).

The old `applies_to` (incoherent: prose ⊕ ids ⊕ tags) is **removed**, split into `applies_when` (prose) + the derived
`applies_to_claims` (ids).

---

## MOVE — *forking-path & analytic strategy* (only the established+supported spine ships as reviewed entries)

Frontmatter (+ shared): `tier` from `n_threads` (≥3 established · 2 supported · 1 candidate) · `topic` R (re-derived
fine-grained; **not** the collapsed `divergence-geometry` bucket) · `action` R · `discriminates` R (H1/H2/H3 labels
**inlined**, not thread-local-opaque) · `branches` R list[{`if_observe`, `then`}] (≥1 — zero-branch moves are not moves) ·
`expected_findings` O · `terminal` R (**the resolution/outcome — restored from the rich `moves.json`; the highest-value
field**) · `situations` O list[str] · `relates_to_claims` D list[claim-id] (breaks the move-island; from the action-key
dedup pass) · `n_threads` R int · `support` R int.

Body: `## Situation` · `## Action` · `## Discriminates` · `## Branches` · `## Resolution` (`terminal`) · `## Evidence`
(short quoted excerpt from the local `raw/<forum>/<id>.json` thread) · `## Source` (verified reconstructed URL).

**Candidate tail (1,875 moves):** NOT rendered as reviewed entries. Ship as `catalog-data/moves_appendix.jsonl`, every
row `tier: candidate · single-witness · machine-mined · unreviewed`. Searchable via `move_index.npz`; never linked as a
🟢/🟡 fix.

---

## Link integrity (the publish gate — `validate_schema.py`)

The build FAILS if any of these is false:
1. every `uses_techniques` id resolves to a `techniques/` file;
2. every `contradicts_ids` id resolves to a `claims/` file **and** the reverse edge exists;
3. `applies_to_claims` == inverse of `uses_techniques` (derived, asserted symmetric);
4. every `observed` leaf and `structure` tag is a known slug from `TAXONOMY.md`;
5. every `experiment` slug resolves to an `experiments/<slug>` dir;
6. `conditions` is a list; `statement` ≤ ~60 words; required fields present per layer;
7. every entry has ≥1 verified `source_url` (or `evidence.kind: experiment`);
8. no machine-local (`/home/jp`, absolute FS) path in any tracked file.

---

## Taxonomy

The two axes (`observed` primary, `structure` orthogonal) are defined in **`TAXONOMY.md`** — 14 observed-data-family
leaves under 3 branches (`discrete-observed`, `continuous-observed`, `computation-diagnostics`) + 10 structure tags.
That file is the single source of truth for the slug vocabulary; this schema only requires that every `observed`/
`structure` value resolve to a slug defined there.
