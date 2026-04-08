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
      <p class="serif">No sessions yet.</p>
      <p>Start your first session to begin tracking.</p>
    </div>
  {:else}
    {#each sessions as sess (sess.id)}
      <article class="item">
        <header>
          <div>
            <div class="eyebrow">{fmtDate(sess.startedAt)} · {sess.location} · Week {sess.week.toUpperCase()}</div>
            <h3 class="serif">{sess.dayKey}</h3>
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
  .item {
    padding: 1rem 0;
    border-bottom: 1px solid var(--line);
  }
  .item:last-child { border-bottom: 0; }
  .item header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.4rem;
  }
  .item h3 {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: -0.02em;
    text-transform: capitalize;
    margin-top: 0.15rem;
  }
  .badges {
    display: flex;
    gap: 0.85rem;
    text-align: right;
  }
  .badges span {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .badges strong {
    font-size: 14px;
    font-weight: 700;
    color: var(--accent);
  }
  .badges small {
    font-size: 9px;
    color: var(--ink-3);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .exlist {
    font-size: 11px;
    color: var(--ink-3);
    line-height: 1.5;
  }
  .pain {
    font-size: 11px;
    color: var(--ink-3);
    margin-top: 0.3rem;
  }
</style>
