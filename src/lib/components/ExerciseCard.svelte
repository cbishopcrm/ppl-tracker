<script lang="ts">
  import type { Slot } from '../types';
  import { EXERCISES } from '../data/exercises';
  import {
    state,
    addBlankSet,
    removeSet,
    toggleSetDone,
    selectAlt,
    lastCompletedSets,
    skipSlot,
    unskipSlot,
    updateSet
  } from '../store';
  import { warmupRamp, suggestNextWeight, bestE1RM, recoveryFor } from '../calc';
  import Icon from './Icon.svelte';
  import SetRow from './SetRow.svelte';
  import Sparkline from './Sparkline.svelte';
  import { createEventDispatcher, onMount, tick } from 'svelte';

  export let slot: Slot;
  export let slotIndex: number;
  export let dayKey: string;
  export let altIndex: number;

  const dispatch = createEventDispatcher<{
    edit: { setId: string };
  }>();

  let showAlts = false;

  $: rx = slot.alternatives[altIndex];
  $: exercise = EXERCISES[rx.exerciseId];
  $: supersetEx = rx.superset ? EXERCISES[rx.superset] : null;
  $: isActive = !!$state.active;
  $: sessionId = $state.active?.id;
  $: isTimeBased = exercise.unit === 'seconds';
  $: skipped = ($state.active?.skippedSlots ?? []).includes(slotIndex);
  $: isCompound = !!exercise.compound;
  $: warmupEnabled = $state.settings.warmupEnabled;
  $: showWarmupBtn = isCompound && warmupSets.length === 0 && warmupEnabled;

  // Sets logged in current session for this exercise
  $: mySets = sessionId
    ? $state.sets
        .filter((x) => x.sessionId === sessionId && x.exerciseId === rx.exerciseId && !x.isWarmup)
        .sort((a, b) => a.index - b.index)
    : [];

  $: warmupSets = sessionId
    ? $state.sets
        .filter((x) => x.sessionId === sessionId && x.exerciseId === rx.exerciseId && x.isWarmup)
        .sort((a, b) => a.index - b.index)
    : [];

  $: lastTime = lastCompletedSets($state, rx.exerciseId);
  $: suggestion = $state.settings.autoProgression
    ? suggestNextWeight(lastTime, rx, $state.settings.unit)
    : null;

  // Recovery hint per category
  $: recovery = recoveryFor(
    $state.sessions.map((s) => ({ startedAt: s.startedAt, dayKey: s.dayKey })),
    dayKey
  );

  // 1RM sparkline
  $: sparklineData = (() => {
    const bySessionId = new Map<string, typeof $state.sets>();
    for (const s of $state.sets) {
      if (s.exerciseId !== rx.exerciseId || !s.done || s.isWarmup) continue;
      if (!bySessionId.has(s.sessionId)) bySessionId.set(s.sessionId, []);
      bySessionId.get(s.sessionId)!.push(s);
    }
    const points: number[] = [];
    for (const [, sets] of bySessionId) {
      const best = bestE1RM(sets);
      if (best > 0) points.push(best);
    }
    return points.slice(-12);
  })();

  // Initialize on mount when session active and no sets yet
  let initialized = false;
  onMount(() => {
    if (isActive && sessionId && mySets.length === 0 && !skipped) {
      initializeSets();
      initialized = true;
    }
  });

  // Re-init if session changes (started after mount)
  let lastSessionId: string | undefined = undefined;
  $: if (sessionId !== lastSessionId) {
    lastSessionId = sessionId;
    if (isActive && sessionId && mySets.length === 0 && !skipped) {
      // Defer to next tick to avoid clobbering Svelte init
      tick().then(() => {
        if ($state.active?.id === sessionId && mySets.length === 0 && !skipped) {
          initializeSets();
        }
      });
    }
  }

  function initializeSets() {
    // Working sets only — warmup is now an explicit "Generate ramp" button
    for (let i = 0; i < rx.sets; i++) {
      addBlankSet(rx.exerciseId, dayKey, {
        weight: !isTimeBased ? (suggestion?.weight ?? null) : null,
        reps: null,
        isTime: isTimeBased
      });
    }
  }

  function generateWarmup() {
    if (!exercise.compound) return;
    // Use the first working set's weight, the suggestion, or prompt
    let target = mySets[0]?.weight ?? suggestion?.weight ?? null;
    if (!target) {
      const entered = prompt(
        `What's your working weight today for ${exercise.name}? (${$state.settings.unit})`
      );
      if (!entered) return;
      target = Number(entered);
      if (!target || target <= 0) return;
      // Backfill the empty working set
      if (mySets[0]) updateSet(mySets[0].id, { weight: target });
    }
    const ramp = warmupRamp(target, $state.settings.unit);
    for (const r of ramp) {
      addBlankSet(rx.exerciseId, dayKey, {
        weight: r.weight,
        reps: r.reps,
        isWarmup: true
      });
    }
  }

  function addExtra() {
    addBlankSet(rx.exerciseId, dayKey, { isTime: isTimeBased });
  }

  function pick(idx: number) {
    selectAlt(dayKey, slotIndex, idx);
    showAlts = false;
  }

  function toggleSkip() {
    if (skipped) unskipSlot(slotIndex);
    else skipSlot(slotIndex);
  }

  function onTimeStop(setId: string, seconds: number) {
    updateSet(setId, { reps: seconds, done: seconds > 0, isTime: true });
  }

  $: allDone = mySets.length > 0 && mySets.every((s) => s.done);
  $: started = mySets.some((s) => s.done);
