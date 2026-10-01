import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/glass/glass.css'
import App from './App.jsx'
import { GlassFilter } from './components/glass/index.js'
import AdminPage from './pages/AdminPage.jsx'

// /admin, or /#admin for static hosts that can't serve /admin directly.
const isAdmin =
  window.location.pathname.startsWith('/admin') || window.location.hash === '#admin'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? (
      <>
        <GlassFilter />
        <AdminPage />
      </>
    ) : (
      <App />
    )}
  </StrictMode>,
)
