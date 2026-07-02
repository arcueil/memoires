export const meta = {
  name: 'claim-body-backfill',
  description: 'Regenerate the ## Evidence body for 153 body-less forum-sourced claims from their local raw Discourse threads, dropping non-supporting sources',
  phases: [{ title: 'Backfill', detail: 'one agent per claim — read raw threads, write attributed evidence body' }],
}

const ROOT = "/home/jp/rekursiv/bayesian-catalog"
const MANIFEST = `${ROOT}/catalog/_intermediate/backfill_manifest.json`
const OUTDIR = `${ROOT}/catalog/_intermediate/backfill_out`
const N = 153

const TEMPLATE = `## Evidence
- **[stan:24915]** ... Aki Vehtari corrected the beta-regression plan: "Beta is for continuous data, but based on your description the data is discrete and beta is then the wrong model and can be especially bad as there are many zeros." — \\\`avehtari / posts #15, #19\\\`
- **[stan:12228]** Max Mantei reconstructed the counts as Binomial(total trials, performance) ... noting fewer-trial obs "contain less information." — \\\`Max_Mantei / posts #9, #14\\\`

## Source
- [stan:24915](https://discourse.mc-stan.org/t/non-linear-distribution-with-some-zeros-in-data/24915)
- [stan:12228](https://discourse.mc-stan.org/t/trying-to-fit-my-costumised-logistic-function/12228)`

const idxs = Array.from({ length: N }, (_, i) => i)

const results = await parallel(idxs.map(i => () => agent(
`Regenerate the EVIDENCE BODY for one distilled Bayesian claim from its local source threads. READ-ONLY on the repo except the ONE json file you write at the end.

STEP 1 — read ${MANIFEST} and take entry index [${i}] (a list; 0-based). It has: \`id\`, \`stem\`, \`statement\`, \`naive_version\`, \`nuance\`, and \`sources\` = a list of {shortid, rawpath, canonical_url}. If index ${i} is out of range, just return "skip".

STEP 2 — read each source's \`rawpath\` (a Discourse topic JSON: \`post_stream.posts[]\`, each post has \`username\`, \`post_number\`, and \`cooked\` HTML or \`raw\` text; \`slug\`+\`id\` give the URL).

STEP 3 — write the evidence body in EXACTLY this house style (this is the approved level of summary):
${TEMPLATE}

RULES:
- 3–6 bullets total across the supporting sources. Each bullet: \`- **[shortid]** <faithful, specific evidentiary point — short verbatim quote where load-bearing> — \\\`username / post #N\\\`\`. Attribute to the real participant; cite the post number.
- FAITHFULNESS OVER COMPLETENESS. Never invent numbers, quotes, or claims not in the threads.
- DROP non-supporting sources. If a cited source does NOT actually support THIS claim (off-topic / tangential / about a different model), do NOT write a bullet for it and do NOT include it in the Source list — record it in \`dropped\` with a one-line reason. (Example: a Poisson-mixture thread cited under a proportion/binomial claim → drop it.)
- The ## Source list contains ONLY the sources you kept, as \`- [shortid](canonical_url)\`.

STEP 4 — write your result as JSON to ${OUTDIR}/<stem>.json (use the entry's \`stem\`), with keys:
  { "stem": "<stem>", "body": "<the full markdown: '## Evidence\\n...\\n\\n## Source\\n...'>", "source_urls": ["<canonical_url of each KEPT source>", ...], "dropped": [{"shortid":"...","reason":"..."}] }
Then return one line: "<stem>: <n_kept> kept, <n_dropped> dropped".`,
  { label: `bf:${i}`, phase: 'Backfill' }
)))

log(`backfill agents finished: ${results.filter(Boolean).length}/${N}`)
return { done: results.filter(Boolean).length }
