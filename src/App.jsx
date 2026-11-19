import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowRight, ArrowUp, ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays,
  Check, ChevronDown, Compass, Headphones, Luggage, Mail, MapPin, MapPinned,
  Menu, MessageCircle, Moon, Navigation, Phone, Plane, Quote, ShieldCheck,
  Star, Sun, UserRound, Users, X,
} from 'lucide-react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { business, destinations, faqs, navItems, packages, services, travelStyles } from './data.js'
import { reviews, reviewSource } from './reviews.js'
import { DestinationDetailPage, NotFound, PackageDetailPage, PageHero, PlanningProcess, slugify } from './pages.jsx'
import { CustomCursor, ScrollProgress, useCinematicScenes, useMotion } from './motion.jsx'

const serviceIcons = { BriefcaseBusiness, Plane, MapPinned, Compass, Luggage, Building2, Users, Headphones }
const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
const whatsappUrl = (message) => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`
const today = new Date().toLocaleDateString('en-CA')

function SafeImage({ src, alt, ...props }) {
  const [source, setSource] = useState(src)
  useEffect(() => setSource(src), [src])
  return <img src={source} alt={alt} width="1200" height="800" onError={() => source !== fallbackImage && setSource(fallbackImage)} {...props} />
}

function SectionIntro({ eyebrow, title, text, align = 'left', light = false }) {
  return (
    <div className={`section-intro section-intro--${align} ${light ? 'section-intro--light' : ''}`} data-reveal>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="section-copy">{text}</p>}
    </div>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'light')
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    document.documentElement.style.colorScheme = next
    localStorage.setItem('vpathfinder-theme', next)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#071923' : '#f7f9f8')
  }
  return <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
}

function Header({ onEnquiry }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()
  const { lenis, reduced } = useMotion()

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setScrolled(self.scroll() > 24),
    })
    return () => trigger.kill()
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    if (!reduced && window.innerWidth <= 1020) {
      gsap.fromTo(menuRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.65, ease: 'power4.out' })
      gsap.fromTo(menuRef.current.querySelectorAll('a, .mobile-nav-cta'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.055, delay: 0.15, ease: 'power3.out' })
    }
    const onKeyDown = (event) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
      window.removeEventListener('keydown', onKeyDown)
      gsap.killTweensOf(menuRef.current)
    }
  }, [menuOpen, lenis, reduced])

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(`${href}/`)
  const closeMenu = useCallback(() => {
    if (!menuOpen || reduced || window.innerWidth > 1020) {
      setMenuOpen(false)
      return
    }
    gsap.to(menuRef.current, { xPercent: 100, duration: 0.4, ease: 'power3.in', onComplete: () => setMenuOpen(false) })
  }, [menuOpen, reduced])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="contact-strip">
        <div className="shell contact-strip__inner">
          <p><MapPin size={13} /> West Patel Nagar, New Delhi <span>28.6517° N · 77.1907° E</span></p>
          <div><a href={`tel:${business.phone}`}><Phone size={13} /> {business.phone}</a><a href={`mailto:${business.email}`}><Mail size={13} /> {business.email}</a></div>
        </div>
      </div>
      <div className="navigation-shell">
        <div className="shell navbar">
          <Link className="brand" to="/" aria-label="Vpathfinder Travel Solutions home"><img src="/images/vpathfinder-logo.webp" alt="Vpathfinder Travel Solutions" width="1218" height="804" /></Link>
          <nav id="primary-navigation" ref={menuRef} className={`nav-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
            <div className="mobile-nav-heading"><span>Explore Vpathfinder</span><button className="icon-button" onClick={closeMenu} aria-label="Close navigation"><X size={22} /></button></div>
            {navItems.map((item) => <Link key={item.href} to={item.href} onClick={closeMenu} className={isActive(item.href) ? 'active' : ''}>{item.label}</Link>)}
            <Link to="/contact" onClick={closeMenu} className={isActive('/contact') ? 'active' : ''}>Contact</Link>
            <button className="button button--primary mobile-nav-cta" onClick={() => { setMenuOpen(false); onEnquiry() }}>Plan a journey <ArrowUpRight size={17} /></button>
            <p className="mobile-nav-foot">New Delhi · India<br />Travel, thoughtfully arranged.</p>
          </nav>
          <div className="nav-actions"><ThemeToggle /><button className="button button--primary desktop-nav-cta" onClick={() => onEnquiry()}>Plan a journey <ArrowUpRight size={17} /></button><button className="menu-toggle" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(true)}><Menu size={24} /></button></div>
        </div>
      </div>
      {menuOpen && <button className="nav-backdrop" aria-label="Close navigation" onClick={closeMenu} />}
    </header>
  )
}

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

