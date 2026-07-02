# Releasing

## Automated (the normal path)
1. Bump `version` in `pyproject.toml` + `memoires/__init__.py`; regenerate + validate:
   ```bash
   python process/pipeline/render_graph.py memoires/catalog
   python process/pipeline/validate_links.py memoires/catalog   # must PASS
   ```
2. Commit, tag, push:
   ```bash
   git commit -am "Release vX.Y.Z" && git tag vX.Y.Z && git push --follow-tags
   ```
3. Create the GitHub Release — this triggers `publish.yml` → PyPI:
   ```bash
   gh release create vX.Y.Z --generate-notes
   ```
   `.github/workflows/ci.yml` gates every push; `publish.yml` ships the release to PyPI.

## One-time PyPI setup (Trusted Publishing — no token, no secret)
On https://pypi.org/manage/project/memoires/settings/publishing → **Add a pending/trusted publisher**:
- Owner: `arcueil` · Repository: `memoires` · Workflow: `publish.yml` · (Environment: leave blank)

After that, releases publish themselves via OIDC — GitHub mints a short-lived identity token per run;
nothing is stored. (The initial 0.1.0/0.2.0 were pushed manually with a token; trusted publishing
replaces that going forward.)
