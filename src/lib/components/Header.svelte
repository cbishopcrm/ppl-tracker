<script lang="ts">
  import { state } from '../store';
  import Icon from './Icon.svelte';

  export let onHistory: () => void;
  export let onSettings: () => void;
  export let onProgress: () => void;

  $: loc = $state.settings.location === 'gym' ? 'Gym' : 'Hotel';
  $: wk = $state.settings.week.toUpperCase();
  $: live = !!$state.active;
</script>

<header class="hdr">
  <div class="hdr-left">
    <div class="chip">
      Week {wk} · {loc}
      {#if live}<span class="live"><span class="dot"></span>Live</span>{/if}
    </div>
    <h1 class="brand">
      PPL <span class="grad">Tracker.</span>
    </h1>
  </div>
  <div class="hdr-right">
    <button class="icon-btn" on:click={onProgress} aria-label="Progress">
      <Icon name="chart" />
    </button>
    <button class="icon-btn" on:click={onHistory} aria-label="History">
      <Icon name="history" />
    </button>
    <button class="icon-btn" on:click={onSettings} aria-label="Settings">
      <Icon name="settings" />
    </button>
  </div>
</header>

<style>
  .hdr {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem 0 1.5rem;
  }
  .hdr-left { flex: 1; min-width: 0; }
  .hdr-right { display: flex; gap: 0.4rem; margin-top: 0.3rem; }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.25rem 0.75rem;
    border-radius: var(--r-pill);
    background: var(--surface);
    color: var(--ink-2);
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 0.6rem;
    letter-spacing: -0.005em;
  }
  .live {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--accent-2);
    font-weight: 600;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-2);
    box-shadow: 0 0 0 3px rgba(20, 124, 229, 0.18);
    animation: pulse 1.8s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }

  .brand {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1;
  }
</style>
