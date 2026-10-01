import { useEffect, useState } from 'react'
import { getAnswers } from '../api/answers.js'
import { Glass, GlassButton } from '../components/glass/index.js'
import './AdminPage.css'

const STORAGE_KEY = 'admin-password'

function readSaved() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

function save(password) {
  try {
    sessionStorage.setItem(STORAGE_KEY, password)
  } catch {
    // storage unavailable: just ask again next time
  }
}

const formatTime = (iso) =>
  new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))

// Private page (/admin) showing her answers, behind ADMIN_PASSWORD.
function AdminPage() {
  const [password, setPassword] = useState(readSaved)
  const [answers, setAnswers] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load(pw = password) {
    setLoading(true)
    setError(null)
    try {
      setAnswers(await getAnswers(pw))
      save(pw)
    } catch (err) {
      setAnswers(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const saved = readSaved()
    if (saved) load(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (password) load()
  }

  if (!answers) {
    return (
      <div className="admin">
        <Glass className="admin-card">
          <h1>Her answer</h1>
          <form onSubmit={handleSubmit}>
            <input
              className="admin-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
            />
            <GlassButton type="submit">{loading ? 'Checking…' : 'View'}</GlassButton>
          </form>
          {error && <p className="admin-error">{error}</p>}
        </Glass>
      </div>
    )
  }

  const latest = answers[0]

  return (
    <div className="admin">
      <Glass className="admin-card">
        {latest ? (
          <>
            <p className="admin-label">Latest answer</p>
            <p className={`admin-answer is-${latest.answer}`}>
              {latest.answer === 'yes' ? 'YES ✓' : 'NO'}
            </p>
            <p className="admin-time">{formatTime(latest.created_at)}</p>
          </>
        ) : (
          <>
            <p className="admin-answer">No answer yet</p>
            <p className="admin-time">She hasn’t answered.</p>
          </>
        )}

        {answers.length > 1 && (
          <ul className="admin-history">
            {answers.map((a) => (
              <li key={a.id}>
                <span className={`is-${a.answer}`}>{a.answer.toUpperCase()}</span>
                <span>{formatTime(a.created_at)}</span>
              </li>
            ))}
          </ul>
        )}

        <GlassButton onClick={() => load()}>{loading ? 'Refreshing…' : 'Refresh'}</GlassButton>
      </Glass>
    </div>
  )
}

export default AdminPage
