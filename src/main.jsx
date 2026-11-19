import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { MotionProvider } from './motion.jsx'
import { preloadInitialRoute } from './routeComponents.js'
import './styles.css'

const root = document.getElementById('root')
const application = (
  <React.StrictMode>
    <BrowserRouter>
      <MotionProvider>
        <App />
      </MotionProvider>
    </BrowserRouter>
  </React.StrictMode>
)

async function bootstrap() {
  if (root.hasChildNodes()) {
    await preloadInitialRoute(window.location.pathname)
    hydrateRoot(root, application)
  } else {
    createRoot(root).render(application)
  }
}

bootstrap()
