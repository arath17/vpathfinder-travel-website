import { createElement } from 'react'

function preloadableLazy(loader) {
  let Component = null
  let promise = null
  const preload = () => {
    if (!promise) promise = loader().then((module) => {
      Component = module.default
      return Component
    })
    return promise
  }
  function RouteComponent(props) {
    if (Component) return createElement(Component, props)
    throw preload()
  }
  RouteComponent.preload = preload
  return RouteComponent
}

export const HomePage = preloadableLazy(() => import('./routes/HomePage.jsx'))
export const DestinationsPage = preloadableLazy(() => import('./routes/DestinationsPage.jsx'))
export const JourneysPage = preloadableLazy(() => import('./routes/JourneysPage.jsx'))
export const ServicesPage = preloadableLazy(() => import('./routes/ServicesPage.jsx'))
export const AboutPage = preloadableLazy(() => import('./routes/AboutPage.jsx'))
export const FaqsPage = preloadableLazy(() => import('./routes/FaqsPage.jsx'))
export const ContactPage = preloadableLazy(() => import('./routes/ContactPage.jsx'))
export const DestinationDetailPage = preloadableLazy(() => import('./pages.jsx').then((module) => ({ default: module.DestinationDetailPage })))
export const PackageDetailPage = preloadableLazy(() => import('./pages.jsx').then((module) => ({ default: module.PackageDetailPage })))
export const NotFound = preloadableLazy(() => import('./pages.jsx').then((module) => ({ default: module.NotFound })))

export function preloadInitialRoute(pathname) {
  if (pathname === '/') return HomePage.preload()
  if (/^\/destinations\/[^/]+\/?$/.test(pathname)) return DestinationDetailPage.preload()
  if (/^\/journeys\/[^/]+\/?$/.test(pathname)) return PackageDetailPage.preload()
  if (pathname === '/destinations' || pathname === '/destinations/') return DestinationsPage.preload()
  if (pathname === '/journeys' || pathname === '/journeys/' || pathname.startsWith('/packages')) return JourneysPage.preload()
  if (pathname === '/services' || pathname === '/services/') return ServicesPage.preload()
  if (pathname === '/about' || pathname === '/about/') return AboutPage.preload()
  if (pathname === '/faqs' || pathname === '/faqs/') return FaqsPage.preload()
  if (pathname === '/contact' || pathname === '/contact/') return ContactPage.preload()
  return NotFound.preload()
}
