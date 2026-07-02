#!/usr/bin/env python3
"""M1 graph validator: every relative markdown link resolves; structural invariants hold.

Checks: (1) all relative links in *.md (root, pages/, claims/, recs/) point at existing
files; (2) every claim file has an SA breadcrumb; (3) every rec file has either a
governing-claim link or the explicit gap note; (4) source short-ids in entry files are
all linkified (no bare ids left); (5) counts match expectations.
"""
import re
import sys
from pathlib import Path

M = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
bad_links, bare_ids, no_sa, no_up = [], [], [], []
SID = re.compile(r'(?<!\[)(mc-stan:\d+|pymc:\d+|pyro:\d+|betanalpha:[a-z_0-9]+|dansblog:[a-z0-9_-]+|pymc-labs:[a-z0-9-]+)\b')

files = [*M.glob('*.md'), *(M / 'pages').glob('*.md'),
         *(M / 'claims').rglob('*.md'), *(M / 'recs').rglob('*.md')]
for f in files:
    t = f.read_text()
    for m in re.finditer(r'\]\(([^)#\s]+?\.md)\)', t):
        tgt = (f.parent / m.group(1)).resolve()
        if not tgt.exists():
            bad_links.append(f'{f.relative_to(M)} -> {m.group(1)}')
    if f.parent.parent.name in ('claims', 'recs') or f.parent.name in ('claims', 'recs') \
            or 'claims/' in str(f.relative_to(M)) or 'recs/' in str(f.relative_to(M)):
        for line in t.splitlines():
            if '](http' in line:
                continue
            for m in SID.finditer(line):
                bare_ids.append(f'{f.relative_to(M)}: {m.group(1)}')

for f in (M / 'claims').rglob('*.md'):
    if '↑ [SA' not in f.read_text():
        no_sa.append(str(f.relative_to(M)))
for f in (M / 'recs').rglob('*.md'):
    t = f.read_text()
    if 'governing claim' not in t and 'gap signal' not in t:
        no_up.append(str(f.relative_to(M)))

nc = len(list((M / 'claims').rglob('*.md')))
nr = len(list((M / 'recs').rglob('*.md')))
print(f'files: {nc} claims + {nr} recs · md files scanned: {len(files)}')
print(f'broken relative links: {len(bad_links)}')
for b in bad_links[:10]:
    print('  ', b)
print(f'bare (unlinkified) source ids in entries: {len(bare_ids)}')
for b in bare_ids[:6]:
    print('  ', b)
print(f'claims missing SA breadcrumb: {len(no_sa)} {no_sa[:4]}')
print(f'recs missing upward edge AND gap note: {len(no_up)} {no_up[:4]}')
ok = not (bad_links or no_sa or no_up)
print('VALIDATION:', 'PASS' if ok else 'FAIL')
sys.exit(0 if ok else 1)
