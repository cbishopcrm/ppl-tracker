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
    grid-template-columns: 22px 1fr 14px 1fr 42px 28px;
    align-items: center;
    gap: 0.45rem;
    padding: 0.3rem 0;
  }
  .idx {
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-3);
    text-align: center;
  }
  .warmup .idx { color: var(--ok); }
  .field {
    position: relative;
    padding: 0.6rem 0.55rem;
    background: var(--surface-2);
    border-radius: var(--r-sm);
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 160ms;
  }
  .field:hover { background: var(--surface-3); }
  .val {
    font-size: 17px;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: -0.02em;
  }
  .ph {
    position: absolute;
    right: 5px;
    top: 3px;
    font-size: 8px;
    color: var(--ink-4);
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  .times {
    font-size: 13px;
    color: var(--ink-4);
    text-align: center;
    font-weight: 500;
  }
  .check {
    width: 42px;
    height: 42px;
    background: var(--surface-2);
    border-radius: var(--r-pill);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink);
    transition: all 180ms, transform 120ms;
  }
  .check:hover { background: var(--surface-3); }
  .check:active { transform: scale(0.92); }
  .empty { width: 14px; height: 14px; }
  .row.done .check {
    background: var(--accent);
    color: #fff;
  }
  .row.done .field { background: var(--accent-soft); }
  .row.done .val { color: var(--accent-2); }
  .row.pr .check { background: var(--pr); color: #000; }

  .del {
    width: 28px;
    height: 42px;
    color: var(--ink-4);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 160ms;
  }
  .del:hover { color: var(--warn); }

  .warmup .val { font-size: 14px; color: var(--ink-2); }
  .warmup .field { background: var(--ok-soft); }
</style>
