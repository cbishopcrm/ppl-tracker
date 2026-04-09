<script lang="ts">
  import { state, setSetting } from '../store';
  import { THEMES, THEME_GROUPS } from '../themes';
  import type { ThemeDef } from '../themes';

  $: currentTheme = $state.settings.theme || 'midnight';

  function pick(t: ThemeDef) {
    setSetting('theme', t.id);
  }

  $: grouped = THEME_GROUPS.map((g) => ({
    label: g,
    themes: THEMES.filter((t) => t.group === g)
  }));
</script>

<div class="picker">
  {#each grouped as group}
    <div class="group-label">{group.label}</div>
    <div class="grid">
      {#each group.themes as t (t.id)}
        <button
          class="swatch"
          class:on={t.id === currentTheme}
          on:click={() => pick(t)}
          aria-label={t.name}
        >
          <div class="colors">
            <div class="c bg" style="background:{t.preview[0]}"></div>
            <div class="c sf" style="background:{t.preview[1]}"></div>
            <div class="c ac" style="background:{t.preview[2]}"></div>
          </div>
          <span class="label">{t.name}</span>
        </button>
      {/each}
    </div>
  {/each}
</div>

<style>
  .picker {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .group-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--ink-3);
    letter-spacing: -0.005em;
    margin-top: 0.6rem;
    margin-bottom: 0.15rem;
    padding-left: 0.1rem;
  }
  .group-label:first-child {
    margin-top: 0;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  .swatch {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.4rem;
    padding: 0.55rem;
    background: var(--surface-2);
    border-radius: var(--r-md);
    border: 2px solid transparent;
    transition: all 180ms;
    text-align: left;
    min-height: 72px;
  }
  .swatch:hover {
    background: var(--surface-3);
  }
  .swatch:active {
    transform: scale(0.97);
  }
  .swatch.on {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  .colors {
    display: flex;
    gap: 3px;
    height: 28px;
    border-radius: 6px;
    overflow: hidden;
  }
  .c {
    flex: 1;
  }
  .c.bg {
    border-radius: 6px 0 0 6px;
  }
  .c.ac {
    border-radius: 0 6px 6px 0;
  }
  .label {
    font-size: 10px;
    font-weight: 600;
    color: var(--ink-2);
    letter-spacing: -0.005em;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .swatch.on .label {
    color: var(--ink);
  }

  @media (max-width: 380px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
