import { business, destinations, packages } from './data.js'
import { destinationDetails } from './details.js'
import { reviewSource } from './reviews.js'
import { responsiveImageUrl, responsiveSrcSet } from './imageUtils.js'
import { slugify } from './ui.jsx'

export const siteOrigin = 'https://vpathfindertravel.com'
export const siteName = 'Vpathfinder Travel Solutions'
const homeImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=90'

const staticImages = {
  destinations: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=85',
  journeys: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=85',
  services: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=85',
  about: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1800&q=85',
  faqs: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85',
  contact: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
}

const collection = (path, label, title, description, image, imageAlt) => ({
  path, title, description, image, imageAlt,
  breadcrumbs: [{ label: 'Home', path: '/' }, { label }],
})

export const publicRoutes = [
  {
    path: '/',
    title: 'Vpathfinder Travel Solutions | Custom Travel from New Delhi',
    description: 'Personalized domestic and international holidays, corporate travel, flights, hotels, and inbound tours with end-to-end support from New Delhi.',
    image: homeImage,
    imageAlt: 'Turquoise ocean and a pristine tropical beach',
    breadcrumbs: [],
  },
  collection('/destinations/', 'Destinations', 'Destinations | Vpathfinder Travel Solutions', 'Explore international and Indian destinations, from the Maldives and Europe to Kerala and Kashmir, with every journey customized around you.', staticImages.destinations, 'Travel essentials arranged for a personalized journey'),
  ...destinations.map((item) => {
    const detail = destinationDetails[item.name]
    return {
      path: `/destinations/${slugify(item.name)}/`,
      title: `${item.name} Travel Planning | Vpathfinder`,
      description: `${detail.strapline} Plan a personalized ${item.name} journey with Vpathfinder, including route, stay, transfer, and experience support.`,
      image: item.image,
      imageAlt: `${item.name} travel destination`,
      breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Destinations', path: '/destinations/' }, { label: item.name }],
    }
  }),
  collection('/journeys/', 'Trip Ideas', 'Custom Trip Ideas | Vpathfinder Travel Solutions', 'Start with a customizable trip idea, then shape the route, dates, hotels, meals, transport, and pace with your personal travel expert.', staticImages.journeys, 'Limestone islands and a boat on a Vietnam waterway'),
  ...packages.map((item) => ({
    path: `/journeys/${slugify(item.name)}/`,
    title: `${item.name} | Custom Trip Idea | Vpathfinder`,
    description: `Explore the ${item.name} trip idea and customize the itinerary, dates, accommodation, meals, transport, and pace with Vpathfinder.`,
    image: item.image,
    imageAlt: `${item.name} travel inspiration`,
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Trip Ideas', path: '/journeys/' }, { label: item.name }],
  })),
  collection('/services/', 'Travel Services', 'Travel Services | Vpathfinder Travel Solutions', 'Corporate travel management, domestic and international flights, hotels, group tours, inbound tours, and destination support from one New Delhi team.', staticImages.services, 'Airplane wing above the clouds'),
  collection('/about/', 'About', 'About Vpathfinder | New Delhi Travel Company', 'Meet Vpathfinder Travel Solutions, a full-service New Delhi travel management company creating personal holidays, business journeys, and inbound tours.', staticImages.about, 'Traveller planning a journey with a map'),
  collection('/faqs/', 'FAQs', 'Travel FAQs | Vpathfinder Travel Solutions', 'Answers about customized holidays, corporate travel, flight and hotel booking, inbound tours, group travel, and contacting Vpathfinder.', staticImages.faqs, 'Scenic mountain journey'),
  collection('/contact/', 'Contact', 'Contact Vpathfinder | New Delhi Travel Agency', 'Contact Vpathfinder in West Patel Nagar, New Delhi, or send your travel preferences through WhatsApp to begin a personalized journey plan.', staticImages.contact, 'Turquoise ocean and a pristine tropical beach'),
]

