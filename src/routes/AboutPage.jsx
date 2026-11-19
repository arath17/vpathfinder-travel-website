import { About, JourneyCta, Testimonials } from '../sections.jsx'
import { PageHero, PlanningProcess } from '../pages.jsx'

export default function AboutPage({ onEnquiry }) {
  return <main><PageHero eyebrow="About Vpathfinder" title="Personal by design." italic="Professional by nature." text="A New Delhi travel management company built around thoughtful service and dependable support." image="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1800&q=85" breadcrumbs={[{ label: 'About' }]} /><About onEnquiry={onEnquiry} /><PlanningProcess /><Testimonials /><JourneyCta onEnquiry={onEnquiry} /></main>
}
