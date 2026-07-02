#!/usr/bin/env python3
"""M1 evidence-graph renderer.

Explodes the page corpus into per-entry files with explicit, clickable graph edges:

    super-axioms  <-up-  claims  <-up-  recs                  (structure)
    claims/recs  ->  blog & forum URLs                        (provenance)
    every entry  ->  cross-page related entries               (cross-cutting evidence)

Inputs:  pages/*.md, SUPER_AXIOMS.md,
         data/{source_map,claim_sa_edges,rec_claim_edges,related_edges}.json
Outputs: claims/<page>/<Cid>.md, recs/<page>/<id>.md,
         patched SUPER_AXIOMS.md / pages/*.md / CLAIMS_SPINE.md (links injected)

Rec marks: ✓, ✗, ✓/✗, ✗/✓, ⚪ (candidate). Rec ids are unique per page, so files
are id-only (ASCII-safe). Deterministic; idempotent link injection.
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

M = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
smap = json.load(open(M / 'data/source_map.json'))
sa_of = json.load(open(M / 'data/claim_sa_edges.json'))          # "page/Cn" -> "SAk"
rec_claims = json.load(open(M / 'data/rec_claim_edges.json'))    # "page/id" -> ["page/Cn", ...]
related = json.load(open(M / 'data/related_edges.json'))         # "kind:page/id" -> [[key, sim], ...]

SID = r'(mc-stan:\d+|pymc:\d+|pyro:\d+|betanalpha:[a-z_0-9]+|dansblog:[a-z0-9_-]+|pymc-labs:[a-z0-9-]+)'
MARK = r'([✓✗⚪](?:/[✓✗])?)'
# permalinks previously injected into pages/ — stripped before body extraction so render is idempotent
PERMA = re.compile(r'\s*\*\[→ (?:full entry|entry)\]\([^)]*\)\*')


def linkify(text: str) -> str:
    out = []
    for line in text.splitlines():
        if '](http' not in line:
            line = re.sub(SID, lambda m: f'[{m.group(1)}]({smap[m.group(1)]})'
                          if m.group(1) in smap else m.group(1), line)
        out.append(line)
    return '\n'.join(out)


def entry_link(key: str) -> str:
    kind, rest = key.split(':', 1)
    pg, eid = rest.split('/', 1)
    d = 'claims' if kind == 'claim' else 'recs'
    return f'../../{d}/{pg}/{eid}.md'


def related_block(key: str, titles: dict) -> str:
    picks = related.get(key, [])
    if not picks:
        return ''
    lines = ['\n## Related across the catalog\n',
             '*Similar challenges in other model classes / computation areas '
             '(embedding neighbors):*\n']
    for k, sim in picks:
        lines.append(f'- [{titles.get(k, k.split(":", 1)[1])}]({entry_link(k)}) `{sim:.2f}`')
    return '\n'.join(lines) + '\n'


# ---------- parse ----------
pages = sorted((M / 'pages').glob('*.md'))
claims, recs, titles, page_title = {}, {}, {}, {}
for f in pages:
    pg = f.stem
    t = PERMA.sub('', f.read_text())   # strip any prior-render permalinks -> idempotent extraction
    page_title[pg] = re.search(r'^# (.+)$', t, re.M).group(1)
    for m in re.finditer(r'(?ms)^### (C\d+) · (.+?)\s*([🟢🟡⚪])?\s*$\n(.*?)(?=^### |^## |\Z)', t):
        claims[f'{pg}/{m.group(1)}'] = {'title': m.group(2), 'glyph': m.group(3) or '',
                                        'body': m.group(4).strip()}
        titles[f'claim:{pg}/{m.group(1)}'] = f'{pg} {m.group(1)} · {m.group(2)[:70]}'
    body = t.split('## Practical', 1)
    if len(body) > 1:
        for m in re.finditer(rf'(?ms)^\*\*{MARK}\s*([A-Z]{{0,3}}\d+)\*\*(.*?)(?=^\*\*[✓✗⚪]|^### |^## |\Z)',
                             body[1]):
            d, rid, blk = m.group(1), m.group(2), m.group(3)
            head = re.sub(r'\s+', ' ', blk.split('\n-')[0]).strip(' ·')
            recs[f'{pg}/{rid}'] = {'dir': d, 'rid': rid, 'head': head, 'body': blk.rstrip()}
            titles[f'rec:{pg}/{rid}'] = f'{d} {pg} {rid} · {head[:70]}'

recs_of = defaultdict(list)
for rk, cl in rec_claims.items():
    for c in cl:
        recs_of[c].append(rk)

sat = {m.group(1): m.group(2) for m in
       re.finditer(r'^### (SA\d+) · (.+?)\s*$', (M / 'SUPER_AXIOMS.md').read_text(), re.M)}

# ---------- claims ----------
for ck, c in claims.items():
    pg, cid = ck.split('/')
    sa = sa_of.get(ck)
    out = [f'# {cid} · {c["title"]} {c["glyph"]}'.rstrip(), '']
    crumb = [f'[{page_title[pg]}](../../pages/{pg}.md)']
    if sa:
        crumb.insert(0, f'**↑ [{sa} · {sat.get(sa, "")[:60]}](../../SUPER_AXIOMS.md)**')
    out += [' · '.join(crumb), '', linkify(c['body']), '']
    ev = sorted(recs_of.get(ck, []))
    if ev:
        out += ['## Practical evidence — recs grounded in this claim', '']
        for rk in ev:
            r = recs.get(rk)
            if r:
                rpg, rid = rk.split('/')
                out.append(f'- [{r["dir"]} {rid}](../../recs/{rpg}/{rid}.md) — {r["head"][:110]}')
        out.append('')
    out.append(related_block(f'claim:{ck}', titles))
    p = M / 'claims' / pg / f'{cid}.md'
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text('\n'.join(out).rstrip() + '\n')

# ---------- recs ----------
for rk, r in recs.items():
    pg, rid = rk.split('/')
    out = [f'# {r["dir"]} {rid} · {r["head"][:120]}', '',
           f'[{page_title[pg]}](../../pages/{pg}.md)', '']
    ups = rec_claims.get(rk, [])
    if ups:
        out += ['**Why this holds — the governing claim' + ('s' if len(ups) > 1 else '') + ':**', '']
        for c in ups:
            cpg, cid = c.split('/')
            cc = claims.get(c)
            if cc:
                out.append(f'- ↑ [{cpg} {cid} · {cc["title"][:80]}](../../claims/{cpg}/{cid}.md)')
        out.append('')
    else:
        out += ['*No governing claim in the current spine — an honest gap signal '
                '(see data/unassigned_recs.json).*', '']
    out += [f'**{r["dir"]} {rid}** {linkify(r["body"])}', '']
    out.append(related_block(f'rec:{rk}', titles))
    p = M / 'recs' / pg / f'{rid}.md'
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text('\n'.join(out).rstrip() + '\n')

# ---------- patch SUPER_AXIOMS ----------
t = (M / 'SUPER_AXIOMS.md').read_text()
def _sub(m):
    pg, cid = m.group(1), m.group(2)
    return (f'[{pg} {cid}](claims/{pg}/{cid}.md) ·' if f'{pg}/{cid}' in claims else m.group(0))
t = re.sub(r'(?<!\[)([A-Za-z-]+(?:-[A-Za-z-]+)*)\s+(C\d+)\s*·', _sub, t)
(M / 'SUPER_AXIOMS.md').write_text(t)

# ---------- patch pages + spine (strip-then-reinject -> idempotent for new entries) ----------
for f in pages:
    pg = f.stem
    t = PERMA.sub('', f.read_text())
    t = re.sub(r'(?m)^(### (C\d+) · .+)$',
               lambda m: f'{m.group(1)}\n*[→ full entry](../claims/{pg}/{m.group(2)}.md)*', t)
    def _rl(m):
        return (f'{m.group(1)} *[→ entry](../recs/{pg}/{m.group(3)}.md)*'
                if f'{pg}/{m.group(3)}' in recs else m.group(1))
    t = re.sub(rf'(?m)^(\*\*{MARK}\s*([A-Z]{{0,3}}\d+)\*\*.*)$', _rl, t)
    f.write_text(t)

sp = M / 'CLAIMS_SPINE.md'
t = sp.read_text()
if '](claims/' not in t:
    tit2pg = {v: k for k, v in page_title.items()}
    cur = None
    out = []
    for line in t.splitlines():
        h = re.match(r'^## (.+)$', line)
        if h:
            cur = tit2pg.get(h.group(1))
        if cur and re.match(r'^- \*\*C\d+ · ', line):
            line = re.sub(r'^- \*\*(C\d+)',
                          lambda m: f'- **[{m.group(1)}](claims/{cur}/{m.group(1)}.md)', line, count=1)
        out.append(line)
    sp.write_text('\n'.join(out) + '\n')

print(f'rendered {len(claims)} claims + {len(recs)} recs; patched SUPER_AXIOMS, '
      f'{len(pages)} pages, spine')
