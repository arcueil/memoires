#!/usr/bin/env python3
"""Embedding step — the L2 semantic index + the cross-cutting related-edges.

We do NOT train or fine-tune anything. We *embed* the full substantive content of each entry with a
**frozen, pretrained** model (nomic-embed-text-v1.5, 768-d). Corpus text uses the `search_document:`
prefix; queries (in the CLI) use `search_query:` — nomic's asymmetric convention. Knowledge lives in
the reviewable catalog, not in tuned weights; re-embedding is a deterministic build step.

Requires the `semantic` extra:  pip install -e '.[semantic]'
Regenerate after any corpus change:  python process/pipeline/embed.py memoires/catalog

Emits (both shipped in the wheel):
  data/entry_vectors.npz    keys[] + float32 (N,768)  — the semantic search index (M2)
  data/related_edges.json   "kind:page/id" -> [[neighbor, cos], ...]  (top-4 cross-page, ≥THRESH)
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer

CAT = Path(sys.argv[1] if len(sys.argv) > 1 else 'memoires/catalog')
MODEL = 'nomic-ai/nomic-embed-text-v1.5'   # frozen
THRESH, TOPK = 0.72, 4
MARK = r'[✓✗⚪](?:/[✓✗])?'


def entries():
    """Yield (key, rich_text) — the full substantive content, so semantic search matches meaning
    (a query about 'slow sampling no divergences' finds ill-conditioning entries even w/o the words)."""
    for f in sorted((CAT / 'pages').glob('*.md')):
        pg = f.stem
        t = f.read_text()
        for m in re.finditer(r'(?ms)^### (C\d+) · (.+?)\s*[🟢🟡⚪]?\s*$\n(.*?)(?=^### |^## |\Z)', t):
            cid, title, body = m.group(1), m.group(2), m.group(3)
            parts = [title]
            for field in ('Statement', 'Nuance', 'Conditions'):
                fm = re.search(rf'\*\*{field}\.\*\*\s*(.+?)(?:\n\n|\n\*\*|\Z)', body, re.S)
                if fm:
                    parts.append(re.sub(r'\s+', ' ', fm.group(1)))
            yield f'claim:{pg}/{cid}', ' '.join(parts)[:1600]
        prac = t.split('## Practical', 1)
        if len(prac) > 1:
            for m in re.finditer(rf'(?ms)^\*\*{MARK}\s*([A-Z]{{0,3}}\d+)\*\*(.*?)(?=^\*\*[✓✗⚪]|^### |^## |\Z)',
                                 prac[1]):
                rid, blk = m.group(1), m.group(2)
                head = blk.split('\n-')[0]
                why = re.search(r'- why:\s*(.+)', blk)
                cond = re.search(r'- conditions:\s*(.+)', blk)
                txt = ' '.join(re.sub(r'\s+', ' ', x) for x in
                               (head, why.group(1) if why else '', cond.group(1) if cond else '') if x)
                yield f'rec:{pg}/{rid}', txt[:1000]


def main():
    keys, txts = map(list, zip(*entries()))
    print(f'embedding {len(keys)} entries (full content) with frozen {MODEL} …')
    model = SentenceTransformer(MODEL, trust_remote_code=True)
    V = np.asarray(model.encode(['search_document: ' + t for t in txts],
                                convert_to_numpy=True, batch_size=64), np.float32)
    V /= np.linalg.norm(V, axis=1, keepdims=True) + 1e-9
    np.savez_compressed(CAT / 'data/entry_vectors.npz', keys=np.array(keys), vecs=V)

    pg = [k.split(':')[1].split('/')[0] for k in keys]
    S = V @ V.T
    np.fill_diagonal(S, 0)
    rel = {k: [(keys[j], round(float(S[i, j]), 2))
               for j in np.argsort(S[i])[::-1] if pg[j] != pg[i] and S[i, j] >= THRESH][:TOPK]
           for i, k in enumerate(keys)}
    rel = {k: v for k, v in rel.items() if v}
    json.dump(rel, open(CAT / 'data/related_edges.json', 'w'), indent=1, ensure_ascii=False)
    print(f'entry_vectors.npz {V.shape} · related edges {sum(len(v) for v in rel.values())}')


if __name__ == '__main__':
    main()
