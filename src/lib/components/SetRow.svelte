<script lang="ts">
  import type { SetLog, Unit } from '../types';
  import Icon from './Icon.svelte';
  import { createEventDispatcher } from 'svelte';

  export let set: SetLog;
  export let unit: Unit;
  export let warmup = false;
  export let placeholder: SetLog | undefined = undefined;

  const dispatch = createEventDispatcher<{ toggle: void; edit: void; delete: void }>();
</script>

<div class="row" class:done={set.done} class:pr={set.isPR} class:warmup>
  <div class="idx mono">{warmup ? 'W' : set.index + 1}</div>
  <button class="field" on:click={() => dispatch('edit')}>
    <span class="val mono">{set.weight ?? placeholder?.weight ?? '—'}</span>
    {#if set.weight == null && placeholder?.weight != null}
      <span class="ph">last</span>
    {/if}
  </button>
  <span class="times">×</span>
  <button class="field" on:click={() => dispatch('edit')}>
    <span class="val mono">{set.reps ?? placeholder?.reps ?? '—'}</span>
    {#if set.reps == null && placeholder?.reps != null}
      <span class="ph">last</span>
    {/if}
  </button>
  <button class="check" on:click={() => dispatch('toggle')} aria-label="Complete set">
    {#if set.done}
      <Icon name="check" size={16} stroke={3} />
    {:else}
      <span class="empty"></span>
    {/if}
  </button>
  <button class="del" on:click={() => dispatch('delete')} aria-label="Delete set">
    <Icon name="trash" size={14} />
  </button>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 20px 1fr 12px 1fr 38px 28px;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0;
  }
  .idx {
    font-size: 11px;
    font-weight: 700;
    color: var(--ink-3);
    text-align: center;
  }
  .warmup .idx { color: var(--ok); }
  .field {
    position: relative;
    padding: 0.55rem 0.5rem;
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    min-height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 140ms;
  }
  .field:hover { border-color: var(--line-2); background: var(--surface-2); }
  .val {
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.02em;
  }
  .row:not(.done) .val { color: var(--ink); }
  .ph {
    position: absolute;
    right: 4px;
    top: 2px;
    font-size: 7px;
    color: var(--ink-4);
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .times {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--ink-3);
    text-align: center;
  }
  .check {
    width: 38px;
    height: 38px;
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink);
    transition: all 140ms;
  }
  .check:hover { background: var(--surface-2); border-color: var(--line-2); }
  .empty { width: 14px; height: 14px; }
  .row.done .check {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--bg);
  }
  .row.done .field {
    background: var(--accent-soft);
    border-color: var(--accent-soft);
  }
  .row.done .val { color: var(--accent); }
  .row.pr .check { background: var(--pr); border-color: var(--pr); }

  .del {
    width: 28px;
    height: 38px;
    color: var(--ink-4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .del:hover { color: var(--warn); }

  .warmup .val { font-size: 14px; }
  .warmup .field { background: var(--ok-soft); border-color: var(--ok-soft); }
  .warmup.row.done .field { background: var(--ok-soft); border-color: var(--ok); }
</style>
