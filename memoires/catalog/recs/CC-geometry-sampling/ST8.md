# ⚪ ST8 · when **step-size adaptation "crashes" (step size spirals toward 0) during warmup** on a model with a discontinuous log-d

[Cross-cutting: Posterior geometry & gradient-based sampling (HMC/NUTS)](../../pages/CC-geometry-sampling.md)

**Why this holds — the governing claims:**

- ↑ [CC-geometry-sampling C7 · Beneath geometry sits a *machinery* layer — initialization & gradient correctnes](../../claims/CC-geometry-sampling/C7.md)
- ↑ [CC-geometry-sampling C6 · Discrete, multimodal, and parameter-dependent-support structure is outside gradi](../../claims/CC-geometry-sampling/C6.md)

**⚪ ST8**  · when **step-size adaptation "crashes" (step size spirals toward 0) during warmup** on a model with a discontinuous log-density → reading it as a machinery-layer symptom of model *structure* (not a bad `adapt_delta`) works — and note that the acceptance statistic (`accept_stat`, the "acceptance ratio" of NUTS) that adaptation drives toward `adapt_delta` is itself a design choice, not a law.
- why: the current target averages the hypothetical Metropolis acceptance probability uniformly over each trajectory, so at a symmetric discontinuity (`x[1]>0 ? 0 : -10`) the statistic sits (per betanalpha, "probably") near 0.5 for *every* step size → dual averaging keeps shrinking the step size with no gain (a "fatal spiral"); the discontinuity invalidates the smooth statistic↔cost relationship the adaptation assumes.
- conditions: HMC/NUTS dual-averaging step-size adaptation; log-density with a hard branch/jump (a C6 discontinuity); Stan's current uniform-average target. The reverted "Boltzmann-weighted" target (stan#2836) gives lower-energy-error points higher weight, so it tunes for one side and *avoids the crash* — but per betanalpha this is **not a cure**: neither target guarantees any behavior at a discontinuity, the trajectories still under-explore the jump, and multinomial sampling may merely mask it on this small problem.
- tier: ⚪ · source: [mc-stan:22752](https://discourse.mc-stan.org/t/acceptance-ratio-in-nuts/22752)
- efficacy: {divergences: pending · min_ess: pending · ess_per_sec: pending · rmse: pending · coverage: pending}
- both positions (why stan#2836 was reverted): nhuurre — reverted "simply because the devs couldn't agree if it had been tested adequately" plus a release deadline; "no concrete problems were known." betanalpha — that is "not the full story," a developer-*governance* breakdown, stressing "no problems were ever suggested, let alone demonstrated" — the change was theory-motivated and empirically verified. Both agree no technical defect was ever shown; they differ on the completeness/framing of the reversal.
- follow-up & related discussion (in the corpus): the less-conservative target **was** implemented, tested, and reverted — [mc-stan:9532](https://discourse.mc-stan.org/t/request-for-volunteers-to-test-adaptation-tweak/9532) (betanalpha, "Request for Volunteers to Test Adaptation Tweak"; the thread ends with the maintainers reverting stan#2836). An **alternative** gradient-based metric + step-size adaptation (Adrian Seyboldt / covadapt, as used in nuts-rs / nutpie) is discussed as significantly faster — [mc-stan:32259](https://discourse.mc-stan.org/t/comparing-stans-adaptation-phase-to-that-of-nuts-rs/32259). Background: what the acceptance statistic `accept_stat__` is vs `adapt_delta` — [mc-stan:9931](https://discourse.mc-stan.org/t/confused-about-accept-stat-and-delta/9931); dual-averaging step-size restart quirks — [mc-stan:5995](https://discourse.mc-stan.org/t/issue-with-dual-averaging/5995).
- moves: "Reproduce with a minimal discontinuous target (`x ~ std_normal(); target += (x[1]>0) ? 0 : -10`) and watch the adapted step size collapse during warmup" · "Read a warmup step-size collapse as a possible model-structure (discontinuity) signal — scan the log-density for hard branches / `reject()` / jumps before blaming `adapt_delta`"


## Related across the catalog

*Similar challenges in other model classes / computation areas (embedding neighbors):*

- [✗ hierarchical-multilevel E1 · for a **hierarchical funnel** → sweeping **adapt_delta / shrinking ste](../../recs/hierarchical-multilevel/E1.md) `0.84`
- [✗ sparse-shrinkage D2 · for a **sparsity funnel** → reading a **near-zero divergence count fro](../../recs/sparse-shrinkage/D2.md) `0.82`
- [✓ sparse-shrinkage W3 · for **HMC/NUTS with windowed warmup and multiple chains** → **adaptive](../../recs/sparse-shrinkage/W3.md) `0.82`
- [✓ sparse-shrinkage D3 · for a **sparsity model at high adapt_delta** → checking **tree-depth s](../../recs/sparse-shrinkage/D3.md) `0.82`
