<script>
  import { onMount } from 'svelte'
  import { Bird, Eye, EyeOff, Mail, Moon, Sun } from '@lucide/svelte'
  import GithubMark from './GithubMark.svelte'
  import GraphBackground from './GraphBackground.svelte'


  // --- Editable Content ---
  const pseudonym = 'renowned'

  const sectionOrder = ['home', 'projects', 'socials', 'hobbies']

  const lastBuilt = __BUILD_DATE__

  const projects = [
    {
      title: 'dotfiles',
      description: 'My over-engineered Linux setup',
      link: 'https://github.com/renownitall/dotfiles',
      url: 'renownitall/dotfiles',
    },
    {
      title: 'forge',
      description: 'My Arch Linux package repository',
      link: 'https://github.com/renownitall/forge',
      url: 'renownitall/forge',
    },
    {
      title: 'calpdf',
      description: 'A simple PDF toolkit to run alongside Calibre',
      link: 'https://github.com/renownitall/calpdf',
      url: 'renownitall/calpdf',
    },
  ]
  const projectsListStyle = 'numbered'

  const socials = [
    {
      platform: 'GitHub',
      link: 'https://github.com/renownitall',
      subtext: 'Spaghetti code',
      icon: GithubMark,
    },
    {
      platform: 'Twitter',
      link: 'https://twitter.com/renownitall',
      subtext: 'No, I refuse to call it X',
      icon: Bird,
    },
    {
      platform: 'Email',
      link: 'mailto:renownitall@duck.com',
      subtext: 'Best way to reach me',
      icon: Mail,
    },
  ]
  const socialsListStyle = 'plain'

  const hobbies = [
    { name: 'Playing the piano', subtext: '...only when I have the time to' },
    { name: 'Running', subtext: 'Short distances' },
    { name: 'Reading fiction', subtext: 'A chapter before bed' },
  ]
  const hobbiesListStyle = 'bulleted'
  // --- Behavior Settings ---
  const scrollIncrement = 90
  const doubleGTimeout = 500

  let theme = 'dark'
  let graphEnabled = false

  const readStorage = (key) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  const writeStorage = (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {}
  }

  // typing animation state
  let typed = ''
  let typingDone = false

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
    theme = root.dataset.theme || (media.matches ? 'dark' : 'light')
    graphEnabled = readStorage('renown-graph') === 'on'
    let lastG = 0

    // Type out the name once, with a random per-character delay. Skip the
    // animation entirely for users who prefer reduced motion.
    let typeTimer
    if (reducedMotion.matches) {
      typed = pseudonym
      typingDone = true
    } else {
      let i = 0
      const tick = () => {
        i++
        typed = pseudonym.slice(0, i)
        if (i < pseudonym.length) {
          typeTimer = setTimeout(tick, 40 + Math.random() * 160)
        } else {
          typingDone = true
        }
      }
      typeTimer = setTimeout(tick, 300)
    }

    const followSystemTheme = (event) => {
      if (readStorage('renown-theme')) return
      theme = event.matches ? 'dark' : 'light'
      root.dataset.theme = theme
    }

    const handleKeydown = (event) => {
      const target = event.target
      if (target instanceof HTMLElement && (target.matches('input, textarea') || target.isContentEditable)) return
      if (event.ctrlKey || event.metaKey || event.altKey) return

      if (event.key === 'j') {
        window.scrollBy({ top: scrollIncrement, behavior: scrollBehavior })
      } else if (event.key === 'k') {
        window.scrollBy({ top: -scrollIncrement, behavior: scrollBehavior })
      } else if (event.key === 'G') {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: scrollBehavior })
      } else if (event.key === 'g') {
        const now = Date.now()
        if (now - lastG <= doubleGTimeout) {
          window.scrollTo({ top: 0, behavior: scrollBehavior })
          lastG = 0
        } else {
          lastG = now
        }
      } else if (/^[1-4]$/.test(event.key)) {
        const num = Number(event.key)
        if (num >= 1 && num <= sectionOrder.length) {
          document.getElementById(sectionOrder[num - 1])?.scrollIntoView({ behavior: scrollBehavior })
        }
      }
    }

    media.addEventListener('change', followSystemTheme)
    window.addEventListener('keydown', handleKeydown)

    return () => {
      clearTimeout(typeTimer)
      media.removeEventListener('change', followSystemTheme)
      window.removeEventListener('keydown', handleKeydown)
    }
  })
</script>

<GraphBackground enabled={graphEnabled} />

<main>
  <div class="utility">
    <button
      class="icon-button"
      type="button"
      onclick={toggleGraph}
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
      onclick={toggleTheme}
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

  {#each sectionOrder as sectionId}
    {#if sectionId === 'home'}
      <section id="home" class="home" aria-labelledby="home-title">
        <img class="avatar" src="pfp.webp" alt="renowned" />
        <div>
          <p class="greeting">Hi, I'm</p>
          <h1 id="home-title" aria-label={pseudonym}>{typed}<span class="cursor" class:blink={typingDone} aria-hidden="true">_</span></h1>
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
          {#each projects as project (project.title)}
            <li>
              <a class="item-title" href={project.link} target="_blank" rel="noopener noreferrer">{project.title}</a>
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
          {#each socials as social (social.platform)}
            {@const Icon = social.icon}
            <li class="social-item">
              <span class="social-icon"><Icon size={17} /></span>
              <span>
                <a
                  class="item-title"
                  href={social.link}
                  target={social.link.startsWith('http') ? '_blank' : undefined}
                  rel={social.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >{social.platform}</a
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
          {#each hobbies as hobby (hobby.name)}
            <li>
              <span class="item-title">{hobby.name}</span>
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
