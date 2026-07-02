# Embedding — what it is, and what it is not

## We embed; we do not train
memoires uses a **frozen, pretrained** sentence-embedding model
(`nomic-ai/nomic-embed-text-v1.5`, 768-d, `search_document:` prefix). **Nothing is trained or
fine-tuned** — not the embedding model, not an LLM. Re-embedding is a deterministic *build step*
over the current catalog, the same way `render_graph.py` rebuilds the link structure.

This is deliberate and on-thesis: the catalog is the knowledge; when it changes, we re-run a
generator, not a training job. Updating knowledge = a reviewed, versioned commit — never a weight
update. (This is the continual-learning argument the project makes, applied to its own tooling.)

## What the embeddings are used for
- **v0.1 (shipped):** the cross-cutting **related-edges** only — each entry's nearest *cross-page*
  neighbors ("the same challenge in another model class"), precomputed into
  `data/related_edges.json`. **Search itself is lexical (sqlite FTS5), zero-dependency.**
- **M2 (planned):** semantic search. `data/entry_vectors.npz` (also emitted by `embed.py`) will
  ship in the wheel; a query is embedded on the fly and hybrid-reranked over FTS5 candidates. This
  is the `memoires[semantic]` extra — the base install stays dependency-free.

## Regenerating (after any corpus change)
```bash
pip install -e '.[semantic]'                       # sentence-transformers + numpy (dev/optional)
python process/pipeline/embed.py memoires/catalog  # rewrites related_edges.json (+ entry_vectors.npz)
python process/pipeline/render_graph.py memoires/catalog
python process/pipeline/validate_links.py memoires/catalog
```
The model download (~500 MB) is a one-time dev cost; **end users never need it for lexical search**,
and for M2 semantic search they download only the query-encoder, not any training pipeline.

## Provenance / pinning
- Model: `nomic-ai/nomic-embed-text-v1.5` (frozen; pin the revision in `embed.py::MODEL` if a future
  version would change neighbors).
- Thresholds: cross-page cosine ≥ 0.72, top-4 (in `embed.py`).
- Vectors are a **build artifact**, regenerable from the catalog at any time — not a source of truth.
