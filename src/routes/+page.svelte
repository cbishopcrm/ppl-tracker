<script lang="ts">
  import { onMount, tick } from 'svelte';
  import {
    state,
    activeSession,
    startSession,
    endSession,
    getAltIndex,
    updateSet,
    haptic
  } from '$lib/store';
  import { getProgram } from '$lib/data/program';
  import { recoveryFor } from '$lib/calc';
  import { EXERCISES } from '$lib/data/exercises';
  import { pushToast } from '$lib/components/toast';

  import Header from '$lib/components/Header.svelte';
  import StatStrip from '$lib/components/StatStrip.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import ExerciseCard from '$lib/components/ExerciseCard.svelte';
  import CardioCard from '$lib/components/CardioCard.svelte';
  import PainLog from '$lib/components/PainLog.svelte';
  import RestTimer from '$lib/components/RestTimer.svelte';
  import NumPad from '$lib/components/NumPad.svelte';
  import SettingsPanel from '$lib/components/SettingsPanel.svelte';
  import HistoryPanel from '$lib/components/HistoryPanel.svelte';
  import ProgressPanel from '$lib/components/ProgressPanel.svelte';
  import UndoToast from '$lib/components/UndoToast.svelte';

  let dayIndex = 0;
  let settingsOpen = false;
  let historyOpen = false;
  let progressOpen = false;

  // Auto-select day based on weekday
  onMount(() => {
    const d = new Date().getDay();
    dayIndex = d === 1 ? 0 : d === 2 ? 1 : d === 4 ? 2 : d === 5 ? 3 : 0;
  });

  // Editing a set with the numpad
  let editingSetId: string | null = null;
  let editingWeight: number | null = null;
  let editingReps: number | null = null;
  let editingRpe: number | null = null;
  let editingMode: 'weight' | 'reps' | 'rpe' = 'weight';
  let editingIsTime = false;
  let editingIsBarbell = false;
  let editingExName = '';

  $: program = getProgram($state.settings.location, $state.settings.week);
  $: currentDay = program.days[dayIndex];

  $: dayRecovery = recoveryFor(
    $state.sessions.map((s) => ({ startedAt: s.startedAt, dayKey: s.dayKey })),
    currentDay.key
  );

  let timer: RestTimer;

  async function openEdit(setId: string) {
    const set = $state.sets.find((s) => s.id === setId);
    if (!set) return;
    const ex = EXERCISES[set.exerciseId];
    editingSetId = setId;
    editingWeight = set.weight;
    editingReps = set.reps;
    editingRpe = set.rpe;
    editingIsTime = ex?.unit === 'seconds' || !!set.isTime;
    editingIsBarbell = !!ex?.barbell;
    editingExName = ex?.name ?? '';
    editingMode = set.weight == null && !editingIsTime ? 'weight' : 'reps';
    // Scroll the active row into view above the numpad after numpad mounts
    await tick();
    const el = document.querySelector(`[data-set-id="${setId}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function onNumChange(e: CustomEvent<{ weight: number | null; reps: number | null; rpe: number | null }>) {
    if (!editingSetId) return;
    editingWeight = e.detail.weight;
    editingReps = e.detail.reps;
    editingRpe = e.detail.rpe;
    updateSet(editingSetId, {
      weight: e.detail.weight,
      reps: e.detail.reps,
      rpe: e.detail.rpe
    });
  }

  function onNumCommit() {
    if (!editingSetId) return;
    const set = $state.sets.find((s) => s.id === editingSetId);
    if (set && (set.weight != null || editingIsTime) && set.reps != null && !set.done) {
      updateSet(editingSetId, { done: true });
      startRest();
    }
    editingSetId = null;
  }

  function startRest() {
    const rest = $state.settings.defaultRestSec;
    timer?.start(rest);
  }

  function toggleSession() {
    if ($activeSession) {
      const completed = $state.sets.filter(
        (s) => s.sessionId === $activeSession!.id && s.done
      ).length;
      if (completed === 0) {
        if (!confirm('Nothing logged. Discard session?')) return;
        endSession(true);
        pushToast('Discarded');
      } else {
        endSession();
        pushToast('Session saved');
      }
    } else {
      // Confirm if switching to a day mid-recovery
      startSession(currentDay.key);
      pushToast(`${currentDay.label} session started`);
    }
  }

  function setDayIdx(i: number) {
    dayIndex = i;
  }

  $: recoveryLabel = (() => {
    if (dayRecovery.hoursSince == null) return null;
    const h = Math.round(dayRecovery.hoursSince);
    if (h < 24) return `${h}h ago — still recovering`;
    if (h < 48) return `${h}h ago — ready`;
    const d = Math.round(h / 24);
    return `${d} day${d === 1 ? '' : 's'} ago — fresh`;
  })();
</script>

<div class="app">
  <Header
    onHistory={() => (historyOpen = true)}
    onSettings={() => (settingsOpen = true)}
    onProgress={() => (progressOpen = true)}
  />

  <StatStrip />

  <!-- Day header -->
  <section class="day">
    <div class="eyebrow">{currentDay.weekday} · Day 0{dayIndex + 1}</div>
    <h2 class="day-title">
      Time to <span class="grad">{currentDay.label.toLowerCase()}.</span>
    </h2>
    <div class="focus">
      {$state.settings.location === 'hotel' ? 'Dumbbells and bands' : 'Full equipment'}
      · {currentDay.slots.length + ($state.settings.cardio.enabled ? 1 : 0)} exercises
    </div>
    {#if recoveryLabel}
      <div class="recovery" class:warm={dayRecovery.warm} class:fresh={dayRecovery.fresh}>
        Last {currentDay.label} · {recoveryLabel}
      </div>
    {/if}
    {#if !$activeSession}
      <button class="session-btn btn btn-primary" on:click={toggleSession}>
        Start session
      </button>
    {/if}
  </section>

  {#if $activeSession}
    <PainLog phase="before" />
  {/if}

  <CardioCard dayKey={currentDay.key} />

  {#each currentDay.slots as slot, slotIdx (slotIdx)}
    <ExerciseCard
      {slot}
      slotIndex={slotIdx}
      dayKey={currentDay.key}
      altIndex={getAltIndex($state, currentDay.key, slotIdx)}
      on:edit={(e) => openEdit(e.detail.setId)}
    />
  {/each}

  {#if $activeSession}
    <PainLog phase="after" />
  {/if}

  <footer class="footer">
    Based on <a href="https://learn.athleanx.com/articles/push-pull-legs-routine-the-complete-guide" target="_blank" rel="noopener">Athlean-X PPL</a><br />
    Spine mods: McGill · Squat University · Contreras
  </footer>
</div>

<!-- Sticky end-session pill (live only) -->
{#if $activeSession}
  <button class="end-fab" on:click={toggleSession}>
    End session
  </button>
{/if}

<BottomNav {dayIndex} onSelect={setDayIdx} />
<RestTimer bind:this={timer} />
<UndoToast />

{#if editingSetId}
  <NumPad
    bind:weightValue={editingWeight}
    bind:repsValue={editingReps}
    bind:rpeValue={editingRpe}
    bind:mode={editingMode}
    isTime={editingIsTime}
    isBarbell={editingIsBarbell}
    exerciseName={editingExName}
    on:change={onNumChange}
    on:commit={onNumCommit}
    on:close={() => (editingSetId = null)}
  />
{/if}

<SettingsPanel bind:open={settingsOpen} />
<HistoryPanel bind:open={historyOpen} />
<ProgressPanel bind:open={progressOpen} />

<style>
  .day {
    margin-bottom: 1.5rem;
    text-align: center;
    padding: 0.5rem 0 1rem;
  }
  .day .eyebrow {
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-3);
    letter-spacing: -0.005em;
    margin-bottom: 0.35rem;
  }
  .day-title {
    font-size: 52px;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 0.98;
    margin-bottom: 0.85rem;
  }
  .focus {
    font-size: 15px;
    color: var(--ink-3);
    margin-bottom: 0.85rem;
    letter-spacing: -0.01em;
    font-weight: 500;
  }
  .recovery {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    color: var(--ink-3);
    background: var(--surface);
    padding: 0.4rem 0.85rem;
    border-radius: var(--r-pill);
    margin-bottom: 1rem;
  }
  .recovery.warm { color: var(--warn); background: var(--warn-soft); }
  .recovery.fresh { color: var(--ok); background: var(--ok-soft); }
  .session-btn {
    padding: 0.85rem 1.85rem;
    min-height: 50px;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  @media (max-width: 420px) {
    .day-title { font-size: 44px; }
  }

  .end-fab {
    position: fixed;
    bottom: calc(108px + var(--safe-b));
    right: 1rem;
    padding: 0.7rem 1.25rem;
    background: var(--warn);
    color: #fff;
    border-radius: var(--r-pill);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.005em;
    box-shadow: 0 12px 32px rgba(255, 69, 58, 0.35);
    z-index: 65;
    transition: transform 140ms;
  }
  .end-fab:active { transform: scale(0.95); }

  .footer {
    text-align: center;
    font-size: 12px;
    color: var(--ink-4);
    padding: 2.5rem 0 1rem;
    line-height: 1.75;
    margin-top: 2.5rem;
    letter-spacing: -0.005em;
  }
  .footer a { color: var(--ink-3); }
</style>
