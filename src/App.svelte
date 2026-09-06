<script>
  import { onMount, tick } from 'svelte'
  import { X } from '@lucide/svelte'
  import { Bird, Mail } from '@lucide/svelte'
  import GithubMark from './GithubMark.svelte'
  import TypedTitle from './TypedTitle.svelte'
  import UtilityBar from './UtilityBar.svelte'
  import { readStorage, writeStorage } from './storage.js'

  // --- Editable content ---
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

  let theme = $state(document.documentElement.dataset.theme || 'dark')

  function listTag(style) {
    return style === 'numbered' ? 'ol' : 'ul'
  }

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme
  }

  let peeking = $state(false)
  let peekExitButton = $state(null)

  function enterPeek() {
    peeking = true
    document.documentElement.dataset.bg = 'peek'
  }

  async function exitPeek() {
    peeking = false
    delete document.documentElement.dataset.bg
    await tick()
    document.getElementById('peek-button')?.focus()
  }

  function handleKeydown(event) {
    if (peeking && event.key === 'Escape') exitPeek()
  }

  $effect(() => {
    if (peeking) peekExitButton?.focus()
  })

  onMount(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const storedTheme = root.dataset.theme
    theme = storedTheme || (media.matches ? 'dark' : 'light')
    if (!storedTheme) root.dataset.theme = theme

    const followSystemTheme = (event) => {
      theme = event.matches ? 'dark' : 'light'
      root.dataset.theme = theme
    }

    media.addEventListener('change', followSystemTheme)
    return () => media.removeEventListener('change', followSystemTheme)
  })
</script>

<svelte:window onkeydown={handleKeydown} />

<main>
  <UtilityBar {theme} onToggleTheme={toggleTheme} onEnterPeek={enterPeek} />

  {#each sectionOrder as sectionId}
    {#if sectionId === 'home'}
      <section id="home" class="home" aria-labelledby="home-title">
        <img class="avatar" src="/pfp.webp" alt="renowned" />
        <div>
          <p class="greeting">Hi, I'm</p>
          <TypedTitle {pseudonym} />
          <p class="tagline">
            I like making things for my own use.
            <span class="tagline-sub">And, as you can tell, I like ricing too.</span>
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
</footer>

{#if peeking}
  <button type="button" class="peek-exit" bind:this={peekExitButton} onclick={exitPeek} aria-label="Back to site">
    <span class="icon-button peek-close" aria-hidden="true"><X size={17} /></span>
  </button>
{/if}

<style>
  .peek-exit {
    position: fixed;
    inset: 0;
    z-index: 2;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: zoom-out;
  }

  .peek-close {
    position: absolute;
    top: var(--space-5);
    right: var(--space-5);
  }
</style>
