import React from 'react'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'
import { MotionProvider } from './motion.jsx'

export { publicRoutes, getRouteSeo, absoluteUrl, siteOrigin } from './seo.js'
export { responsiveImageUrl, responsiveSrcSet } from './imageUtils.js'
export { preloadInitialRoute } from './routeComponents.js'

export default function ServerApp({ url }) {
  return (
    <StaticRouter location={url}>
      <MotionProvider>
        <App />
      </MotionProvider>
    </StaticRouter>
  )
}
