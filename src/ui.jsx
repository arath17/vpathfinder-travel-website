import { useEffect, useState } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { business } from './data.js'
import { defaultImageWidths, fallbackImage, responsiveImageUrl, responsiveSrcSet } from './imageUtils.js'

export const whatsappUrl = (message) => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`
export const today = new Date().toLocaleDateString('en-CA')
export const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function GoogleMapsLink({ href = business.googleMaps, className = '', label = 'View on Google Maps' }) {
  return <a className={`google-maps-link ${className}`} href={href} target="_blank" rel="noreferrer" aria-label="View Vpathfinder office on Google Maps (opens in a new tab)"><MapPin size={16} /><span>{label}</span><ArrowUpRight size={15} /></a>
}

export function SafeImage({ src, alt, sizes = '100vw', widths = defaultImageWidths, decoding = 'async', ...props }) {
  const [source, setSource] = useState(src)
  useEffect(() => setSource(src), [src])
  return <img
    src={responsiveImageUrl(source)}
    srcSet={responsiveSrcSet(source, widths)}
    sizes={sizes}
    alt={alt}
    width="1200"
    height="800"
    decoding={decoding}
    onError={() => source !== fallbackImage && setSource(fallbackImage)}
    {...props}
  />
}

export function SectionIntro({ eyebrow, title, text, align = 'left', light = false }) {
  return (
    <div className={`section-intro section-intro--${align} ${light ? 'section-intro--light' : ''}`} data-reveal>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="section-copy">{text}</p>}
    </div>
  )
}
