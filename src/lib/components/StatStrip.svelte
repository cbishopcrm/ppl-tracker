<script lang="ts">
  import { state, weekStats } from '../store';
  import { computePPLStreak, formatVolume, setsPerCategoryThisWeek, VOLUME_TARGETS } from '../calc';
  import { EXERCISES } from '../data/exercises';

  $: streak = computePPLStreak($state.sessions.map((s) => s.startedAt));
  $: stats = $weekStats;
  $: unit = $state.settings.unit;

  $: volByCat = setsPerCategoryThisWeek($state.sets, (id) => {
    const cat = EXERCISES[id]?.category;
    if (cat === 'push' || cat === 'pull' || cat === 'legs' || cat === 'core') return cat;
    return undefined;
  });
</script>

<section class="strip">
  <div class="row top">
    <div class="stat">
      <div class="value mono">{streak}</div>
      <div class="label">week streak</div>
    </div>
    <div class="stat">
      <div class="value mono">{formatVolume(stats.volume)}</div>
      <div class="label">{unit} this week</div>
    </div>
    <div class="stat">
      <div class="value mono">{stats.sets}</div>
      <div class="label">sets this week</div>
    </div>
  </div>
  <div class="row volume">
    {#each ['push', 'pull', 'legs', 'core'] as cat}
      {@const done = volByCat[cat]}
      {@const target = VOLUME_TARGETS[cat]}
      {@const pct = Math.min(100, (done / target) * 100)}
      <div class="vc">
        <div class="vc-top">
          <span class="vc-label">{cat}</span>
          <span class="vc-num mono">{done}<small>/{target}</small></span>
        </div>
        <div class="vc-bar"><div class="vc-fill" style="width: {pct}%" class:full={done >= target}></div></div>
      </div>
    {/each}
  </div>
</section>

<style>
  .strip {
    padding: 1.1rem 1.2rem;
    border-radius: var(--r-lg);
    background: var(--surface);
    margin-bottom: 1.4rem;
  }
  .row.top {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
    padding-bottom: 0.95rem;
    border-bottom: 1px solid var(--line);
    margin-bottom: 0.95rem;
  }
  .stat { text-align: left; }
  .value {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.035em;
    color: var(--ink);
    margin-bottom: 0.25rem;
  }
  .label {
    font-size: 12px;
    color: var(--ink-3);
    font-weight: 500;
    letter-spacing: -0.005em;
  }
  .row.volume {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem 0.8rem;
  }
  .vc { display: flex; flex-direction: column; gap: 4px; }
  .vc-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .vc-label {
    font-size: 11px;
    color: var(--ink-3);
    font-weight: 500;
    text-transform: capitalize;
    letter-spacing: -0.005em;
  }
  .vc-num {
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
  }
  .vc-num small { color: var(--ink-3); font-weight: 500; }
  .vc-bar {
    height: 4px;
    background: var(--surface-2);
    border-radius: var(--r-pill);
    overflow: hidden;
  }
  .vc-fill {
    height: 100%;
    background: var(--accent);
    border-radius: var(--r-pill);
    transition: width 320ms ease;
  }
  .vc-fill.full { background: var(--ok); }
</style>
