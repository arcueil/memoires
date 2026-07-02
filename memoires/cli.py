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


def cmd_search(args):
    db = _index()
    where, params = "", [_fts_query(" ".join(args.query))]
    if args.kind:
        where = " AND kind = ?"
        params.append(args.kind)
    rows = db.execute(
        f"""SELECT key, kind, title, path,
                   snippet(e, 4, '[', ']', ' … ', 14) AS snip,
                   bm25(e, 8.0, 1.0, 2.0, 6.0, 1.0) AS rank
            FROM e WHERE e MATCH ?{where} ORDER BY rank LIMIT ?""",
        params + [args.k],
    ).fetchall()
    if not rows:
        print("no matches — try broader terms")
        return
    for key, kind, title, path, snip, _ in rows:
        src = re.search(r"\]\((https?://[^)]+)\)", open(_resolve(key)[0], encoding="utf-8").read())
        print(f"\n◆ [{kind}] {title[:100]}")
        print(f"  {re.sub(r'\\s+', ' ', snip)[:180]}")
        print(f"  ↳ {path}" + (f"  ·  source: {src.group(1)}" if src else ""))
    print(f"\n({len(rows)} results · `memoires show <page>/<id>` for the full entry, "
          f"`memoires graph <page>/<id>` for its edges)")


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
    s = sub.add_parser("search", help="full-text search over claims + recs")
    s.add_argument("query", nargs="+")
    s.add_argument("-k", type=int, default=8, help="max results")
    s.add_argument("--kind", choices=["claim", "rec"])
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
