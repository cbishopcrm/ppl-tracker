<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';
  import { settings } from '../store';
  import { platesPerSide } from '../calc';

  export let weightValue: number | null = null;
  export let repsValue: number | null = null;
  export let mode: 'weight' | 'reps' = 'weight';

  const dispatch = createEventDispatcher<{
    change: { weight: number | null; reps: number | null };
    commit: void;
    close: void;
    next: void;
  }>();

  function setMode(m: 'weight' | 'reps') {
    mode = m;
  }

  function press(n: string) {
    if (mode === 'weight') {
      const cur = weightValue?.toString() ?? '';
      const next = cur === '0' ? n : cur + n;
      weightValue = next === '' ? null : Number(next);
    } else {
      const cur = repsValue?.toString() ?? '';
      const next = cur === '0' ? n : cur + n;
      repsValue = next === '' ? null : Number(next);
    }
    emit();
  }

  function backspace() {
    if (mode === 'weight') {
      const s = weightValue?.toString() ?? '';
      const next = s.slice(0, -1);
      weightValue = next === '' ? null : Number(next);
    } else {
      const s = repsValue?.toString() ?? '';
      const next = s.slice(0, -1);
      repsValue = next === '' ? null : Number(next);
    }
    emit();
  }

  function adjustWeight(delta: number) {
    const cur = weightValue ?? 0;
    weightValue = Math.max(0, cur + delta);
    emit();
  }

  function dot() {
    if (mode !== 'weight') return;
    const s = weightValue?.toString() ?? '';
    if (s.includes('.')) return;
    weightValue = Number((s || '0') + '.');
    // Don't emit for lone dot — wait for next digit
  }

  function emit() {
    dispatch('change', { weight: weightValue, reps: repsValue });
  }

  function commit() {
    dispatch('commit');
  }

  function next() {
    if (mode === 'weight') {
      setMode('reps');
      dispatch('next');
    } else {
      commit();
    }
  }

  $: bumps = $settings.unit === 'lb' ? [2.5, 5, 10, 25, 45] : [1.25, 2.5, 5, 10, 20];
  $: plates = weightValue && mode === 'weight' ? platesPerSide(weightValue, $settings.unit) : [];
</script>

<div class="numpad-backdrop" on:click={() => dispatch('close')} on:keydown role="presentation"></div>
<div class="numpad" on:click|stopPropagation on:keydown role="presentation">
  <div class="switch">
    <button class:on={mode === 'weight'} on:click={() => setMode('weight')}>
      <span class="lbl">{$settings.unit.toUpperCase()}</span>
      <span class="val mono">{weightValue ?? '—'}</span>
    </button>
    <button class:on={mode === 'reps'} on:click={() => setMode('reps')}>
      <span class="lbl">REPS</span>
      <span class="val mono">{repsValue ?? '—'}</span>
    </button>
  </div>

  {#if mode === 'weight' && plates.length > 0}
    <div class="plates">
      <span class="plates-label">plates/side</span>
      <span class="plates-val mono">{plates.join(' · ')}</span>
    </div>
  {/if}

  {#if mode === 'weight'}
    <div class="bumps">
      {#each bumps as b}
        <button on:click={() => adjustWeight(b)}>+{b}</button>
      {/each}
      <button class="neg" on:click={() => adjustWeight(-bumps[0])}>−{bumps[0]}</button>
    </div>
  {/if}

  <div class="grid">
    {#each ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as n}
      <button class="key" on:click={() => press(n)}>{n}</button>
    {/each}
    {#if mode === 'weight'}
      <button class="key" on:click={dot}>.</button>
    {:else}
      <button class="key empty" disabled></button>
    {/if}
    <button class="key" on:click={() => press('0')}>0</button>
    <button class="key back" on:click={backspace} aria-label="Backspace">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 5H8l-7 7 7 7h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
    </button>
  </div>

  <div class="actions">
    <button class="btn btn-ghost btn-sm" on:click={() => dispatch('close')}>Close</button>
    <button class="btn btn-primary" on:click={next}>
      {mode === 'weight' ? 'Next: reps →' : 'Complete set ✓'}
    </button>
  </div>
</div>

<style>
  .numpad-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 199;
    animation: fade 220ms;
  }
  .numpad {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1.25rem 1.25rem calc(1.25rem + var(--safe-b));
    background: var(--surface);
    z-index: 200;
    max-width: 680px;
    margin: 0 auto;
    border-radius: var(--r-xl) var(--r-xl) 0 0;
    animation: slideUp 300ms cubic-bezier(0.2, 0.8, 0.3, 1);
    box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.5);
  }
  @keyframes slideUp { from { transform: translateY(110%); } to { transform: translateY(0); } }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }

  .switch {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 0.85rem;
  }
  .switch button {
    border-radius: var(--r-md);
    padding: 0.95rem 1rem;
    background: var(--surface-2);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    transition: all 180ms;
  }
  .switch button.on {
    background: var(--accent-soft);
    box-shadow: inset 0 0 0 1.5px var(--accent);
  }
  .switch .lbl {
    font-size: 12px;
    font-weight: 500;
    color: var(--ink-3);
    letter-spacing: -0.005em;
  }
  .switch button.on .lbl { color: var(--accent-2); }
  .switch .val {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.1;
    margin-top: 4px;
    color: var(--ink);
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }

  .plates {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.7rem 0.95rem;
    background: var(--surface-2);
    border-radius: var(--r-md);
    margin-bottom: 0.7rem;
  }
  .plates-label {
    font-size: 12px;
    color: var(--ink-3);
    font-weight: 500;
    letter-spacing: -0.005em;
  }
  .plates-val {
    font-size: 14px;
    font-weight: 600;
    color: var(--accent-2);
  }

  .bumps {
    display: flex;
    gap: 0.35rem;
    margin-bottom: 0.7rem;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .bumps::-webkit-scrollbar { display: none; }
  .bumps button {
    flex: 1 0 auto;
    min-width: 56px;
    padding: 0.55rem 0.4rem;
    border-radius: var(--r-pill);
    background: var(--surface-2);
    color: var(--ink-2);
    font-weight: 500;
    font-size: 13px;
    min-height: 40px;
    font-variant-numeric: tabular-nums;
    transition: all 180ms;
  }
  .bumps button.neg { color: var(--warn); }
  .bumps button:hover { background: var(--surface-3); color: var(--ink); }
  .bumps button:active { transform: scale(0.95); }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.55rem;
    margin-bottom: 0.85rem;
  }
  .key {
    padding: 1.05rem 0;
    background: var(--surface-2);
    border-radius: var(--r-md);
    font-size: 24px;
    font-weight: 500;
    color: var(--ink);
    min-height: 58px;
    transition: background 140ms, transform 120ms;
    font-variant-numeric: tabular-nums;
  }
  .key:hover { background: var(--surface-3); }
  .key:active { transform: scale(0.96); background: var(--surface-3); }
  .key.back { color: var(--ink-2); display: flex; align-items: center; justify-content: center; }
  .key.empty { visibility: hidden; }

  .actions {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 0.5rem;
  }
</style>
