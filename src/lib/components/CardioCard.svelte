<script lang="ts">
  import { state, addBlankSet, toggleSetDone, updateSet } from '../store';
  import Icon from './Icon.svelte';
  import { onDestroy } from 'svelte';

  export let dayKey: string;

  $: targetMin = $state.settings.treadmillMin;
  $: sessionId = $state.active?.id;
  $: cardioSet = sessionId
    ? $state.sets.find((x) => x.sessionId === sessionId && x.exerciseId === 'treadmill_walk')
    : undefined;

  // Ensure one cardio set exists when session is active
  $: if ($state.active && !cardioSet) {
    addBlankSet('treadmill_walk', dayKey, { isCardio: true, durationSec: 0 });
  }

  let running = false;
  let startedAt = 0;
  let elapsed = 0;
  let tickId: ReturnType<typeof setInterval> | null = null;

  function startWalk() {
    if (!cardioSet) return;
    running = true;
    startedAt = Date.now() - elapsed * 1000;
    tickId = setInterval(() => {
      elapsed = Math.round((Date.now() - startedAt) / 1000);
      if (elapsed >= targetMin * 60 && navigator.vibrate) {
        navigator.vibrate([200, 80, 200]);
      }
    }, 500);
  }

  function pauseWalk() {
    running = false;
    if (tickId) { clearInterval(tickId); tickId = null; }
  }

  function finishWalk() {
    if (!cardioSet) return;
    pauseWalk();
    updateSet(cardioSet.id, { durationSec: elapsed, done: true });
  }

  onDestroy(() => { if (tickId) clearInterval(tickId); });

  $: if (cardioSet?.done && !running) elapsed = cardioSet.durationSec ?? 0;

  $: mm = Math.floor(elapsed / 60);
  $: ss = String(elapsed % 60).padStart(2, '0');
  $: pct = Math.min(100, (elapsed / (targetMin * 60)) * 100);
</script>

{#if $state.active}
<article class="card" class:done={cardioSet?.done}>
  <header>
    <div class="num mono">00</div>
    <div class="tags">
      <span class="tag tag-warmup"><Icon name="walk" size={10} />warmup</span>
    </div>
  </header>
  <h3 class="name">Treadmill Walk</h3>
  <p class="rx mono">{targetMin}:00 easy pace</p>
  <p class="cues">Get blood flowing. 2.5–3.5 mph, 1–3% incline if available. Loosen hips.</p>

  <div class="timer-block">
    <div class="elapsed mono">
      <span class={elapsed >= targetMin * 60 ? 'hit' : ''}>{mm}:{ss}</span>
      <span class="target">/ {targetMin}:00</span>
    </div>
    <div class="bar"><div class="fill" style="width: {pct}%"></div></div>
    <div class="actions">
      {#if cardioSet?.done}
        <button class="btn btn-sm" on:click={() => { if (cardioSet) updateSet(cardioSet.id, { done: false }); pauseWalk(); elapsed = 0; }}>Redo</button>
      {:else if running}
        <button class="btn btn-sm" on:click={pauseWalk}>Pause</button>
        <button class="btn btn-sm btn-primary" on:click={finishWalk}>Done</button>
      {:else if elapsed > 0}
        <button class="btn btn-sm" on:click={startWalk}>Resume</button>
        <button class="btn btn-sm btn-primary" on:click={finishWalk}>Done</button>
      {:else}
        <button class="btn btn-primary btn-sm" on:click={startWalk}>
          <Icon name="play" size={12} /> Start walk
        </button>
      {/if}
    </div>
  </div>
</article>
{/if}

<style>
  .card {
    background: var(--surface);
    padding: 1.35rem 1.4rem;
    margin-bottom: 0.85rem;
    border-radius: var(--r-lg);
    position: relative;
    border: 1px solid var(--ok-soft);
    transition: opacity 240ms;
  }
  .card.done { opacity: 0.45; }
  header {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 0.6rem;
  }
  .num {
    font-size: 13px;
    font-weight: 600;
    color: var(--ok);
    padding: 0.32rem 0.62rem;
    background: var(--ok-soft);
    border-radius: var(--r-pill);
    line-height: 1;
  }
  .tags { display: flex; gap: 0.3rem; flex: 1; }
  .name {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.028em;
    line-height: 1.12;
  }
  .rx {
    font-size: 14px;
    font-weight: 600;
    color: var(--ok);
    margin-top: 0.3rem;
    letter-spacing: -0.005em;
  }
  .cues {
    font-size: 14px;
    color: var(--ink-2);
    line-height: 1.5;
    margin-top: 0.65rem;
    letter-spacing: -0.005em;
  }
  .timer-block {
    margin-top: 1rem;
    padding-top: 0.9rem;
    border-top: 1px solid var(--line);
  }
  .elapsed {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    font-size: 38px;
    font-weight: 700;
    letter-spacing: -0.04em;
    margin-bottom: 0.7rem;
    color: var(--ink);
  }
  .elapsed .hit { color: var(--ok); }
  .target {
    font-size: 15px;
    color: var(--ink-3);
    font-weight: 500;
  }
  .bar {
    height: 4px;
    background: var(--surface-2);
    border-radius: var(--r-pill);
    overflow: hidden;
    margin-bottom: 0.85rem;
  }
  .fill {
    height: 100%;
    background: var(--ok);
    border-radius: var(--r-pill);
    transition: width 500ms ease;
  }
  .actions { display: flex; gap: 0.45rem; }
  .actions .btn { flex: 1; }
</style>
