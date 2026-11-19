export const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=90'
export const defaultImageWidths = [480, 768, 1200, 1600, 2000, 2560, 3200, 3840]

export function responsiveImageUrl(source, width = 2000) {
  try {
    const url = new URL(source)
    if (url.hostname !== 'images.unsplash.com') return source
    url.searchParams.set('w', String(width))
    url.searchParams.set('q', '90')
    return url.toString()
  } catch {
    return source
  }
}

export function responsiveSrcSet(source, widths = defaultImageWidths) {
  try {
    if (new URL(source).hostname !== 'images.unsplash.com') return undefined
  } catch {
    return undefined
  }
  return widths.map((width) => `${responsiveImageUrl(source, width)} ${width}w`).join(', ')
}
