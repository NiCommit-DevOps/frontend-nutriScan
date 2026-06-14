import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { getInitialTheme } from '@/core/theme/ThemeContext'

// Aplica el tema antes del primer render para evitar parpadeo.
document.documentElement.classList.toggle('dark', getInitialTheme() === 'dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
