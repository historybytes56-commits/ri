import { useEffect, useRef } from 'react'

// Hues for the bursts (HSL). Willows are always gold.
const HUES = [350, 330, 10, 45, 120, 190, 210, 270, 300]
const BURST_TYPES = ['peony', 'peony', 'willow', 'ring', 'double', 'crackle']
// Page colour at low alpha: each frame fades the last one, leaving light trails.
const FADE = 'rgba(7, 6, 15, 0.18)'

const rand = (min, max) => min + Math.random() * (max - min)
const pick = (list) => list[Math.floor(Math.random() * list.length)]

// Realistic-ish canvas fireworks: rockets with spark trails rise, slow down
// and burst (peony, willow, ring, double, crackle) with a sky flash, drag,
// gravity, streaking sparks that cool from bright to ember before fading.
function Fireworks() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let scale = 1
    let rockets = []
    let sparks = []
    let flashes = []
    let nextLaunch = 0
    let last = performance.now()
    let frame

    function resize() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      scale = height / 400
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function launch() {
      const gravity = 520 * scale
      const targetY = height * rand(0.12, 0.4)
      rockets.push({
        x: width * rand(0.12, 0.88),
        y: height + 5,
        vx: rand(-25, 25) * scale,
        vy: -Math.sqrt(2 * gravity * (height - targetY)),
        gravity,
        type: pick(BURST_TYPES),
        hue: pick(HUES),
      })
    }

    function addSpark(x, y, vx, vy, options) {
      sparks.push({
        x,
        y,
        px: x,
        py: y,
        vx,
        vy,
        life: 0,
        maxLife: options.life,
        hue: options.hue,
        sat: options.sat ?? 100,
        drag: options.drag ?? 1.6,
        gravity: (options.gravity ?? 90) * scale,
        width: options.width ?? 1.6,
        crackle: options.crackle ?? false,
      })
    }

    // Random direction on a sphere, seen from the front: gives the burst depth.
    function sphereVelocity(speed) {
      const angle = Math.random() * Math.PI * 2
      const z = rand(-1, 1)
      const r = Math.sqrt(1 - z * z) * speed
      return [Math.cos(angle) * r, Math.sin(angle) * r]
    }

    function explode(r) {
      const power = rand(150, 210) * scale
      flashes.push({ x: r.x, y: r.y, life: 0, hue: r.type === 'willow' ? 40 : r.hue })

      if (r.type === 'ring') {
        const count = 70
        const tilt = rand(0.35, 0.8)
        const spin = rand(0, Math.PI)
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2
          const x = Math.cos(a) * power
          const y = Math.sin(a) * power * tilt
          addSpark(
            r.x,
            r.y,
            x * Math.cos(spin) - y * Math.sin(spin),
            x * Math.sin(spin) + y * Math.cos(spin),
            { life: rand(1.4, 1.9), hue: r.hue + rand(-8, 8) },
          )
        }
        return
      }

      if (r.type === 'willow') {
        for (let i = 0; i < 130; i++) {
          const [vx, vy] = sphereVelocity(power * rand(0.6, 0.95))
          addSpark(r.x, r.y, vx, vy, {
            life: rand(2.6, 3.6),
            hue: rand(32, 45),
            sat: 90,
            drag: 2.6,
            gravity: 70,
            width: 1.2,
          })
        }
        return
      }

      const count = r.type === 'crackle' ? 90 : 120
      for (let i = 0; i < count; i++) {
        const [vx, vy] = sphereVelocity(power * rand(0.85, 1))
        addSpark(r.x, r.y, vx, vy, {
          life: rand(1.3, 2),
          hue: r.hue + rand(-10, 10),
          crackle: r.type === 'crackle',
        })
      }

      if (r.type === 'double') {
        const inner = (r.hue + 150) % 360
        for (let i = 0; i < 60; i++) {
          const [vx, vy] = sphereVelocity(power * rand(0.35, 0.5))
          addSpark(r.x, r.y, vx, vy, { life: rand(1.1, 1.5), hue: inner + rand(-8, 8) })
        }
      }
    }

    function tick(now) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      // A show: single shells most of the time, sometimes a salvo of three.
      if (now >= nextLaunch) {
        const salvo = Math.random() < 0.2 ? 3 : 1
        for (let i = 0; i < salvo; i++) setTimeout(launch, i * 180)
        nextLaunch = now + rand(700, 1600)
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = FADE
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      // sky flash from each burst
      flashes = flashes.filter((f) => {
        f.life += dt
        const alpha = 0.22 * (1 - f.life / 0.35)
        if (alpha <= 0) return false
        const radius = 220 * scale
        const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius)
        glow.addColorStop(0, `hsla(${f.hue}, 100%, 80%, ${alpha})`)
        glow.addColorStop(1, `hsla(${f.hue}, 100%, 60%, 0)`)
        ctx.fillStyle = glow
        ctx.fillRect(f.x - radius, f.y - radius, radius * 2, radius * 2)
        return true
      })

      // rockets: a bright head and a falling trail of gold sparks
      rockets = rockets.filter((r) => {
        r.vy += r.gravity * dt
        r.x += r.vx * dt
        r.y += r.vy * dt
        addSpark(r.x + rand(-1, 1), r.y, rand(-12, 12) * scale, rand(10, 40) * scale, {
          life: rand(0.3, 0.6),
          hue: 38,
          sat: 80,
          drag: 3,
          gravity: 60,
          width: 1.1,
        })
        ctx.fillStyle = 'hsla(45, 100%, 85%, 1)'
        ctx.beginPath()
        ctx.arc(r.x, r.y, 1.8 * scale + 0.6, 0, Math.PI * 2)
        ctx.fill()
        if (r.vy >= -20 * scale) {
          explode(r)
          return false
        }
        return true
      })

      // sparks: streak from last position, slow down, fall, cool and fade
      ctx.lineCap = 'round'
      sparks = sparks.filter((s) => {
        s.life += dt
        const t = s.life / s.maxLife
        if (t >= 1) return false

        const drag = Math.exp(-s.drag * dt)
        s.vx *= drag
        s.vy = s.vy * drag + s.gravity * dt
        s.px = s.x
        s.py = s.y
        s.x += s.vx * dt
        s.y += s.vy * dt

        let alpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3
        if (s.crackle && t > 0.45) alpha *= Math.random() < 0.5 ? 1 : 0.1
        else if (t > 0.6) alpha *= rand(0.6, 1) // twinkle as it burns out
        const light = 85 - t * 40 // white-hot -> colour -> ember

        ctx.strokeStyle = `hsla(${s.hue}, ${s.sat}%, ${light}%, ${alpha})`
        ctx.lineWidth = s.width * (1 - t * 0.5) * Math.max(1, scale)
        ctx.beginPath()
        ctx.moveTo(s.px, s.py)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()
        return true
      })

      frame = requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    launch()
    setTimeout(launch, 350)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      rockets = []
    }
  }, [])

  return <canvas ref={canvasRef} className="fireworks" aria-hidden="true" />
}

export default Fireworks
