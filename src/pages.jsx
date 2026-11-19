import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, Compass, MapPin, MessageCircle, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { destinations, packages } from './data.js'
import { destinationDetails, planningSteps } from './details.js'
import { SafeImage, slugify, whatsappUrl } from './ui.jsx'

export function PageHero({ eyebrow, title, italic, text, image, code = 'DEL', breadcrumbs = [{ label: title }] }) {
  return (
    <section className="page-hero">
      <SafeImage src={image} alt="" loading="eager" fetchPriority="high" sizes="125vw" data-parallax="0.1" />
      <div className="page-hero__overlay" />
      <div className="shell page-hero__content">
        <div className="breadcrumbs" data-hero-fade><Link to="/">Home</Link>{breadcrumbs.map((crumb) => <span key={`${crumb.label}-${crumb.path || 'current'}`} className="breadcrumb-item"><span>/</span>{crumb.path ? <Link to={crumb.path}>{crumb.label}</Link> : <span>{crumb.label}</span>}</span>)}</div>
        <p className="eyebrow" data-hero-fade><span />{eyebrow}</p>
        <h1><span data-title-line><span>{title}</span></span>{italic && <span data-title-line><span><em>{italic}</em></span></span>}</h1>
        {text && <p data-hero-fade>{text}</p>}
      </div>
      <div className="page-hero__route" data-hero-fade><span>{code}</span><i /><Compass size={18} /><span>ANYWHERE</span></div>
    </section>
  )
}

export function DestinationDetailPage({ onEnquiry }) {
  const { slug } = useParams()
  const item = destinations.find((destination) => slugify(destination.name) === slug)
  if (!item) return <NotFound />
  const detail = destinationDetails[item.name]

  return (
    <main>
      <PageHero eyebrow={`${item.region} · ${item.code}`} title={item.name} italic={item.note} text={detail.strapline} image={item.image} code={item.code} breadcrumbs={[{ label: 'Destinations', path: '/destinations/' }, { label: item.name }]} />
      <section className="section detail-section">
        <div className="shell detail-layout">
          <div className="detail-main" data-reveal>
            <p className="eyebrow"><span />The Vpathfinder perspective</p>
            <h2>{detail.strapline}</h2>
            <p>{detail.description}</p>
            <div className="detail-experiences">
              <h3>Make the journey your own</h3>
              {detail.experiences.map((experience) => <span key={experience}><Check size={16} />{experience}</span>)}
            </div>
          </div>
          <aside className="detail-aside" data-reveal>
            <p className="mono-label">AT A GLANCE</p>
            <dl>
              <div><dt><CalendarDays size={17} />Best time to go</dt><dd>{detail.bestTime}</dd></div>
              <div><dt><Clock3 size={17} />Ideal length</dt><dd>{detail.idealLength}</dd></div>
              <div><dt><Users size={17} />Especially good for</dt><dd>{detail.idealFor}</dd></div>
            </dl>
            <button className="button button--primary" onClick={() => onEnquiry(item.name)}>Plan a {item.name} journey <ArrowUpRight size={17} /></button>
            <a href={whatsappUrl(`Hello Vpathfinder, I would like to know more about travelling to ${item.name}.`)} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Ask a destination expert</a>
          </aside>
        </div>
      </section>
      <section className="detail-photo-band">
        <SafeImage src={item.image} alt={`${item.name} landscape`} loading="lazy" sizes="100vw" data-parallax="0.14" />
        <div className="shell"><p>GOOD JOURNEYS AREN’T PACKAGED.<br /><em>They’re personal.</em></p></div>
      </section>
      <section className="section related-section">
        <div className="shell related-inner">
          <div><p className="eyebrow"><span />Keep exploring</p><h2>Another place,<br /><em>another possibility.</em></h2></div>
          <div className="related-links">{destinations.filter((destination) => destination.name !== item.name).slice(0, 3).map((destination) => <Link key={destination.name} to={`/destinations/${slugify(destination.name)}/`}><span><small>{destination.code}</small>{destination.name}</span><ArrowUpRight size={20} /></Link>)}</div>
        </div>
      </section>
    </main>
  )
}

