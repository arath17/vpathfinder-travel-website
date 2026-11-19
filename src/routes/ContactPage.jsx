import { Contact } from '../sections.jsx'
import { PageHero } from '../pages.jsx'

export default function ContactPage() {
  return <main><PageHero eyebrow="Contact Vpathfinder" title="Your journey starts" italic="with a conversation." text="Share your ideas and preferences. We’ll help you shape a journey that is entirely yours." image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85" breadcrumbs={[{ label: 'Contact' }]} /><Contact /></main>
}
