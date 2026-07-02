# ✓ WD1 · when applying a precedent recorded on a different model or setting → check the geometry/method class boundary before transferring it

[Cross-cutting: Workflow discipline & precedent reasoning](../../pages/CC-workflow-discipline.md)

**Why this holds — gap signal:**

*Gap signal: first-party experimental finding (arcueil transfer experiment 2026-07, writeup pending) — no peer-reviewed claim yet.*

**✓ WD1**  · when applying a precedent recorded on a different model or setting → check that the candidate's {geometry class, method family, dimension regime, budget} matches the precedent's local frame before applying it.
- why: a precedent's evidential value is conditional on its local frame. Two failure cases from the arcueil 2026-07 transfer experiment (~25% of agent errors were of this type): (1) "Laplace succeeded on eight-schools" was wrongly used to predict success on Neal's funnel — eight-schools geometry (mild hierarchical funnel, J=8, bounded sigma) is not funnel geometry (near-zero-sigma collapse, kappa→0 limit, continuous depth); (2) "diag-IMM cleared a kappa=1000 Gaussian" was wrongly used to predict success on a stiff ODE posterior — a Gaussian with kappa=1000 has analytically known, spatially constant curvature; a stiff ODE posterior carries trajectory-dependent curvature the diagonal mass matrix cannot represent. In both cases the precedent raised confidence; the correct move is to lower it. Negative form: a precedent that doesn't match the class must LOWER, not raise, confidence — frame mismatch should trigger a revert to mechanism-level reasoning, and the precedent is weak evidence at best.
- conditions: applies whenever the precedent was recorded on a different model or setting; most dangerous when a surface similarity (both involve a scale parameter, both are loosely "hierarchical", both passed a sampler diagnostic) masks a geometry-class or method-family mismatch.
- tier: ⚪ candidate · source: first-party: arcueil transfer experiment 2026-07 (writeup pending)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Compare the candidate problem's {geometry class, method family, dimension regime, budget} against the precedent's local frame before applying it"
