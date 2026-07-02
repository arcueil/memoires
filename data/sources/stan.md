# Source: Stan Discourse
- **What:** community Q&A + expert diagnoses — the largest practical-Bayesian corpus.
- **Where:** https://discourse.mc-stan.org
- **Fetched:** read-only via the public Discourse JSON API (`/t/<id>.json`), 2026-05/06.
- **Volume:** 17,598 thread JSONs (local only, gitignored).
- **License/ToS:** user-generated forum content; we publish only distilled entries with
  per-entry links back to the source thread (slug-resolved), never wholesale reproduction.
- **Resolution:** `mc-stan:<id>` → `https://discourse.mc-stan.org/t/<slug>/<id>` via
  `memoires/catalog/data/source_map.json`.
