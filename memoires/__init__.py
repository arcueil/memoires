"""memoires — the Arcueil catalog of Bayesian craft, as a searchable package.

The catalog (claims, recs, super-axioms, the evidence graph) ships inside the
package under ``memoires/catalog``; the CLI is a local search engine over it.
"""
from pathlib import Path

__version__ = "0.1.0"

CATALOG = Path(__file__).parent / "catalog"
