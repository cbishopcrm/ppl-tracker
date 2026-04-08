<script lang="ts">
  import { getProgram } from '../data/program';
  import { state } from '../store';

  export let dayIndex: number;
  export let onSelect: (i: number) => void;

  $: prog = getProgram($state.settings.location, $state.settings.week);
</script>

<nav class="bnav">
  <div class="bnav-inner">
    {#each prog.days as day, i}
      <button
        class:on={i === dayIndex}
        on:click={() => onSelect(i)}
        aria-label={day.label}
      >
        {day.label}
      </button>
    {/each}
  </div>
</nav>

<style>
  .bnav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0.75rem 1rem calc(0.75rem + var(--safe-b));
    z-index: 50;
    display: flex;
    justify-content: center;
    pointer-events: none;
  }
  .bnav-inner {
    display: flex;
    gap: 4px;
    padding: 5px;
    background: rgba(28, 28, 30, 0.85);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid var(--line);
    border-radius: var(--r-pill);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
    pointer-events: auto;
    max-width: 100%;
  }
  .bnav button {
    padding: 0.72rem 1.15rem;
    min-height: 42px;
    font-size: 14px;
    font-weight: 500;
    color: var(--ink-2);
    border-radius: var(--r-pill);
    letter-spacing: -0.01em;
    transition: background 200ms, color 200ms, transform 140ms;
    white-space: nowrap;
  }
  .bnav button:hover { color: var(--ink); }
  .bnav button.on {
    background: var(--accent);
    color: #fff;
    font-weight: 600;
  }
  .bnav button:active:not(.on) { transform: scale(0.95); }

  @media (max-width: 420px) {
    .bnav button {
      padding: 0.7rem 0.85rem;
      font-size: 13px;
    }
  }
</style>
