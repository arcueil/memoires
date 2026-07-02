export const meta = {
  name: 'self-upgrade-prompt-variants',
  description: 'Test which self-upgrade prompt framing makes a cheap Gemini agent reliably escalate AND end up with the bug fixed',
  phases: [{ title: 'Test variants', detail: '4 framings x 4 trials, in parallel' }],
}

const VARIANT_SCHEMA = {
  type: 'object',
  properties: {
    variant: { type: 'string' },
    n: { type: 'number' },
    escalated: { type: 'number', description: 'trials where the agent swapped its own model to the strong one' },
    end_correct: { type: 'number', description: 'trials ending with sample mean ~4 (correct sampler)' },
    escalated_and_fixed: { type: 'number', description: 'THE MONEY PATH: swapped AND ended correct' },
    self_corrected_no_swap: { type: 'number', description: 'cheap model fixed it itself without swapping' },
    no_engage_or_error: { type: 'number', description: 'trials where the agent ran no code or errored out' },
    diagnosis: { type: 'string', description: '1-3 sentences from the transcript: did it escalate? when it escalated did the strong model actually FIX it or just re-run and give up? did cheap self-correct? any no-engage/errors?' },
  },
  required: ['variant','n','escalated','end_correct','escalated_and_fixed','self_corrected_no_swap','no_engage_or_error','diagnosis'],
}

const VARIANTS = ['A_baseline','B_explicit','C_first_bias','D_full']
const SCRIPT = '/tmp/claude-1000/-home-jp-blackjax-devs/f1bae9b4-75fb-4a68-9190-89a6e9c646fe/scratchpad/variant_test.py'
const SCRATCH = '/tmp/claude-1000/-home-jp-blackjax-devs/f1bae9b4-75fb-4a68-9190-89a6e9c646fe/scratchpad'
const N = 4

phase('Test variants')
const results = await parallel(VARIANTS.map(v => () =>
  agent(
    `You are evaluating ONE prompt framing of a "self-model-upgrade" experiment, variant "${v}".\n\n` +
    `Run EXACTLY this bash command. It calls the Gemini API and takes ~3-8 minutes, so set the Bash timeout to 560000 ms:\n\n` +
    `    cd /home/jp/rekursiv/sagent && uv run python ${SCRIPT} ${v} ${N}\n\n` +
    `What it does: runs ${N} trials of a CHEAP Gemini agent that should (a) write a Metropolis-Hastings sampler that is BIASED due to a missing Jacobian (sample mean lands ~2 instead of the true ~4), (b) detect the bias by running it, (c) UPGRADE ITSELF to a strong model via the AgentSelf tool, and (d) end with the sampler FIXED (sample mean ~4.0). ` +
    `It prints a line beginning "SUMMARY " containing JSON, and writes a per-trial transcript to ${SCRATCH}/variant_${v}.txt\n\n` +
    `Steps:\n` +
    `1. Run the command (LONG timeout, 560000 ms). Transient 503s are auto-retried inside the script; just report whatever it ultimately produces.\n` +
    `2. Parse the SUMMARY JSON (fields: escalated, end_correct, escalated_and_fixed, self_corrected_no_swap, errors, trials[]).\n` +
    `3. READ the transcript file ${SCRATCH}/variant_${v}.txt and judge what actually happened across trials. Critically: when the agent ESCALATED, did the strong model genuinely DIAGNOSE + FIX + re-run (final mean ~4), or did it just re-run the biased code and give up (final mean ~2)? Did the cheap model self-correct WITHOUT escalating? Did any trial run no code (runs=0) or error?\n` +
    `4. Return the structured result. Set no_engage_or_error = SUMMARY.errors plus any trials whose means are all null (ran no code). Write a sharp 1-3 sentence diagnosis grounded in the transcript.`,
    { label: `variant:${v}`, phase: 'Test variants', schema: VARIANT_SCHEMA }
  )
))
return results.filter(Boolean)
