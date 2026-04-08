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
    bottom: calc(88px + var(--safe-b));
    background: var(--surface);
    border: 1px solid var(--accent);
    padding: 0.75rem;
    border-radius: var(--radius);
    display: flex;
    gap: 0.75rem;
    align-items: center;
    z-index: 70;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
    animation: slide 240ms cubic-bezier(0.2, 0.8, 0.3, 1);
  }
  @keyframes slide { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .ring { position: relative; width: 58px; height: 58px; }
  .ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .bg { fill: none; stroke: var(--line); stroke-width: 7; }
  .fg {
    fill: none;
    stroke: var(--accent);
    stroke-width: 7;
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
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .actions { display: flex; flex-direction: column; gap: 0.25rem; }
  .actions .btn { padding: 0.35rem 0.65rem; min-height: 28px; font-size: 10px; }
  .urgent .fg { stroke: var(--warn); }
  .urgent .label { color: var(--warn); }
</style>
