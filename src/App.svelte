<script>
  import { onMount } from 'svelte'
  import { Bird, Mail, Moon, Sun } from '@lucide/svelte'
  import GithubMark from './GithubMark.svelte'


  // --- Editable Content ---
  const pseudonym = 'renowned'
  const tagline = `i like making things for my own use.
<br>you can also call me <strong>meisei</strong>. either name is fine.
`

  const sectionOrder = ['home', 'projects', 'socials', 'hobbies']

  const projects = [
    {
      title: 'this very website',
      description: 'it\'s in the name.',
      link: 'https://github.com/renownitall/renownitall.github.io',
      url: 'renownitall/renownitall.github.io',
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
          <h1 id="home-title">{pseudonym}<span class="cursor" aria-hidden="true">_</span></h1>
          <p class="tagline">{@html tagline}</p>
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
