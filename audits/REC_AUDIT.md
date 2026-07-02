# Rec-layer cross-model spot-audit (Gemini 3.1 Pro, 2026-07-01)

**Method:** 50 recs sampled from ~459 (30 ✗ / 20 ✓, oversampling the higher-risk failure verdicts) → Gemini cross-model audit → **each flag verified against the rec** (2× discipline; Gemini raw-flagged 14, ~11 hold up, ~3 borderline).

## The bound
- **~22% of recs have a genuine problem** (≈11 of 50; 95% CI roughly [10%, 34%]).
- **Far worse than the claims** (75/76 faithful = ~1.3%). The comprehensive rec layer was generated fast and unreviewed, and it shows.

## Crucial nuance — errors concentrate in the *explanation*, not the *verdict*
Classifying the 11 genuine issues by location:
- **~8 in the `why:`** — backwards mechanisms, wrong formulas, wrong directions (e.g. "underdetermined N<M constrains σ *away from* zero" → actually σ→0; "KL to a point mass = τ" → actually infinite; "QR-rotated rows" → QR orthogonalizes *columns*).
- **~3 in the `moves:`** — a move that contradicts the verdict, or an irrelevant move mis-attached.
- **~1 in the verdict itself** (r23: a ✓ that's a warned-against practice).
So the **core ✓/✗ verdict + statement are mostly reliable**; the errors are in the fast-generated *why* and *move-attachment*.

## Implication
The recs are **not shippable as trusted verdicts** as-is. But because the damage is concentrated in the `why`/`moves`, a **targeted fix-pass on those fields** (not the verdicts) would clear most of it — cheaper than a full review.

---

# Round 2 — re-audit after the full review+fix pass (fresh 50)

**Raw 28% → 17%. Verified ~22% → ~13%** (6 of 46 genuine; 95% CI ≈ [5%, 26%]). The fix pass **roughly halved** the error rate **and de-fanged the severity**:
- Round-1 residuals were *dangerous* — backwards mechanisms, wrong formulas (QR-rows, KL-to-point-mass, σ-direction). **Those are gone.**
- Round-2 residuals are *subtle*: 3 content (r04 latent-scale ICC internal contradiction · r22 elpd-SE scaling factor · r41 GP "banana" vs ellipsoid at fixed hyperparameters) + 3 mis-attached moves (r00/r06/r10) + 2 cross-model false positives (r08 CP-variance — **source confirms our claim**; r28 SBC/EB pedantry).

**Conclusion:** automated review works on the dangerous errors; the residual ~13% is subtle domain points + move-relevance, where automation hits diminishing returns — the path lower is a targeted move-relevance pass and/or human/source adjudication of the 3 content subtleties. The dangerous-error rate is now ~0.
