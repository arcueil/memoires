# CONTRADICTIONS — pymc-L1 vs our catalog (external expert check)

### Calibrating the InverseGamma length-scale prior directly from the observed min/max pairwise distances (beta ~ mode*(alpha-1), beta = max_dist/2)
*📐 portable*

They say (unconditionally): 'concentrate the IG prior between the shortest and longest pairwise distances in the data', beta = max_dist/2. We say (HP9/HP10, Betancourt): deriving rho-prior bounds from the observed covariate span is principled ONLY when the design was itself length-scale-motivated; for an observational study it is circular / overfits the prior to the initial data. Their guidance omits the designed-vs-observational caveat -- flag as our catalog being the more careful of the two (an external-expert file that skips a distinction we hold).

---
### Recovering component assignments: pymc table says 'need posterior on assignments → Standard model with Gibbs sampling'
*📐 portable*

They say: to get a posterior over component assignments, switch to a Standard (non-marginalized) model with Gibbs sampling. We say (M3): recover z post-hoc as the data-conditioned membership E[z|theta,y] from the marginalized NUTS fit — no need to abandon gradient sampling or add Gibbs. Their table advice is heavier/less efficient than M3; flag as an external check where our position is the stronger one.

---
### Divergence tolerance: <0.1% random divergences 'acceptable'
*📐 portable*

THEY (threshold table) say 0 divergences good and <0.1%, if scattered randomly, is 'acceptable.' WE (B6 'reject the ignore-divergences framing on principle' + Betancourt stance) treat any divergence as potential bias worth investigating. Note the pymc file itself hedges in prose ('even a few divergences can indicate biased results'), so the real split is pragmatic-tolerant-threshold vs strict-investigate-all; worth recording as an external stance datapoint rather than a clean disagreement.

---
### Horseshoe: target_accept=0.99 as first-line, and Laplace as 'simpler if sufficient' fallback
*📐 portable*

Flag (external-expert check, but WE are more precise): pymc recommends target_accept=0.99 as first-line for the horseshoe double-funnel and offers Laplace 'if sufficient'. Our SP2 says raising adapt_delta/max_treedepth does NOT cure a non-identified (M>N) horseshoe (138 divergences persist at 0.99 — need the regularized/Finnish slab, SP3); SP4 says Laplace/LASSO is a dichotomous soft failure (over-shrinks relevant, under-concentrates irrelevant). Net: keep target_accept=0.99 only as a stopgap; prefer the regularized horseshoe. Mild contradiction — pymc is less precise, not wrong.

---
### pm.Potential -inf truncation idiom vs our hard-wall anti-pattern
*📐 portable*

THEY (§Truncation via Potential, lines 198-215): implement truncation to [a,b] as pm.Potential('trunc', pt.switch((x>=a)&(x<=b), 0, -np.inf)), cautioning ONLY about 'improper posteriors'. WE (DM5): target += -inf is a gradient-free cliff -> non-conserved Hamiltonian -> all-divergent transitions, R-hat>>1, tiny ESS under HMC/NUTS; the fix is a smooth bijection to unconstrained space (DM6) or pm.Truncated. Since PyMC's DEFAULT sampler is NUTS, their idiom reproduces our anti-pattern and their doc omits the divergence caveat. Edit: add to DM5 a cross-ref that the '-inf Potential truncation' pattern is safe only for non-gradient samplers (or params that never approach the wall in warmup); under NUTS use pm.Truncated / interval transform.

---
### Model averaging: averaging predictive means vs pooling predictive draws
*📐 portable*

They say: y_pred_avg = Σ_m weight_m · mean(ppc_m) — a weighted average of per-model predictive MEANS. We say (G10): stack by POOLING predictive draws in proportion to weights, not averaging summaries. Their snippet yields the correct stacked mean but a too-narrow predictive distribution (it discards the between-model dispersion of the mixture). Mild contradiction: their code is a point-estimate shortcut; G10 is the correct full-predictive construction — flag so the shortcut isn't mistaken for the stacked predictive.

---
### elpd_diff decisiveness thresholds: their ratio>2 vs our ~4-5x
*📐 portable*

THEY say: meaningful difference iff |elpd_diff|>4 AND |elpd_diff/dse|>2; |elpd_diff|<4 => practically indistinguishable, prefer simpler. WE say (G8): the SE is optimistic and even ratio 5 can be negligible when the absolute diff is tiny; recommend a ~4-5x SE bar. Agreement: both use a dual gate (absolute AND ratio). Disagreement: their ratio-2 bar is materially more lenient than our ~4-5x. Suggested edit to G8: cite their concrete numbers ('a common but lenient rule is |elpd_diff|>4 and ratio>2') then keep our stricter stance that the SE is optimistic and ~4-5x is safer.
