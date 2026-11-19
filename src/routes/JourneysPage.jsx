import { JourneyCta, TripIdeas } from '../sections.jsx'
import { PageHero, PlanningProcess } from '../pages.jsx'

export default function JourneysPage({ onEnquiry }) {
  return <main><PageHero eyebrow="Customizable trip ideas" title="Start with an idea." italic="Make it your own." text="No fixed templates. Use these journeys as inspiration, then shape every detail with your travel expert." image="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=85" breadcrumbs={[{ label: 'Trip Ideas' }]} /><TripIdeas /><PlanningProcess /><JourneyCta onEnquiry={onEnquiry} /></main>
}
