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
    <div class="eyebrow">
      Week {wk} · {loc}
      {#if live}<span class="live"><span class="dot"></span>Live</span>{/if}
    </div>
    <h1>
      <span class="serif">PPL</span>
      <span class="accent serif">Tracker</span>
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
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.6rem 0 1rem;
    border-bottom: 1px solid var(--line);
    margin-bottom: 1.1rem;
  }
  .hdr-left { flex: 1; min-width: 0; }
  .hdr-right { display: flex; gap: 0.4rem; }
  h1 {
    font-size: 34px;
    font-weight: 900;
    margin-top: 4px;
    letter-spacing: -0.03em;
  }
  .accent { color: var(--accent); }
  .eyebrow {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .live {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--accent);
    font-weight: 700;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 1.6s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
</style>
