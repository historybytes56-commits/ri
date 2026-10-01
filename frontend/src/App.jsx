import { useEffect, useState } from 'react'
import './components/glass/glass.css'
import './App.css'
import { GlassFilter } from './components/glass/index.js'
import RotatePrompt, { ROTATE_PROMPT_MS } from './components/RotatePrompt.jsx'
import StartScreen from './components/StartScreen.jsx'
import useBackgroundMusic from './hooks/useBackgroundMusic.js'
import Home from './pages/Home.jsx'

// Put the song file in public/music/ with this name.
const MUSIC_SRC = '/music/aphrodite.mp3'
// Start the song from the beginning.
const MUSIC_START_SECONDS = 0
// The music fades in this long before the letter starts.
const MUSIC_LEAD_MS = 2000

// On phones: go fullscreen and lock the screen upright, so the phone's own
// auto-rotate never turns the page. The letter is rotated by CSS instead
// (see .landscape-stage in App.css), whatever the auto-rotate setting is.
// Works on Android Chrome; elsewhere it silently does nothing.
function lockScreenUpright() {
  if (!window.matchMedia('(pointer: coarse)').matches) return
  document.documentElement
    .requestFullscreen?.({ navigationUI: 'hide' })
    .then(() => screen.orientation?.lock?.('portrait-primary'))
    .catch(() => {})
}

// start (tap) -> rotate prompt (5s, music fades in for the last 2s) -> letter
function App() {
  const [step, setStep] = useState('start')
  const music = useBackgroundMusic(MUSIC_SRC, MUSIC_START_SECONDS)

  useEffect(() => {
    if (step !== 'rotate') return
    const musicTimer = setTimeout(music.play, ROTATE_PROMPT_MS - MUSIC_LEAD_MS)
    const letterTimer = setTimeout(() => setStep('letter'), ROTATE_PROMPT_MS)
    return () => {
      clearTimeout(musicTimer)
      clearTimeout(letterTimer)
    }
  }, [step, music.play])

  function handleStart() {
    lockScreenUpright()
    music.unlock()
    setStep('rotate')
  }

  return (
    <>
      <GlassFilter />
      {step === 'start' && <StartScreen onStart={handleStart} />}
      {step === 'rotate' && <RotatePrompt />}
      {step === 'letter' && <Home />}
    </>
  )
}

export default App
