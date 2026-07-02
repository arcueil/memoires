# ✓ IM9 · when you need **both the forward (training) and reverse (sampling) map of a CNF** → learning one vector field f works (t

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✓ IM9**  · when you need **both the forward (training) and reverse (sampling) map of a CNF** → learning one vector field f works (the same f drives both directions; reversibility is free).
- why: solving the ODE backward with the terminal condition gives the inverse from the same f (Picard-Lindelöf for Lipschitz f); no need to commit to modeling T or T⁻¹.
- conditions: ODE well-posed in both directions; does not remove the trace bottleneck or the information desert.
- tier: 🟢 · source: [dansblog:diffusion](`https://dansblog.netlify.app/posts/2023-01-30-diffusion/diffusion.html`)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Reduce scope: make the model sample correctly WITHOUT the flow before reintroducing it"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [ode-dynamical C1 · Continuous-time generative flows: the vector field's reversibility is ](../../claims/ode-dynamical/C1.md) `0.86`
- [✓/✗ CC-priors-identifiability E6 · when **a family's CDF/quantile has no closed form** → for **fixed-para](../../recs/CC-priors-identifiability/E6.md) `0.81`
- [✓ ode-dynamical R7 · for **exposing hidden parameter combinations** → **re-derive the ODE/f](../../recs/ode-dynamical/R7.md) `0.79`
- [✓ mixture M3 · for a **marginalized model** → recover z **post-hoc as the data-condit](../../recs/mixture/M3.md) `0.79`
