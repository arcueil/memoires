# The review system — how the catalog earns trust without exhaustive human review

The binding constraint on this catalog is that the maintainer (a domain expert) wants to vouch for quality but
cannot read 2,605 entries. This document is the system that resolves that — validated by two pilots before scale-up.

## The principle: appellate court, not trial court

The goal is **not** "the maintainer reviews everything." It is "**the maintainer's standards are enforced everywhere,
and the maintainer's attention is spent only where it is decisive.**" Agents do the exhaustive trial; the human
audits a sample to confirm the agents match their taste, then trusts them on the rest. Human attention goes to
**calibration + adjudication**, not reading.

## The panel — neutral domain-expert lenses

A single reviewer has blind spots, so the panel is matched to the catalog's surface. Crucially the lenses are defined
by **expertise domain, not identity** (no impersonation of named people — that risks hallucinating positions they do
not hold). Each entry is routed to its best-matched lens by its `observed` leaf:

| lens | covers (`observed` leaves) | "you are a Bayesian statistician with deep expertise in…" |
|---|---|---|
| **geometry** | geometry-sampling, convergence-diagnostics | HMC/NUTS posterior geometry, divergences, funnels, reparameterization, diagnostics |
| **priors** | priors-identifiability | weakly-informative & PC priors, pushforward, identifiability, label/sign switching |
| **evaluation** | model-evaluation | LOO/PSIS/WAIC, predictive checks, SBC, model comparison |
| **modeling** | all discrete/continuous-observed leaves | applied hierarchical/GLM modeling, likelihood choice, workflow |

