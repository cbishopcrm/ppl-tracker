<script lang="ts">
  import { state, addBlankSet, updateSet, haptic } from '../store';
  import Icon from './Icon.svelte';
  import { onDestroy } from 'svelte';
  import type { CardioType } from '../types';

  export let dayKey: string;

  const ICONS: Record<CardioType, string> = {
    treadmill: 'walk',
    walk: 'walk',
    bike: 'walk',
    row: 'walk',
    elliptical: 'walk',
    jumprope: 'bolt'
  };
  const LABELS: Record<CardioType, string> = {
    treadmill: 'Treadmill Walk',
    walk: 'Walk',
    bike: 'Bike',
    row: 'Row',
    elliptical: 'Elliptical',
    jumprope: 'Jump Rope'
  };
  const CUES: Record<CardioType, string> = {
    treadmill: 'Easy pace warmup. 2.5–3.5 mph, 1–3% incline. Loosen hips.',
    walk: 'Easy pace warmup. Get blood flowing.',
    bike: 'Light resistance. Spin to warm up legs and hips.',
    row: 'Easy strokes, focus on form. Warmup heart rate.',
    elliptical: 'Easy pace, full range of motion.',
    jumprope: 'Light bouncing. Skip-step to warm up.'
  };

  $: cardioCfg = $state.settings.cardio;
  $: targetMin = cardioCfg.durationMin;
  $: type = cardioCfg.type;
  $: sessionId = $state.active?.id;
  $: cardioSet = sessionId
    ? $state.sets.find((x) => x.sessionId === sessionId && x.exerciseId === 'treadmill_walk')
    : undefined;

  // Ensure one cardio set exists when session is active and cardio is enabled
  $: if ($state.active && cardioCfg.enabled && !cardioSet) {
    addBlankSet('treadmill_walk', dayKey, { isCardio: true, durationSec: 0 });
  }

  let running = false;
  let startedAt = 0;
  let elapsed = 0;
  let tickId: ReturnType<typeof setInterval> | null = null;
  let persistTickId: ReturnType<typeof setInterval> | null = null;
  let alerted = false;

  // Restore from persisted state
  $: if (cardioSet && !running && elapsed === 0 && cardioSet.durationSec) {
    elapsed = cardioSet.durationSec;
  }

  function startWalk() {
    if (!cardioSet) return;
    running = true;
    startedAt = Date.now() - elapsed * 1000;
    tickId = setInterval(() => {
      elapsed = Math.round((Date.now() - startedAt) / 1000);
      if (elapsed >= targetMin * 60 && !alerted) {
        alerted = true;
        haptic([200, 80, 200]);
      }
    }, 500);
    // Persist every 3s so reload doesn't lose progress
    persistTickId = setInterval(() => {
      if (cardioSet) updateSet(cardioSet.id, { durationSec: elapsed });
    }, 3000);
  }

  function pauseWalk() {
    running = false;
    if (tickId) { clearInterval(tickId); tickId = null; }
    if (persistTickId) { clearInterval(persistTickId); persistTickId = null; }
    if (cardioSet) updateSet(cardioSet.id, { durationSec: elapsed });
  }

  function finishWalk() {
    if (!cardioSet) return;
    pauseWalk();
    updateSet(cardioSet.id, { durationSec: elapsed, done: true });
    haptic(40);
  }

  function redo() {
    if (!cardioSet) return;
    pauseWalk();
    elapsed = 0;
    alerted = false;
    updateSet(cardioSet.id, { durationSec: 0, done: false });
  }

  onDestroy(() => {
    if (tickId) clearInterval(tickId);
    if (persistTickId) clearInterval(persistTickId);
  });

  $: mm = Math.floor(elapsed / 60);
  $: ss = String(elapsed % 60).padStart(2, '0');
  $: pct = Math.min(100, (elapsed / (targetMin * 60)) * 100);
</script>

{#if $state.active && cardioCfg.enabled}
<article class="card" class:done={cardioSet?.done}>
  <header>
    <div class="num mono">00</div>
    <div class="tags">
      <span class="tag tag-warmup"><Icon name={ICONS[type]} size={10} />warmup</span>
    </div>
  </header>
  <h3 class="name">{LABELS[type]}</h3>
  <p class="rx mono">{targetMin}:00 · easy pace</p>
  <p class="cues">{CUES[type]}</p>

  <div class="timer-block">
    <div class="elapsed mono">
      <span class={elapsed >= targetMin * 60 ? 'hit' : ''}>{mm}:{ss}</span>
      <span class="target">/ {targetMin}:00</span>
    </div>
    <div class="bar"><div class="fill" style="width: {pct}%"></div></div>
    <div class="actions">
      {#if cardioSet?.done}
        <button class="btn btn-sm" on:click={redo}>Redo</button>
      {:else if running}
        <button class="btn btn-sm" on:click={pauseWalk}>Pause</button>
        <button class="btn btn-sm btn-primary" on:click={finishWalk}>Done</button>
      {:else if elapsed > 0}
        <button class="btn btn-sm" on:click={startWalk}>Resume</button>
        <button class="btn btn-sm btn-primary" on:click={finishWalk}>Done</button>
      {:else}
        <button class="btn btn-primary btn-sm" on:click={startWalk}>
          <Icon name="play" size={12} /> Start
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