function Hero() {
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
      <div className="hero__media"><SafeImage src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=90" alt="Turquoise ocean and a pristine tropical beach" fetchPriority="high" data-parallax="0.1" /></div>
      <div className="hero__shade" />
      <div className="hero-route" aria-hidden="true"><span>DEL</span><i /><Plane size={19} /></div>
      <div className="shell hero__inner">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow" data-hero-fade><span />Full-service travel management · New Delhi</p>
          <h1><span data-title-line><span>Travel well.</span></span><span data-title-line><span>Leave the details</span></span><span data-title-line><span>to us.</span></span></h1>
          <p className="hero-description" data-hero-fade>From the first conversation to the final transfer, we shape personal holidays and business journeys around you—with care, clarity, and dependable support.</p>
          <div className="hero-actions" data-hero-fade><Link className="button button--primary" to="/journeys">Find your next journey <ArrowRight size={18} /></Link><a className="text-link" href={whatsappUrl('Hello Vpathfinder, I would like help planning a personalized trip.')} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Chat with a travel expert</a></div>
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

function Destinations({ preview = false, onFilterChange }) {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? destinations : destinations.filter((item) => item.region === filter)
  const visible = preview ? destinations.slice(0, 4) : filtered
  return (
    <section id={preview ? undefined : 'destinations'} className="section destinations-section">
      <div className="shell">
        <div className="section-heading-row"><SectionIntro eyebrow="The world is waiting" title={<>Places that stay<br /><em>with you.</em></>} text="Destination inspiration for domestic and international escapes, each shaped around how you want to travel." />{preview ? <Link className="text-link text-link--dark" to="/destinations">Explore all destinations <ArrowRight size={17} /></Link> : <div className="filter-group" aria-label="Filter destinations">{['All', 'International', 'Domestic'].map((option) => <button key={option} className={filter === option ? 'active' : ''} aria-pressed={filter === option} onClick={() => { setFilter(option); onFilterChange?.() }}>{option}</button>)}</div>}</div>
        <div className={`destinations-grid ${preview || filter !== 'All' ? 'is-filtered' : ''} ${preview ? 'is-preview' : ''}`}>{visible.map((item, index) => <Link data-cinematic-card className={`destination-card destination-card--${index}`} key={item.name} to={`/destinations/${slugify(item.name)}`} aria-label={`Explore ${item.name}`} data-cursor="Explore"><SafeImage src={item.image} alt={`${item.name} travel destination`} loading="lazy" data-parallax="0.1" /><span className="image-overlay" /><span className="destination-code">{item.code} <ArrowUpRight size={16} /></span><span className="destination-content"><small>{item.region}</small><strong>{item.name}</strong><span>{item.note}</span></span></Link>)}</div>
      </div>
    </section>
  )
}

function Services({ onEnquiry, preview = false }) {
  const visible = preview ? services.slice(0, 4) : services
  return (
    <section id={preview ? undefined : 'services'} className="section services-section"><div className="shell services-layout"><div className="services-sticky"><SectionIntro eyebrow="Expertise, end to end" title={<>Everything travel.<br /><em>One trusted team.</em></>} text="Flights, stays, routes, and the small details in between—coordinated around your needs with one point of contact." light />{preview ? <Link className="button button--light" to="/services">Explore our services <ArrowRight size={17} /></Link> : <button className="button button--light" onClick={() => onEnquiry()}>Discuss your requirements <ArrowUpRight size={17} /></button>}</div><div className="service-list">{visible.map((service) => { const Icon = serviceIcons[service.icon]; return <button data-reveal className="service-row" key={service.title} onClick={() => onEnquiry(service.title)}><span className="service-icon"><Icon size={23} strokeWidth={1.6} /></span><span className="service-text"><strong>{service.title}</strong><span>{service.text}</span></span><ArrowUpRight className="service-arrow" size={20} /></button> })}</div></div></section>
  )
}

function TripIdeas({ preview = false }) {
  const visible = preview ? packages.slice(0, 3) : packages
  return (
    <section id={preview ? undefined : 'journeys'} className="section packages-section"><div className="shell"><div className="section-heading-row packages-heading"><SectionIntro eyebrow="Customizable trip ideas" title={<>A little inspiration.<br /><em>Entirely your journey.</em></>} /><p className="section-copy">These are conversation starters, not fixed packages. Your route, dates, stays, meals, transport, and pace are all planned with you.</p></div><div className="packages-grid">{visible.map((item) => <article className="package-card" key={item.name} data-cinematic-card><Link className="package-image" to={`/journeys/${slugify(item.name)}`} data-cursor="Discover"><SafeImage src={item.image} alt={`${item.name} inspiration`} loading="lazy" data-parallax="0.11" /><span className="package-badge">{item.badge}</span><span className="package-code">DEL <ArrowRight size={13} /> {item.code}</span></Link><div className="package-body"><div className="package-rating" aria-label="Featured trip idea"><Star size={13} fill="currentColor" /><span>TRIP IDEA</span></div><h3><Link to={`/journeys/${slugify(item.name)}`}>{item.name}</Link></h3><ul>{item.features.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul><div className="package-footer"><p><span>Indicative · per person</span><strong>{item.price}</strong></p><Link to={`/journeys/${slugify(item.name)}`} aria-label={`Explore ${item.name}`}><span>Explore the idea</span><ArrowUpRight size={19} /></Link></div></div></article>)}</div><div className="collection-footer"><p className="package-note">Starting prices are indicative and subject to dates and customization. Final arrangements and quotes are prepared directly with you.</p>{preview && <Link className="button button--secondary" to="/journeys">View all trip ideas <ArrowRight size={17} /></Link>}</div></div></section>
  )
}

function TravelStyles({ onEnquiry }) {
  return (
    <section className="section styles-section scroll-gallery"><div className="styles-sticky"><div className="shell"><div className="section-heading-row"><SectionIntro eyebrow="Closer to home" title={<>India, in every<br /><em>direction.</em></>} light /><div className="gallery-intro"><p className="section-copy">Mountains, backwaters, islands, and cities—scroll through the many ways to see India.</p><span>SCROLL TO EXPLORE <ArrowRight size={15} /></span></div></div><div className="styles-rail">{travelStyles.map((item) => <button className="style-card" key={item.name} onClick={() => onEnquiry(`${item.name} — customized India journey`)} data-cursor="Plan"><SafeImage src={item.image} alt={item.name} loading="lazy" data-parallax="0.08" /><span className="image-overlay" /><span className="style-code">{item.code}</span><span className="style-name">{item.name}<ArrowUpRight size={19} /></span></button>)}</div><div className="gallery-progress"><span /></div></div></div></section>
  )
}

function About({ onEnquiry, preview = false }) {
  return (
    <section id={preview ? undefined : 'about'} className="section about-section"><div className="shell about-grid"><div className="about-visual" data-reveal><SafeImage src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1400&q=85" alt="Traveller planning a journey with a map" loading="lazy" data-parallax="0.1" /><div className="about-image-label"><span>BASED IN NEW DELHI</span><span>AT HOME IN THE WORLD</span></div><div className="about-experience"><strong>5<span>+</span></strong><p>years of making<br />travel feel effortless</p></div></div><div className="about-content"><SectionIntro eyebrow="Meet Vpathfinder" title={<>Travel is personal.<br /><em>So is our approach.</em></>} /><p>Vpathfinder Travel Solutions is a full-service travel management company based in New Delhi NCR, serving corporate clients, inbound travellers, and holidaymakers with care and precision.</p><p>We combine travel proficiency, smart ticketing support, and destination partnerships to create thoughtful journeys without losing sight of comfort or your individual needs.</p><div className="about-specialities"><span>Corporate travel</span><span>Inbound tours</span><span>Airline tickets</span><span>Custom holidays</span></div>{preview ? <Link className="text-link text-link--dark" to="/about">Get to know your travel team <ArrowRight size={18} /></Link> : <button className="text-link text-link--dark" onClick={() => onEnquiry()}>Start a conversation <ArrowRight size={18} /></button>}</div></div><div className="shell proof-strip" data-reveal><div><strong>Personal</strong><span>Customized plans</span></div><div><strong>Responsive</strong><span>Travel support</span></div><div><strong>End-to-end</strong><span>Trip coordination</span></div><div><strong>One team</strong><span>For every detail</span></div></div></section>
  )
}

function JourneyCta({ onEnquiry }) {
  return <section className="journey-cta"><SafeImage src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=85" alt="Scenic mountain journey" loading="lazy" data-parallax="0.12" /><div className="journey-cta__overlay" /><div className="shell journey-cta__content" data-reveal><p className="eyebrow"><span />Your next chapter</p><h2>Where will life<br /><em>take you next?</em></h2><p>Tell us what you have in mind. We’ll shape the route, stays, and details around you.</p><button className="button button--light" onClick={() => onEnquiry()}>Start planning <ArrowUpRight size={18} /></button></div></section>
}

function FaqAnswer({ id, isOpen, children }) {
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

function Faq({ preview = false }) {
  const [openIndex, setOpenIndex] = useState(0)
  const visible = preview ? faqs.slice(0, 4) : faqs
  return <section id={preview ? undefined : 'faq'} className="section faq-section"><div className="shell faq-layout"><div className="faq-aside"><SectionIntro eyebrow="Good to know" title={<>Questions,<br /><em>answered.</em></>} text="The practical details before you set off. Need to know something else?" /><a className="text-link text-link--dark" href={whatsappUrl('Hello Vpathfinder, I have a travel question.')} target="_blank" rel="noreferrer">Ask us directly <MessageCircle size={17} /></a></div><div className="faq-list">{visible.map((item, index) => { const isOpen = openIndex === index; return <div className={`faq-item ${isOpen ? 'is-open' : ''}`} key={item.q}><h3><button aria-expanded={isOpen} aria-controls={`faq-answer-${index}`} onClick={() => setOpenIndex(isOpen ? -1 : index)}><span>{item.q}</span><ChevronDown size={20} /></button></h3><FaqAnswer id={`faq-answer-${index}`} isOpen={isOpen}>{item.a}</FaqAnswer></div> })}</div></div></section>
}

function Testimonials() {
  const visible = reviews.slice(0, 3)
  return <section className="section testimonials-section"><div className="shell"><div className="reviews-heading"><SectionIntro eyebrow="Verified public reviews" title={<>Real journeys.<br /><em>Genuine feedback.</em></>} align="center" /><a href={reviewSource} target="_blank" rel="noreferrer" className="review-rating"><strong>4.8</strong><span>on Google · 56 reviews<br /><small>Externally listed on Holidify · View source <ArrowUpRight size={12} /></small></span></a></div><div className="testimonial-grid">{visible.map((item) => <figure className="testimonial-card" key={item.name} data-reveal><Quote size={30} strokeWidth={1.2} /><blockquote>“{item.quote}”</blockquote><figcaption><span className="review-initials">{item.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><strong>{item.name}</strong><span>{item.trip}</span></div><a href={reviewSource} target="_blank" rel="noreferrer" aria-label={`Read ${item.name}'s review on Holidify`}><ArrowUpRight size={17} /></a></figcaption></figure>)}</div><a className="reviews-link" href={reviewSource} target="_blank" rel="noreferrer">Read more verified public reviews <ArrowUpRight size={15} /></a></div></section>
}

function Contact() {
  const [status, setStatus] = useState('')
  const submitContact = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    window.open(whatsappUrl(`Hello Vpathfinder, I would like a personalized travel plan.\n\nName: ${form.get('name')}\nPhone: ${form.get('phone')}\nEmail: ${form.get('email') || 'Not provided'}\nDestination: ${form.get('destination') || 'Open to suggestions'}\nService: ${form.get('service') || 'Travel planning'}\nPreferences / requirements: ${form.get('message') || 'Please contact me to discuss.'}`), '_blank', 'noopener,noreferrer')
    setStatus('Your enquiry is ready. Opening WhatsApp…')
  }
  return <section id="contact" className="section contact-section"><div className="shell contact-layout"><div className="contact-content"><SectionIntro eyebrow="Let’s make it happen" title={<>A remarkable trip<br /><em>starts with hello.</em></>} text="Share your destination, dates, and ideas. Our New Delhi team will shape the details with you." light /><div className="contact-details"><a href={`tel:${business.phone}`}><Phone size={20} /><span><small>Call our travel team</small>{business.phone} / {business.alternatePhone}</span><ArrowUpRight size={18} /></a><a href={`mailto:${business.email}`}><Mail size={20} /><span><small>Write to us</small>{business.email}</span><ArrowUpRight size={18} /></a><a href="https://www.google.com/maps/search/?api=1&query=M-2%2C%201st%20Floor%2C%20West%20Patel%20Nagar%2C%20New%20Delhi%20110008" target="_blank" rel="noreferrer"><MapPin size={20} /><span><small>Visit our office</small>{business.address}</span><ArrowUpRight size={18} /></a></div><div className="contact-hours"><span className="status-dot" /> Personalized travel planning and booking assistance</div></div><form className="contact-form" onSubmit={submitContact} data-reveal><div className="form-heading"><span>TRIP ENQUIRY</span><span>DEL <ArrowRight size={14} /> ANYWHERE</span></div><h3>Tell us about your journey.</h3><div className="form-grid"><label><span>Your name *</span><input name="name" autoComplete="name" placeholder="e.g. Rohan Sharma" required /></label><label><span>Phone number *</span><input name="phone" type="tel" autoComplete="tel" placeholder="Your contact number" required /></label><label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label><label><span>Destination</span><input name="destination" placeholder="Where would you like to go?" /></label><label className="form-grid__full"><span>How can we help?</span><select name="service" defaultValue=""><option value="">Select a service</option>{services.map((service) => <option key={service.title}>{service.title}</option>)}</select></label><label className="form-grid__full"><span>Your preferences</span><textarea name="message" rows="4" placeholder="Dates, travellers, pace, meal or transport preferences, budget, or anything else…" /></label></div><button className="button button--primary form-submit" type="submit">Send enquiry on WhatsApp <MessageCircle size={18} /></button><p className="form-privacy"><ShieldCheck size={14} /> Your details are only used to prepare your travel enquiry.</p><p className="form-status" role="status">{status}</p></form></div></section>
}

function Footer({ onEnquiry }) {
  return <footer className="footer"><div className="footer-wordmark" aria-hidden="true">VPATHFINDER</div><div className="shell footer-main"><div className="footer-brand"><Link to="/" aria-label="Back to Vpathfinder home"><img src="/images/vpathfinder-logo.webp" alt="Vpathfinder Travel Solutions" width="1218" height="804" /></Link><p>Thoughtful holidays, seamless business travel, and personalized support from New Delhi to the world.</p><button className="text-link" onClick={() => onEnquiry()}>Make an enquiry <ArrowUpRight size={17} /></button></div><div className="footer-column"><h3>Explore</h3>{navItems.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}<Link to="/contact">Contact</Link></div><div className="footer-column"><h3>Company</h3><Link to="/about">About Vpathfinder</Link><Link to="/faqs">FAQs</Link><a href={reviewSource} target="_blank" rel="noreferrer">Verified reviews</a><button onClick={() => onEnquiry()}>Custom trip enquiry</button></div><div className="footer-column footer-contact"><h3>New Delhi, India</h3><p>{business.address}</p><a href={`tel:${business.phone}`}>{business.phone}</a><a href={`tel:${business.alternatePhone}`}>{business.alternatePhone}</a><a href={`mailto:${business.email}`}>{business.email}</a></div></div><div className="shell footer-bottom"><p>© {new Date().getFullYear()} Vpathfinder Travel Solutions. All rights reserved.</p><p>WE MAKE YOUR DREAMS LIVE <Plane size={14} /></p></div></footer>
}

function EnquiryModal({ enquiry, onClose }) {
  const dialogRef = useRef(null), firstInputRef = useRef(null), backdropRef = useRef(null)
  const [status, setStatus] = useState('')
  const { lenis, reduced } = useMotion()

  const requestClose = useCallback(() => {
    if (reduced) {
      onClose()
      return
    }
    gsap.to(dialogRef.current, { y: 30, opacity: 0, duration: 0.25, ease: 'power2.in' })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, onComplete: onClose })
  }, [onClose, reduced])

  useEffect(() => {
    setStatus('')
    if (!enquiry) return undefined
    const previousFocus = document.activeElement, previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    if (!reduced) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(dialogRef.current, { y: 55, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'power4.out' })
    }
    const timer = window.setTimeout(() => firstInputRef.current?.focus(), 50)
    const onKeyDown = (event) => {
      if (event.key === 'Escape') requestClose()
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll('button, input, select, textarea, a[href]')
        if (!focusable?.length) return
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
      lenis?.start()
      window.removeEventListener('keydown', onKeyDown)
      gsap.killTweensOf([dialogRef.current, backdropRef.current])
      previousFocus?.focus()
    }
  }, [enquiry, lenis, reduced, requestClose])
  if (!enquiry) return null
  const submitEnquiry = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    window.open(whatsappUrl(`Hello Vpathfinder, I am interested in ${enquiry.context || 'a personalized journey'}.\n\nName: ${form.get('name')}\nPhone: ${form.get('phone')}\nDestination / service: ${form.get('destination')}\nPreferred date: ${form.get('date') || 'Flexible'}\nPreferences: ${form.get('message') || 'Please help me customize this journey.'}\n\nI understand all details will be planned with your team.`), '_blank', 'noopener,noreferrer')
    setStatus('Opening WhatsApp with your enquiry…')
  }
  return <div className="modal-backdrop" ref={backdropRef} data-lenis-prevent onMouseDown={(event) => event.target === event.currentTarget && requestClose()}><div className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" ref={dialogRef}><button className="modal-close icon-button" onClick={requestClose} aria-label="Close enquiry form"><X size={21} /></button><div className="modal-route"><span>DEL</span><i /><Plane size={18} /><i /><span>ANY</span></div><p className="eyebrow"><span />Let’s plan your journey</p><h2 id="enquiry-title">A few details.<br /><em>Endless possibilities.</em></h2><p className="modal-intro">Tell us what you have in mind. We’ll customize the journey with you on WhatsApp.</p><form onSubmit={submitEnquiry} key={enquiry.context}><div className="form-grid"><label><span>Your name *</span><input ref={firstInputRef} name="name" autoComplete="name" required placeholder="Your name" /></label><label><span>Phone number *</span><input name="phone" type="tel" autoComplete="tel" required placeholder="Your phone number" /></label><label className="form-grid__full"><span>Destination, trip idea, or service *</span><input name="destination" defaultValue={enquiry.context} required placeholder="What would you like to plan?" /></label><label className="form-grid__full"><span>Preferred travel date</span><input name="date" type="date" min={today} /></label><label className="form-grid__full"><span>Your preferences</span><textarea name="message" rows="3" placeholder="Travellers, pace, budget, meal or transport preferences…" /></label></div><div className="modal-form-actions"><button className="button button--primary form-submit" type="submit">Continue on WhatsApp <MessageCircle size={18} /></button><p className="form-status" role="status">{status}</p></div></form></div></div>
}

