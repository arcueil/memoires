export const meta = {
  name: 'verify-worklog-drafts',
  description: 'Verify the 25 claims_worklog/ drafts against their BlackJAX worklog source lessons, with adversarial recheck on flags',
  phases: [
    { title: 'Verify', detail: 'each draft vs worklog source: faithful? correct? tags? near-dup?' },
    { title: 'Recheck', detail: 'adversarial are-you-sure on flagged drafts only' },
  ],
}

const DRAFTS = [
  "adapt-mh-endpoint-sample-multinomial-2.md",
  "adapt-mh-endpoint-sample-multinomial.md",
  "clustered-divergences-unit-root-geometry-not-sampler-failure.md",
  "cost-structure-acceptance-target.md",
  "dense-imm-laplace-nuts-warmup-fragility.md",
  "divergence-cluster-before-response.md",
  "fixed-l-hmc-resonance-2pi.md",
  "fixed-l-hmc-resonance-at-2pi.md",
  "jax-cpu-nuts-nondeterminism-correctness-signal.md",
  "laplace-exact-under-ncp-gaussian-likelihood.md",
  "laplace-marginal-lbfgs-convergence-floor.md",
  "max-abs-mean-z-bonferroni-gate.md",
  "max-abs-mean-z-sampler-gate.md",
  "mfvi-elbo-converged-not-mean-converged-high-kappa.md",
  "mfvi-kappa-optimizer-failure.md",
  "mhmc-trajectory-length-cost-not-orbit.md",
  "ncp-gp-exact-laplace-marginalisation.md",
  "ncp-laplace-exact-marginalisation.md",
  "static-warmup-dynamic-sample.md",
  "std-ratio-dimension-collapse-silent-failure.md",
  "step-size-only-warmup-via-dual-averaging.md",
  "surrogate-kernel-for-dual-averaging-adaptation.md",
  "two-phase-hmc-adapter-mhmc-sampler.md",
  "vi-iid-draw-max-z-pivotal.md",
  "warmup-cost-amortization-ess-accounting.md",
]

const VERIFY_SCHEMA = {
  type: "object",
  required: ["file","source_found","source_paths","faithful","technically_correct","verdict","issues","near_duplicate_of"],
  properties: {
    file: { type: "string" },
    source_found: { type: "boolean", description: "did you locate the worklog lesson/thread this draft was distilled from?" },
    source_paths: { type: "array", items: { type: "string" }, description: "relative paths under worklog/ that ground this draft" },
    faithful: { type: "boolean", description: "the draft's claims are supported by the source — no hallucination, no overstatement beyond what the source warrants" },
    technically_correct: { type: "boolean", description: "the BlackJAX/MCMC/VI technical content is correct on its own merits (API names, math, diagnostics)" },
    verdict: { type: "string", enum: ["clean","minor-drift","overstated","unverifiable","technically-wrong"] },
    issues: { type: "array", items: { type: "string" }, description: "specific problems; empty if clean" },
    near_duplicate_of: { type: ["string","null"], description: "filename of another draft in the set that this substantially duplicates, or null" },
    suggested_fix: { type: ["string","null"] },
  },
}

const RECHECK_SCHEMA = {
  type: "object",
  required: ["file","flag_upheld","final_verdict","reasoning"],
  properties: {
    file: { type: "string" },
    flag_upheld: { type: "boolean", description: "true if the original flag stands; false if the draft is actually fine on closer inspection" },
    final_verdict: { type: "string", enum: ["clean","minor-drift","overstated","unverifiable","technically-wrong"] },
    reasoning: { type: "string" },
  },
}

const DRAFT_DIR = "/home/jp/rekursiv/bayesian-catalog/claims_worklog"
const WORKLOG = "/home/jp/blackjax-devs/worklog"

const results = await pipeline(
  DRAFTS,
  (file) => agent(
    `You are auditing a distilled knowledge draft for fidelity to its source.

DRAFT: ${DRAFT_DIR}/${file}
SOURCE CORPUS: ${WORKLOG}/ (117 lesson files under lessons/, 75 thread files under threads/, plus decisions/)

Steps:
1. Read the draft in full.
2. Find its source: grep ${WORKLOG}/ for the draft's distinctive terms (kernel names, diagnostic terms, the specific number/threshold it cites). The draft was distilled FROM one or more of these worklog lesson/thread/decision files. Read the matching source file(s) fully.
3. Judge on THREE independent axes:
   - faithful: every claim in the draft is supported by the source — flag any number, threshold, mechanism, or causal claim the source does NOT back up (hallucination or overstatement).
   - technically_correct: the content is correct on its own merits — BlackJAX API names exist (e.g. blackjax.window_adaptation, dual_averaging_adaptation, laplace_hmc/laplace_mhmc), the MCMC/VI reasoning is sound, the math/diagnostics check out. A draft can be faithful-to-source but technically wrong if the source itself was wrong, OR faithful and correct.
   - tags: is status/reliability/evidence framing appropriate (these are internal worklog lessons → reliability high is OK, but evidence should reflect whether the source had experiments/runs vs assertion).
4. near_duplicate_of: the draft set contains near-duplicate pairs (e.g. resonance-2pi vs resonance-at-2pi). If this file substantially overlaps another in the set, name it. Full set: ${DRAFTS.join(", ")}.

Be skeptical and specific. 'unverifiable' = you could NOT find a grounding source (possible hallucination — important to flag). Return the structured verdict.`,
    { label: `verify:${file.replace(/\.md$/,'').slice(0,28)}`, phase: 'Verify', schema: VERIFY_SCHEMA }
  ),
  (v, file) => {
    if (!v) return { file, verdict: "ERROR", faithful: false, issues: ["stage-1 agent died"], near_duplicate_of: null }
    if (v.verdict === "clean" && v.source_found) return v   // no recheck needed
    // adversarial recheck on anything flagged
    return agent(
      `Adversarial recheck (the "are you sure?" pass). A first auditor flagged this distilled draft. Your job is to decide whether the flag is REAL or whether the first auditor was wrong and the draft is actually fine.

DRAFT: ${DRAFT_DIR}/${file}
SOURCE CORPUS: ${WORKLOG}/

First auditor's verdict: ${v.verdict}
Their issues: ${JSON.stringify(v.issues)}
Source paths they found: ${JSON.stringify(v.source_paths)}

Re-read the draft AND the source independently. Do NOT anchor on the first auditor — they flip ~1/3 of the time. Decide: does the flag stand (flag_upheld=true) or is the draft actually fine (flag_upheld=false, final_verdict=clean)? Give specific reasoning grounded in the source text.`,
      { label: `recheck:${file.replace(/\.md$/,'').slice(0,26)}`, phase: 'Recheck', schema: RECHECK_SCHEMA }
    ).then(r => ({ ...v, recheck: r, verdict: (r && !r.flag_upheld) ? "clean" : (r ? r.final_verdict : v.verdict) }))
  }
)

const clean = results.filter(r => r && r.verdict === "clean")
const flagged = results.filter(r => r && r.verdict !== "clean" && r.verdict !== "ERROR")
const dups = results.filter(r => r && r.near_duplicate_of)
return {
  total: results.length,
  clean: clean.length,
  flagged: flagged.map(r => ({ file: r.file, verdict: r.verdict, issues: r.issues, fix: r.suggested_fix })),
  near_duplicates: dups.map(r => ({ file: r.file, dup_of: r.near_duplicate_of })),
}