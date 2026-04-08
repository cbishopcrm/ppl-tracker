<script lang="ts">
  import { DAY_ORDER } from '../data/program';
  import { getProgram } from '../data/program';
  import { state } from '../store';

  export let dayIndex: number;
  export let onSelect: (i: number) => void;

  $: prog = getProgram($state.settings.location, $state.settings.week);
</script>

<nav class="bnav">
  {#each prog.days as day, i}
    <button
      class:on={i === dayIndex}
      on:click={() => onSelect(i)}
      aria-label={day.label}
    >
      <span class="num mono">0{i + 1}</span>
      <span class="label serif">{day.label}</span>
    </button>
  {/each}
</nav>

<style>
  .bnav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0.5rem 0.5rem calc(0.5rem + var(--safe-b));
    background: var(--surface);
    border-top: 1px solid var(--line);
    display: flex;
    gap: 2px;
    z-index: 50;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .bnav button {
    flex: 1;
    min-height: 68px;
    padding: 0.55rem 0.25rem;
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.18rem;
    color: var(--ink-3);
    transition: color 120ms, background 120ms;
  }
  .bnav button:hover { color: var(--ink-2); }
  .bnav button.on {
    color: var(--ink);
    background: var(--bg-2);
  }
  .bnav button.on .label {
    color: var(--accent);
  }
  .bnav button.on::before {
    content: '';
    position: absolute;
    bottom: calc(0.5rem + var(--safe-b));
    width: 24px;
    height: 2px;
    background: var(--accent);
  }
  .num {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: inherit;
    opacity: 0.7;
  }
  .label {
    font-size: 18px;
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1;
  }
  @media (min-width: 680px) {
    .bnav {
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      width: 100%;
      max-width: 640px;
      border-radius: var(--radius) var(--radius) 0 0;
    }
  }
</style>
