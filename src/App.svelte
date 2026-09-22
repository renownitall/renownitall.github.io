<script>
  import { onMount } from 'svelte'
  import { Bird, Mail } from '@lucide/svelte'
  import GithubMark from './GithubMark.svelte'
  import TypedTitle from './TypedTitle.svelte'
  import UtilityBar from './UtilityBar.svelte'

  // --- Editable content ---
  const pseudonym = 'renowned'
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
      link: 'https://renownitall.github.io/forge',
      url: 'renownitall.github.io/forge',
    },
    {
      label: 'calpdf',
      description: 'A simple PDF toolkit to run alongside Calibre',
      link: 'https://github.com/renownitall/calpdf',
      url: 'renownitall/calpdf',
    },
  ]

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

  const hobbies = [
    { label: 'Playing the piano', subtext: '...only when I have the time to' },
    { label: 'Running', subtext: 'Short distances' },
    { label: 'Reading fiction', subtext: 'A chapter before bed' },
  ]

  let theme = $state(document.documentElement.dataset.theme)

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme
    syncThemeColor()
  }

  // The theme-color meta mirrors the page background, so its value is read
  // from the `--color-bg` variable instead of duplicating the hex codes.
  function syncThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim())
  }

  onMount(() => {
    // The inline script in `index.html` keeps `data-theme` in sync with the
    // system theme, so this listener only mirrors that into state.
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystemTheme = (event) => {
      theme = event.matches ? 'dark' : 'light'
    }
    media.addEventListener('change', followSystemTheme)
    return () => media.removeEventListener('change', followSystemTheme)
  })
</script>

<div class="content">
  <main>
    <UtilityBar {theme} onToggleTheme={toggleTheme} />

    <section id="home" class="home" aria-labelledby="home-title">
      <img class="avatar" src="/pfp.webp" alt="" />
      <div>
        <p class="greeting">Hi, I'm</p>
        <TypedTitle {pseudonym} />
        <p class="tagline">
          I like making things for my own use.
          <span class="tagline-sub">And, as you can tell, I like ricing too.</span>
        </p>
      </div>
    </section>
    <div class="banner" aria-hidden="true"></div>

    <section id="projects" aria-labelledby="projects-title">
      <h2 id="projects-title">My stuff</h2>
      <ol>
        {#each projects as project}
          <li>
            <a class="item-title" href={project.link} target="_blank" rel="noopener noreferrer">{project.label}</a>
            {#if project.url}<span class="item-meta">{project.url}</span>{/if}
            <p>{project.description}</p>
          </li>
        {/each}
      </ol>
    </section>

    <section id="socials" aria-labelledby="socials-title">
      <h2 id="socials-title">Where to find me</h2>
      <ul class="list-plain">
        {#each socials as social}
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
      </ul>
    </section>

    <section id="hobbies" aria-labelledby="hobbies-title">
      <h2 id="hobbies-title">What I do in my free time</h2>
      <ul>
        {#each hobbies as hobby}
          <li>
            <span class="item-title">{hobby.label}</span>
            {#if hobby.subtext}<span class="item-meta">{hobby.subtext}</span>{/if}
          </li>
        {/each}
      </ul>
    </section>
  </main>

  <footer>
    <p>Last changed on {lastBuilt}</p>
    <p>Built with <a href="https://svelte.dev" target="_blank" rel="noopener noreferrer">Svelte</a> · <a href="https://github.com/renownitall/renown" target="_blank" rel="noopener noreferrer">View the source</a> on GitHub</p>
  </footer>
</div>
