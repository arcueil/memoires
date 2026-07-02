# ✗ DM5 · when constraints are enforced by **hard-rejecting out-of-bounds points** (`target += -inf` / `reject()`) → it does **NOT

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**✗ DM5**  · when constraints are enforced by **hard-rejecting out-of-bounds points** (`target += -inf` / `reject()`) → it does **NOT** work under HMC.
- why: a -inf cliff has no usable gradient → the Hamiltonian is not conserved → all-divergent transitions, R̂≫1, tiny ESS (looks like a sampler failure but is a coding choice).
- conditions: gradient samplers that map to unconstrained space; constraints on the PARAMETERS (not data).
- tier: 🟡 · source: [mc-stan:38573](https://discourse.mc-stan.org/t/benchmarking-with-inequality-constraints-on-the-true-value-in-stan/38573)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Read sampler diagnostics (divergences) and re-run with a higher target_accept to force a smaller step size near the hard boundary" · "Check whether the proposed value can leave the parameter's valid range — locate the constraint the sampler can violate"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ CC-model-evaluation F10 · when a **constraint is imposed via `pm.Potential`** (e.g. −inf outside](../../recs/CC-model-evaluation/F10.md) `0.81`
- [✗ spatial-areal C1 · for **divergences caused by a hard clip on a constrained parameter** →](../../recs/spatial-areal/C1.md) `0.79`
- [✓ ode-dynamical P3 · for **constraint specification** → **separate hard (physical, e.g. pos](../../recs/ode-dynamical/P3.md) `0.78`
- [✗ CC-convergence-diagnostics I1 · when you rely on absolute continuity (support containment) for IS vali](../../recs/CC-convergence-diagnostics/I1.md) `0.77`


## Contradiction record

**pymc-labs says:** (§Truncation via Potential) implement truncation to [a,b] as `pm.Potential('trunc', pt.switch((x>=a)&(x<=b), 0, -np.inf))`, cautioning ONLY about 'improper posteriors'. · **this catalog says (DM5):** `target += -inf` is a gradient-free cliff → non-conserved Hamiltonian → all-divergent transitions, R̂≫1, tiny ESS under HMC/NUTS; the fix is a smooth bijection to unconstrained space (DM6) or `pm.Truncated`. · **adjudication:** since PyMC's DEFAULT sampler is NUTS, their idiom reproduces our anti-pattern and their doc omits the divergence caveat — the '-inf Potential truncation' pattern is safe only for non-gradient samplers (or params that never approach the wall in warmup); under NUTS use `pm.Truncated` / interval transform.
*The catalog is contradiction-aware by design: both positions stay visible.*
