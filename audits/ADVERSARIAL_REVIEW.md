# Adversarial release review — 50-entry sample, double-verified (2026-07-02)

The final pre-release quality measurement. **50 entries sampled across every shipped asset class**,
each adversarially reviewed, and every flag passed through **two independent "are-you-sure"
verifications** (an independent refuter, then a high-effort final gate re-deriving the issue from
scratch). Only double-confirmed defects counted. 34 agents; sampling covered the full rec
population (616 extractable recs — an earlier extraction bug that saw only 459 was fixed for this
sample) and included the never-before-audited move tail.

## Result

| asset class | sampled | entries w/ confirmed defects | issues (major/minor) |
|---|---|---|---|
| super-axioms | 3 | 0 | 0 |
| claims | 15 | 3 | 1 major · 2 minor |
| recs | 18 | 2 | 2 major · 1 minor |
| moves (incl. tail) | 5 | 1 | 1 minor |
| pymc-L1 layer | 5 | 1 | 1 major |
| docs (README/GAPS/PROVENANCE/audits) | 4 | 2 | 1 major · 1 minor |
| **total** | **50** | **9 (18%)** | **10 (5 major · 5 minor)** |

## The confirmed defects (all fixed in the same commit)

**Major**
1. `CC-convergence-diagnostics` claim — IAT estimator bias direction stated backwards ("biased
   upward" → downward; n_eff correspondingly *over*estimated). Directional error contradicting the
   claim's own headline.
2. `pymc_L1/RECS.md` — sigmoid-saturation mechanism backwards: a too-**wide** (not too-narrow)
   slope prior + extrapolated X drives sigmoid(Xβ) to exactly 0/1 (transcription error ours, not
   pymc-labs').
3. `CC-geometry-sampling` rec — Stan API misuse: `multi_normal_cholesky(0, K+σ²I)` passes a
   covariance where a Cholesky factor is expected → corrected to `multi_normal` (or explicit
   `cholesky_decompose`).
4. `PROVENANCE.md` — itemized cross-compare counts summed to 144 vs the stated 152 (the 8
   "already-covered" findings were omitted from the breakdown).
5. `spatial-areal` rec — "nullity = number of connected components" over-generalized from the ICAR
   graph-Laplacian case to higher-order intrinsic smoothers (where d = polynomial null-space
   dimension, e.g. 2 for cubic/RW2).

**Minor**: stale `dist/` path prefixes in README+GAPS; a "4 SD" that is actually 2.5 prior-SDs
(mixture); a determinant factor mislabeled "log-determinant" (spatial-areal); a move whose action
said "banana" while its own expected-findings said "tilted ellipse"; per-iteration ESS ratios
labeled as bare `n_eff` (impossible read literally).

## Reading the bound
- **The apex is clean** (0/3), consistent with its review history.
- **Docs were the most defect-dense class (2/4)** — the newest, least-reviewed content; both were
  navigation/arithmetic slips, not statistical errors. The recurring lesson: *the newest layer
  always carries the errors* — review effort should follow recency, not just stakes.
- Statistical majors in the knowledge layers ran ~3/41 sampled knowledge entries (~7%), all subtle
  (direction words, API signatures, scope qualifiers) — the exact classes the 2× pipeline exists
  to catch. All fixed; the sampled-entry residual is now 0.
- Method note: the double-verify gate discarded every unsubstantiated flag; no false positives
  reached this list (each confirmation is file-checked and re-derived, per
  `methodology/REVIEW_SYSTEM.md`).
