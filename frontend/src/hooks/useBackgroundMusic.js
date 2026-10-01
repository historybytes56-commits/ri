import { useCallback, useEffect, useRef } from 'react'

const FADE_IN_MS = 3000
const FADE_OUT_MS = 4000

// Looping background track that starts at `startAt` seconds, fades in when it
// starts and fades out before the song ends (then loops from `startAt`).
//
// Browsers only allow sound after a tap, so call `unlock()` inside the tap
// handler; `play()` can then be called any time later.
export default function useBackgroundMusic(src, startAt = 0, volume = 0.8) {
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const wantPlayingRef = useRef(false)

  // Smoothly moves the volume to `target` over `ms`.
  const fadeTo = useCallback((target, ms) => {
    const audio = audioRef.current
    clearInterval(fadeRef.current)
    const from = audio.volume
    const begin = performance.now()
    fadeRef.current = setInterval(() => {
      const progress = Math.min(1, (performance.now() - begin) / ms)
      audio.volume = from + (target - from) * progress
      if (progress === 1) clearInterval(fadeRef.current)
    }, 50)
  }, [])

  useEffect(() => {
    const audio = new Audio(`${src}#t=${startAt}`)
    audio.preload = 'auto'
    audioRef.current = audio
    let fadingOut = false

    // Fallback for browsers that ignore the #t= start time in the URL.
    function seekToStart() {
      if (audio.currentTime < startAt) audio.currentTime = startAt
    }

    function handleTimeUpdate() {
      const remaining = audio.duration - audio.currentTime
      if (!fadingOut && remaining * 1000 <= FADE_OUT_MS) {
        fadingOut = true
        fadeTo(0, remaining * 1000)
      }
    }

    function handleEnded() {
      fadingOut = false
      audio.currentTime = startAt
      audio.volume = 0
      audio.play().then(() => fadeTo(volume, FADE_IN_MS)).catch(() => {})
    }

    audio.addEventListener('loadedmetadata', seekToStart, { once: true })
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      clearInterval(fadeRef.current)
      audio.removeEventListener('loadedmetadata', seekToStart)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
    }
  }, [src, startAt, volume, fadeTo])

  // Call from a tap: briefly plays muted so the browser allows sound later.
  const unlock = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = true
    audio
      .play()
      .then(() => {
        if (!wantPlayingRef.current) {
          audio.pause()
          audio.currentTime = startAt
        }
      })
      .catch(() => {})
      .finally(() => {
        audio.muted = false
      })
  }, [startAt])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    wantPlayingRef.current = true

    function tryPlay() {
      audio.muted = false
      audio.volume = 0
      audio
        .play()
        .then(() => fadeTo(volume, FADE_IN_MS))
        .catch((err) => {
          console.warn('Background music could not start:', err)
          window.addEventListener('pointerdown', tryPlay, { once: true })
        })
    }

    tryPlay()
  }, [volume, fadeTo])

  return { unlock, play }
}
