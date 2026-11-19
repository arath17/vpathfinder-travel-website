import { JourneyCta, Services } from '../sections.jsx'
import { PageHero, PlanningProcess } from '../pages.jsx'

export default function ServicesPage({ onEnquiry }) {
  return <main><PageHero eyebrow="Travel management" title="Every detail." italic="One trusted team." text="Corporate travel, flights, stays, tours, and on-ground support—coordinated around your requirements." image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=85" breadcrumbs={[{ label: 'Travel Services' }]} /><Services onEnquiry={onEnquiry} /><PlanningProcess /><JourneyCta onEnquiry={onEnquiry} /></main>
}
