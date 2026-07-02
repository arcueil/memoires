# Mémoires

*The [Arcueil](https://github.com/arcueil) catalog of Bayesian craft — curated, evidence-graded,
contradiction-aware. Named for the* Mémoires de la Société d'Arcueil*, and read by
[jaynes-robot](https://github.com/arcueil/jaynes-robot). License: CC BY 4.0.*

## Why this exists

When your hierarchical model diverges, you search the Stan forum with three keywords and read
five half-relevant threads. **Search this catalog instead**: the same community knowledge —
≈27.5k forum threads (Stan/PyMC/Pyro) + the Betancourt and Simpson corpora + a human-curated
[pymc-labs peer layer](memoires/catalog/pymc_L1/README.md) — distilled, adversarially reviewed, evidence-graded,
and organized so that every answer comes with **cross-cutting evidence**: the same challenge in
other model classes, the same model in other libraries, and the principle that explains *why*.


## Use it

```bash
pip install memoires        # zero-dependency core (stdlib sqlite FTS5)

memoires search "divergences hierarchical funnel"   # the search engine
memoires show  hierarchical-multilevel/C2            # one entry, with all its edges
memoires graph hierarchical-multilevel/P4            # ↑ claims · ↔ related · sources
memoires stats
```

Also browsable entirely on GitHub — every entry is a markdown node with clickable edges.

## Repository structure

```
memoires/    the pip package: the catalog (claims/recs/super-axioms + graph data) and the CLI —
             a local search engine, and the foundation for the MCP server agents will use
process/     how it is built: pipeline, audits, methodology, experiments, provenance,
             worklog (the forking path), roadmap, update procedure
data/        raw sources (gitignored) + one provenance note per source (tracked)
```

## The evidence graph

Nothing here asks to be trusted on authority — every entry is a node in an explicit, clickable
graph, so you can always see **where it comes from**:

```
7  super-axioms      the leanest why                 SUPER_AXIOMS.md
      ↑ subsumes (82/82, verified bijection)
82 claims            mid-level principles            memoires/catalog/claims/<page>/<C-id>.md
      ↑ grounds (613 edges; 27 honest gaps)
640 recs             "for model X / when you see Y   memoires/catalog/recs/<page>/<id>.md
                      → works ✓ / doesn't ✗ (+conditions)"
      → sources      307 short-ids, ALL resolving    memoires/catalog/data/source_map.json
                     to clickable forum threads,
                     blog case studies, pymc-labs skills
      ↔ related      2,886 cross-page links          "similar challenge, other models"
```

Every **claim** file: statement → nuance → conditions → tier, its super-axiom (↑), the recs it
grounds (↓), clickable sources, and related entries across the catalog. Every **rec** file: the
✓/✗ verdict with its conditions, the governing claim(s) (↑), attached diagnostic moves, an
`efficacy` slot for empirical grounding, clickable sources, and cross-cutting neighbors.

## How to read it

- **Top-down** — [SUPER_AXIOMS.md](memoires/catalog/SUPER_AXIOMS.md) → follow subsumes-links down into claims →
  practical evidence.
- **By your model** — the pages below are index/summary views; every entry links to its full
  node.
- **By your symptom** — the cross-cutting pages are indexed by what you actually see
  (divergences, R̂ alarms, treedepth, prior doubt).
- **The spine** — [CLAIMS_SPINE.md](memoires/catalog/CLAIMS_SPINE.md), all 82 claims on one page.

## Cross-cutting (computation & diagnostics — apply across all models)

- **[Posterior geometry & gradient-based sampling](memoires/catalog/pages/CC-geometry-sampling.md)**
- **[Priors & identifiability](memoires/catalog/pages/CC-priors-identifiability.md)**
- **[Model evaluation](memoires/catalog/pages/CC-model-evaluation.md)**
- **[Convergence & Monte-Carlo reliability diagnostics](memoires/catalog/pages/CC-convergence-diagnostics.md)**
- **[Decision theory](memoires/catalog/pages/CC-decision-theory.md)** *(seeded — thin by honest design)*

## By model class *(a navigation tag, not the only axis)*

[Regression](memoires/catalog/pages/regression.md) · [Hierarchical / multilevel](memoires/catalog/pages/hierarchical-multilevel.md) ·
[Mixtures](memoires/catalog/pages/mixture.md) · [Gaussian processes](memoires/catalog/pages/gaussian-process.md) ·
[Time series & state space](memoires/catalog/pages/time-series-state-space.md) · [Spatial & areal](memoires/catalog/pages/spatial-areal.md) ·
[Latent factor](memoires/catalog/pages/latent-factor.md) · [ODE / dynamical](memoires/catalog/pages/ode-dynamical.md) ·
[Measurement error & missingness](memoires/catalog/pages/measurement-error-missing.md) ·
[Sparse regression & shrinkage](memoires/catalog/pages/sparse-shrinkage.md)

## Trust, stated plainly

The catalog's own quality is evidence-graded, like its contents: claims reviewed for
over-generalization (75/76 faithful, the 1 fixed), the error-dense rec class rigorously swept,
a 50-entry adversarial release review with double independent verification (10 defects found and
fixed), and an external cross-check against human-curated expert material in which **5 of 7
disagreements resolved in this catalog's favor**. Full methodology and bounds:
[PROVENANCE.md](process/PROVENANCE.md) · [audits/](process/audits/) · [methodology/](process/methodology/). Known
limitations: [GAPS.md](memoires/catalog/GAPS.md).

---

*« La théorie des probabilités n'est, au fond, que le bon sens réduit au calcul. »* — Laplace
