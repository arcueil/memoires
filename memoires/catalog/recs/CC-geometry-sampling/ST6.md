# ✓ ST6 · when SVI on a **Bayesian NN/RNN gives a NaN ELBO at the first iteration** → shrinking the initial variational locs/scale

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claim:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)

**✓ ST6**  · when SVI on a **Bayesian NN/RNN gives a NaN ELBO at the first iteration** → shrinking the initial variational locs/scales works.
- why: wide randn-seeded locs/scales make softplus(scale) and summed Normal log-probs overflow to NaN before any gradient step; it's an init/numerics problem, not a model bug.
- conditions: mean-field SVI; recurrent architectures (GRU/RNN/LSTM) compound log-probs over timesteps.
- tier: 🟡 · source: [pyro:254](https://forum.pyro.ai/t/bayesian-rnn-nan-loss-issue/254)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- moves: "Rule out floating-point precision as the driver of step-size collapse" · "Equalize and pin the starting point to isolate initialization effects"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✓ sparse-shrinkage W6 · for the **same stalled fit** → **diagnosing and fixing the geometry fi](../../recs/sparse-shrinkage/W6.md) `0.80`
- [✗ hierarchical-multilevel J1 · for **minibatch/stochastic VI** (SVI/ADVI) → treating it like frequent](../../recs/hierarchical-multilevel/J1.md) `0.80`
- [✗ CC-convergence-diagnostics J1 · when you read an oscillating / spiking ELBO curve as a bug or a bad va](../../recs/CC-convergence-diagnostics/J1.md) `0.80`
- [✓ spatial-areal Z2 · for the same effects → the **N-corrected soft constraint sum(x) ~ norm](../../recs/spatial-areal/Z2.md) `0.80`
