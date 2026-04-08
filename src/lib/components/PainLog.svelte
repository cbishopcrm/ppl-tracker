<script lang="ts">
  import { state, setPainBefore, setPainAfter } from '../store';
  export let phase: 'before' | 'after' = 'before';
  $: value = phase === 'before' ? $state.active?.painBefore : $state.active?.painAfter;
  function set(v: number) {
    if (phase === 'before') setPainBefore(v);
    else setPainAfter(v);
  }
</script>

<div class="pain">
  <div class="label">
    <span class="eyebrow">Low back feel · {phase === 'before' ? 'pre-session' : 'post-session'}</span>
    <span class="hint">0 = no issues · 10 = severe</span>
  </div>
  <div class="scale">
    {#each Array(11) as _, i}
      <button class:on={value === i} class:low={i <= 3} class:mid={i > 3 && i <= 6} class:high={i > 6} on:click={() => set(i)} aria-label="Pain level {i}">
        {i}
      </button>
    {/each}
  </div>
</div>

<style>
  .pain {
    border: 1px solid var(--line);
    background: var(--surface);
    border-radius: var(--radius);
    padding: 0.9rem 1rem;
    margin-bottom: 0.8rem;
  }
  .label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.55rem;
  }
  .hint {
    font-size: 9px;
    color: var(--ink-4);
    letter-spacing: 0.04em;
  }
  .scale {
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    gap: 3px;
  }
  .scale button {
    padding: 0.4rem 0;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 700;
    border: 1px solid var(--line);
    border-radius: 3px;
    background: var(--bg-2);
    color: var(--ink-3);
    min-height: 34px;
    transition: all 120ms;
  }
  .scale button:hover { background: var(--surface-2); color: var(--ink); }
  .scale button.on.low { background: var(--ok); border-color: var(--ok); color: var(--bg); }
  .scale button.on.mid { background: var(--pr); border-color: var(--pr); color: var(--bg); }
  .scale button.on.high { background: var(--warn); border-color: var(--warn); color: var(--bg); }
</style>