**Two rules keep it honest, not theatrical:**
1. **Stance from the lens, truth from the source.** Every criticism must cite the source ("you wrote X; the thread/
   case-study says Y"). A criticism with no source quote is itself folklore and is discarded.
2. **Output is actionable + grading-linked:** per entry → verdict (`clean` / `over-claimed` / `mis-attributed` /
   `folklore` / `grade-mismatch` / `conceptually-sloppy`) + a proposed tier change + an **`imported_assertions`** list
   (every claim/number/mechanism asserted *beyond* the cited source) — the field that routes re-sourcing.

### The four recurring distillation failure modes (what the panel targets)
From the pilot, these recur across the corpus — the systematic ways an LLM distiller degrades a faithful source:
1. **Imported mechanism / mis-attribution** — the distiller adds a confident "why" not in the source (e.g. an
   autodiff op-count, a Rao-Blackwell justification, a GPU caveat). Most common, most dangerous.
2. **Over-precision** — "power law", "nearly Gaussian", "1.4×", "0.05" stated sharper than the source supports.
3. **Paraphrase-as-quote** — single-quotes around non-verbatim text (citation hygiene).
4. **Strong grade on empty/weak evidence** — `established` tier resting on a single assertion or an empty evidence block.

## The two "are you sure?" passes (challenge, then challenge the challenge)

The project's signature discipline is an *independent* "are you sure?" on every conclusion. The review applies it twice
before anything reaches the maintainer:

- **1st pass — challenge the *entry*.** The lens-matched reviewer adversarially audits the catalog claim against its
  source. (This is the review itself.)
- **2nd pass — challenge the *critique*.** Each flagged finding is handed to an **independent verifier — a *different*
  lens than the original reviewer** — prompted to **refute** it: *"default to 'the critique is wrong / the entry is
  fine' unless you can confirm the over-reach against the source."* A flag survives only if the verifier confirms it;
  refuted flags revert toward clean. Scrutiny scales with stakes: **1 verifier for `minor`, a 2-of-3 majority vote for
  `major`/`blocker`.**

Why the 2nd pass is non-optional: the reviewer is itself an LLM and can over-flag, manufacture criticism, or misread a
source. Without the refute pass we would (a) *act* on unverified critiques — downgrade tiers, trigger re-sourcing — and
(b) fill the maintainer's exploit queue with false positives, defeating the load-reduction the system exists for. The
2nd pass makes the maintainer's queue **pre-verified**. The human gate (below) is effectively a **3rd, sampled**
"are you sure?" — it also catches the false-*negatives* (entries the panel wrongly passed) that no agent refute-pass can.

## Cross-model gate — Gemini as an *independent* 2nd "are you sure?"

The whole panel above is Claude — so the 2nd "are you sure?" (verify) is **Claude checking Claude**, which shares
blind spots (self-consistency, not independence). A *different model family* (Gemini, via the `agy` CLI) is a genuinely
independent challenge. A 3-entry ground-truth probe (Gemini 3.1 Pro, 2026-06-28) was decisive:

| entry | our pipeline's ground truth | Gemini verdict | result |
|---|---|---|---|
| `forum-c81` | clean | clean | ✅ passed the clean one (no over-flag) |
| `cauchy-…-treedepth` | confirmed major (3/3) | major | ✅ caught it independently — same core contradiction **+ a new catch** (k-hat is a PSIS-LOO diagnostic, not an HMC warning) |
| `divergence-location-…` | **refuted (Claude verify 0/3 = "fine")** | **major** | ❗ **disagreed — and was right**: verified that the entry cites `pystan_workflow`/`general_taylor_models` + a "34.225% (1369/4000)" stat absent from its own `## Source` block (a real mis-attribution our same-model verify waved through) |

**The lesson is not "Gemini is a better reviewer" — it is that cross-model *agreement* gives high confidence, and
cross-model *disagreement* is the signal that flags the genuinely-contested entries a human must see.** The
`divergence-location` case is a false-negative our Claude-only verify produced and a cross-model gate would have caught.
Effort note: Gemini Pro caught the clear major at **both Low and High** effort → use **Pro(Low)** as the cheap default
verifier, escalate to **Pro(High)** only on disagreement / high stakes.

### Where the cross-model gate goes (insertion plan)
1. **PRIMARY — make the verify pass cross-model.** Replace/augment the 3 Claude refuters with a mixed panel (e.g. 2
   Gemini-Pro(Low) + 1 Claude). Decision rule: a Claude-review flag that **both families** uphold → confident major
   (→ fix/JP); **cross-model disagreement → escalate to JP** (never auto-refute on the same family that found it). This
   is the highest-leverage spot — it is the gate to JP, and it is exactly where the monoculture cost us.
2. **SECONDARY — Gemini pre-screens the explore-sample.** Cross-model is the right tool for *false-negatives* (entries
   the Claude panel passed). Gemini spot-checks the "clean/minor" pile before JP — the `divergence-location` defect is
   precisely the class of thing this recovers.
3. **TERTIARY — Gemini second-opinions the `needs_jp` fixes.** Before a re-source/downgrade reaches JP, a cross-model
   opinion; surface only disagreements.

**Guardrails (the 2× "are you sure?" applied to *Gemini* too):** (a) Gemini also over-flags (its "forum-evidence ⇒
grade-mismatch" was borderline-pedantic), so use it for **disagreement-routing to JP**, not as a sole auto-decider;
(b) every Gemini claim must be checkable against the entry/source before acting (the `34.225%` catch was *verified*
before being believed); (c) n=3 is a probe — run a larger labelled calibration set before trusting aggregate Gemini
verdicts. Tooling: `agy --model "Gemini 3.1 Pro (High|Low)" -p "<rubric + entry>"` (no `--dangerously-skip-permissions`).

**Batch validation (29 Claude-refuted majors, 2026-06-28) — the guardrails are non-optional.** Gemini's *raw* verdicts
were noisy: it mislabeled **6/9** entries `SURVIVES_MAJOR: yes` while its own reasoning said "no major defects," and was
**run-to-run inconsistent** (`divergence-location`: major in the probe, fine in the batch). After judging by *substance*
(not the verdict token) and verifying each claim against the file, only **3/29 were genuine** recoveries (all
`established`-on-empty-evidence). Takeaway: **never tally Gemini by its verdict label — judge by its substantiated,
file-checked reasoning, and route disagreements to a human.** (The same pass also caught a bug in *our own* tally parser.)

## Re-sourcing — the constructive half (re-source, don't delete)

A mis-attribution flag does **not** mean delete the (often correct) knowledge. The remedy is graded, and it never
discards what we spent effort to produce:

1. **Re-source** — semantic-search the 27.5k-thread + blog corpus for a source that *actually establishes* the
   imported knowledge; re-attribute, and **graft back the nuance the import flattened** (the source's caveats come
   along for free). Tier set by the new source's reliability.
2. **Downgrade** — if no source establishes it, it is not "established domain fact" — it is `candidate` /
   folklore-to-verify (honest), or split out of the otherwise-clean claim so its weakness doesn't drag the entry down.
3. **Keep** — only if it genuinely traces to the cited source.

This is the catalog's own evidence-grading ethos turned on the distiller's *own* additions: **if you assert it, cite
who establishes it.** (Even "obviously true" domain facts get checked — e.g. "HMC can't sample discrete" flattens the
real nuance that a hard if-else cutoff is sometimes traversable when the energy gap is small, and that enumeration /
MixedHMC *do* handle discrete latents.)

## The human gate — explore + exploit

The maintainer never reviews the whole population; they review a weighted sample, and audit the reviewers:

- **Exploit (review all):** every panel-flagged entry + every `established`-tier claim (a wrong "established" is the
  costliest error). Attention weighted by **tier × stakes**, not uniformly.
- **Explore (a random calibration slice):** ~20–30 *uniform-random* entries the panel marked clean — not to find bugs
  but to **audit the panel**: anything the panel passed that the human would not is a signal to retune the panel.
- **Ship with a stated bound:** "audited N items, k disagreements → error rate p ± CI." The catalog's *own quality is
  evidence-graded* — consistent with the rest of the product.

## The calibration loop (why human load shrinks over time)

Each human adjudication is absorbed into the panel prompt ("the maintainer downgrades any 'X is faster' claim without a
cross-hardware test"). Over a few rounds the panel converges on the maintainer's taste, and the job shrinks to
spot-auditing. The explore-sample stays **uniform-random** so it always re-checks the whole population, guarding
against the panel over-fitting to recent corrections.

## Staging (highest-stakes first)
`established` claims → `supported` claims → spine moves → (candidate tail only as needed). A wrong `established` claim
is far costlier than a wrong single-witness candidate move, so the costly set is reviewed first and exhaustively.

## Pipeline
```
route each entry → matched lens → REVIEW  (1st are-you-sure: verdict + imported_assertions)
     → VERIFY flagged findings  (2nd are-you-sure: independent different-lens skeptic tries to REFUTE;
                                 1 verifier for minor, 2-of-3 majority for major/blocker; refuted → revert to clean)
          → semantic-search the corpus for each imported assertion of a SURVIVING flag
               → adjudicate: re-attribute (+ graft nuance) / downgrade / split
          → triage: clean / fix-wording / re-sourced / downgraded
               → maintainer (3rd, sampled are-you-sure): exploit (all SURVIVING flags + all established)
                            + explore (random clean sample, catches false-negatives)
                    → adjudications retune the panel → next stage reviews less
```

## Validation (two pilots, before any scale-up)
- **Critical pilot (10 claims):** the lens passed the genuinely clean entries, flagged real problems, *independently
  defended* a claim the maintainer suspected (while finding a real numeric bug in it), and **caught serious
  mis-attribution in 2 entries the maintainer assumed were clean** — i.e. it added information beyond the expert's own read.
- **Constructive pilot (3 imports):** re-sourcing grounded one import properly (with the flattened nuance restored),
  honestly downgraded one (no corpus source; identified the *real* reason), and **refuted one using the original
  author's own forum posts**. The find → flag → re-source → regrade loop works end-to-end.

**Rec-layer re-audit FP (2026-07-01).** In the 50-rec round-2 cross-model audit, Gemini flagged `hierarchical E4` "CP underestimates group-level variance" as *backwards* (claimed CP overestimates). **Verified false positive** — Betancourt `divergences_and_bias` states the centered chain *"does systematically underestimate the variance."* Another datapoint for the standing rule: **cross-model flags on directional statistical claims must be checked against the source before belief; the raw verdict rate over-counts.**
