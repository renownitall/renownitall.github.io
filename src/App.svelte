<script>
  import { onMount } from 'svelte'
  import { Bird, Mail } from '@lucide/svelte'
  import GithubMark from './GithubMark.svelte'
  import GraphBackground from './GraphBackground.svelte'
  import TypedTitle from './TypedTitle.svelte'
  import UtilityBar from './UtilityBar.svelte'
  import { readStorage, writeStorage } from './storage.js'

  // --- Editable Content ---
  const pseudonym = 'renowned'
  const sectionOrder = ['home', 'projects', 'socials', 'hobbies']
  const lastBuilt = __BUILD_DATE__

  const projects = [
    {
      label: 'dotfiles',
      description: 'My over-engineered Linux setup',
      link: 'https://github.com/renownitall/dotfiles',
      url: 'renownitall/dotfiles',
    },
    {
      label: 'forge',
      description: 'My Arch Linux package repository',
      link: 'https://github.com/renownitall/forge',
      url: 'renownitall/forge',
    },
    {
      label: 'calpdf',
      description: 'A simple PDF toolkit to run alongside Calibre',
      link: 'https://github.com/renownitall/calpdf',
      url: 'renownitall/calpdf',
    },
  ]
  const projectsListStyle = 'numbered'

  const socials = [
    {
      label: 'GitHub',
      link: 'https://github.com/renownitall',
      subtext: 'Spaghetti code',
      icon: GithubMark,
    },
    {
      label: 'Twitter',
      link: 'https://twitter.com/renownitall',
      subtext: 'No, I refuse to call it X',
      icon: Bird,
    },
    {
      label: 'Email',
      link: 'mailto:renownitall@duck.com',
      subtext: 'Best way to reach me',
      icon: Mail,
    },
  ]
  const socialsListStyle = 'plain'

  const hobbies = [
    { label: 'Playing the piano', subtext: '...only when I have the time to' },
    { label: 'Running', subtext: 'Short distances' },
    { label: 'Reading fiction', subtext: 'A chapter before bed' },
  ]
  const hobbiesListStyle = 'bulleted'

  const scrollIncrement = 90
  const doubleGTimeout = 500

  let theme = $state(document.documentElement.dataset.theme || 'dark')
  let graphEnabled = $state(false)

  function listTag(style) {
    return style === 'numbered' ? 'ol' : 'ul'
  }

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme
    writeStorage('renown-theme', theme)
  }

  function toggleGraph() {
    graphEnabled = !graphEnabled
    writeStorage('renown-graph', graphEnabled ? 'on' : 'off')
  }

  onMount(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const scrollBehavior = reducedMotion.matches ? 'auto' : 'smooth'
    const storedTheme = root.dataset.theme
    theme = storedTheme || (media.matches ? 'dark' : 'light')
    if (!storedTheme) root.dataset.theme = theme
    graphEnabled = readStorage('renown-graph') === 'on'
    let lastG = 0

    const followSystemTheme = (event) => {
      if (readStorage('renown-theme')) return
      theme = event.matches ? 'dark' : 'light'
      root.dataset.theme = theme
    }

    const handleKeydown = (event) => {
      const target = event.target
      if (target instanceof HTMLElement && (target.matches('input, textarea') || target.isContentEditable)) return
      if (event.ctrlKey || event.metaKey || event.altKey) return

      if (event.key === 'j') window.scrollBy({ top: scrollIncrement, behavior: scrollBehavior })
      else if (event.key === 'k') window.scrollBy({ top: -scrollIncrement, behavior: scrollBehavior })
      else if (event.key === 'G') window.scrollTo({ top: document.documentElement.scrollHeight, behavior: scrollBehavior })
      else if (event.key === 'g') {
        const now = Date.now()
        if (now - lastG <= doubleGTimeout) {
          window.scrollTo({ top: 0, behavior: scrollBehavior })
          lastG = 0
        } else lastG = now
      } else if (/^[1-9]$/.test(event.key)) {
        const num = Number(event.key)
        if (num >= 1 && num <= sectionOrder.length) {
          document.getElementById(sectionOrder[num - 1])?.scrollIntoView({ behavior: scrollBehavior })
        }
      }
    }

    media.addEventListener('change', followSystemTheme)
    window.addEventListener('keydown', handleKeydown)
    return () => {
      media.removeEventListener('change', followSystemTheme)
      window.removeEventListener('keydown', handleKeydown)
    }
  })
