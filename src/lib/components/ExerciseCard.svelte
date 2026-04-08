<script lang="ts">
  import type { Slot, AppState, SetLog } from '../types';
  import { EXERCISES } from '../data/exercises';
  import { state, addBlankSet, updateSet, removeSet, toggleSetDone, selectAlt, lastCompletedSets, bestE1RMForExercise } from '../store';
  import { warmupRamp, suggestNextWeight, epley1RM, bestE1RM } from '../calc';
  import Icon from './Icon.svelte';
  import SetRow from './SetRow.svelte';
  import Sparkline from './Sparkline.svelte';
  import { createEventDispatcher } from 'svelte';

  export let slot: Slot;
  export let slotIndex: number;
  export let dayKey: string;
  export let altIndex: number;

  const dispatch = createEventDispatcher<{
    edit: { setId: string };
    setDone: { setId: string };
  }>();

  let showAlts = false;

  $: rx = slot.alternatives[altIndex];
  $: exercise = EXERCISES[rx.exerciseId];
  $: supersetEx = rx.superset ? EXERCISES[rx.superset] : null;
  $: isActive = !!$state.active;
  $: sessionId = $state.active?.id;

  // Sets logged in current session
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
  $: suggestion = $state.settings.autoProgression ? suggestNextWeight(lastTime, rx, $state.settings.unit) : null;

  // 1RM sparkline: one e1RM per prior session
  $: sparklineData = (() => {
    const bySessionId = new Map<string, SetLog[]>();
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

  $: targetWorkingSets = rx.sets;

  // Initialize working sets if session active and none yet
  $: if (isActive && sessionId && mySets.length === 0 && warmupSets.length === 0) {
    initializeSets();
  }

  function initializeSets() {
    // Warmup ramp if compound + first compound today + setting enabled
    if ($state.settings.warmupEnabled && exercise.compound && suggestion) {
      const ramp = warmupRamp(suggestion.weight, $state.settings.unit);
      for (let i = 0; i < ramp.length; i++) {
        addBlankSet(rx.exerciseId, dayKey, {
          weight: ramp[i].weight,
          reps: ramp[i].reps,
          isWarmup: true
        });
      }
    }
    // Working sets
    for (let i = 0; i < targetWorkingSets; i++) {
      addBlankSet(rx.exerciseId, dayKey, {
        weight: suggestion?.weight ?? null,
        reps: null
      });
    }
  }

  function addExtra() {
    addBlankSet(rx.exerciseId, dayKey, {});
  }

  function pick(idx: number) {
    selectAlt(dayKey, slotIndex, idx);
    showAlts = false;
  }

  $: allDone = mySets.length > 0 && mySets.every((s) => s.done);
  $: started = mySets.some((s) => s.done);
</script>

<article class="card" class:done={allDone} class:active={started && !allDone}>
  <!-- Header row -->
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
      <Sparkline data={sparklineData} stroke="var(--accent)" />
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

  {#if suggestion && isActive}
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

  {#if isActive && (warmupSets.length > 0 || mySets.length > 0)}
    <div class="sets">
      {#if warmupSets.length > 0}
        <div class="sets-label eyebrow">Warmup</div>
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
        {#if warmupSets.length > 0}<div class="sets-label eyebrow">Working</div>{/if}
        {#each mySets as set (set.id)}
          <SetRow
            {set}
            unit={$state.settings.unit}
            placeholder={lastTime[mySets.indexOf(set)]}
            on:toggle={() => toggleSetDone(set.id)}
            on:edit={() => dispatch('edit', { setId: set.id })}
            on:delete={() => removeSet(set.id)}
          />
        {/each}
      {/if}
      <button class="add-set" on:click={addExtra}>+ add set</button>
    </div>
  {/if}

  {#if !isActive && lastTime.length > 0}
    <div class="last mono">
      last: {lastTime.map((s) => `${s.weight ?? '-'}×${s.reps ?? '-'}`).join(' · ')}
    </div>
  {/if}

  {#if showAlts}
    <div class="alts">
      <div class="alts-label eyebrow">Alternatives</div>
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
    background: var(--surface);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }
  .card.done { opacity: 0.45; }

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
  .meta { flex: 1; min-width: 0; display: flex; gap: 0.3rem; flex-wrap: wrap; }
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
  .add-set {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.7rem;
    border-radius: var(--r-pill);
    background: var(--surface-2);
    color: var(--ink-2);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -0.005em;
    transition: all 180ms;
  }
  .add-set:hover {
    color: var(--ink);
    background: var(--surface-3);
  }

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
