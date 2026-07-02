#!/usr/bin/env python3
"""Embedding step — regenerates the cross-cutting related-edges (and, in M2, the
semantic search vectors) from the catalog.

We do NOT train or fine-tune anything. We *embed* claim statements + rec headlines with a
**frozen, pretrained** model (nomic-embed-text-v1.5, 768-d, `search_document:` prefix) and take
each entry's nearest cross-page neighbors — "the same challenge in another model class." Knowledge
lives in the reviewable catalog, not in tuned weights; re-embedding is a deterministic build step,
not learning.

Requires the `semantic` extra:  pip install -e '.[semantic]'
Regenerate after any corpus change:  python process/pipeline/embed.py memoires/catalog

Emits:
  data/related_edges.json   "kind:page/id" -> [[neighbor_key, cos], ...]   (top-4 cross-page, ≥THRESH)
  data/entry_vectors.npz    (M2) keys + float32 matrix, shipped in the wheel for semantic search
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer

CAT = Path(sys.argv[1] if len(sys.argv) > 1 else 'memoires/catalog')
MODEL = 'nomic-ai/nomic-embed-text-v1.5'   # frozen; pin here if the version ever matters
THRESH = 0.72                               # min cosine for a related edge
TOPK = 4
MARK = r'[✓✗⚪](?:/[✓✗])?'


def entries():
    for f in sorted((CAT / 'pages').glob('*.md')):
        pg = f.stem
        t = f.read_text()
        for m in re.finditer(r'(?ms)^### (C\d+) · (.+?)\s*[🟢🟡⚪]?\s*$\n(.*?)(?=^### |^## |\Z)', t):
            st = re.search(r'\*\*Statement\.\*\*\s*(.+?)(?:\n\n|\n\*\*)', m.group(3), re.S)
            txt = m.group(2) + '. ' + (re.sub(r'\s+', ' ', st.group(1))[:350] if st else '')
            yield f'claim:{pg}/{m.group(1)}', txt
        body = t.split('## Practical', 1)
        if len(body) > 1:
            for m in re.finditer(rf'(?ms)^\*\*{MARK}\s*([A-Z]{{0,3}}\d+)\*\*(.*?)(?=\n- why|\Z)', body[1]):
                yield f'rec:{pg}/{m.group(1)}', re.sub(r'\s+', ' ', m.group(2))[:300]


def main():
    keys, txts = zip(*entries())
    keys, txts = list(keys), list(txts)
    print(f'embedding {len(keys)} entries with frozen {MODEL} …')
    model = SentenceTransformer(MODEL, trust_remote_code=True)
    V = np.asarray(model.encode(['search_document: ' + t for t in txts],
                                convert_to_numpy=True, batch_size=64), np.float32)
    V /= np.linalg.norm(V, axis=1, keepdims=True) + 1e-9

    pg = [k.split(':')[1].split('/')[0] for k in keys]
    S = V @ V.T
    np.fill_diagonal(S, 0)
    rel = {}
    for i, k in enumerate(keys):
        picks = [(keys[j], round(float(S[i, j]), 2))
                 for j in np.argsort(S[i])[::-1] if pg[j] != pg[i] and S[i, j] >= THRESH][:TOPK]
        if picks:
            rel[k] = picks
    json.dump(rel, open(CAT / 'data/related_edges.json', 'w'), indent=1, ensure_ascii=False)
    np.savez_compressed(CAT / 'data/entry_vectors.npz', keys=np.array(keys), vecs=V)  # for M2 semantic
    print(f'related edges: {sum(len(v) for v in rel.values())} across {len(rel)} entries; '
          f'vectors → data/entry_vectors.npz ({V.shape})')


if __name__ == '__main__':
    main()
