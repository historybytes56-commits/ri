import { GlassButton } from './glass/index.js'
import './StartScreen.css'

// First screen. The tap is needed so the browser allows the music to play.
function StartScreen({ onStart }) {
  return (
    <div className="start-screen" onClick={onStart}>
      <GlassButton>Tap to open</GlassButton>
    </div>
  )
}

export default StartScreen
