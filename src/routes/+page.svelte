<script lang="ts">
  import { onMount } from 'svelte';
  import { state, activeSession, startSession, endSession, getAltIndex, updateSet } from '$lib/store';
  import { getProgram, DAY_ORDER } from '$lib/data/program';
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
  let editingMode: 'weight' | 'reps' = 'weight';

  $: program = getProgram($state.settings.location, $state.settings.week);
  $: currentDay = program.days[dayIndex];

  let timer: RestTimer;

  function openEdit(setId: string) {
    const set = $state.sets.find((s) => s.id === setId);
    if (!set) return;
    editingSetId = setId;
    editingWeight = set.weight;
    editingReps = set.reps;
    editingMode = set.weight == null ? 'weight' : 'reps';
  }

  function onNumChange(e: CustomEvent<{ weight: number | null; reps: number | null }>) {
    if (!editingSetId) return;
    editingWeight = e.detail.weight;
    editingReps = e.detail.reps;
    updateSet(editingSetId, { weight: e.detail.weight, reps: e.detail.reps });
  }

  function onNumCommit() {
    if (!editingSetId) return;
    // Mark done if both values present
    const set = $state.sets.find((s) => s.id === editingSetId);
    if (set && set.weight != null && set.reps != null && !set.done) {
      updateSet(editingSetId, { done: true });
      // Find if PR
      const priorSets = $state.sets.filter(
        (x) => x.exerciseId === set.exerciseId && x.id !== set.id && x.done && !x.isWarmup
      );
      // Rest timer
      startRest(set.exerciseId);
      const isNewPR = priorSets.length > 0;
      // (PR detection done in store.toggleSetDone)
    }
    editingSetId = null;
  }

  function onSetDone(setId: string, exerciseId: string) {
    startRest(exerciseId);
  }

  function startRest(exerciseId: string) {
    const rest = $state.settings.defaultRestSec;
    // Could look up per-exercise default here
    timer?.start(rest);
  }

  function toggleSession() {
    if ($activeSession) {
      if ($state.sets.filter((s) => s.sessionId === $activeSession!.id && s.done).length === 0) {
        if (!confirm('Nothing logged. Discard session?')) return;
        endSession(true);
        pushToast('Discarded');
      } else {
        endSession();
        pushToast('Session saved');
      }
    } else {
      startSession(currentDay.key);
      pushToast(`${currentDay.label} session started`);
    }
  }
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
    <div class="day-left">
      <div class="eyebrow">{currentDay.weekday} · Day 0{dayIndex + 1}</div>
      <h2 class="serif">{currentDay.label}</h2>
      <div class="focus">
        {$state.settings.location === 'hotel' ? 'Dumbbells + bands' : 'Full equipment'}
        · {program.days[dayIndex].slots.length + ($state.settings.treadmillMin > 0 ? 1 : 0)} exercises
      </div>
    </div>
    <button class="session-btn btn {$activeSession ? 'end' : ''}" on:click={toggleSession}>
      {$activeSession ? 'End session' : 'Start session'}
    </button>
  </section>

  {#if $activeSession}
    <PainLog phase="before" />
  {/if}

  {#if $state.settings.treadmillMin > 0}
    <CardioCard dayKey={currentDay.key} />
  {/if}

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

<BottomNav {dayIndex} onSelect={(i) => (dayIndex = i)} />
<RestTimer bind:this={timer} />

{#if editingSetId}
  <NumPad
    bind:weightValue={editingWeight}
    bind:repsValue={editingReps}
    bind:mode={editingMode}
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
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 0.75rem;
    margin-bottom: 1.1rem;
  }
  .day-left { flex: 1; min-width: 0; }
  .day h2 {
    font-size: 42px;
    font-weight: 900;
    letter-spacing: -0.035em;
    line-height: 1;
    margin-top: 0.2rem;
    text-transform: capitalize;
  }
  .focus {
    font-size: 11px;
    color: var(--ink-3);
    margin-top: 0.35rem;
    letter-spacing: 0.02em;
  }
  .session-btn {
    padding: 0.75rem 1.1rem;
    min-height: 46px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: var(--accent);
    color: var(--bg);
    border-color: var(--accent);
  }
  .session-btn:hover { background: var(--accent-2); border-color: var(--accent-2); }
  .session-btn.end {
    background: var(--warn-soft);
    color: var(--warn);
    border-color: var(--warn-soft);
  }
  .session-btn.end:hover {
    background: var(--warn);
    color: var(--bg);
  }
  .footer {
    text-align: center;
    font-size: 10px;
    color: var(--ink-4);
    padding: 2rem 0 1rem;
    line-height: 1.8;
    border-top: 1px solid var(--line);
    margin-top: 2rem;
  }
  .footer a { color: var(--ink-3); }
</style>
