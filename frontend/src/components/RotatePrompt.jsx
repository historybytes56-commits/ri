import './RotatePrompt.css'

// How long the prompt stays before the message starts (keep in sync with RotatePrompt.css).
export const ROTATE_PROMPT_MS = 5000

// Intro screen asking the user to turn the phone to the left
// (counter-clockwise) into landscape. Shown on load, then fades out.
function RotatePrompt() {
  return (
    <div className="rotate-prompt" role="alert">
      <svg className="rotate-icon" viewBox="0 8 96 88" aria-hidden="true">
        <path
          className="rotate-arrow"
          d="M84,18.4 A48,48 0 0 0 12.7,51.7"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          className="rotate-arrow"
          d="M5,44 L12.7,53 L21,45"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g className="rotate-phone">
          <rect x="42" y="28" width="36" height="64" rx="7" strokeWidth="4" fill="none" />
          <line x1="54" y1="35" x2="66" y2="35" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>

      <h1>Rotate your phone</h1>
      <p>Turn it to the left</p>
    </div>
  )
}

export default RotatePrompt
