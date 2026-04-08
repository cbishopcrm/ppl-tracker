<script lang="ts">
  import { state, weekStats } from '../store';
  import { computeStreak, formatVolume } from '../calc';

  $: streak = computeStreak($state.sessions.map((s) => s.startedAt));
  $: stats = $weekStats;
  $: unit = $state.settings.unit;
</script>

<section class="strip">
  <div class="stat">
    <div class="value mono">{streak}</div>
    <div class="label">day streak</div>
  </div>
  <div class="stat">
    <div class="value mono">{formatVolume(stats.volume)}</div>
    <div class="label">{unit} this week</div>
  </div>
  <div class="stat">
    <div class="value mono">{stats.sets}</div>
    <div class="label">sets this week</div>
  </div>
</section>

<style>
  .strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
    padding: 1.1rem 1.2rem;
    border-radius: var(--r-lg);
    background: var(--surface);
    margin-bottom: 1.4rem;
  }
  .stat {
    text-align: left;
  }
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
</style>