const notFoundRoute = {
  path: '/404.html',
  title: 'Page Not Found | Vpathfinder Travel Solutions',
  description: 'This route does not exist. Return to Vpathfinder to explore personalized destinations and trip ideas.',
  robots: 'noindex,follow',
  breadcrumbs: [],
}

const normalizePath = (path) => {
  const clean = path.split(/[?#]/)[0]
  return clean === '/' ? '/' : `/${clean.replace(/^\/+|\/+$/g, '')}`
}
const routeByPath = new Map(publicRoutes.map((route) => [normalizePath(route.path), route]))
export const absoluteUrl = (path) => path === '/' ? `${siteOrigin}/` : `${siteOrigin}${path}`

export function getRouteSeo(pathname) {
  const route = routeByPath.get(normalizePath(pathname)) || notFoundRoute
  const isNotFound = route === notFoundRoute
  const canonical = isNotFound ? null : absoluteUrl(route.path)
  const agency = {
    '@type': 'TravelAgency',
    '@id': `${siteOrigin}/#travel-agency`,
    name: siteName,
    url: `${siteOrigin}/`,
    telephone: business.phone,
    email: business.email,
    hasMap: business.googleMaps,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'M-2, 1st Floor, West Patel Nagar',
      addressLocality: 'New Delhi',
      postalCode: '110008',
      addressCountry: 'IN',
    },
    logo: `${siteOrigin}/images/vpathfinder-logo.webp`,
    sameAs: [reviewSource],
  }
  const graph = isNotFound ? [] : [agency]
  if (!isNotFound && route.breadcrumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: route.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: absoluteUrl(crumb.path || route.path),
      })),
    })
  }
  return {
    ...route,
    canonical,
    robots: route.robots || 'index,follow,max-image-preview:large',
    structuredData: graph.length ? { '@context': 'https://schema.org', '@graph': graph } : null,
  }
}

function setMeta(attribute, name, content) {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function applyRouteMetadata(pathname) {
  const seo = getRouteSeo(pathname)
  document.title = seo.title
  setMeta('name', 'description', seo.description)
  setMeta('name', 'robots', seo.robots)
  setMeta('property', 'og:title', seo.title)
  setMeta('property', 'og:description', seo.description)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:site_name', siteName)
  setMeta('property', 'og:locale', 'en_IN')
  if (seo.image) {
    setMeta('property', 'og:image', seo.image)
    setMeta('property', 'og:image:alt', seo.imageAlt)
    setMeta('name', 'twitter:image', seo.image)
    setMeta('name', 'twitter:image:alt', seo.imageAlt)
  } else {
    document.head.querySelector('meta[property="og:image"]')?.remove()
    document.head.querySelector('meta[property="og:image:alt"]')?.remove()
    document.head.querySelector('meta[name="twitter:image"]')?.remove()
    document.head.querySelector('meta[name="twitter:image:alt"]')?.remove()
  }
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', seo.title)
  setMeta('name', 'twitter:description', seo.description)

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (seo.canonical) {
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = seo.canonical
    setMeta('property', 'og:url', seo.canonical)
  } else {
    canonical?.remove()
    document.head.querySelector('meta[property="og:url"]')?.remove()
  }

  let preload = document.head.querySelector('link[data-route-image-preload]')
  if (seo.image) {
    if (!preload) {
      preload = document.createElement('link')
      preload.rel = 'preload'
      preload.as = 'image'
      preload.dataset.routeImagePreload = ''
      document.head.appendChild(preload)
    }
    preload.href = responsiveImageUrl(seo.image)
    preload.setAttribute('imagesrcset', responsiveSrcSet(seo.image))
    preload.setAttribute('imagesizes', '125vw')
    preload.setAttribute('fetchpriority', 'high')
  } else {
    preload?.remove()
  }

  let structured = document.head.querySelector('script[data-route-structured-data]')
  if (seo.structuredData) {
    if (!structured) {
      structured = document.createElement('script')
      structured.type = 'application/ld+json'
      structured.dataset.routeStructuredData = ''
      document.head.appendChild(structured)
    }
    structured.textContent = JSON.stringify(seo.structuredData)
  } else {
    structured?.remove()
  }
}
