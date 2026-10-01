import { useEffect, useState } from 'react'
import { saveAnswer } from '../api/answers.js'
import { GIFS } from '../data/celebration.js'
import { REPLIES } from '../data/message.js'
import { GlassButton } from './glass/index.js'

const MAX_TRIES = 3

async function saveWithRetry(answer) {
  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    try {
      return await saveAnswer(answer)
    } catch (err) {
      if (attempt === MAX_TRIES) throw err
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
    }
  }
}

// Yes / No buttons under the final question. The choice is saved to the
// backend; the reply is shown right away either way.
function Answer({ onAnswer }) {
  const [answer, setAnswer] = useState(null)

  // Load the celebration GIFs now so they appear instantly on "Yes".
  useEffect(() => {
    for (const { src } of [...GIFS.yes, ...GIFS.no]) {
      new Image().src = src
    }
  }, [])

  function choose(choice) {
    if (answer) return
    setAnswer(choice)
    onAnswer?.(choice)
    saveWithRetry(choice).catch((err) => console.error('Could not save answer:', err))
  }

  if (answer) {
    return <p className="answer-reply">{REPLIES[answer]}</p>
  }

  return (
    <div className="answer-buttons">
      <GlassButton className="answer-yes" onClick={() => choose('yes')}>
        Yes
      </GlassButton>
      <GlassButton className="answer-no" onClick={() => choose('no')}>
        No
      </GlassButton>
    </div>
  )
}

export default Answer
