# Known coverage gaps — where the *sources* are thin (not the synthesis)

The catalog faithfully represents its sources (PyMC/Stan/Pyro forums + Betancourt/Simpson blogs), which are
**computation-heavy** (~91% geometry/diagnostics/priors). So the apex + claims are complete *relative to the data we
have* — but the sources themselves under-discuss several grand areas of Bayesian practice. These are **source gaps, not
synthesis gaps**: we do NOT invent super-axioms the corpus can't support (that would be fabrication one level up). We
record them here as an honest boundary and a roadmap for future sources / experiments.

## Apex-level gaps (grand principles the source corpus under-represents)
- **Decision / utility** — inference serves a *decision* (loss functions, expected utility, the cost of being wrong).
  The corpus is about getting the posterior *right*, not *using* it. → future sources: decision-theory texts, applied
  case studies with explicit loss.
- **Iterative model-building** — the build→fit→check→expand loop (Box's loop) as *the method*, not a single fit.
  Present only fragmentarily (predictive checks) in the corpus. → future: workflow papers (Gelman et al. Bayesian
  Workflow), longitudinal model-development threads.
- **Prior elicitation from substance** — where a prior *comes from* (domain knowledge, mechanism, prior-predictive
  reasoning). The corpus covers prior *scale/geometry* (technical calibration), not prior *substance*. → future:
  elicitation literature, domain-expert interviews.

## ✅ Update (2026-07-01): substantially addressed by the pymc-labs L1
Cross-comparing the human-curated `pymc-labs/python-analytics-skills` (treated as a peer L1) filled these:
- **Decision/utility** — partly, via model-comparison decision rules (LOO/stacking/elpd_diff) in `pymc_L1/`.
- **Iterative model-building** — the `workflow` skill supplies Box's-loop as a claim (`pymc_L1/CLAIMS.md`) + build-up ladders.
- **Prior elicitation** — the `prior-elicitation` skill (SHELF, PreliZ, roulette, maxent) — directly fills this. See `pymc_L1/`.
Remaining thin at apex level: only formal decision-theory/utility — the iterative-model-building and prior-elicitation gaps are now promoted to a super-axiom (SA7). The rest are now sourced (from a real curated external L1, not invented).

## How to close them (without fabricating)
Each gap closes only by adding **real sources** that discuss it, or by running **experiments** (the spike-slab pattern)
that generate first-party evidence. Until then they stay flagged here — a user sees exactly where the catalog is thin,
and the roadmap says what to ingest next. (Consistent with the per-model-class 🕳 gaps the field guide already surfaces.)
