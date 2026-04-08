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
    background: var(--surface);
    border-radius: var(--r-lg);
    padding: 1.1rem 1.2rem;
    margin-bottom: 0.85rem;
  }
  .label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.7rem;
  }
  .eyebrow {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: -0.01em;
  }
  .hint {
    font-size: 11px;
    color: var(--ink-3);
    letter-spacing: -0.005em;
  }
  .scale {
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    gap: 4px;
  }
  .scale button {
    padding: 0.5rem 0;
    font-size: 13px;
    font-weight: 500;
    border-radius: var(--r-pill);
    background: var(--surface-2);
    color: var(--ink-3);
    min-height: 38px;
    transition: all 180ms, transform 120ms;
    font-variant-numeric: tabular-nums;
  }
  .scale button:hover { background: var(--surface-3); color: var(--ink); }
  .scale button:active { transform: scale(0.92); }
  .scale button.on.low { background: var(--ok); color: #000; font-weight: 600; }
  .scale button.on.mid { background: var(--pr); color: #000; font-weight: 600; }
  .scale button.on.high { background: var(--warn); color: #fff; font-weight: 600; }
</style>
