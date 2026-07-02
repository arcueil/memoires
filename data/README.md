# data/ — raw sources (gitignored) + provenance notes (tracked)

The raw corpora live here locally and are **never committed** (see `.gitignore`); what ships is
the distilled catalog with per-entry links back to every source. Each file in `sources/`
documents one source: what it is, where it lives, how it was fetched, volume, and license
posture. `data/raw` is a local symlink to the working archive.
