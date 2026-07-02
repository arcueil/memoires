# ✓ HZ1 · for **count / semicontinuous data with excess zeros** → choosing between a **hurdle** and a **zero-inflated** model by t

[Regression models (linear / GLM / GP / ordinal)](../../pages/regression.md)

**Why this holds — the governing claim:**

- ↑ [regression C7 · Match the observation model to the data's generative structure, not its surface ](../../claims/regression/C7.md)

**✓ HZ1**  · for **count / semicontinuous data with excess zeros** → choosing between a **hurdle** and a
**zero-inflated** model by the *zero-generating mechanism* works.
- why: hurdle = one **Bernoulli(theta) gate** decides zero-vs-positive and a count process
**truncated-at-zero** generates the positives, so ALL zeros come from the gate; zero-inflation instead
mixes structural zeros with a count process that can ALSO emit zeros. Choose **hurdle** when a zero means
"the event did not occur" (a behavioral gate) and positives are "how many, given it occurred"; choose
**ZI** when some zeros are structurally impossible AND the count process can also emit zeros.
- conditions: excess-zero count/semicontinuous outcome. PyMC `CustomDist`: positive logp =
`log(theta) + Poisson.logp(y|mu) − log(1 − exp(−mu))` (the `− log(1 − exp(−mu))` is the
truncation adjustment); zero logp = `log(1 − theta)`. Complements SM2 (fitted-vs-predict for
reproducing the zero spike, i.e. the summary side).
- tier: 🟢 · source: pymc-labs
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ mixture Z2 · for **hurdle / zero-inflated models** → reading **`fitted`-type output](../../recs/mixture/Z2.md) `0.88`
- [✓ mixture Z1 · for **zero-inflation over a continuous baseline** → **decompose exactl](../../recs/mixture/Z1.md) `0.85`
- [✗ measurement-error-missing B1 · for **count/spectral data observed through a non-trivial measurement p](../../recs/measurement-error-missing/B1.md) `0.83`
- [✗ ode-dynamical D1 · for **structural zeros** in the data of a dynamical/count model → trea](../../recs/ode-dynamical/D1.md) `0.82`
