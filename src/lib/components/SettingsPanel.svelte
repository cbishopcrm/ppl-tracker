<script lang="ts">
  import Modal from './Modal.svelte';
  import {
    state,
    setSetting,
    exportJSON,
    importJSON,
    resetAll,
    logBodyWeight,
    removeBodyWeight
  } from '../store';
  import { pushToast } from './toast';
  import Icon from './Icon.svelte';
  import ThemePicker from './ThemePicker.svelte';
  import type { CardioType } from '../types';

  export let open = false;

  let bwInput = '';

  async function doExport() {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ppl-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast('Exported');
  }

  let fileInput: HTMLInputElement;
  function doImport() {
    fileInput.click();
  }
  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const text = await f.text();
    if (importJSON(text)) pushToast('Imported');
    else pushToast('Invalid file');
    (e.target as HTMLInputElement).value = '';
  }

  function doReset() {
    if (!confirm('Reset ALL data? This cannot be undone.')) return;
    if (!confirm('Are you absolutely sure?')) return;
    resetAll();
    pushToast('Reset');
  }

  async function trySync() {
    const res = await fetch('/api/sync', { method: 'GET' });
    const data = await res.json();
    if (data.ok) pushToast('Cloud sync ready');
    else pushToast(data.message ?? 'Sync unavailable');
  }

  function addBodyWeight() {
    const n = Number(bwInput);
    if (!n || n <= 0) return;
    logBodyWeight(n);
    bwInput = '';
    pushToast('Body weight logged');
  }

  function setCardioType(t: CardioType) {
    setSetting('cardio', { ...$state.settings.cardio, type: t });
  }
  function setCardioMin(m: number) {
    setSetting('cardio', { ...$state.settings.cardio, durationMin: m, enabled: m > 0 });
  }
  function toggleCardioEnabled() {
    setSetting('cardio', { ...$state.settings.cardio, enabled: !$state.settings.cardio.enabled });
  }

  $: s = $state.settings;
  $: latestBw = $state.bodyWeights[0];
</script>

