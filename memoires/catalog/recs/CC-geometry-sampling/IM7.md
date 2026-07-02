# ✓/✗ IM7 · when **assembling a 2×2 block-structured sparse matrix in Eigen** → manual column-by-column CCS interleaving (~100 lines

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✓/✗ IM7**  · when **assembling a 2×2 block-structured sparse matrix in Eigen** → manual column-by-column CCS interleaving (~100 lines of raw-pointer construction) **works**; triplet (insert-then-compress) construction does **NOT** (destroys the column-sorted CCS invariant and is slower).
- why: Eigen exposes no higher-level mixed sparse/dense block-assembly API; the three CCS arrays (outer, inner, val) must be walked column by column.
- conditions: lower-triangle-only symmetric storage; header-only Eigen expression-template context.
- tier: 🟢 · source: [dansblog:blocks](https://dansblog.netlify.app/posts/2024-09-04-block-matrices/blocks.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-convergence-diagnostics D1 · when you thin a well-mixing chain to "improve" ESS → does **NOT** work](../../recs/CC-convergence-diagnostics/D1.md) `0.76`
- [✓ CC-model-evaluation F7 · when summarizing **f(θ)** → **applying f inside each draw then summari](../../recs/CC-model-evaluation/F7.md) `0.76`
- [✗ CC-priors-identifiability S3 · when **mixture components overlap** (separation within ~1σ) → an **ord](../../recs/CC-priors-identifiability/S3.md) `0.76`
- [✗ CC-model-evaluation I6 · when a **sparse-matrix class lazily caches its Cholesky via a mutable ](../../recs/CC-model-evaluation/I6.md) `0.75`
