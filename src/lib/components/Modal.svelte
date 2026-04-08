<script lang="ts">
  import Icon from './Icon.svelte';
  import { createEventDispatcher } from 'svelte';

  export let open = false;
  export let title: string;

  const dispatch = createEventDispatcher<{ close: void }>();
  function close() { dispatch('close'); }
  function onBgKey(e: KeyboardEvent) { if (e.key === 'Escape') close(); }
</script>

{#if open}
  <div class="backdrop" role="presentation" on:click={close} on:keydown={onBgKey}>
    <div class="modal" role="dialog" aria-modal="true" aria-label={title} on:click|stopPropagation on:keydown|stopPropagation>
      <header>
        <h2 class="serif">{title}</h2>
        <button class="icon-btn" on:click={close} aria-label="Close">
          <Icon name="close" />
        </button>
      </header>
      <div class="body">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    z-index: 150;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fade 180ms;
  }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    width: 100%;
    max-width: 640px;
    max-height: 92vh;
    background: var(--bg);
    border: 1px solid var(--line);
    border-bottom: 0;
    border-radius: 12px 12px 0 0;
    display: flex;
    flex-direction: column;
    animation: slideUp 260ms cubic-bezier(0.2, 0.8, 0.3, 1);
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.1rem;
    border-bottom: 1px solid var(--line);
    flex-shrink: 0;
  }
  header h2 {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: -0.03em;
  }
  .body {
    padding: 1.1rem 1.1rem calc(1.3rem + var(--safe-b));
    overflow-y: auto;
    flex: 1;
  }
</style>
