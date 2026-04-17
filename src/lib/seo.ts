export const SITE_URL = "https://www.amortization.in"
const SITE_NAME = "Amortization.in"
const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.png`
const JSON_LD_ID = "route-json-ld"

function upsertMetaByName(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement("meta")
    tag.setAttribute("name", name)
    document.head.appendChild(tag)
  }
  tag.setAttribute("content", content)
}

function upsertMetaByProperty(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement("meta")
    tag.setAttribute("property", property)
    document.head.appendChild(tag)
  }
  tag.setAttribute("content", content)
}

function upsertCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!link) {
    link = document.createElement("link")
    link.setAttribute("rel", "canonical")
    document.head.appendChild(link)
  }
  link.setAttribute("href", href)
}

function upsertJsonLd(schema?: Record<string, unknown>) {
  let scriptTag = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null
  if (!schema) {
    if (scriptTag) scriptTag.remove()
    return
  }
  if (!scriptTag) {
    scriptTag = document.createElement("script")
    scriptTag.id = JSON_LD_ID
    scriptTag.type = "application/ld+json"
    document.head.appendChild(scriptTag)
  }
  scriptTag.textContent = JSON.stringify(schema)
}

export function applySeoTags({
  title,
  description,
  canonicalPath,
  schema,
  ogType,
  ogImage,
}: {
  title: string
  description: string
  canonicalPath: string
  schema?: Record<string, unknown>
  ogType?: string
  ogImage?: string
}) {
  const canonicalUrl = `${SITE_URL}${canonicalPath}`
  const image = ogImage ?? DEFAULT_OG_IMAGE
  document.title = title
  upsertCanonical(canonicalUrl)
  upsertMetaByName("description", description)
  upsertMetaByName("robots", "index, follow")
  upsertMetaByProperty("og:type", ogType ?? "website")
  upsertMetaByProperty("og:site_name", SITE_NAME)
  upsertMetaByProperty("og:title", title)
  upsertMetaByProperty("og:description", description)
  upsertMetaByProperty("og:url", canonicalUrl)
  upsertMetaByProperty("og:image", image)
  upsertMetaByName("twitter:card", "summary_large_image")
  upsertMetaByName("twitter:title", title)
  upsertMetaByName("twitter:description", description)
  upsertMetaByName("twitter:image", image)
  upsertJsonLd(schema)
}
