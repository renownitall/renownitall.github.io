<script>
  import { Eye, EyeOff, Moon, Sun } from '@lucide/svelte'

  let { theme, graphEnabled, onToggleTheme, onToggleGraph } = $props()
</script>

<div class="utility">
  <button
    class="icon-button"
    type="button"
    onclick={onToggleGraph}
    aria-label="Toggle background animation"
    aria-pressed={graphEnabled}
    title="Toggle background animation"
  >
    {#if graphEnabled}
      <Eye size={17} />
    {:else}
      <EyeOff size={17} />
    {/if}
  </button>
  <button
    class="icon-button"
    type="button"
    onclick={onToggleTheme}
    aria-label="Toggle theme"
    aria-pressed={theme === 'dark'}
    title="Toggle theme"
  >
    {#if theme === 'dark'}
      <Sun size={17} />
    {:else}
      <Moon size={17} />
    {/if}
  </button>
</div>

<style>
  .utility {
    display: flex;
    justify-content: flex-end;
    min-height: var(--space-6);
    margin-bottom: var(--space-5);
  }
  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2);
    border: 0;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: color 160ms ease;
  }
  .icon-button:hover { color: var(--color-text-primary); }
  .icon-button + .icon-button { margin-left: var(--space-2); }
  @media (prefers-reduced-motion: reduce) {
    .icon-button { transition: none; }
  }
</style>
