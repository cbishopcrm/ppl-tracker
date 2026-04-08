<script lang="ts">
  import { state, weekStats } from '../store';
  import { computeStreak, formatVolume } from '../calc';

  $: streak = computeStreak($state.sessions.map((s) => s.startedAt));
  $: stats = $weekStats;
  $: unit = $state.settings.unit;
</script>

<section class="strip">
  <div class="stat">
    <div class="label">Streak</div>
    <div class="value mono">{streak}</div>
    <div class="unit">days</div>
  </div>
  <div class="sep"></div>
  <div class="stat">
    <div class="label">Week volume</div>
    <div class="value mono">{formatVolume(stats.volume)}</div>
    <div class="unit">{unit}</div>
  </div>
  <div class="sep"></div>
  <div class="stat">
    <div class="label">Week sets</div>
    <div class="value mono">{stats.sets}</div>
    <div class="unit">sets</div>
  </div>
</section>

<style>
  .strip {
    display: grid;
    grid-template-columns: 1fr 1px 1fr 1px 1fr;
    align-items: center;
    padding: 1rem 1.1rem;
    border: 1px solid var(--line);
    background: var(--surface);
    border-radius: var(--radius);
    margin-bottom: 1.25rem;
  }
  .sep {
    height: 42px;
    background: var(--line);
    justify-self: center;
  }
  .stat {
    text-align: center;
  }
  .label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-bottom: 0.2rem;
  }
  .value {
    font-family: var(--serif);
    font-size: 30px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--ink);
  }
  .unit {
    font-size: 10px;
    color: var(--ink-3);
    margin-top: 0.2rem;
    font-weight: 500;
    text-transform: lowercase;
  }
</style>
