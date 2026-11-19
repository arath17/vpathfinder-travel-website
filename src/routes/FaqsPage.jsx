import { Faq, JourneyCta } from '../sections.jsx'
import { PageHero } from '../pages.jsx'

export default function FaqsPage({ onEnquiry }) {
  return <main><PageHero eyebrow="Practical information" title="Before you" italic="set off." text="Answers to common questions about our services, customization, and travel support." image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85" breadcrumbs={[{ label: 'FAQs' }]} /><Faq /><JourneyCta onEnquiry={onEnquiry} /></main>
}
