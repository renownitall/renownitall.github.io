<script>
  import { onMount } from 'svelte'

  let { enabled = false } = $props()

  const MAX_SPEED = 0.18
  const CONNECT_DIST = 130
  const AREA_PER_NODE = 28000
  const MIN_NODES = 14
  const MAX_NODES = 60
  const MAX_DPR = 2
  const NODE_RADIUS = 1.4
  const NODE_ALPHA = { dark: 0.14, light: 0.26 }
  const LINE_ALPHA = { dark: 0.05, light: 0.06 }
  const FRAME_UNIT = 1000 / 60
  const FALLBACK_COLOR = '#888888'

  let canvas
  let controller = null

  onMount(() => {
    const ctx = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let width = 0
    let height = 0
    let nodes = []
    let rafId = 0
    let running = false
    let lastTime = 0
    let color = FALLBACK_COLOR
    let nodeAlpha = NODE_ALPHA.dark
    let lineAlpha = LINE_ALPHA.dark

    const readTheme = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-text-primary')
        .trim()
      if (value) color = value
      const scheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
      nodeAlpha = NODE_ALPHA[scheme]
      lineAlpha = LINE_ALPHA[scheme]
    }

    const makeNode = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2 * MAX_SPEED,
      vy: (Math.random() - 0.5) * 2 * MAX_SPEED,
    })

    const syncNodeCount = () => {
      const count = Math.min(
        MAX_NODES,
        Math.max(MIN_NODES, Math.round((width * height) / AREA_PER_NODE)),
      )
      while (nodes.length < count) nodes.push(makeNode())
      if (nodes.length > count) nodes.length = count
      for (const node of nodes) {
        node.x = Math.min(node.x, width)
        node.y = Math.min(node.y, height)
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.globalAlpha = nodeAlpha
      for (const node of nodes) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
      const maxDistSq = CONNECT_DIST * CONNECT_DIST
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distSq = dx * dx + dy * dy
          if (distSq >= maxDistSq) continue
          ctx.globalAlpha = lineAlpha * (1 - Math.sqrt(distSq) / CONNECT_DIST)
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }

    const render = () => {
      if (enabled) draw()
      else ctx.clearRect(0, 0, width, height)
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      syncNodeCount()
      render()
    }

    const step = (dt) => {
      for (const node of nodes) {
        node.x += node.vx * dt
        node.y += node.vy * dt
        if (node.x <= 0 || node.x >= width) {
          node.vx *= -1
          node.x = Math.max(0, Math.min(node.x, width))
        }
        if (node.y <= 0 || node.y >= height) {
          node.vy *= -1
          node.y = Math.max(0, Math.min(node.y, height))
        }
      }
    }

    const frame = (now) => {
      if (!running) return
      const dt = Math.min(now - lastTime, 50) / FRAME_UNIT
      lastTime = now
      step(dt)
      draw()
      rafId = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || document.hidden) return
      running = true
      lastTime = performance.now()
      rafId = requestAnimationFrame(frame)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(rafId)
    }

    const update = (isEnabled) => {
      if (!isEnabled) {
        stop()
        ctx.clearRect(0, 0, width, height)
      } else if (reducedMotion.matches) {
        stop()
        draw()
      } else {
        start()
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) stop()
      else update(enabled)
    }

    const themeObserver = new MutationObserver(() => {
      readTheme()
      render()
    })

    const handleMotionPreferenceChange = () => update(enabled)

    readTheme()
    resize()

    controller = { update }
    update(enabled)

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    reducedMotion.addEventListener('change', handleMotionPreferenceChange)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotion.removeEventListener('change', handleMotionPreferenceChange)
      themeObserver.disconnect()
    }
  })

  $effect(() => {
    if (controller) controller.update(enabled)
  })
</script>

<canvas class="graph-bg" bind:this={canvas} aria-hidden="true"></canvas>

<style>
  .graph-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
</style>