</script>

<article class="card" class:done={allDone || skipped} class:active={started && !allDone} class:skipped>
  <header>
    <div class="num mono">
      {#if exercise.compound}<span class="bolt">▲</span>{/if}
      {String(slotIndex + 1).padStart(2, '0')}
    </div>
    <div class="meta">
      <div class="tags">
        {#if exercise.spineSafe}
          <span class="tag tag-spine"><Icon name="shield" size={10} />spine-safe</span>
        {/if}
        {#if exercise.location.length === 1 && exercise.location[0] === 'hotel'}
          <span class="tag tag-hotel"><Icon name="hotel" size={10} />hotel</span>
        {/if}
        {#if supersetEx}
          <span class="tag tag-superset">superset</span>
        {/if}
        {#if exercise.barbell}
          <span class="tag">bar</span>
        {/if}
        {#if isTimeBased}
          <span class="tag">timed</span>
        {/if}
      </div>
    </div>
    <button class="swap" class:open={showAlts} on:click={() => (showAlts = !showAlts)} aria-label="Alternatives">
      <Icon name="swap" size={16} />
    </button>
  </header>

  <h3 class="name">{exercise.name}</h3>
  {#if supersetEx}
    <h3 class="name superset-name">+ {supersetEx.name}</h3>
  {/if}

  <div class="rx-row">
    <div class="rx mono">{rx.rx}</div>
    {#if sparklineData.length >= 2}
      <Sparkline data={sparklineData} stroke="var(--accent-2)" />
    {/if}
  </div>

  {#if exercise.cues}
    <p class="cues">{exercise.cues}</p>
  {/if}

  {#if exercise.spineSafe}
    <div class="spine-note">
      <Icon name="shield" size={12} />
      <span>{exercise.spineSafe}</span>
    </div>
  {/if}

  {#if exercise.gymRef && EXERCISES[exercise.gymRef]}
    <div class="gym-ref">← gym: {EXERCISES[exercise.gymRef].name}</div>
  {/if}

  {#if exercise.videoUrl}
    <a class="video-link" href={exercise.videoUrl} target="_blank" rel="noopener">
      ▶ Form check
    </a>
  {/if}

  {#if suggestion && isActive && !skipped && !isTimeBased}
    <div class="suggest" class:up={suggestion.reason === 'hit_all'} class:down={suggestion.reason === 'missed_all'}>
      {#if suggestion.reason === 'hit_all'}
        ▲ Try <strong class="mono">{suggestion.weight}</strong> — you hit every rep last session
      {:else if suggestion.reason === 'missed_all'}
        ▼ Drop to <strong class="mono">{suggestion.weight}</strong> — you missed all last session
      {:else}
        → Hold <strong class="mono">{suggestion.weight}</strong> from last session
      {/if}
    </div>
  {/if}

  {#if skipped}
    <div class="skip-banner">
      Skipped today.
      <button class="skip-undo" on:click={toggleSkip}>Restore</button>
    </div>
  {:else if isActive && (warmupSets.length > 0 || mySets.length > 0)}
    <div class="sets">
      {#if warmupSets.length > 0}
        <div class="sets-label">Warmup</div>
        {#each warmupSets as set (set.id)}
          <SetRow
            {set}
            unit={$state.settings.unit}
            warmup
            on:toggle={() => toggleSetDone(set.id)}
            on:edit={() => dispatch('edit', { setId: set.id })}
            on:delete={() => removeSet(set.id)}
          />
        {/each}
      {/if}
      {#if mySets.length > 0}
        {#if warmupSets.length > 0}<div class="sets-label">Working</div>{/if}
        {#each mySets as set, i (set.id)}
          <SetRow
            {set}
            unit={$state.settings.unit}
            isTime={isTimeBased}
            placeholder={lastTime[i]}
            on:toggle={() => toggleSetDone(set.id)}
            on:edit={() => dispatch('edit', { setId: set.id })}
            on:delete={() => removeSet(set.id)}
            on:timeStop={(e) => onTimeStop(set.id, e.detail)}
          />
        {/each}
      {/if}
      <div class="sets-actions">
        <button class="add-set" on:click={addExtra}>+ add set</button>
        {#if showWarmupBtn}
          <button class="add-set warm" on:click={generateWarmup}>↗ warmup ramp</button>
        {/if}
        <button class="add-set skip" on:click={toggleSkip}>skip exercise</button>
      </div>
    </div>
  {/if}

  {#if !isActive && lastTime.length > 0}
    <div class="last mono">
      last: {lastTime.map((s) => `${s.weight ?? '-'}×${s.reps ?? '-'}`).join(' · ')}
    </div>
  {/if}

  {#if showAlts}
    <div class="alts">
      <div class="alts-label">Alternatives</div>
      {#each slot.alternatives as alt, i}
        {@const altEx = EXERCISES[alt.exerciseId]}
        <button class="alt" class:on={i === altIndex} on:click={() => pick(i)}>
          <span class="alt-letter">{String.fromCharCode(65 + i)}</span>
          <span class="alt-body">
            <span class="alt-name">{altEx.name}</span>
            <span class="alt-rx mono">{alt.rx}</span>
          </span>
        </button>
      {/each}
    </div>
  {/if}
</article>

<style>
  .card {
    background: var(--surface);
    padding: 1.35rem 1.4rem;
    margin-bottom: 0.85rem;
    border-radius: var(--r-lg);
    position: relative;
    border: 1px solid transparent;
    transition: border-color 240ms, background 240ms, opacity 240ms;
  }
  .card.active {
    border-color: var(--accent-line);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }
  .card.done { opacity: 0.45; }
  .card.skipped { opacity: 0.5; }

  header {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 0.6rem;
  }
  .num {
    font-weight: 600;
    font-size: 13px;
    color: var(--ink-3);
    letter-spacing: -0.01em;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.32rem 0.62rem;
    background: var(--surface-2);
    border-radius: var(--r-pill);
  }
  .num .bolt { color: var(--accent-2); font-size: 10px; }
  .meta { flex: 1; min-width: 0; }
  .tags { display: flex; gap: 0.3rem; flex-wrap: wrap; }
  .swap {
    width: 36px;
    height: 36px;
    border-radius: var(--r-pill);
    background: var(--surface-2);
    color: var(--ink-3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 180ms, color 180ms, transform 120ms;
  }
  .swap:hover, .swap.open {
    color: var(--ink);
    background: var(--surface-3);
  }
  .swap:active { transform: scale(0.92); }

  .name {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.028em;
    line-height: 1.12;
    color: var(--ink);
  }
  .superset-name {
    font-size: 17px;
    color: var(--ink-2);
    font-weight: 500;
    margin-top: 0.2rem;
    letter-spacing: -0.015em;
  }

  .rx-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.55rem;
  }
  .rx {
    font-size: 14px;
    font-weight: 600;
    color: var(--accent-2);
    letter-spacing: -0.005em;
  }

  .cues {
    font-size: 14px;
    color: var(--ink-2);
    line-height: 1.5;
    margin-top: 0.65rem;
    letter-spacing: -0.005em;
  }

  .spine-note {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    font-size: 12px;
    color: var(--info);
    background: var(--info-soft);
    padding: 0.6rem 0.8rem;
    margin-top: 0.7rem;
    border-radius: var(--r-sm);
    line-height: 1.5;
    letter-spacing: -0.005em;
  }
  .spine-note svg { margin-top: 2px; flex-shrink: 0; }

  .gym-ref {
    font-size: 11px;
    color: var(--ink-4);
    margin-top: 0.5rem;
  }

  .video-link {
    display: inline-flex;
    align-items: center;
    margin-top: 0.55rem;
    padding: 0.35rem 0.75rem;
    background: var(--surface-2);
    border-radius: var(--r-pill);
    font-size: 12px;
    font-weight: 500;
    color: var(--accent-2);
    transition: background 180ms;
    text-decoration: none;
  }
  .video-link:hover { background: var(--surface-3); text-decoration: none; }

  .suggest {
    font-size: 13px;
    color: var(--ink-2);
    background: var(--surface-2);
    padding: 0.7rem 0.9rem;
    margin-top: 0.7rem;
    border-radius: var(--r-sm);
    font-weight: 500;
    letter-spacing: -0.005em;
  }
  .suggest strong {
    color: var(--ink);
    font-size: 14px;
    font-weight: 600;
  }
  .suggest.up { color: var(--ok); background: var(--ok-soft); }
  .suggest.up strong { color: var(--ok); }
  .suggest.down { color: var(--warn); background: var(--warn-soft); }
  .suggest.down strong { color: var(--warn); }

  .skip-banner {
    font-size: 13px;
    color: var(--ink-3);
    background: var(--surface-2);
    padding: 0.85rem 1rem;
    margin-top: 0.85rem;
    border-radius: var(--r-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .skip-undo {
    color: var(--accent-2);
    font-size: 13px;
    font-weight: 500;
  }

  .sets {
    margin-top: 1rem;
    padding-top: 0.9rem;
    border-top: 1px solid var(--line);
  }
  .sets-label {
    margin-bottom: 0.35rem;
    margin-top: 0.35rem;
    font-size: 11px;
    color: var(--ink-3);
    font-weight: 600;
  }
  .sets-actions {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-top: 0.65rem;
  }
  .add-set {
    flex: 1 1 auto;
    min-width: 100px;
    padding: 0.65rem 0.85rem;
    border-radius: var(--r-pill);
    background: var(--surface-2);
    color: var(--ink-2);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.005em;
    transition: all 180ms;
  }
  .add-set:hover {
    color: var(--ink);
    background: var(--surface-3);
  }
  .add-set.warm:hover { color: var(--ok); }
  .add-set.skip:hover { color: var(--warn); }

  .last {
    font-size: 12px;
    color: var(--ink-3);
    margin-top: 0.7rem;
    letter-spacing: -0.005em;
  }

  .alts {
    margin-top: 0.9rem;
    padding-top: 0.8rem;
    border-top: 1px solid var(--line);
  }
  .alts-label {
    margin-bottom: 0.55rem;
    font-size: 11px;
    color: var(--ink-3);
    font-weight: 600;
  }
  .alt {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: var(--r-md);
    background: var(--surface-2);
    margin-bottom: 0.4rem;
    text-align: left;
    transition: all 180ms;
    border: 1px solid transparent;
  }
  .alt:hover { background: var(--surface-3); }
  .alt.on {
    background: var(--accent-soft);
    border-color: var(--accent-line);
  }
  .alt-letter {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink-3);
    width: 22px;
    height: 22px;
    background: var(--surface-3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .alt.on .alt-letter {
    color: #fff;
    background: var(--accent);
  }
  .alt-body { display: flex; flex-direction: column; flex: 1; min-width: 0; }
  .alt-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.25;
    letter-spacing: -0.01em;
  }
  .alt-rx {
    font-size: 12px;
    color: var(--ink-3);
    margin-top: 2px;
  }
</style>
