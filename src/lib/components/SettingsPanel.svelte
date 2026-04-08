<script lang="ts">
  import Modal from './Modal.svelte';
  import { state, setSetting, exportJSON, importJSON, resetAll } from '../store';
  import { pushToast } from './toast';
  import Icon from './Icon.svelte';
  // theme toggle removed — app is dark only

  export let open = false;

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

  $: s = $state.settings;
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
    <p class="hint">Individual exercises may override this.</p>
  </div>

  <div class="field">
    <label>Treadmill warmup</label>
    <div class="seg">
      <button class:on={s.treadmillMin === 0} on:click={() => setSetting('treadmillMin', 0)}>Off</button>
      <button class:on={s.treadmillMin === 3} on:click={() => setSetting('treadmillMin', 3)}>3m</button>
      <button class:on={s.treadmillMin === 5} on:click={() => setSetting('treadmillMin', 5)}>5m</button>
      <button class:on={s.treadmillMin === 10} on:click={() => setSetting('treadmillMin', 10)}>10m</button>
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
    <label>Warmup ramp sets</label>
    <div class="seg">
      <button class:on={s.warmupEnabled} on:click={() => setSetting('warmupEnabled', true)}>Auto</button>
      <button class:on={!s.warmupEnabled} on:click={() => setSetting('warmupEnabled', false)}>Off</button>
    </div>
    <p class="hint">Auto-generates 4 ramp sets for compounds.</p>
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
    <p class="hint">Cloud sync requires Vercel KV to be enabled on this deployment. Local data is your source of truth.</p>
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
</style>