function FloatingActions() {
  const [showTop, setShowTop] = useState(false)
  const { lenis, reduced } = useMotion()
  useEffect(() => {
    const trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => setShowTop(self.scroll() > 700) })
    return () => trigger.kill()
  }, [])
  const toTop = () => lenis ? lenis.scrollTo(0, { duration: reduced ? 0 : 1.2 }) : window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  return <div className="floating-actions">{showTop && <button className="floating-button floating-button--top" onClick={toTop} aria-label="Back to top"><ArrowUp size={20} /></button>}<a className="floating-button floating-button--whatsapp" href={whatsappUrl('Hello Vpathfinder, I would like help planning a personalized trip.')} target="_blank" rel="noreferrer" aria-label="Chat with Vpathfinder on WhatsApp"><MessageCircle size={23} /><span>Let’s talk</span></a></div>
}

function App() {
  const [enquiry, setEnquiry] = useState(null)
  const [motionVersion, setMotionVersion] = useState(0)
  const location = useLocation()
  const pageRef = useRef(null)
  const { lenis } = useMotion()
  const openEnquiry = useCallback((context = '') => setEnquiry({ context }), [])
  const closeEnquiry = useCallback(() => setEnquiry(null), [])
  useCinematicScenes(pageRef, `${location.pathname}-${motionVersion}`)

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo({ top: 0, behavior: 'instant' })
    const [, section, slug] = location.pathname.split('/')
    const names = { destinations: 'Destinations', journeys: 'Trip Ideas', services: 'Travel Services', about: 'About Us', faqs: 'FAQs', contact: 'Contact Us' }
    const detail = section === 'destinations' ? destinations.find((item) => slugify(item.name) === slug) : section === 'journeys' ? packages.find((item) => slugify(item.name) === slug) : null
    const pageName = detail?.name || names[section] || 'Page not found'
    document.title = section ? `${pageName} | Vpathfinder` : 'Vpathfinder Travel Solutions | Travel Well'
    document.querySelector('meta[name="description"]')?.setAttribute('content', detail ? `Explore ${detail.name} with Vpathfinder. Every journey is customized around your preferences with personal planning support from New Delhi.` : 'Vpathfinder creates customized domestic and international journeys, corporate travel, flights, hotels, and inbound tours from New Delhi.')
  }, [location.pathname])

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a><ScrollProgress /><Header onEnquiry={openEnquiry} />
    <div className="page-transition" id="main-content" key={location.pathname} ref={pageRef}><Routes>
      <Route path="/" element={<><Hero /><Destinations preview /><TripIdeas preview /><Services onEnquiry={openEnquiry} preview /><TravelStyles onEnquiry={openEnquiry} /><About onEnquiry={openEnquiry} preview /><Testimonials /><JourneyCta onEnquiry={openEnquiry} /></>} />
      <Route path="/destinations" element={<main><PageHero eyebrow="Destination collection" title="Find your place" italic="in the world." text="Inspiration for international escapes and journeys across India, each customized around you." image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=85" /><Destinations onFilterChange={() => setMotionVersion((version) => version + 1)} /><TravelStyles onEnquiry={openEnquiry} /><JourneyCta onEnquiry={openEnquiry} /></main>} />
      <Route path="/destinations/:slug" element={<DestinationDetailPage onEnquiry={openEnquiry} />} />
      <Route path="/journeys" element={<main><PageHero eyebrow="Customizable trip ideas" title="Start with an idea." italic="Make it your own." text="No fixed templates. Use these journeys as inspiration, then shape every detail with your travel expert." image="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1800&q=85" /><TripIdeas /><PlanningProcess /><JourneyCta onEnquiry={openEnquiry} /></main>} />
      <Route path="/journeys/:slug" element={<PackageDetailPage onEnquiry={openEnquiry} />} />
      <Route path="/packages/*" element={<Navigate to="/journeys" replace />} />
      <Route path="/services" element={<main><PageHero eyebrow="Travel management" title="Every detail." italic="One trusted team." text="Corporate travel, flights, stays, tours, and on-ground support—coordinated around your requirements." image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=85" /><Services onEnquiry={openEnquiry} /><PlanningProcess /><JourneyCta onEnquiry={openEnquiry} /></main>} />
      <Route path="/about" element={<main><PageHero eyebrow="About Vpathfinder" title="Personal by design." italic="Professional by nature." text="A New Delhi travel management company built around thoughtful service and dependable support." image="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1800&q=85" /><About onEnquiry={openEnquiry} /><PlanningProcess /><Testimonials /><JourneyCta onEnquiry={openEnquiry} /></main>} />
      <Route path="/faqs" element={<main><PageHero eyebrow="Practical information" title="Before you" italic="set off." text="Answers to common questions about our services, customization, and travel support." image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85" /><Faq /><JourneyCta onEnquiry={openEnquiry} /></main>} />
      <Route path="/contact" element={<main><PageHero eyebrow="Contact Vpathfinder" title="Your journey starts" italic="with a conversation." text="Share your ideas and preferences. We’ll help you shape a journey that is entirely yours." image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85" /><Contact /></main>} />
      <Route path="*" element={<NotFound />} />
    </Routes></div>
    <Footer onEnquiry={openEnquiry} /><FloatingActions /><EnquiryModal enquiry={enquiry} onClose={closeEnquiry} /><CustomCursor />
  </>
}

export default App
