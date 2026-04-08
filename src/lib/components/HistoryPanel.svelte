<script lang="ts">
  import Modal from './Modal.svelte';
  import { state } from '../store';
  import { formatDuration, formatVolume } from '../calc';
  import { EXERCISES } from '../data/exercises';

  export let open = false;

  $: sessions = $state.sessions;
  $: unit = $state.settings.unit;

  function exNames(sessionId: string): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const s of $state.sets) {
      if (s.sessionId !== sessionId || !s.done || s.isWarmup || s.isCardio) continue;
      if (seen.has(s.exerciseId)) continue;
      seen.add(s.exerciseId);
      result.push(EXERCISES[s.exerciseId]?.name ?? s.exerciseId);
    }
    return result;
  }

  function fmtDate(d: number): string {
    return new Date(d).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: new Date(d).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  }
</script>

<Modal {open} title="History" on:close={() => (open = false)}>
  {#if sessions.length === 0}
    <div class="empty">
      <p class="title">No sessions yet.</p>
      <p>Start your first session to begin tracking.</p>
    </div>
  {:else}
    {#each sessions as sess (sess.id)}
      <article class="item">
        <header>
          <div>
            <div class="eyebrow">{fmtDate(sess.startedAt)} · {sess.location} · Week {sess.week.toUpperCase()}</div>
            <h3 class="title">{sess.dayKey}</h3>
          </div>
          <div class="badges mono">
            <span><strong>{formatVolume(sess.totalVolume)}</strong><small>{unit}</small></span>
            <span><strong>{sess.totalSets}</strong><small>sets</small></span>
            <span><strong>{formatDuration(sess.durationSec * 1000)}</strong><small></small></span>
          </div>
        </header>
        <div class="exlist">{exNames(sess.id).join(' · ')}</div>
        {#if sess.painBefore !== undefined || sess.painAfter !== undefined}
          <div class="pain">
            Low back: <span class="mono">{sess.painBefore ?? '—'}</span> → <span class="mono">{sess.painAfter ?? '—'}</span>
          </div>
        {/if}
      </article>
    {/each}
  {/if}
</Modal>

<style>
  .empty {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--ink-3);
  }
  .empty p.title {
    font-size: 24px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
  }
  .item {
    background: var(--bg-2);
    border-radius: var(--r-lg);
    padding: 1.15rem 1.3rem;
    margin-bottom: 0.7rem;
  }
  .item header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.85rem;
    margin-bottom: 0.65rem;
  }
  .eyebrow {
    font-size: 12px;
    color: var(--ink-3);
    font-weight: 500;
    letter-spacing: -0.005em;
  }
  .item h3 {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.025em;
    text-transform: capitalize;
    margin-top: 0.2rem;
  }
  .badges {
    display: flex;
    gap: 1rem;
    text-align: right;
  }
  .badges span {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .badges strong {
    font-size: 16px;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: -0.015em;
  }
  .badges small {
    font-size: 10px;
    color: var(--ink-3);
    margin-top: 1px;
  }
  .exlist {
    font-size: 12px;
    color: var(--ink-3);
    line-height: 1.5;
    letter-spacing: -0.005em;
  }
  .pain {
    font-size: 12px;
    color: var(--ink-3);
    margin-top: 0.5rem;
    letter-spacing: -0.005em;
  }
</style>
