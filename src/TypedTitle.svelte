<script>
  import { onMount } from 'svelte'

  let { pseudonym } = $props()

  let typed = $state('')
  let done = $state(false)

  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) {
      typed = pseudonym
      done = true
      return
    }
    let i = 0
    let timer
    const tick = () => {
      i++
      typed = pseudonym.slice(0, i)
      if (i < pseudonym.length) timer = setTimeout(tick, 40 + Math.random() * 160)
      else done = true
    }
    timer = setTimeout(tick, 300)
    return () => clearTimeout(timer)
  })
</script>

<h1 id="home-title" aria-label={pseudonym}>{typed}<span class="cursor" class:blink={done} aria-hidden="true">_</span></h1>

<style>
  h1 {
    margin-bottom: var(--space-1);
    font-family: var(--font-mono);
    font-size: var(--font-size-name);
    font-weight: var(--font-weight-bold);
    line-height: 1.2;
  }
  .cursor {
    margin-left: var(--space-1);
    color: var(--color-text-secondary);
  }
  .cursor.blink {
    animation: cursor-blink 1.1s steps(1, end) infinite;
  }
  @keyframes cursor-blink {
    0%, 48% { opacity: 1; }
    49%, 100% { opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cursor.blink { animation: none; }
  }
</style>
