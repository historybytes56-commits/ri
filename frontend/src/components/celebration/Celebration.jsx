import { useState } from 'react'
import { GIFS } from '../../data/celebration.js'
import Fireworks from './Fireworks.jsx'
import './celebration.css'

// One GIF per corner (shuffled), nudged and tilted a little at random,
// so they land in different spots each time and stay clear of the text.
// The top-left one sits lower to leave room for the "Read again" button.
const CORNERS = [
  { x: 'left', y: 'top', minY: 18 },
  { x: 'right', y: 'top', minY: 3 },
  { x: 'left', y: 'bottom', minY: 3 },
  { x: 'right', y: 'bottom', minY: 3 },
]

function placeGifs(gifs) {
  const corners = [...CORNERS].sort(() => Math.random() - 0.5)
  return gifs.map((gif, i) => ({
    ...gif,
    style: {
      [corners[i].x]: `${2 + Math.random() * 5}%`,
      [corners[i].y]: `${corners[i].minY + Math.random() * 6}%`,
      '--tilt': `${-10 + Math.random() * 20}deg`,
      animationDelay: `${0.4 + i * 0.35}s, ${1.4 + i * 0.35}s`,
    },
  }))
}

// Shown after she answers: the answer's GIFs, plus fireworks for "yes".
function Celebration({ answer }) {
  const [gifs] = useState(() => placeGifs(GIFS[answer]))

  return (
    <div className="celebration" aria-hidden="true">
      {answer === 'yes' && <Fireworks />}
      {gifs.map((gif) => (
        <img key={gif.src} src={gif.src} alt={gif.alt} className="celebration-gif" style={gif.style} />
      ))}
    </div>
  )
}

export default Celebration
