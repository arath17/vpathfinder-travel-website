import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MotionContext = createContext({ lenis: null, reduced: false })

export function MotionProvider({ children }) {
  const [lenis, setLenis] = useState(null)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduced) return undefined
    const instance = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
    })
    const update = (time) => instance.raf(time * 1000)
    instance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    return () => {
      gsap.ticker.remove(update)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  const value = useMemo(() => ({ lenis, reduced }), [lenis, reduced])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotion() {
  return useContext(MotionContext)
}

export function useCinematicScenes(rootRef, routeKey) {
  const { reduced } = useMotion()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    let active = true
    let refreshFrame

    if (reduced) {
      const elements = root.querySelectorAll('[data-reveal], [data-cinematic-card], [data-title-line] > span, [data-hero-fade]')
      if (elements.length) {
        gsap.set(elements, { clearProps: 'opacity,transform,clipPath,visibility' })
      }
      return undefined
    }

    const context = gsap.context(() => {
      const hero = root.querySelector('.hero, .page-hero')
      const heroImage = hero?.querySelector('[data-parallax]')
      const titleLines = root.querySelectorAll('[data-title-line] > span')
      const heroFade = root.querySelectorAll('[data-hero-fade]')

      if (hero) {
        const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
        intro
          .fromTo(hero, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.25 }, 0)
          .fromTo(heroImage, { scale: 1.22 }, { scale: 1.08, duration: 1.8 }, 0)
          .fromTo(titleLines, { yPercent: 115 }, { yPercent: 0, duration: 1.15, stagger: 0.11 }, 0.35)
          .fromTo(heroFade, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07 }, 0.7)

        if (heroImage) {
          gsap.to(heroImage, {
            yPercent: 13,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.65 },
          })
        }
      }

      root.querySelectorAll('[data-reveal]').forEach((element) => {
        if (hero?.contains(element) || element.closest('.services-section')) return
        gsap.fromTo(element, { y: 56, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
      })

      const servicesSection = root.querySelector('.services-section')
      if (servicesSection) {
        const introItems = servicesSection.querySelectorAll('.services-sticky .section-intro, .services-sticky > .button')
        const rows = servicesSection.querySelectorAll('.service-row')
        gsap.timeline({
          scrollTrigger: { trigger: servicesSection, start: 'top 82%', toggleActions: 'play none none reverse' },
        })
          .fromTo(introItems, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }, 0)
          .fromTo(rows, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.08)
      }

      root.querySelectorAll('[data-cinematic-card]').forEach((card) => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.55 },
        })
        timeline
          .fromTo(card,
            { clipPath: 'inset(13% 0 13% 0 round 32px)', y: 76, scale: 0.96, opacity: 0.42 },
            { clipPath: 'inset(0% 0 0% 0 round 28px)', y: 0, scale: 1, opacity: 1, duration: 0.22, ease: 'none' },
          )
          .to(card, { clipPath: 'inset(0% 0 0% 0 round 28px)', duration: 0.6 })
          .to(card, { clipPath: 'inset(11% 0 11% 0 round 32px)', y: -52, scale: 0.97, opacity: 0.48, duration: 0.18, ease: 'none' })
      })

      root.querySelectorAll('[data-parallax]').forEach((image) => {
        if (image === heroImage || image.closest('.scroll-gallery')) return
        const amount = Math.min(14, Math.max(6, Number(image.dataset.parallax || 0.1) * 100))
        gsap.fromTo(image, { yPercent: -amount }, {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: image.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      const gallery = root.querySelector('.scroll-gallery')
      if (gallery) {
        const track = gallery.querySelector('.styles-rail')
        const progress = gallery.querySelector('.gallery-progress span')
        const cards = [...gallery.querySelectorAll('.style-card')]
        const distance = () => Math.max(1, track.scrollWidth - window.innerWidth + window.innerWidth * 0.12)
        const mm = gsap.matchMedia()
        mm.add('(min-width: 901px)', () => {
          const sizeGallery = () => { gallery.style.height = `${window.innerHeight + distance()}px` }
          sizeGallery()
          ScrollTrigger.addEventListener('refresh', sizeGallery)
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: gallery,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          })
          timeline
            .to(track, { x: () => -distance(), ease: 'none' }, 0)
            .fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
          cards.forEach((card) => {
            gsap.fromTo(card.querySelector('img'), { xPercent: -7, yPercent: -3 }, {
              xPercent: 7,
              yPercent: 3,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: timeline,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            })
          })
          return () => {
            ScrollTrigger.removeEventListener('refresh', sizeGallery)
            gallery.style.removeProperty('height')
          }
        })
        mm.add('(max-width: 900px)', () => {
          let frame
          const update = () => {
            frame = undefined
            const bounds = gallery.getBoundingClientRect()
            const verticalProgress = gsap.utils.clamp(0, 1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height))
            cards.forEach((card) => {
              const cardBounds = card.getBoundingClientRect()
              const horizontalProgress = gsap.utils.clamp(-1, 1, (cardBounds.left + cardBounds.width / 2 - window.innerWidth / 2) / ((window.innerWidth + cardBounds.width) / 2))
              gsap.set(card.querySelector('img'), { xPercent: horizontalProgress * -7, yPercent: -4 + verticalProgress * 8 })
            })
          }
          const requestUpdate = () => {
            if (!frame) frame = requestAnimationFrame(update)
          }
          track.addEventListener('scroll', requestUpdate, { passive: true })
          window.addEventListener('scroll', requestUpdate, { passive: true })
          window.addEventListener('resize', requestUpdate)
          update()
          return () => {
            track.removeEventListener('scroll', requestUpdate)
            window.removeEventListener('scroll', requestUpdate)
            window.removeEventListener('resize', requestUpdate)
            if (frame) cancelAnimationFrame(frame)
          }
        })
        return () => mm.revert()
      }
      return undefined
    }, root)

    refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
    document.fonts?.ready.then(() => active && ScrollTrigger.refresh())
    const images = [...root.querySelectorAll('img')]
    const refresh = () => active && ScrollTrigger.refresh()
    images.forEach((image) => image.complete || image.addEventListener('load', refresh, { once: true }))

    return () => {
      active = false
      if (refreshFrame) cancelAnimationFrame(refreshFrame)
      images.forEach((image) => image.removeEventListener('load', refresh))
      context.revert()
    }
  }, [rootRef, routeKey, reduced])
}

