export const meta = {
  name: 'taxonomy-tag-curation',
  description: 'LLM-curate the two-axis observed/structure tags for the 730 reviewed-spine entries, correcting the noisy embedding-derived structure tags',
  phases: [{ title: 'Curate', detail: 'one agent per batch of ~22 spine entries' }],
}
const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const BATCHES = ROOT + "/catalog/_intermediate/curate_batches"
const OUT = ROOT + "/catalog/_intermediate/curate_out"
const N = 34

const TAX = `OBSERVED-DATA FAMILY (pick exactly ONE primary leaf; add a 2nd only if genuinely dual):
 discrete-observed:  count (unbounded counts: Poisson/NegBin) | proportion-of-n (k of n trials: Binomial/Beta-Binomial) | binary (0/1: Bernoulli/logit) | categorical (K unordered: softmax) | ordinal (ordered ratings: cumulative-logit)
 continuous-observed: real-valued (Normal/Student-t) | positive (Gamma/LogNormal/Weibull) | bounded-unit-interval (continuous [0,1]: Beta, NOT a count ratio) | censored-survival (time-to-event/censored) | multivariate-observed (joint vector outcome)
 computation-diagnostics (NO outcome family — use these when the entry is about the sampler/inference, not the data type):
   geometry-sampling (funnels, divergences, step-size/adapt_delta, treedepth, E-BFMI, mass-matrix, CP/NCP reparam) | convergence-diagnostics (R-hat, ESS, traceplots, warmup, MCSE) | model-evaluation (prior/posterior predictive checks, LOO/WAIC/PSIS, SBC, comparison) | priors-identifiability (weakly-informative/PC priors, pushforward, non-identifiability, label/sign switching, regularization)

MODEL STRUCTURE (0-2 tags; ONLY if clearly present — do NOT force one; many computation entries have none or just 'regression'):
 regression | hierarchical-multilevel | mixture | gaussian-process | time-series-state-space | spatial-areal | latent-factor | ode-dynamical | measurement-error-missing | sparse-shrinkage`

const idxs = Array.from({ length: N }, (_, i) => i)
const results = await parallel(idxs.map(i => () => agent(
`Curate the two-axis taxonomy tags for a batch of catalog entries. READ-ONLY except the one json file you write.

Read ${BATCHES}/batch_${String(i).padStart(2,'0')}.json — a list of {id, layer, text, embed_observed, embed_structure}. \`embed_*\` are a noisy embedding GUESS (the structure guess is especially unreliable — e.g. an adapt_delta/funnel claim was wrongly tagged 'sparse-shrinkage'). Your job is to CONFIRM or CORRECT each, using the entry's \`text\` and this taxonomy:

${TAX}

For EACH entry decide:
- observed: the ONE primary leaf naming the outcome/data type; or a computation-diagnostics leaf if the entry is about the sampler/inference rather than a data type (most claims are computation). Add a 2nd leaf only if truly dual.
- structure: 0-2 architecture tags that are CLEARLY present in the text. Be conservative — an entry about generic geometry/diagnostics often has NO structure tag (or only 'regression'). Drop spurious embed guesses like 'sparse-shrinkage' on a non-shrinkage entry.

Write ${OUT}/batch_${String(i).padStart(2,'0')}.json — a JSON list, one object per entry:
  {"id": "<id>", "observed": ["<leaf>", ...], "structure": ["<tag>", ...], "changed_observed": <bool>, "changed_structure": <bool>}
changed_* = true if you differ from the embed guess. Then return one line: "batch ${i}: <n> entries, <obs_changes> obs-fixed, <struct_changes> struct-fixed".`,
  { label: `cur:${i}`, phase: 'Curate' }
)))
log(`curation agents finished: ${results.filter(Boolean).length}/${N}`)
return { done: results.filter(Boolean).length }