<Modal {open} title="Settings" on:close={() => (open = false)}>
  <div class="field">
    <label>Location</label>
    <div class="seg">
      <button class:on={s.location === 'gym'} on:click={() => setSetting('location', 'gym')}>
        Gym<small>Full equipment</small>
      </button>
      <button class:on={s.location === 'hotel'} on:click={() => setSetting('location', 'hotel')}>
        Hotel<small>DBs + bands</small>
      </button>
    </div>
  </div>

  <div class="field">
    <label>Week</label>
    <div class="seg">
      <button class:on={s.week === 'a'} on:click={() => setSetting('week', 'a')}>
        Week A<small>Variant 1</small>
      </button>
      <button class:on={s.week === 'b'} on:click={() => setSetting('week', 'b')}>
        Week B<small>Variant 2</small>
      </button>
    </div>
  </div>

  <div class="field">
    <label>Theme</label>
    <ThemePicker />
  </div>

  <div class="field">
    <label>Units</label>
    <div class="seg">
      <button class:on={s.unit === 'lb'} on:click={() => setSetting('unit', 'lb')}>Pounds</button>
      <button class:on={s.unit === 'kg'} on:click={() => setSetting('unit', 'kg')}>Kilograms</button>
    </div>
  </div>

  <div class="field">
    <label>Default rest between sets</label>
    <div class="seg">
      <button class:on={s.defaultRestSec === 60} on:click={() => setSetting('defaultRestSec', 60)}>60s</button>
      <button class:on={s.defaultRestSec === 90} on:click={() => setSetting('defaultRestSec', 90)}>90s</button>
      <button class:on={s.defaultRestSec === 120} on:click={() => setSetting('defaultRestSec', 120)}>2m</button>
      <button class:on={s.defaultRestSec === 180} on:click={() => setSetting('defaultRestSec', 180)}>3m</button>
    </div>
    <p class="hint">Individual exercises override this.</p>
  </div>

  <div class="field">
    <label>Cardio warmup</label>
    <div class="seg">
      <button class:on={s.cardio.type === 'treadmill'} on:click={() => setCardioType('treadmill')}>Treadmill</button>
      <button class:on={s.cardio.type === 'bike'} on:click={() => setCardioType('bike')}>Bike</button>
      <button class:on={s.cardio.type === 'row'} on:click={() => setCardioType('row')}>Row</button>
      <button class:on={s.cardio.type === 'jumprope'} on:click={() => setCardioType('jumprope')}>Rope</button>
    </div>
    <div class="seg" style="margin-top:6px">
      <button class:on={!s.cardio.enabled} on:click={toggleCardioEnabled}>Off</button>
      <button class:on={s.cardio.enabled && s.cardio.durationMin === 3} on:click={() => setCardioMin(3)}>3m</button>
      <button class:on={s.cardio.enabled && s.cardio.durationMin === 5} on:click={() => setCardioMin(5)}>5m</button>
      <button class:on={s.cardio.enabled && s.cardio.durationMin === 10} on:click={() => setCardioMin(10)}>10m</button>
    </div>
  </div>

  <div class="field">
    <label>Auto progression hints</label>
    <div class="seg">
      <button class:on={s.autoProgression} on:click={() => setSetting('autoProgression', true)}>On</button>
      <button class:on={!s.autoProgression} on:click={() => setSetting('autoProgression', false)}>Off</button>
    </div>
  </div>

  <div class="field">
    <label>Warmup ramp button</label>
    <div class="seg">
      <button class:on={s.warmupEnabled} on:click={() => setSetting('warmupEnabled', true)}>Show</button>
      <button class:on={!s.warmupEnabled} on:click={() => setSetting('warmupEnabled', false)}>Hide</button>
    </div>
    <p class="hint">A "warmup ramp" button appears under compound lifts in a session. Tap it to auto-generate 4 ramp sets.</p>
  </div>

  <div class="field">
    <label>Haptics</label>
    <div class="seg">
      <button class:on={s.hapticsEnabled} on:click={() => setSetting('hapticsEnabled', true)}>On</button>
      <button class:on={!s.hapticsEnabled} on:click={() => setSetting('hapticsEnabled', false)}>Off</button>
    </div>
  </div>

  <div class="field">
    <label>Body weight</label>
    {#if latestBw}
      <div class="bw-current mono">
        Latest: <strong>{latestBw.weight}</strong> {s.unit}
        <span class="bw-date">— {new Date(latestBw.date).toLocaleDateString()}</span>
      </div>
    {/if}
    <div class="bw-row">
      <input
        class="bw-input mono"
        type="number"
        inputmode="decimal"
        placeholder="weight in {s.unit}"
        bind:value={bwInput}
      />
      <button class="btn btn-primary btn-sm" on:click={addBodyWeight}>Log</button>
    </div>
    {#if $state.bodyWeights.length > 1}
      <div class="bw-history">
        {#each $state.bodyWeights.slice(0, 5) as b (b.id)}
          <div class="bw-item mono">
            <span>{b.weight} {s.unit}</span>
            <span class="bw-date">{new Date(b.date).toLocaleDateString()}</span>
            <button class="bw-del" on:click={() => removeBodyWeight(b.id)} aria-label="Delete">×</button>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="field">
    <label>Data</label>
    <div class="io">
      <button class="btn" on:click={doExport}><Icon name="export" size={14} />Export</button>
      <button class="btn" on:click={doImport}><Icon name="import" size={14} />Import</button>
      <input type="file" accept="application/json" bind:this={fileInput} on:change={onFile} hidden />
    </div>
    <button class="btn danger" on:click={doReset}>Reset all data</button>
  </div>

  <div class="field">
    <label>Cloud sync</label>
    <button class="btn" on:click={trySync}><Icon name="cloud" size={14} />Check cloud status</button>
    <p class="hint">Cloud sync requires Vercel KV (Upstash Redis) to be enabled on this deployment. Local data is your source of truth.</p>
  </div>
</Modal>

<style>
  .io { display: flex; gap: 0.5rem; margin-bottom: 0.6rem; }
  .io .btn { flex: 1; }
  .btn.danger {
    width: 100%;
    color: var(--warn);
    background: var(--warn-soft);
  }
  .btn.danger:hover { background: var(--warn); color: #fff; }
  .hint {
    font-size: 12px;
    color: var(--ink-3);
    margin-top: 0.55rem;
    line-height: 1.5;
    letter-spacing: -0.005em;
  }
  .bw-current {
    font-size: 13px;
    color: var(--ink-2);
    background: var(--surface-2);
    padding: 0.7rem 0.95rem;
    border-radius: var(--r-md);
    margin-bottom: 0.55rem;
  }
  .bw-current strong {
    color: var(--ink);
    font-size: 16px;
    font-weight: 600;
  }
  .bw-date {
    color: var(--ink-3);
    font-size: 11px;
    margin-left: 4px;
  }
  .bw-row { display: flex; gap: 0.5rem; }
  .bw-input {
    flex: 1;
    padding: 0.7rem 0.85rem;
    background: var(--surface-2);
    border-radius: var(--r-pill);
    color: var(--ink);
    font-size: 14px;
    font-weight: 500;
    min-height: 44px;
  }
  .bw-input:focus { outline: none; box-shadow: inset 0 0 0 1.5px var(--accent); }
  .bw-history { margin-top: 0.7rem; display: flex; flex-direction: column; gap: 0.3rem; }
  .bw-item {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem 0.7rem;
    background: var(--surface-2);
    border-radius: var(--r-sm);
    font-size: 12px;
    color: var(--ink-2);
  }
  .bw-del {
    color: var(--ink-4);
    font-size: 18px;
    width: 24px;
    height: 24px;
  }
  .bw-del:hover { color: var(--warn); }
</style>
