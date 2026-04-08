<script lang="ts">
  import Modal from './Modal.svelte';
  import { state } from '../store';
  import { EXERCISES } from '../data/exercises';
  import { bestE1RM, detectDeload } from '../calc';
  import type { SetLog } from '../types';
  import Sparkline from './Sparkline.svelte';

  export let open = false;

  // Build a map: exerciseId -> [e1rm per session] sorted
  $: exerciseProgress = (() => {
    const byEx = new Map<string, Map<string, SetLog[]>>();
    for (const s of $state.sets) {
      if (s.isWarmup || !s.done) continue;
      if (!byEx.has(s.exerciseId)) byEx.set(s.exerciseId, new Map());
      const sessMap = byEx.get(s.exerciseId)!;
      if (!sessMap.has(s.sessionId)) sessMap.set(s.sessionId, []);
      sessMap.get(s.sessionId)!.push(s);
    }

    type Row = { id: string; name: string; e1rm: number; points: number[]; deload: boolean };
    const rows: Row[] = [];
    for (const [exId, sessMap] of byEx) {
      const ex = EXERCISES[exId];
      if (!ex) continue;
      const points: number[] = [];
      const sessionsSorted = Array.from(sessMap.entries()).sort((a, b) => {
        const firstA = a[1][0]?.date ?? 0;
        const firstB = b[1][0]?.date ?? 0;
        return firstA - firstB;
      });
      for (const [, sets] of sessionsSorted) {
        const best = bestE1RM(sets);
        if (best > 0) points.push(Math.round(best));
      }
      if (points.length === 0) continue;
      const deload = detectDeload($state.sets, exId).suggest;
      rows.push({
        id: exId,
        name: ex.name,
        e1rm: points[points.length - 1],
        points,
        deload
      });
    }
    return rows.sort((a, b) => b.e1rm - a.e1rm);
  })();

  $: unit = $state.settings.unit;
</script>

<Modal {open} title="Progress" on:close={() => (open = false)}>
  {#if exerciseProgress.length === 0}
    <div class="empty">
      <p class="serif">No data yet.</p>
      <p>Log a few sessions and your estimated 1RM progress will show here.</p>
    </div>
  {:else}
    <p class="intro">Estimated 1RM over time (Epley formula). Based on your heaviest working set per session.</p>
    {#each exerciseProgress as row (row.id)}
      <article class="row">
        <div class="top">
          <h3 class="serif">{row.name}</h3>
          <div class="e1rm mono">
            <strong>{row.e1rm}</strong>
            <small>{unit} est 1RM</small>
          </div>
        </div>
        <div class="chart">
          <Sparkline data={row.points} width={280} height={36} stroke="var(--accent)" />
        </div>
        {#if row.deload}
          <div class="deload-hint">⚠ Deload suggested — progression has plateaued or overshot</div>
        {/if}
      </article>
    {/each}
  {/if}
</Modal>

<style>
  .empty {
    text-align: center;
    padding: 2.5rem 1rem;
    color: var(--ink-3);
  }
  .empty p.serif {
    font-family: var(--serif);
    font-size: 28px;
    font-weight: 800;
    color: var(--ink-2);
    margin-bottom: 0.5rem;
  }
  .intro {
    font-size: 12px;
    color: var(--ink-3);
    line-height: 1.5;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--line);
  }
  .row {
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--line);
  }
  .row:last-child { border: 0; }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
  }
  .top h3 {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.015em;
  }
  .e1rm {
    text-align: right;
  }
  .e1rm strong {
    font-size: 18px;
    font-weight: 800;
    color: var(--accent);
    font-family: var(--serif);
  }
  .e1rm small {
    font-size: 9px;
    color: var(--ink-3);
    display: block;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .chart {
    margin-top: 0.5rem;
    width: 100%;
    overflow: hidden;
  }
  .deload-hint {
    font-size: 10px;
    color: var(--pr);
    background: var(--pr-soft);
    padding: 0.35rem 0.55rem;
    margin-top: 0.4rem;
    border-radius: 2px;
  }
</style>
