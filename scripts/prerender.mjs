import React from 'react'
import { build } from 'vite'
import { renderToString } from 'react-dom/server'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const outputRoot = join(root, 'dist')
const escapeHtml = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const meta = (attribute, name, content) => `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`

function renderHead(seo, responsiveImageUrl, responsiveSrcSet) {
  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    meta('name', 'description', seo.description),
    meta('name', 'robots', seo.robots),
    meta('property', 'og:title', seo.title),
    meta('property', 'og:description', seo.description),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', 'Vpathfinder Travel Solutions'),
    meta('property', 'og:locale', 'en_IN'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', seo.title),
    meta('name', 'twitter:description', seo.description),
  ]
  if (seo.canonical) {
    tags.push(`<link rel="canonical" href="${seo.canonical}" />`, meta('property', 'og:url', seo.canonical))
  }
  if (seo.image) {
    tags.push(
      meta('property', 'og:image', seo.image),
      meta('property', 'og:image:alt', seo.imageAlt),
      meta('name', 'twitter:image', seo.image),
      meta('name', 'twitter:image:alt', seo.imageAlt),
      `<link rel="preload" as="image" href="${escapeHtml(responsiveImageUrl(seo.image))}" imagesrcset="${escapeHtml(responsiveSrcSet(seo.image))}" imagesizes="125vw" fetchpriority="high" data-route-image-preload />`,
    )
  }
  if (seo.structuredData) {
    tags.push(`<script type="application/ld+json" data-route-structured-data>${JSON.stringify(seo.structuredData).replace(/</g, '\\u003c')}</script>`)
  }
  return tags.join('\n    ')
}

async function renderApp(ServerApp, preloadInitialRoute, url) {
  await preloadInitialRoute(url)
  return renderToString(React.createElement(ServerApp, { url }))
}

const prerenderRoot = join(root, '.prerender')
try {
  await build({
    root,
    logLevel: 'silent',
    build: {
      ssr: 'src/entry-server.jsx',
      outDir: prerenderRoot,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
    },
  })
  const { default: ServerApp, publicRoutes, getRouteSeo, absoluteUrl, siteOrigin, responsiveImageUrl, responsiveSrcSet, preloadInitialRoute } = await import(pathToFileURL(join(prerenderRoot, 'entry-server.mjs')).href)
  const template = await readFile(join(outputRoot, 'index.html'), 'utf8')
  const pages = [...publicRoutes.map((route) => route.path), '/404.html']
  for (const path of pages) {
    const isNotFound = path === '/404.html'
    const url = isNotFound ? '/404' : path
    const appHtml = await renderApp(ServerApp, preloadInitialRoute, url)
    if (!appHtml.includes('<main')) throw new Error(`Prerender produced no main content for ${url}`)
    const html = template
      .replace('<!--seo-head-->', () => renderHead(getRouteSeo(url), responsiveImageUrl, responsiveSrcSet))
      .replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`)
    const outputPath = isNotFound ? join(outputRoot, '404.html') : path === '/' ? join(outputRoot, 'index.html') : join(outputRoot, path, 'index.html')
    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, html)
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicRoutes.map((route) => `  <url><loc>${absoluteUrl(route.path)}</loc></url>`).join('\n')}\n</urlset>\n`
  await writeFile(join(outputRoot, 'sitemap.xml'), sitemap)
  await writeFile(join(outputRoot, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`)
  console.log(`Prerendered ${publicRoutes.length} public routes plus 404; generated robots.txt and sitemap.xml.`)
} finally {
  await rm(prerenderRoot, { recursive: true, force: true })
}
