import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowUp, ArrowUpRight, Mail, MapPin, Menu, MessageCircle, Moon,
  Phone, Plane, Sun, X,
} from 'lucide-react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { business, navItems } from './data.js'
import { reviewSource } from './reviews.js'
import { CustomCursor, ScrollProgress, useCinematicScenes, useMotion } from './motion.jsx'
import { applyRouteMetadata } from './seo.js'
import { GoogleMapsLink, today, whatsappUrl } from './ui.jsx'
import {
  AboutPage, ContactPage, DestinationDetailPage, DestinationsPage, FaqsPage,
  HomePage, JourneysPage, NotFound, PackageDetailPage, ServicesPage,
} from './routeComponents.js'

function ThemeToggle() {
  const [theme, setTheme] = useState('light')
  useEffect(() => setTheme(document.documentElement.dataset.theme || 'light'), [])
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
    if (!reduced && window.innerWidth <= 1100) {
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

  const isActive = (href) => location.pathname.startsWith(href)
  const closeMenu = useCallback(() => {
    if (!menuOpen || reduced || window.innerWidth > 1100) {
      setMenuOpen(false)
      return
    }
    gsap.to(menuRef.current, { xPercent: 100, duration: 0.4, ease: 'power3.in', onComplete: () => setMenuOpen(false) })
  }, [menuOpen, reduced])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="contact-strip">
        <div className="shell contact-strip__inner">
          <a className="contact-strip__location" href={business.googleMaps} target="_blank" rel="noreferrer" aria-label="View Vpathfinder office on Google Maps (opens in a new tab)"><MapPin size={13} /> West Patel Nagar, New Delhi <span className="contact-strip__map-action">View on Google Maps <ArrowUpRight size={12} /></span></a>
          <div><a href={`tel:${business.phone}`}><Phone size={13} /> {business.phone}</a><a href={`mailto:${business.email}`}><Mail size={13} /> {business.email}</a></div>
        </div>
      </div>
      <div className="navigation-shell">
        <div className="shell navbar">
          <Link className="brand" to="/" aria-label="Vpathfinder Travel Solutions home"><img src="/images/vpathfinder-logo.webp" alt="Vpathfinder Travel Solutions" width="1218" height="804" /></Link>
          <nav id="primary-navigation" ref={menuRef} className={`nav-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
            <div className="mobile-nav-heading"><span>Explore Vpathfinder</span><button className="icon-button" onClick={closeMenu} aria-label="Close navigation"><X size={22} /></button></div>
            {navItems.map((item) => <Link key={item.href} to={item.href} onClick={closeMenu} className={isActive(item.href) ? 'active' : ''}>{item.label}</Link>)}
            <Link to="/contact/" onClick={closeMenu} className={isActive('/contact/') ? 'active' : ''}>Contact</Link>
            <button className="button button--primary mobile-nav-cta" onClick={() => { setMenuOpen(false); onEnquiry() }}>Plan a journey <ArrowUpRight size={17} /></button>
            <div className="mobile-nav-foot"><GoogleMapsLink className="mobile-map-link" /><p>New Delhi office<br />Travel, thoughtfully arranged.</p></div>
          </nav>
          <div className="nav-actions"><ThemeToggle /><button className="button button--primary desktop-nav-cta" onClick={() => onEnquiry()}>Plan a journey <ArrowUpRight size={17} /></button><button className="menu-toggle" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(true)}><Menu size={24} /></button></div>
        </div>
      </div>
      {menuOpen && <button className="nav-backdrop" aria-label="Close navigation" onClick={closeMenu} />}
    </header>
  )
}

function Footer({ onEnquiry }) {
  return <footer className="footer"><div className="footer-wordmark" aria-hidden="true">VPATHFINDER</div><div className="shell footer-main"><div className="footer-brand"><Link to="/" aria-label="Back to Vpathfinder home"><img src="/images/vpathfinder-logo.webp" alt="Vpathfinder Travel Solutions" width="1218" height="804" /></Link><p>Thoughtful holidays, seamless business travel, and personalized support from New Delhi to the world.</p><button className="text-link" onClick={() => onEnquiry()}>Make an enquiry <ArrowUpRight size={17} /></button></div><div className="footer-column"><h3>Explore</h3>{navItems.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}<Link to="/contact/">Contact</Link></div><div className="footer-column"><h3>Company</h3><Link to="/about/">About Vpathfinder</Link><Link to="/faqs/">FAQs</Link><a href={reviewSource} target="_blank" rel="noreferrer">Verified reviews</a><button onClick={() => onEnquiry()}>Custom trip enquiry</button></div><div className="footer-column footer-contact"><h3>New Delhi, India</h3><p>{business.address}</p><GoogleMapsLink className="footer-map-link" /><a href={`tel:${business.phone}`}>{business.phone}</a><a href={`tel:${business.alternatePhone}`}>{business.alternatePhone}</a><a href={`mailto:${business.email}`}>{business.email}</a></div></div><div className="shell footer-bottom"><p>© {new Date().getFullYear()} Vpathfinder Travel Solutions. All rights reserved.</p><p>WE MAKE YOUR DREAMS LIVE <Plane size={14} /></p></div></footer>
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
      gsap.fromTo(dialogRef.current, { y: 55, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power4.out' })
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
    applyRouteMetadata(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    const root = pageRef.current
    if (!root || root.querySelector('main')) return undefined
    const observer = new MutationObserver(() => {
      if (!root.querySelector('main')) return
      observer.disconnect()
      setMotionVersion((version) => version + 1)
    })
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [location.pathname])

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a><ScrollProgress /><Header onEnquiry={openEnquiry} />
    <div className="page-transition" id="main-content" key={location.pathname} ref={pageRef}><Suspense fallback={null}><Routes>
      <Route path="/" element={<HomePage onEnquiry={openEnquiry} />} />
      <Route path="/destinations" element={<DestinationsPage onEnquiry={openEnquiry} onFilterChange={() => setMotionVersion((version) => version + 1)} />} />
      <Route path="/destinations/:slug" element={<DestinationDetailPage onEnquiry={openEnquiry} />} />
      <Route path="/journeys" element={<JourneysPage onEnquiry={openEnquiry} />} />
      <Route path="/journeys/:slug" element={<PackageDetailPage onEnquiry={openEnquiry} />} />
      <Route path="/packages/*" element={<Navigate to="/journeys/" replace />} />
      <Route path="/services" element={<ServicesPage onEnquiry={openEnquiry} />} />
      <Route path="/about" element={<AboutPage onEnquiry={openEnquiry} />} />
      <Route path="/faqs" element={<FaqsPage onEnquiry={openEnquiry} />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes></Suspense></div>
    <Footer onEnquiry={openEnquiry} /><FloatingActions /><EnquiryModal enquiry={enquiry} onClose={closeEnquiry} /><CustomCursor />
  </>
}

export default App
