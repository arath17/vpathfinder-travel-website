import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays, Check,
  ChevronDown, Compass, Headphones, Luggage, Mail, MapPin, MapPinned, MessageCircle,
  Phone, Plane, Quote, ShieldCheck, Star, UserRound, Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { business, destinations, faqs, packages, services, travelStyles } from './data.js'
import { reviews, reviewSource } from './reviews.js'
import { GoogleMapsLink, SafeImage, SectionIntro, slugify, today, whatsappUrl } from './ui.jsx'
import { useMotion } from './motion.jsx'

const serviceIcons = { BriefcaseBusiness, Plane, MapPinned, Compass, Luggage, Building2, Users, Headphones }

function PlannerSelect({ id, label, value, placeholder, options, onChange, icon: Icon, open, onOpenChange, invalid = false }) {
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const activeIndexRef = useRef(Math.max(0, options.findIndex((option) => option.value === value)))
  const keyboardModeRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(activeIndexRef.current)
  const [placement, setPlacement] = useState({ side: 'top', height: 340 })
  const selected = options.find((option) => option.value === value)
  const updateActive = (index) => {
    activeIndexRef.current = index
    setActiveIndex(index)
  }

  useLayoutEffect(() => {
    if (!open) return undefined
    keyboardModeRef.current = false
    updateActive(Math.max(0, options.findIndex((option) => option.value === value)))
    const bounds = triggerRef.current.getBoundingClientRect()
    const spaceAbove = bounds.top - 16
    const spaceBelow = window.innerHeight - bounds.bottom - 16
    const side = spaceBelow >= 280 || spaceBelow > spaceAbove ? 'bottom' : 'top'
    const available = side === 'top' ? spaceAbove : spaceBelow
    setPlacement({ side, height: Math.max(140, Math.min(350, available)) })
    listRef.current?.focus()
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) onOpenChange(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [open])

  useEffect(() => {
    if (open) listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const choose = (index) => {
    onChange(options[index].value)
    onOpenChange(false)
    triggerRef.current?.focus()
  }

  const onListKeyDown = (event) => {
    let nextIndex
    if (event.key === 'ArrowDown') nextIndex = (activeIndexRef.current + 1) % options.length
    if (event.key === 'ArrowUp') nextIndex = (activeIndexRef.current - 1 + options.length) % options.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = options.length - 1
    if (nextIndex !== undefined) {
      event.preventDefault()
      keyboardModeRef.current = true
      updateActive(nextIndex)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(activeIndexRef.current)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onOpenChange(false)
      triggerRef.current?.focus()
    } else if (event.key === 'Tab') {
      onOpenChange(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <div className={`planner-field planner-select ${open ? 'is-open' : ''}`} ref={rootRef}>
      <span className="field-label" id={`${id}-label`}>{label}</span>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className="planner-select__trigger"
        aria-labelledby={`${id}-label ${id}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        aria-invalid={invalid || undefined}
        onClick={() => onOpenChange(!open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            onOpenChange(true)
          } else if (event.key === 'Escape' && open) {
            event.preventDefault()
            onOpenChange(false)
          }
        }}
      >
        <span className="input-with-icon"><Icon size={17} /><span className={!selected ? 'is-placeholder' : ''}>{selected?.label || placeholder}</span></span>
        <ChevronDown className="planner-select__chevron" size={16} />
      </button>
      {open && <div className={`planner-options planner-options--${placement.side}`} style={{ '--planner-options-height': `${placement.height}px` }}>
        <div className="planner-options__heading"><span>{label}</span><span>DEL <ArrowRight size={12} /> ANY</span></div>
        <ul
          ref={listRef}
          id={`${id}-options`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-option-${activeIndex}`}
          tabIndex={0}
          onKeyDown={onListKeyDown}
          onMouseMove={() => { keyboardModeRef.current = false }}
          data-lenis-prevent
        >
          {options.map((option, index) => <li
            id={`${id}-option-${index}`}
            key={option.value}
            role="option"
            aria-selected={option.value === value}
            className={`${index === activeIndex ? 'is-active' : ''} ${option.value === value ? 'is-selected' : ''}`}
            onMouseEnter={() => { if (!keyboardModeRef.current) updateActive(index) }}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
          >
            <span className="planner-option__code">{option.code || String(index + 1).padStart(2, '0')}</span>
            <span className="planner-option__copy"><strong>{option.label}</strong><small>{option.detail}</small></span>
            <span className="planner-option__check">{option.value === value ? <Check size={17} /> : <ArrowUpRight size={16} />}</span>
          </li>)}
        </ul>
      </div>}
    </div>
  )
}

export function Hero() {
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [travellers, setTravellers] = useState('2 travellers')
  const [openMenu, setOpenMenu] = useState('')
  const [plannerError, setPlannerError] = useState('')
  const destinationOptions = [...destinations.map((item) => ({ value: item.name, label: item.name, code: item.code, detail: `${item.region} · ${item.note}` })), { value: 'Somewhere else', label: 'Somewhere else', code: 'ANY', detail: 'Tell us what you have in mind' }]
  const travellerOptions = [
    { value: '1 traveller', detail: 'A solo escape, designed around you' },
    { value: '2 travellers', detail: 'A journey for two' },
    { value: '3 travellers', detail: 'Three seats, one shared adventure' },
    { value: '4 travellers', detail: 'Perfect for a small family or friends' },
    { value: '5+ travellers', detail: 'A group journey, coordinated for you' },
  ].map((option, index) => ({ ...option, label: option.value, code: String(index + 1).padStart(2, '0') }))
  const submitPlanner = (event) => {
    event.preventDefault()
    if (!destination) {
      setPlannerError('Choose a destination so we can start shaping your journey.')
      setOpenMenu('destination')
      return
    }
    setPlannerError('')
    window.open(whatsappUrl(`Hello Vpathfinder, I would like a personalized journey plan.\n\nDestination: ${destination}\nPreferred date: ${date || 'Flexible'}\nTravellers: ${travellers}\n\nI understand the itinerary, duration, meals, hotels, and transport can be customized with your team. Please help me plan.`), '_blank', 'noopener,noreferrer')
  }
  return (
    <main id="home" className="hero">
      <div className="hero__media"><SafeImage src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=90" alt="Turquoise ocean and a pristine tropical beach" loading="eager" fetchPriority="high" sizes="125vw" data-parallax="0.1" /></div>
      <div className="hero__shade" />
      <div className="hero-route" aria-hidden="true"><span>DEL</span><i /><Plane size={19} /></div>
      <div className="shell hero__inner">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow" data-hero-fade><span />Full-service travel management · New Delhi</p>
          <h1><span data-title-line><span>Travel well.</span></span><span data-title-line><span>Leave the details</span></span><span data-title-line><span>to us.</span></span></h1>
          <p className="hero-description" data-hero-fade>From the first conversation to the final transfer, we shape personal holidays and business journeys around you—with care, clarity, and dependable support.</p>
          <div className="hero-actions" data-hero-fade><Link className="button button--primary" to="/journeys/">Find your next journey <ArrowRight size={18} /></Link><a className="text-link" href={whatsappUrl('Hello Vpathfinder, I would like help planning a personalized trip.')} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Chat with a travel expert</a></div>
          <div className="hero-assurances" aria-label="Service highlights" data-hero-fade><span><Check size={15} /> Fully customized</span><span><Check size={15} /> Domestic & international</span><span><Check size={15} /> Personal assistance</span></div>
        </div>
        <div className="hero-caption" data-hero-fade><span>04.3943° N · 73.5100° E</span><div><small>Indian Ocean</small><strong>Maldives</strong></div><p>Where doing nothing<br />becomes everything.</p></div>
      </div>
      <div className="hero-scroll" data-hero-fade><span>Scroll to discover</span><i /></div>
      <div className="shell planner-wrap" data-hero-fade>
        <form className="trip-planner" onSubmit={submitPlanner}>
          <div className="planner-origin"><span className="field-label">Your journey begins</span><strong>DEL</strong><small>New Delhi, India</small></div>
          <div className="planner-route" aria-hidden="true"><span /><Plane size={22} /><span /></div>
          <PlannerSelect id="planner-destination" label="Where to?" value={destination} placeholder="Choose destination" options={destinationOptions} onChange={(value) => { setDestination(value); setPlannerError('') }} icon={MapPin} open={openMenu === 'destination'} onOpenChange={(open) => setOpenMenu(open ? 'destination' : '')} invalid={Boolean(plannerError)} />
          <label className="planner-field"><span className="field-label">When?</span><span className="input-with-icon"><CalendarDays size={17} /><input type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} aria-label="Preferred travel date" /></span></label>
          <PlannerSelect id="planner-travellers" label="Who’s travelling?" value={travellers} options={travellerOptions} onChange={setTravellers} icon={UserRound} open={openMenu === 'travellers'} onOpenChange={(open) => setOpenMenu(open ? 'travellers' : '')} />
          <button className="planner-submit" type="submit"><span>Plan my journey</span><ArrowUpRight size={22} /></button>
        </form>
        {plannerError && <p className="planner-error" role="alert">{plannerError}</p>}
        <p className="planner-note"><ShieldCheck size={14} /> No fixed templates. Your route, stay, pace, and details are shaped with you.</p>
      </div>
    </main>
  )
}

export function Destinations({ preview = false, onFilterChange }) {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? destinations : destinations.filter((item) => item.region === filter)
  const visible = preview ? destinations.slice(0, 4) : filtered
  return (
    <section id={preview ? undefined : 'destinations'} className="section destinations-section">
      <div className="shell">
        <div className="section-heading-row"><SectionIntro eyebrow="The world is waiting" title={<>Places that stay<br /><em>with you.</em></>} text="Destination inspiration for domestic and international escapes, each shaped around how you want to travel." />{preview ? <Link className="text-link text-link--dark" to="/destinations/">Explore all destinations <ArrowRight size={17} /></Link> : <div className="filter-group" aria-label="Filter destinations">{['All', 'International', 'Domestic'].map((option) => <button key={option} className={filter === option ? 'active' : ''} aria-pressed={filter === option} onClick={() => { setFilter(option); onFilterChange?.() }}>{option}</button>)}</div>}</div>
        <div className={`destinations-grid ${preview || filter !== 'All' ? 'is-filtered' : ''} ${preview ? 'is-preview' : ''}`}>{visible.map((item, index) => <Link data-cinematic-card className={`destination-card destination-card--${index}`} key={item.name} to={`/destinations/${slugify(item.name)}/`} aria-label={`Explore ${item.name}`} data-cursor="Explore"><SafeImage src={item.image} alt={`${item.name} travel destination`} loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1200px) 60vw, 790px" data-parallax="0.1" /><span className="image-overlay" /><span className="destination-code">{item.code} <ArrowUpRight size={16} /></span><span className="destination-content"><small>{item.region}</small><strong>{item.name}</strong><span>{item.note}</span></span></Link>)}</div>
      </div>
    </section>
  )
}

export function Services({ onEnquiry, preview = false }) {
  const visible = preview ? services.slice(0, 4) : services
  return (
    <section id={preview ? undefined : 'services'} className="section services-section"><div className="shell services-layout"><div className="services-sticky"><SectionIntro eyebrow="Expertise, end to end" title={<>Everything travel.<br /><em>One trusted team.</em></>} text="Flights, stays, routes, and the small details in between—coordinated around your needs with one point of contact." light />{preview ? <Link className="button button--light" to="/services/">Explore our services <ArrowRight size={17} /></Link> : <button className="button button--light" onClick={() => onEnquiry()}>Discuss your requirements <ArrowUpRight size={17} /></button>}</div><div className="service-list">{visible.map((service) => { const Icon = serviceIcons[service.icon]; return <button data-reveal className="service-row" key={service.title} onClick={() => onEnquiry(service.title)}><span className="service-icon"><Icon size={23} strokeWidth={1.6} /></span><span className="service-text"><strong>{service.title}</strong><span>{service.text}</span></span><ArrowUpRight className="service-arrow" size={20} /></button> })}</div></div></section>
  )
}

export function TripIdeas({ preview = false }) {
  const visible = preview ? packages.slice(0, 3) : packages
  return (
    <section id={preview ? undefined : 'journeys'} className="section packages-section"><div className="shell"><div className="section-heading-row packages-heading"><SectionIntro eyebrow="Customizable trip ideas" title={<>A little inspiration.<br /><em>Entirely your journey.</em></>} /><p className="section-copy">These are conversation starters, not fixed packages. Your route, dates, stays, meals, transport, and pace are all planned with you.</p></div><div className="packages-grid">{visible.map((item) => <article className="package-card" key={item.name} data-cinematic-card><Link className="package-image" to={`/journeys/${slugify(item.name)}/`} data-cursor="Discover"><SafeImage src={item.image} alt={`${item.name} inspiration`} loading="lazy" sizes="(max-width: 700px) 100vw, (max-width: 1100px) calc(100vw - 64px), 875px" data-parallax="0.11" /><span className="package-badge">{item.badge}</span><span className="package-code">DEL <ArrowRight size={13} /> {item.code}</span></Link><div className="package-body"><div className="package-rating" aria-label="Featured trip idea"><Star size={13} fill="currentColor" /><span>TRIP IDEA</span></div><h3><Link to={`/journeys/${slugify(item.name)}/`}>{item.name}</Link></h3><ul>{item.features.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul><div className="package-footer"><p><span>Indicative · per person</span><strong>{item.price}</strong></p><Link to={`/journeys/${slugify(item.name)}/`} aria-label={`Explore ${item.name}`}><span>Explore the idea</span><ArrowUpRight size={19} /></Link></div></div></article>)}</div><div className="collection-footer"><p className="package-note">Starting prices are indicative and subject to dates and customization. Final arrangements and quotes are prepared directly with you.</p>{preview && <Link className="button button--secondary" to="/journeys/">View all trip ideas <ArrowRight size={17} /></Link>}</div></div></section>
  )
}

export function TravelStyles({ onEnquiry }) {
  return (
    <section className="section styles-section scroll-gallery"><div className="styles-sticky"><div className="shell"><div className="section-heading-row"><SectionIntro eyebrow="Closer to home" title={<>India, in every<br /><em>direction.</em></>} light /><div className="gallery-intro"><p className="section-copy">Mountains, backwaters, islands, and cities—scroll through the many ways to see India.</p><span>SCROLL TO EXPLORE <ArrowRight size={15} /></span></div></div><div className="styles-rail">{travelStyles.map((item) => <button className="style-card" key={item.name} onClick={() => onEnquiry(`${item.name} — customized India journey`)} data-cursor="Plan"><SafeImage src={item.image} alt={item.name} loading="lazy" sizes="(max-width: 640px) 96vw, (max-width: 900px) 76vw, (max-width: 1372px) 41vw, 560px" data-parallax="0.08" /><span className="image-overlay" /><span className="style-code">{item.code}</span><span className="style-name">{item.name}<ArrowUpRight size={19} /></span></button>)}</div><div className="gallery-progress"><span /></div></div></div></section>
  )
}

export function About({ onEnquiry, preview = false }) {
  return (
    <section id={preview ? undefined : 'about'} className="section about-section"><div className="shell about-grid"><div className="about-visual" data-reveal><SafeImage src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1400&q=85" alt="Traveller planning a journey with a map" loading="lazy" sizes="(max-width: 900px) 100vw, 50vw" data-parallax="0.1" /><div className="about-image-label"><GoogleMapsLink className="about-map-link" /><span>AT HOME IN THE WORLD</span></div><div className="about-experience"><strong>5<span>+</span></strong><p>years of making<br />travel feel effortless</p></div></div><div className="about-content"><SectionIntro eyebrow="Meet Vpathfinder" title={<>Travel is personal.<br /><em>So is our approach.</em></>} /><p>Vpathfinder Travel Solutions is a full-service travel management company based in New Delhi NCR, serving corporate clients, inbound travellers, and holidaymakers with care and precision.</p><p>We combine travel proficiency, smart ticketing support, and destination partnerships to create thoughtful journeys without losing sight of comfort or your individual needs.</p><div className="about-specialities"><span>Corporate travel</span><span>Inbound tours</span><span>Airline tickets</span><span>Custom holidays</span></div>{preview ? <Link className="text-link text-link--dark" to="/about/">Get to know your travel team <ArrowRight size={18} /></Link> : <button className="text-link text-link--dark" onClick={() => onEnquiry()}>Start a conversation <ArrowRight size={18} /></button>}</div></div><div className="shell proof-strip" data-reveal><div><strong>Personal</strong><span>Customized plans</span></div><div><strong>Responsive</strong><span>Travel support</span></div><div><strong>End-to-end</strong><span>Trip coordination</span></div><div><strong>One team</strong><span>For every detail</span></div></div></section>
  )
}

export function JourneyCta({ onEnquiry }) {
  return <section className="journey-cta"><SafeImage src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=85" alt="Scenic mountain journey" loading="lazy" sizes="100vw" data-parallax="0.12" /><div className="journey-cta__overlay" /><div className="shell journey-cta__content" data-reveal><p className="eyebrow"><span />Your next chapter</p><h2>Where will life<br /><em>take you next?</em></h2><p>Tell us what you have in mind. We’ll shape the route, stays, and details around you.</p><button className="button button--light" onClick={() => onEnquiry()}>Start planning <ArrowUpRight size={18} /></button></div></section>
}

export function FaqAnswer({ id, isOpen, children }) {
  const answerRef = useRef(null)
  const { reduced } = useMotion()
  useLayoutEffect(() => {
    const answer = answerRef.current
    if (reduced) {
      gsap.set(answer, { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 })
      return
    }
    if (isOpen) gsap.to(answer, { height: 'auto', opacity: 1, duration: 0.45, ease: 'power3.out' })
    else gsap.to(answer, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' })
  }, [isOpen, reduced])
  return <div id={id} className={`faq-answer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} ref={answerRef}><p>{children}</p></div>
}

export function Faq({ preview = false }) {
  const [openIndex, setOpenIndex] = useState(0)
  const visible = preview ? faqs.slice(0, 4) : faqs
  return <section id={preview ? undefined : 'faq'} className="section faq-section"><div className="shell faq-layout"><div className="faq-aside"><SectionIntro eyebrow="Good to know" title={<>Questions,<br /><em>answered.</em></>} text="The practical details before you set off. Need to know something else?" /><a className="text-link text-link--dark" href={whatsappUrl('Hello Vpathfinder, I have a travel question.')} target="_blank" rel="noreferrer">Ask us directly <MessageCircle size={17} /></a></div><div className="faq-list">{visible.map((item, index) => { const isOpen = openIndex === index; return <div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={item.q}><h3><button aria-expanded={isOpen} aria-controls={`faq-answer-${index}`} onClick={() => setOpenIndex(isOpen ? -1 : index)}><span>{item.q}</span><ChevronDown size={20} /></button></h3><FaqAnswer id={`faq-answer-${index}`} isOpen={isOpen}>{item.a}{item.mapUrl && <GoogleMapsLink className="faq-map-link" href={item.mapUrl} />}</FaqAnswer></div> })}</div></div></section>
}

export function Testimonials() {
  const visible = reviews.slice(0, 3)
  return <section className="section testimonials-section"><div className="shell"><div className="reviews-heading"><SectionIntro eyebrow="Verified public reviews" title={<>Real journeys.<br /><em>Genuine feedback.</em></>} align="center" /><a href={reviewSource} target="_blank" rel="noreferrer" className="review-rating"><strong>4.8</strong><span>on Google · 56 reviews<br /><small>Externally listed on Holidify · View source <ArrowUpRight size={12} /></small></span></a></div><div className="testimonial-grid">{visible.map((item) => <figure className="testimonial-card" key={item.name} data-reveal><Quote size={30} strokeWidth={1.2} /><blockquote>“{item.quote}”</blockquote><figcaption><span className="review-initials">{item.name.split(' ').map((part) => part[0]).slice(0, 2).join(' ')}</span><div><strong>{item.name}</strong><span>{item.trip}</span></div><a href={reviewSource} target="_blank" rel="noreferrer" aria-label={`Read ${item.name}'s review on Holidify`}><ArrowUpRight size={17} /></a></figcaption></figure>)}</div><a className="reviews-link" href={reviewSource} target="_blank" rel="noreferrer">Read more verified public reviews <ArrowUpRight size={15} /></a></div></section>
}

export function Contact() {
  const [status, setStatus] = useState('')
  const submitContact = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    window.open(whatsappUrl(`Hello Vpathfinder, I would like a personalized travel plan.\n\nName: ${form.get('name')}\nPhone: ${form.get('phone')}\nEmail: ${form.get('email') || 'Not provided'}\nDestination: ${form.get('destination') || 'Open to suggestions'}\nService: ${form.get('service') || 'Travel planning'}\nPreferences / requirements: ${form.get('message') || 'Please contact me to discuss.'}`), '_blank', 'noopener,noreferrer')
    setStatus('Your enquiry is ready. Opening WhatsApp…')
  }
  return <section id="contact" className="section contact-section"><div className="shell contact-layout"><div className="contact-content"><SectionIntro eyebrow="Let’s make it happen" title={<>A remarkable trip<br /><em>starts with hello.</em></>} text="Share your destination, dates, and ideas. Our New Delhi team will shape the details with you." light /><div className="contact-details"><a href={`tel:${business.phone}`}><Phone size={20} /><span><small>Call our travel team</small>{business.phone} / {business.alternatePhone}</span><ArrowUpRight size={18} /></a><a href={`mailto:${business.email}`}><Mail size={20} /><span><small>Write to us</small>{business.email}</span><ArrowUpRight size={18} /></a><a href={business.googleMaps} target="_blank" rel="noreferrer" aria-label="View Vpathfinder office on Google Maps (opens in a new tab)"><MapPin size={20} /><span><small>Visit our office</small>{business.address}<strong className="contact-map-action">View on Google Maps <ArrowUpRight size={13} /></strong></span></a></div><div className="contact-hours"><span className="status-dot" /> Personalized travel planning and booking assistance</div></div><form className="contact-form" onSubmit={submitContact} data-reveal><div className="form-heading"><span>TRIP ENQUIRY</span><span>DEL <ArrowRight size={14} /> ANYWHERE</span></div><h3>Tell us about your journey.</h3><div className="form-grid"><label><span>Your name *</span><input name="name" autoComplete="name" placeholder="e.g. Rohan Sharma" required /></label><label><span>Phone number *</span><input name="phone" type="tel" autoComplete="tel" placeholder="Your contact number" required /></label><label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label><label><span>Destination</span><input name="destination" placeholder="Where would you like to go?" /></label><label className="form-grid__full"><span>How can we help?</span><select name="service" defaultValue=""><option value="">Select a service</option>{services.map((service) => <option key={service.title}>{service.title}</option>)}</select></label><label className="form-grid__full"><span>Your preferences</span><textarea name="message" rows="4" placeholder="Dates, travellers, pace, meal or transport preferences, budget, or anything else…" /></label></div><button className="button button--primary form-submit" type="submit">Send enquiry on WhatsApp <MessageCircle size={18} /></button><p className="form-privacy"><ShieldCheck size={14} /> Your details are only used to prepare your travel enquiry.</p><p className="form-status" role="status">{status}</p></form></div></section>
}
