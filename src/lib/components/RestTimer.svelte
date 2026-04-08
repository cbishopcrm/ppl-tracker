<script lang="ts">
  import { onDestroy } from 'svelte';

  let total = 0;
  let endAt = 0;
  let remaining = 0;
  let running = false;
  let interval: ReturnType<typeof setInterval> | null = null;

  export function start(sec: number) {
    total = sec;
    endAt = Date.now() + sec * 1000;
    running = true;
    tick();
    if (interval) clearInterval(interval);
    interval = setInterval(tick, 250);
  }

  export function stop() {
    running = false;
    if (interval) { clearInterval(interval); interval = null; }
  }

  function tick() {
    const r = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    remaining = r;
    if (r === 0) {
      stop();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([180, 60, 180]);
    }
  }

  function adjust(d: number) {
    endAt += d * 1000;
    total += d;
    if (total < 1) total = 1;
    tick();
  }

  onDestroy(() => { if (interval) clearInterval(interval); });

  $: pct = total > 0 ? remaining / total : 0;
  $: dashOffset = 283 * (1 - pct);
  $: display = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
  $: urgent = running && remaining <= 5;
</script>

{#if running}
  <div class="timer" class:urgent>
    <div class="ring">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" class="bg" />
        <circle cx="50" cy="50" r="45" class="fg" stroke-dashoffset={dashOffset} />
      </svg>
      <div class="label mono">{display}</div>
    </div>
    <div class="actions">
      <button class="btn btn-sm" on:click={() => adjust(-15)}>−15</button>
      <button class="btn btn-sm btn-primary" on:click={stop}>Skip</button>
      <button class="btn btn-sm" on:click={() => adjust(15)}>+15</button>
    </div>
  </div>
{/if}

<style>
  .timer {
    position: fixed;
    right: 1rem;
    bottom: calc(100px + var(--safe-b));
    background: rgba(28, 28, 30, 0.9);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid var(--line);
    padding: 0.85rem 0.95rem;
    border-radius: var(--r-lg);
    display: flex;
    gap: 0.85rem;
    align-items: center;
    z-index: 70;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
    animation: slide 280ms cubic-bezier(0.2, 0.8, 0.3, 1);
  }
  @keyframes slide { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .ring { position: relative; width: 60px; height: 60px; }
  .ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .bg { fill: none; stroke: var(--surface-2); stroke-width: 6; }
  .fg {
    fill: none;
    stroke: var(--accent);
    stroke-width: 6;
    stroke-linecap: round;
    stroke-dasharray: 283;
    transition: stroke-dashoffset 900ms linear;
  }
  .label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--ink);
  }
  .actions { display: flex; flex-direction: column; gap: 0.3rem; }
  .actions .btn {
    padding: 0.4rem 0.75rem;
    min-height: 28px;
    font-size: 11px;
    font-weight: 500;
  }
  .urgent .fg { stroke: var(--warn); }
  .urgent .label { color: var(--warn); }
</style>
