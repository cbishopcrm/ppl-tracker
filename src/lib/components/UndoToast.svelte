<script lang="ts">
  import { undoBuffer, performUndo } from '../store';

  $: hasUndo = $undoBuffer.length > 0;
  $: latest = $undoBuffer[$undoBuffer.length - 1];
</script>

{#if hasUndo && latest}
  <div class="undo-toast">
    <span>{latest.label}</span>
    <button on:click={performUndo}>Undo</button>
  </div>
{/if}

<style>
  .undo-toast {
    position: fixed;
    bottom: calc(110px + var(--safe-b));
    left: 50%;
    transform: translateX(-50%);
    padding: 0.65rem 0.5rem 0.65rem 1.1rem;
    background: rgba(28, 28, 30, 0.92);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: var(--r-pill);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -0.005em;
    z-index: 80;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    animation: pop 220ms cubic-bezier(0.2, 0.8, 0.3, 1);
  }
  @keyframes pop {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .undo-toast button {
    padding: 0.4rem 0.85rem;
    background: var(--accent);
    color: #fff;
    border-radius: var(--r-pill);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.005em;
  }
  .undo-toast button:hover { background: var(--accent-hover); }
</style>
