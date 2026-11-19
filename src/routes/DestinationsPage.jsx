import { Destinations, JourneyCta, TravelStyles } from '../sections.jsx'
import { PageHero } from '../pages.jsx'

export default function DestinationsPage({ onEnquiry, onFilterChange }) {
  return <main><PageHero eyebrow="Destination collection" title="Find your place" italic="in the world." text="Inspiration for international escapes and journeys across India, each customized around you." image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=85" breadcrumbs={[{ label: 'Destinations' }]} /><Destinations onFilterChange={onFilterChange} /><TravelStyles onEnquiry={onEnquiry} /><JourneyCta onEnquiry={onEnquiry} /></main>
}
