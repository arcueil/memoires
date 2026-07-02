# Artifact map — where every layer of the paper trail lives

| layer | where | committed? |
|---|---|---|
| product (catalog + CLI + graph) | this repo (`memoires/`) | ✅ public (on release) |
| how it was built (pipeline, audits, methodology, provenance, worklog) | this repo (`process/`) | ✅ public |
| the experiment itself — maintainer steers, agent inputs, forks, session transcripts, build intermediates, the pre-audit 446-claim granular corpus | [`arcueil/carnets`](https://github.com/arcueil/carnets) (private lab notebooks) | ✅ private |
| raw sources (≈27.5k threads + blog mirrors, 1.5 GB) | local archive only; described per-source in [`data/sources/`](../data/sources/) | ❌ never |

Rationale: intermediates are superseded predecessors containing pre-audit content (incl. the 49
fabrications the review removed) and verbatim forum text — valuable as *data about the process*,
wrong to ship as *product*. They are version-controlled in carnets so the N=1 experiment that
produced this catalog — and the method it seeds — is never lost.
