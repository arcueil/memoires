# ✗ IM6 · when passing **row-major dense blocks into Eigen CCS (column-major) block assembly** → it does **NOT** work.

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✗ IM6**  · when passing **row-major dense blocks into Eigen CCS (column-major) block assembly** → it does **NOT** work.
- why: the interleaving loop is defined relative to column traversal, so row-major input silently produces an incorrect CCS layout (not merely cache misses); require_* macros check type identity, not storage order.
- conditions: Eigen SparseMatrix CCS; mixed sparse/dense blocks; no compile/runtime guard on storage order.
- tier: 🟢 · source: [dansblog:blocks](https://dansblog.netlify.app/posts/2024-09-04-block-matrices/blocks.html)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the suspect log-density against a trusted reference implementation"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-priors-identifiability S3 · when **mixture components overlap** (separation within ~1σ) → an **ord](../../recs/CC-priors-identifiability/S3.md) `0.76`
- [✗ CC-model-evaluation I6 · when a **sparse-matrix class lazily caches its Cholesky via a mutable ](../../recs/CC-model-evaluation/I6.md) `0.76`
- [✗ CC-convergence-diagnostics D1 · when you thin a well-mixing chain to "improve" ESS → does **NOT** work](../../recs/CC-convergence-diagnostics/D1.md) `0.75`
- [✓ CC-convergence-diagnostics D2 · when memory is the binding constraint on a necessarily-long chain → th](../../recs/CC-convergence-diagnostics/D2.md) `0.75`
