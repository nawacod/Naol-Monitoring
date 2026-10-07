import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LandingPage from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
)