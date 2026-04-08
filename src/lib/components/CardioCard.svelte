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
    <div class="num mono serif">00</div>
    <div class="tags">
      <span class="tag tag-warmup"><Icon name="walk" size={10} />warmup</span>
    </div>
  </header>
  <h3 class="name serif">Treadmill Walk</h3>
  <p class="rx mono">{targetMin}:00 easy pace</p>
  <p class="cues">Get blood flowing. 2.5–3.5 mph, 1–3% incline if available. Loosen hips.</p>

  <div class="timer-block">
    <div class="elapsed serif mono">
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
    border: 1px solid var(--ok-soft);
    background: var(--surface);
    padding: 1.1rem 1.15rem 1.15rem;
    margin-bottom: 0.8rem;
    border-radius: var(--radius);
    position: relative;
    border-left: 3px solid var(--ok);
    transition: opacity 200ms;
  }
  .card.done { opacity: 0.55; }
  header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .num {
    font-weight: 900;
    font-size: 26px;
    color: var(--ok);
    letter-spacing: -0.04em;
    line-height: 1;
  }
  .tags { display: flex; gap: 0.3rem; flex: 1; }
  .name {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.15;
  }
  .rx {
    font-size: 13px;
    font-weight: 700;
    color: var(--ok);
    margin-top: 0.2rem;
  }
  .cues {
    font-size: 12px;
    color: var(--ink-2);
    line-height: 1.55;
    margin-top: 0.5rem;
  }
  .timer-block {
    margin-top: 0.75rem;
    padding-top: 0.65rem;
    border-top: 1px dashed var(--line);
  }
  .elapsed {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: 32px;
    font-weight: 900;
    letter-spacing: -0.03em;
    margin-bottom: 0.5rem;
  }
  .elapsed .hit { color: var(--ok); }
  .target {
    font-size: 14px;
    color: var(--ink-3);
    font-weight: 500;
  }
  .bar {
    height: 4px;
    background: var(--bg-2);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.6rem;
  }
  .fill {
    height: 100%;
    background: var(--ok);
    transition: width 500ms ease;
  }
  .actions { display: flex; gap: 0.4rem; }
  .actions .btn { flex: 1; }
</style>
