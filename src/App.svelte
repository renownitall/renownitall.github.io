<script>
  import { onMount } from 'svelte'
  import { Bird, Mail, Moon, Sun } from '@lucide/svelte'
  import GithubMark from './GithubMark.svelte'


  // --- Editable Content ---
  const pseudonym = 'renowned'

  const sectionOrder = ['home', 'projects', 'socials', 'hobbies']

  const lastBuilt = __BUILD_DATE__

  const projects = [
    {
      title: 'this very website',
      description: 'it\'s in the name.',
      link: 'https://github.com/renownitall/renown'.
      url: 'renownitall/renown',
    },
    {
      title: 'dotfiles',
      description: 'my over-engineered linux setup.',
      link: 'https://github.com/renownitall/dotfiles',
      url: 'renownitall/dotfiles',
    },
    {
      title: 'calpdf',
      description: 'a simple pdf toolkit to run alongside calibre.',
      link: 'https://github.com/renownitall/calpdf',
      url: 'renownitall/calpdf',
    },
  ]
  const projectsListStyle = 'numbered'

  const socials = [
    {
      platform: 'github',
      link: 'https://github.com/renownitall',
      subtext: 'bad code',
      icon: GithubMark,
    },
    {
      platform: 'twitter',
      link: 'https://twitter.com/renownitall',
      subtext: 'nothing to see here',
      icon: Bird,
    },
    {
      platform: 'email',
      link: 'mailto:renowitall@duck.com',
      subtext: 'best way to reach me',
      icon: Mail,
    },
  ]
  const socialsListStyle = 'plain'

  const hobbies = [
    { name: 'playing the piano', subtext: '...only when i have the time to.' },
    { name: 'running', subtext: 'short distances.'},
    { name: 'reading fiction', subtext: 'a chapter before bed.' },
  ]
  const hobbiesListStyle = 'bulleted'

  // --- Behavior Settings ---
  const scrollIncrement = 90
  const doubleGTimeout = 500

  let theme = 'dark'

  // typing animation state
  let typed = ''
  let typingDone = false

  function listTag(style) {
    return style === 'numbered' ? 'ol' : 'ul'
  }

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme
    localStorage.setItem('renown-theme', theme)
  }

  onMount(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    theme = root.dataset.theme || (media.matches ? 'dark' : 'light')
    let lastG = 0

    // Type out the name once, with a random per-character delay. Skip the
    // animation entirely for users who prefer reduced motion.
    let typeTimer
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      if (localStorage.getItem('renown-theme')) return
      theme = event.matches ? 'dark' : 'light'
      root.dataset.theme = theme
    }

    const handleKeydown = (event) => {
      const target = event.target
      if (target instanceof HTMLElement && (target.matches('input, textarea') || target.isContentEditable)) return

      if (event.key === 'j') {
        window.scrollBy({ top: scrollIncrement, behavior: 'smooth' })
      } else if (event.key === 'k') {
        window.scrollBy({ top: -scrollIncrement, behavior: 'smooth' })
      } else if (event.key === 'G') {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
      } else if (event.key === 'g') {
        const now = Date.now()
        if (now - lastG <= doubleGTimeout) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          lastG = 0
        } else {
          lastG = now
        }
      } else if (/^[1-4]$/.test(event.key)) {
        const sectionId = sectionOrder[Number(event.key) - 1]
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
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

<svelte:head>
  <title>renown</title>
</svelte:head>

<main>
  <div class="utility">
    <button class="theme-toggle" type="button" onclick={toggleTheme} aria-label="toggle theme" title="toggle theme">
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
        <img class="avatar" src="pfp.webp" alt="profile portrait of renowned" />
        <div>
          <p class="greeting">hi. i'm</p>
          <h1 id="home-title" aria-label={pseudonym}>{typed}<span class="cursor" class:blink={typingDone} aria-hidden="true">_</span></h1>
          <p class="tagline">
            i like making things for my own use.<br />
            you can also call me <strong>meisei</strong>. either name is fine.
          </p>
        </div>
      </section>
    {:else if sectionId === 'projects'}
      <section id="projects" aria-labelledby="projects-title">
        <h2 id="projects-title">projects</h2>
        <svelte:element this={listTag(projectsListStyle)} class:list-plain={projectsListStyle === 'plain'}>
          {#each projects as project}
            <li>
              <a class="item-title" href={project.link} target="_blank" rel="noreferrer">{project.title}</a>
              {#if project.url}<span class="item-meta">{project.url}</span>{/if}
              <p>{project.description}</p>
            </li>
          {/each}
        </svelte:element>
      </section>
    {:else if sectionId === 'socials'}
      <section id="socials" aria-labelledby="socials-title">
        <h2 id="socials-title">socials</h2>
        <svelte:element this={listTag(socialsListStyle)} class:list-plain={socialsListStyle === 'plain'}>
          {#each socials as social}
            <li class="social-item">
              <span class="social-icon"><svelte:component this={social.icon} size={17} /></span>
              <span>
                <a class="item-title" href={social.link}>{social.platform}</a>
                <span class="item-meta">{social.subtext}</span>
              </span>
            </li>
          {/each}
        </svelte:element>
      </section>
    {:else if sectionId === 'hobbies'}
      <section id="hobbies" aria-labelledby="hobbies-title">
        <h2 id="hobbies-title">hobbies</h2>
        <svelte:element this={listTag(hobbiesListStyle)} class:list-plain={hobbiesListStyle === 'plain'}>
          {#each hobbies as hobby}
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
  <p>last built {lastBuilt}.</p>
  <p>built with <a href="https://svelte.dev" target="_blank" rel="noreferrer">svelte</a>. <a href="https://github.com/renownitall/renown" target="_blank" rel="noreferrer">view the source</a></p>
</footer>
