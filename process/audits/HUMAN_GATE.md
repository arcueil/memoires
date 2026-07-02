# Human gate — maintainer sign-off (2026-07-02)

The final review before publication, run as a **quiz** (the same active-learning format that built
the corpus). Explore + exploit: the 6 never-reviewed new claims (exploit — highest stakes) + a
stratified sample of the newest layer (pymc fold-ins) + a random calibration slice of established
entries (explore — audits the panel). 19 items; every one adjudicated by the maintainer.

## Outcome: 19/19 adjudicated · panel calibrated · **4 corrections + 3 new policies**

The explore slice (established entries 11–14, 16, 17) passed clean — the panel is calibrated. The
value came from the new/newest layers, exactly as designed.

## Verdicts

### New claims (exploit)
| # | claim | verdict |
|---|---|---|
| 1 | regression/C7 — match observation model to generative structure | ✅ approved 🟢 |
| 2 | spatial-areal/C6 — spatial structural commitment | 🔀 **merged into C7** as its named spatial special case |
| 3 | hierarchical/C6 — minibatch-VI N/b rescale | ➡ **moved** to CC-geometry-sampling/C9 ("inference-method nuance, not a multilevel-model property") |
| 4 | CC-priors/C10 — prior-sourcing is strategy-selection | ✅ approved 🟢 |
| 5 | time-series/C7 — time-varying volatility is first-class | ✏ **maintainer added the SV-vs-GARCH conditioning** (GARCH correct only when noise correlates with signal level; else latent stochastic-volatility). 🟢→🟡 |
| 6 | measurement-error/C7 — inference ≠ decision | 🅿 **parked** on new page CC-decision-theory/C1 ⚪ (thin by honest design) |

### pymc fold-ins (newest layer)
| # | item | verdict |
|---|---|---|
| 7 | pm.Data technique (F11) | ➡ re-filed under claim C4 (posterior-predictive sampling) — "library cookbook" |
| 8 | CP/NCP data-per-group rule (K1) | ➡ **re-homed** to hierarchical C2 (the parameterization claim it enriches) |
| 9 | elpd_diff contradiction (G8) | ✏ **kept the stricter ~4–5× bar** as default; looser standard gate noted + cited → **editorial policy** |

### Explore calibration slice (established)
| # | entry | verdict |
|---|---|---|
| 10 | latent-factor/C4 marginalization dominates NCP | ✅ (+ disambiguator: analytic-Gaussian vs discrete-mixture marginalization) |
| 11 | CC-convergence/C7 approximation diagnostics | ✅ clean |
| 12 | regression/C5 estimand-dependence | ✅ clean |
| 13 | hierarchical/C5 identifiability degeneracies | ✏ **fixed** — nuance carried the confounded N(μ,σ)+intercept pair (the rec-level fix hadn't propagated up) → N(0,σ) |
| 14 | mixture/C3 label-switching exactness | ✅ clean |
| 15 | hierarchical/D7 phylogenetic signal | ✅ clean |
| 16 | CC-convergence/A2 short-chain masking | ✅ clean |
| 17 | CC-priors/N6 unbounded worst-case | ✅ clean |
| 18 | CC-model-eval/H3 directional/ROPE vs BF | ✅ clean |
| 19 | mixture/M1 (efficacy-backed) | ✅ + **ess_per_sec contextualized** with same-run baselines → **efficacy policy** |

## Corrections the gate produced (would have shipped otherwise)
1. **hierarchical/C5** confounded-pair error in the claim nuance (fixed only at rec level before).
2. **time-series/C7** was missing the SV-vs-GARCH generative distinction — *maintainer-authored
   domain knowledge entering the catalog through the gate*.
3. **G8** entry recommended the standard gate while its own contradiction record argued the stricter
   one — internal inconsistency reconciled.
4. **mixture/M1** shipped a bare machine-dependent `ess_per_sec`.

## New policies (recorded in process/update.md)
- **Contested thresholds:** strict default, looser common practice noted with citation
  (elpd_diff, divergence tolerance, R̂, BF-vs-directional).
- **Efficacy discipline:** machine-dependent metrics (ESS/sec, wall-time) only with a same-hardware
  baseline; machine-independent metrics (divergences, coverage, RMSE, ESS) stand alone.
- **Derived files are generator-owned:** no hand edits to claims/recs; all enrichment via sidecar
  data (surfaced when a re-render clobbered the fold-ins).

## Bound
Corpus at sign-off: **7 super-axioms → 87 claims → 640 recs**, apex a verified bijection, render
idempotent, link validator 0 broken. The reviewed spine is maintainer-vouched; the searchable tail
carries its stated per-layer bounds (`PROVENANCE.md`, `audits/`). **Gate closed — clear to publish.**
