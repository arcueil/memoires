# ENRICHMENTS.md — unplaced items

Enrichment proposals whose target is not a resolvable per-entry claim/rec node in the graph.

---

### Missing caveats: pm.do gives P(y|do(x)) only WITHIN the assumed graph, and the example estimates ATE from prior predictive not posterior
*📐 portable*

Attach our central caveat to the library-note: (1) pm.do is graph surgery on the *assumed* model - if the graph omits a confounder, the interventional estimate is wrong and diagnostic-silent exactly as CF1/CF3/CF8/SA2 warn; pm.do is not a substitute for getting the marginal-covariate/confounder structure right. (2) The file's 'Causal Effect Estimation' computes ATE via pm.sample_prior_predictive() - for a data-informed effect the model must be FIT first and interventions pushed through the POSTERIOR predictive (SA1/C4: derived quantities through the full generative process). Not a contradiction (pm.do builds the full model, aligning with Betancourt), but the confounding-invisibility and fit-then-intervene caveats are the load-bearing message the pymc file omits.

**Why unplaced:** the named target is "the library-note" — a pymc-labs technique/library-note that lives in the pymc_L1 TECHNIQUES layer, not a claim/rec node in the per-entry graph. The ids it cites (CF1/CF3/CF8/SA2, SA1/C4) are the *sources* of the caveat, not the append target; those entries already carry it. Direction is catalog → library-note, so there is nothing to graft onto within claims/ or recs/.
*Source: pymc-labs (human-curated).*

---

# TECHNIQUES.md — unplaced items

Generic PyMC/ArviZ plumbing or pure tooling that operationalizes no single catalog entry; kept
here rather than force-fit.

- **Parameter vs observation shape mismatch: group param is shape (K,), likelihood is size N; index-expand via alpha[group_idx]** — generic PyMC group-index shape mechanics (likelihood size is always N, map via `pd.factorize`/`group_idx`, `mu = alpha[group_idx]`); no catalog entry is about plain group-indexing plumbing — the hierarchical entries are all about geometry/priors/identifiability, assuming the model is already built. *Source: [pymc-labs:pymc-modeling](https://github.com/pymc-labs/python-analytics-skills)*
- **Consistent factorization across train/test splits; independent per-level indices** — pandas coding-bookkeeping (`pd.Categorical`/`.cat.codes` for codes stable across splits; independent `pd.factorize` per level for nested hierarchies); no catalog entry operationalizes group-code bookkeeping. *Source: [pymc-labs:pymc-modeling](https://github.com/pymc-labs/python-analytics-skills)*
- **PyMC 6+ / ArviZ API deprecations** — pure API-deprecation hygiene (variable name != dim label ValueError; `pm.MutableData`/`ConstantData` removed -> `pm.Data`; `az.plot_ppc_dist` uses `num_samples=`); self-described as low statistical value, with no entry to operationalize. *Source: [pymc-labs:pymc-modeling](https://github.com/pymc-labs/python-analytics-skills)*
- **Compressed NetCDF persistence of large idata (DataTree)** — pure persistence tooling (`idata.to_netcdf(engine="h5netcdf", encoding={var:{"zlib":True,"complevel":4}})` cuts file size 50-80%); self-described "pure tooling, low statistical value," no statistical entry. *Source: [pymc-labs:arviz](https://github.com/pymc-labs/python-analytics-skills)*