</script>

<GraphBackground enabled={graphEnabled} />

<main aria-keyshortcuts="j k g G 1 2 3 4">
  <UtilityBar {theme} {graphEnabled} onToggleTheme={toggleTheme} onToggleGraph={toggleGraph} />

  {#each sectionOrder as sectionId}
    {#if sectionId === 'home'}
      <section id="home" class="home" aria-labelledby="home-title">
        <img class="avatar" src="/pfp.webp" alt="renowned" />
        <div>
          <p class="greeting">Hi, I'm</p>
          <TypedTitle {pseudonym} />
          <p class="tagline">
            I like making things for my own use.<br />
            You can also call me <strong>Meisei</strong>. Either name works.
          </p>
        </div>
      </section>
    {:else if sectionId === 'projects'}
      <section id="projects" aria-labelledby="projects-title">
        <h2 id="projects-title">My stuff</h2>
        <svelte:element this={listTag(projectsListStyle)} class:list-plain={projectsListStyle === 'plain'}>
          {#each projects as project (project.label)}
            <li>
              <a class="item-title" href={project.link} target="_blank" rel="noopener noreferrer">{project.label}</a>
              {#if project.url}<span class="item-meta">{project.url}</span>{/if}
              <p>{project.description}</p>
            </li>
          {/each}
        </svelte:element>
      </section>
    {:else if sectionId === 'socials'}
      <section id="socials" aria-labelledby="socials-title">
        <h2 id="socials-title">Where to find me</h2>
        <svelte:element this={listTag(socialsListStyle)} class:list-plain={socialsListStyle === 'plain'}>
          {#each socials as social (social.label)}
            {@const Icon = social.icon}
            <li class="social-item">
              <span class="social-icon"><Icon size={17} /></span>
              <span>
                <a
                  class="item-title"
                  href={social.link}
                  target={social.link.startsWith('http') ? '_blank' : undefined}
                  rel={social.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >{social.label}</a
                >
                <span class="item-meta">{social.subtext}</span>
              </span>
            </li>
          {/each}
        </svelte:element>
      </section>
    {:else if sectionId === 'hobbies'}
      <section id="hobbies" aria-labelledby="hobbies-title">
        <h2 id="hobbies-title">What I do in my free time</h2>
        <svelte:element this={listTag(hobbiesListStyle)} class:list-plain={hobbiesListStyle === 'plain'}>
          {#each hobbies as hobby (hobby.label)}
            <li>
              <span class="item-title">{hobby.label}</span>
              {#if hobby.subtext}<span class="item-meta">{hobby.subtext}</span>{/if}
            </li>
          {/each}
        </svelte:element>
      </section>
    {/if}
  {/each}
</main>

<footer>
  <p>Last changed on {lastBuilt}</p>
  <p>Built with <a href="https://svelte.dev" target="_blank" rel="noopener noreferrer">Svelte</a> · <a href="https://github.com/renownitall/renown" target="_blank" rel="noopener noreferrer">View the source</a> on GitHub</p>
  <p class="kbd-hint" aria-hidden="true"><kbd>j</kbd>/<kbd>k</kbd> scroll · <kbd>g</kbd><kbd>g</kbd> top · <kbd>G</kbd> bottom · <kbd>1</kbd>–<kbd>{sectionOrder.length}</kbd> sections</p>
</footer>

<style>
  .kbd-hint {
    margin-top: var(--space-3);
    color: var(--color-text-dim);
    font-size: 0.75rem;
  }
  .kbd-hint kbd {
    display: inline-block;
    padding: 0 0.3em;
    border: 1px solid var(--color-divider);
    border-bottom-width: 2px;
    border-radius: 3px;
    background: var(--color-bg);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    line-height: 1.4;
  }
</style>