export function PackageDetailPage({ onEnquiry }) {
  const { slug } = useParams()
  const item = packages.find((journey) => slugify(journey.name) === slug)
  if (!item) return <NotFound />
  const destination = destinations.find((entry) => entry.code === item.code)

  return (
    <main>
      <PageHero eyebrow={`${item.badge} · Customizable trip idea`} title={item.name} italic="Made personal." text="An inspiring starting point, with every detail shaped around your dates, preferences, and travel style." image={item.image} code={item.code} breadcrumbs={[{ label: 'Trip Ideas', path: '/journeys/' }, { label: item.name }]} />
      <section className="section detail-section">
        <div className="shell detail-layout">
          <div className="detail-main" data-reveal>
            <p className="eyebrow"><span />Your journey, your way</p>
            <h2>Start with inspiration.<br /><em>Shape it together.</em></h2>
            <p>This is a Trip Idea, not a fixed itinerary. Your travel expert will discuss your preferences and create a personalized plan directly with you.</p>
            <div className="detail-experiences">
              <h3>Experiences you can discuss</h3>
              {item.features.map((feature) => <span key={feature}><Check size={16} />{feature}</span>)}
            </div>
            <div className="package-customization"><h3>Nothing here is fixed</h3><p>Dates, trip length, hotels, meals, transport, sightseeing, and pace can all be discussed as part of your personalized plan and quote.</p></div>
          </div>
          <aside className="detail-aside package-price-card" data-reveal>
            <p className="mono-label">INDICATIVE STARTING PRICE</p>
            <strong className="detail-price">{item.price}</strong>
            <span className="price-note">Per person · subject to customization</span>
            <p>Final pricing depends on your dates and the personalized arrangements you choose with our team.</p>
            <button className="button button--primary" onClick={() => onEnquiry(item.name)}>Request a personalized quote <ArrowUpRight size={17} /></button>
            <a href={whatsappUrl(`Hello Vpathfinder, I am interested in the ${item.name} Trip Idea. Please help me customize it.`)} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Ask about this journey</a>
          </aside>
        </div>
      </section>
      {destination && <section className="detail-photo-band"><SafeImage src={destination.image} alt={destination.name} loading="lazy" sizes="100vw" data-parallax="0.14" /><div className="shell"><p>THE DESTINATION IS ONLY THE BEGINNING.<br /><em>How you experience it matters.</em></p></div></section>}
      <section className="section related-section"><div className="shell related-inner"><div><p className="eyebrow"><span />More from the collection</p><h2>Find your next<br /><em>way away.</em></h2></div><div className="related-links">{packages.filter((journey) => journey.name !== item.name).slice(0, 3).map((journey) => <Link key={journey.name} to={`/journeys/${slugify(journey.name)}/`}><span><small>{journey.code} · {journey.price}</small>{journey.name}</span><ArrowUpRight size={20} /></Link>)}</div></div></section>
    </main>
  )
}

export function PlanningProcess() {
  return (
    <section className="section process-section">
      <div className="shell">
        <div className="process-heading" data-reveal><p className="eyebrow"><span />From idea to itinerary</p><h2>Simple to plan.<br /><em>Easy to enjoy.</em></h2></div>
        <ol className="process-list">{planningSteps.map((step, index) => <li key={step.title} data-reveal><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><ArrowRight size={20} /></li>)}</ol>
      </div>
    </section>
  )
}

export function NotFound() {
  return (
    <main className="not-found">
      <div><MapPin size={35} strokeWidth={1.3} /><p className="eyebrow"><span />404 · Off the map</p><h1>This route doesn’t exist.<br /><em>Your next journey does.</em></h1><Link className="button button--primary" to="/"><ArrowLeft size={17} /> Return home</Link></div>
    </main>
  )
}
