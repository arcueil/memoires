"""The memoires CLI — a local search engine over the catalog.

The promise: instead of searching a forum with three keywords and reading five
half-relevant threads, search the distilled, evidence-graded catalog — and get
the governing principle, the conditions, the sources, and the same challenge in
other model classes.

Zero-dependency core: sqlite FTS5 (stdlib), built in-memory per invocation
(~700 entries, <1s). Semantic search ships later as ``memoires[semantic]``.

Usage:
    memoires search "divergences hierarchical funnel"      # the search engine
    memoires search --kind rec "horseshoe doesn't work"
    memoires show hierarchical-multilevel/C2                # one entry, full
    memoires graph hierarchical-multilevel/P4               # its edges
    memoires stats
"""
from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
from pathlib import Path

from . import CATALOG, __version__

MARK = re.compile(r"^# ([✓✗⚪](?:/[✓✗])?\s+)?")


def _entries():
    for kind, d in (("claim", "claims"), ("rec", "recs")):
        root = CATALOG / d
        if not root.exists():
            continue
        for f in sorted(root.rglob("*.md")):
            text = f.read_text(encoding="utf-8")
            title = text.splitlines()[0].lstrip("# ").strip()
            yield {
                "key": f"{f.parent.name}/{f.stem}",
                "kind": kind,
                "page": f.parent.name,
                "title": title,
                "body": text,
                "path": str(f.relative_to(CATALOG.parent.parent)) if "memoires" in str(f) else str(f),
            }


def _index():
    db = sqlite3.connect(":memory:")
    db.execute(
        "CREATE VIRTUAL TABLE e USING fts5(key, kind, page, title, body, path UNINDEXED)"
    )
    with db:
        db.executemany(
            "INSERT INTO e VALUES (?,?,?,?,?,?)",
            [(x["key"], x["kind"], x["page"], x["title"], x["body"], x["path"]) for x in _entries()],
        )
    return db


def _fts_query(q: str) -> str:
    terms = [t for t in re.findall(r"[A-Za-z0-9_π²τσ✓✗-]+", q) if len(t) > 1]
    return " OR ".join(f'"{t}"' for t in terms) or '""'


def _fts_ranked(db, query, kind, limit):
    where, params = "", [_fts_query(query)]
    if kind:
        where, _ = " AND kind = ?", params.append(kind)
    return [r[0] for r in db.execute(
        f"""SELECT key FROM e WHERE e MATCH ?{where}
            ORDER BY bm25(e, 8.0, 1.0, 2.0, 6.0, 1.0) LIMIT ?""",
        params + [limit]).fetchall()]


def _semantic_index():
    """Lazy-load the shipped vector index; returns (keys, matrix, query_encoder) or None if the
    `semantic` extra / vectors aren't present — the CLI then degrades to lexical search."""
    npz = CATALOG / "data" / "entry_vectors.npz"
    if not npz.exists():
        return None
    try:
        import numpy as np
        from sentence_transformers import SentenceTransformer
    except ModuleNotFoundError:
        return None
    d = np.load(npz, allow_pickle=True)
    keys = list(d["keys"])
    V = d["vecs"].astype("float32")
    model = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", trust_remote_code=True)

    def rank(query, kind, limit):
        import numpy as np
        q = model.encode(["search_query: " + query], convert_to_numpy=True).astype("float32")[0]
        q /= np.linalg.norm(q) + 1e-9
        order = np.argsort(V @ q)[::-1]
        out = []
        for i in order:
            k = keys[i]
            if kind and not k.startswith(kind + ":"):
                continue
            out.append(k.split(":", 1)[1])
            if len(out) >= limit:
                break
        return out
    return rank


def _rrf(*rankings, k=60):
    """Reciprocal-rank fusion — combine lexical + semantic orderings without score calibration."""
    score = {}
    for ranking in rankings:
        for rank, key in enumerate(ranking):
            score[key] = score.get(key, 0.0) + 1.0 / (k + rank + 1)
    return [key for key, _ in sorted(score.items(), key=lambda kv: -kv[1])]


