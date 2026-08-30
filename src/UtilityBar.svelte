<script>
  import { Moon, Sun } from '@lucide/svelte'

  let { theme, onToggleTheme } = $props()
</script>

<div class="utility">
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
  @media (prefers-reduced-motion: reduce) {
    .icon-button { transition: none; }
  }
</style>