export function ScrollProgress() {
  const barRef = useRef(null)
  const { reduced } = useMotion()

  useLayoutEffect(() => {
    if (reduced) return undefined
    const context = gsap.context(() => {
      gsap.fromTo(barRef.current, { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.25 },
      })
    })
    return () => context.revert()
  }, [reduced])

  return <div className="scroll-progress" aria-hidden="true"><span ref={barRef} /></div>
}

export function CustomCursor() {
  const cursorRef = useRef(null)
  const labelRef = useRef(null)
  const { reduced } = useMotion()

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    if (reduced || !media.matches) return undefined
    const cursor = cursorRef.current
    const label = labelRef.current
    const root = document.documentElement
    root.classList.add('has-custom-cursor')
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -100, y: -100 })
    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.32, ease: 'power3.out' })
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.32, ease: 'power3.out' })

    const onMove = (event) => {
      moveX(event.clientX)
      moveY(event.clientY)
      gsap.to(cursor, { opacity: 1, duration: 0.18, overwrite: 'auto' })
    }
    const onOver = (event) => {
      const target = event.target.closest('a, button, [data-cursor]')
      const formField = event.target.closest('input, textarea, select')
      if (formField) {
        gsap.to(cursor, { opacity: 0, duration: 0.15 })
        return
      }
      if (!target) {
        gsap.to(cursor, { width: 12, height: 12, duration: 0.25 })
        gsap.to(label, { opacity: 0, duration: 0.12 })
        return
      }
      const text = target.dataset.cursor || ''
      label.textContent = text
      gsap.to(cursor, { width: text ? 76 : 44, height: text ? 76 : 44, duration: 0.3, ease: 'power3.out' })
      gsap.to(label, { opacity: text ? 1 : 0, duration: 0.2 })
    }
    const onLeave = () => gsap.to(cursor, { opacity: 0, duration: 0.2 })
    const onDown = () => gsap.to(cursor, { scale: 0.82, duration: 0.15 })
    const onUp = () => gsap.to(cursor, { scale: 1, duration: 0.2 })

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', onUp)
    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      gsap.killTweensOf([cursor, label])
    }
  }, [reduced])

  if (reduced) return null
  return <div className="custom-cursor" ref={cursorRef} aria-hidden="true"><span ref={labelRef} /></div>
}
