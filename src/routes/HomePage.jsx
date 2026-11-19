import { About, Destinations, Hero, JourneyCta, Services, Testimonials, TravelStyles, TripIdeas } from '../sections.jsx'

export default function HomePage({ onEnquiry }) {
  return <><Hero /><Destinations preview /><TripIdeas preview /><Services onEnquiry={onEnquiry} preview /><TravelStyles onEnquiry={onEnquiry} /><About onEnquiry={onEnquiry} preview /><Testimonials /><JourneyCta onEnquiry={onEnquiry} /></>
}
