<script>
  import { Eye, Moon, Sun } from '@lucide/svelte'

  let { theme, onToggleTheme } = $props()

  let wallpaperUrl = $derived(
    theme === 'dark'
      ? 'https://github.com/renownitall/renownitall.github.io/blob/main/public/background-flower-basket-sharp.webp'
      : 'https://github.com/renownitall/renownitall.github.io/blob/main/public/background-roman-forum-sharp.webp',
  )
</script>

<div class="utility">
  <a
    class="icon-button"
    href={wallpaperUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="View the unblurred wallpaper on GitHub"
    title="View the unblurred wallpaper on GitHub"
  >
    <Eye size={17} />
  </a>
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
