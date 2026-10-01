import { useEffect, useState } from 'react'
import Answer from './Answer.jsx'
import Celebration from './celebration/Celebration.jsx'
import { GlassButton } from './glass/index.js'
import './Message.css'

// Keep in sync with the sentence-in animation in Message.css.
const FADE_IN_MS = 1800
// Comfortable reading pace (~200 words per minute).
const MS_PER_WORD = 300
// Extra time to let each sentence sink in, and the shortest a sentence is held.
const PAUSE_MS = 2500
const MIN_HOLD_MS = 4000

// How long a sentence stays before fading out: its fade-in plus time to read it.
function getDisplayTime(sentence) {
  const words = sentence.split(/\s+/).length
  return FADE_IN_MS + Math.max(MIN_HOLD_MS, PAUSE_MS + words * MS_PER_WORD)
}

// Plays the sentences automatically: fade in, hold, fade out, then the next.
// The last sentence stays on screen with the Yes / No answer.
function Message({ sentences }) {
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [answer, setAnswer] = useState(null)

  const sentence = sentences[index]
  const isLast = index === sentences.length - 1

  useEffect(() => {
    if (leaving || isLast) return
    const timer = setTimeout(() => setLeaving(true), getDisplayTime(sentence))
    return () => clearTimeout(timer)
  }, [leaving, isLast, sentence])

  function readAgain() {
    setIndex(0)
    setLeaving(false)
    setAnswer(null)
  }

  function handleAnimationEnd(e) {
    if (e.animationName !== 'sentence-out') return
    setIndex((i) => i + 1)
    setLeaving(false)
  }

  return (
    <div className="message">
      {answer && <Celebration answer={answer} />}
      {isLast && (
        <GlassButton className="read-again" onClick={readAgain}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Read again
        </GlassButton>
      )}
      <div className="message-stage" aria-live="polite">
        {isLast ? (
          <div key={index} className="final">
            <p className="sentence sentence-final">{sentence}</p>
            <Answer onAnswer={setAnswer} />
          </div>
        ) : (
          <p
            key={index}
            className={`sentence ${leaving ? 'is-leaving' : ''}`}
            onAnimationEnd={handleAnimationEnd}
          >
            {sentence}
          </p>
        )}
      </div>
    </div>
  )
}

export default Message