def cmd_search(args):
    db = _index()
    query = " ".join(args.query)
    fts = _fts_ranked(db, query, args.kind, 40)   # candidate page/id refs, ranked by bm25

    sem = None if args.lexical else _semantic_index()
    if args.semantic and sem is None:
        print("semantic search unavailable — run `pip install memoires[semantic]`. Falling back to lexical.")
    if sem is not None:
        semantic = sem(query, args.kind, 40)
        order = semantic if args.semantic else _rrf(fts, semantic)
        mode = "semantic" if args.semantic else "hybrid (lexical + semantic)"
    else:
        order = fts
        mode = "lexical"
    excl = set(getattr(args, "exclude_source", None) or [])
    picked = []
    for ref in order:
        try:
            p, kind = _resolve(ref)
        except SystemExit:
            continue
        body = p.read_text(encoding="utf-8")
        if excl and any(s in body for s in excl):   # contamination guard: skip entries citing an excluded source
            continue
        picked.append((ref, kind, p, body))
        if len(picked) >= args.k:
            break
    if not picked:
        print("no matches — try broader terms" + ("" if sem else " (or install [semantic])"))
        return
    order = [r for r, *_ in picked]
    for ref, kind, p, t in picked:
        title = t.splitlines()[0].lstrip("# ").strip()
        src = re.search(r"\]\((https?://[^)]+)\)", t)
        print(f"\n◆ [{kind}] {title[:100]}")
        print(f"  ↳ {ref}" + (f"  ·  source: {src.group(1)}" if src else ""))
    print(f"\n({len(order)} results · {mode} · `memoires show <page>/<id>` full entry · "
          f"`memoires graph <page>/<id>` edges)")


def _resolve(ref: str):
    ref = ref.strip().strip("/")
    for d, kind in (("claims", "claim"), ("recs", "rec")):
        p = CATALOG / d / (ref + ".md")
        if p.exists():
            return p, kind
    hits = [p for p in CATALOG.rglob(f"{ref.split('/')[-1]}.md")
            if ref.split("/")[0] in str(p.parent)]
    if len(hits) == 1:
        return hits[0], hits[0].parent.parent.name.rstrip("s")
    sys.exit(f"cannot resolve entry '{ref}' (want <page>/<id>, e.g. hierarchical-multilevel/C2)")


def cmd_show(args):
    p, _ = _resolve(args.ref)
    print(p.read_text(encoding="utf-8"))


def cmd_graph(args):
    p, kind = _resolve(args.ref)
    page, eid = p.parent.name, p.stem
    key = f"{page}/{eid}"
    data = CATALOG / "data"
    sa = json.load(open(data / "claim_sa_edges.json"))
    rc = json.load(open(data / "rec_claim_edges.json"))
    rel = json.load(open(data / "related_edges.json"))
    print(f"◆ {kind} {key}\n")
    if kind == "claim":
        print(f"  ↑ super-axiom: {sa.get(key, '—')}")
        down = sorted(r for r, cl in rc.items() if key in cl)
        print(f"  ↓ grounds {len(down)} recs: {', '.join(down[:12])}" + (" …" if len(down) > 12 else ""))
    else:
        ups = rc.get(key, [])
        print(f"  ↑ governing claims: {', '.join(ups) if ups else '— (gap signal)'}")
    for k, sim in rel.get(f"{kind}:{key}", []):
        print(f"  ↔ {k.split(':', 1)[1]}  ({sim})")


def cmd_stats(_):
    nc = len(list((CATALOG / "claims").rglob("*.md")))
    nr = len(list((CATALOG / "recs").rglob("*.md")))
    rc = json.load(open(CATALOG / "data/rec_claim_edges.json"))
    rel = json.load(open(CATALOG / "data/related_edges.json"))
    smap = json.load(open(CATALOG / "data/source_map.json"))
    print(f"memoires {__version__}")
    print(f"  7 super-axioms → {nc} claims → {nr} recs")
    print(f"  rec→claim edges: {len(rc)} · related links: {sum(len(v) for v in rel.values())}")
    print(f"  resolvable sources: {len(smap)} (forums, case studies, pymc-labs)")


def main(argv=None):
    ap = argparse.ArgumentParser(
        prog="memoires",
        description="Search the Arcueil catalog of Bayesian craft — instead of googling it.",
    )
    ap.add_argument("--version", action="version", version=f"memoires {__version__}")
    sub = ap.add_subparsers(required=True)
    s = sub.add_parser("search", help="search claims + recs (hybrid lexical+semantic when installed)")
    s.add_argument("query", nargs="+")
    s.add_argument("-k", type=int, default=8, help="max results")
    s.add_argument("--kind", choices=["claim", "rec"])
    g = s.add_mutually_exclusive_group()
    g.add_argument("--semantic", "-s", action="store_true", help="pure semantic (needs [semantic] extra)")
    g.add_argument("--lexical", "-l", action="store_true", help="force lexical FTS5 only")
    s.add_argument("--exclude-source", action="append", metavar="ID",
                   help="drop entries citing this source id (repeatable; for leak-free evaluation)")
    s.set_defaults(fn=cmd_search)
    s = sub.add_parser("show", help="print one entry (page/id)")
    s.add_argument("ref")
    s.set_defaults(fn=cmd_show)
    s = sub.add_parser("graph", help="print an entry's edges (up / down / related)")
    s.add_argument("ref")
    s.set_defaults(fn=cmd_graph)
    s = sub.add_parser("stats", help="catalog statistics")
    s.set_defaults(fn=cmd_stats)
    args = ap.parse_args(argv)
    args.fn(args)


if __name__ == "__main__":
    main()
