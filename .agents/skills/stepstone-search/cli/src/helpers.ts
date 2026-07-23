// Data source: stepstone.de server-rendered HTML pages. No official JSON API found.
// Search results live in stable data-at="job-item-*" attributes on each <article> card.
// Detail pages embed a full schema.org/JobPosting JSON-LD block, which we parse
// directly instead of scraping the rendered HTML (far more reliable).
//
// robots.txt disallows /jobs/*?* except /jobs/*?q=* — so pagination via ?page=N is
// off-limits. Only page 1 (the site's fixed ~25-result page) is fetched. Location is
// passed via a path segment (/in-<city>), which is not a query string and is allowed.
//
// The detail endpoint (/stellenangebote--...--<id>-inline.html) appears to apply basic
// bot-detection: requests without a browser-like Accept/Accept-Language/Referer set
// hang indefinitely rather than erroring. Both search and detail fetches send those
// headers for reliability.

export const BASE_URL = "https://www.stepstone.de"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/122.0 Safari/537.36"

/** Fetch HTML with exponential backoff on 429/5xx. Returns "" on a 404. */
export async function htmlFetch(url: string, referer?: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
        ...(referer ? { Referer: referer } : {}),
      },
      redirect: "follow",
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return ""
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.text()
  }
  throw new Error("Request failed after max retries")
}

export interface JobCard {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null // ISO date, best-effort from the relative "vor X Tagen" text
  postedRelative: string | null // raw German relative-time text, e.g. "vor 3 Tagen"
  url: string
}

export interface JobDetail {
  id: string
  title: string
  company: string | null
  companyUrl: string | null
  location: string | null
  date: string | null // datePosted, ISO
  deadline: string | null // validThrough, ISO
  employmentType: string | null
  industry: string | null
  description: string | null
  url: string
}

/** Lowercase, hyphenate, strip characters StepStone's slug URLs don't use. */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-äöüß]/gi, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Build the search page URL. Location is a path segment, not a query param
 *  (query params other than ?q= are disallowed by robots.txt). */
export function buildSearchUrl(query: string, location?: string): string {
  const parts = [slugify(query)]
  if (location) parts.push(`in-${slugify(location)}`)
  return `${BASE_URL}/jobs/${parts.map(encodeURIComponent).join("/")}`
}

/** Build a detail page URL. StepStone only routes on the trailing numeric ID —
 *  the slug text before it is ignored server-side, confirmed by live testing. */
export function buildDetailUrl(id: string): string {
  return `${BASE_URL}/stellenangebote--job--${id}-inline.html`
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
}

/**
 * Remove <style>...</style> blocks (emotion CSS-in-JS, whose *content* is not
 * itself wrapped in tags and would otherwise survive naive tag-stripping) and
 * inline SVG icons. Must run on a large-enough span to reach each tag's closing
 * ">" — path "d" attributes routinely run past 300-400 characters, so stripping
 * icons only inside a small post-marker window (rather than the whole card
 * chunk) leaves unclosed, unmatched "<path ...>" fragments behind as text.
 */
function stripNoise(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<path[^>]*\/?>/gi, " ")
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "|")
}

/** First non-empty, non-CSS text chunk after a marker position, within an
 *  already-noise-stripped chunk. */
function firstText(cleanedHtml: string, fromIndex: number, window = 600): string | null {
  const slice = stripTags(cleanedHtml.slice(fromIndex, fromIndex + window))
  for (const part of slice.split("|")) {
    const trimmed = decodeHtmlEntities(part).trim()
    if (trimmed && !trimmed.startsWith(".res-") && !trimmed.startsWith("@media")) {
      return trimmed
    }
  }
  return null
}

/** Best-effort conversion of German relative-time text ("vor 3 Tagen", "vor 19
 *  Stunden", "vor 2 Wochen") into an ISO date. Returns null if unparseable. */
function relativeGermanToISO(text: string): string | null {
  const m = text.match(/vor\s+(\d+)\s+(Stunde|Stunden|Tag|Tagen|Woche|Wochen|Monat|Monaten)/i)
  if (!m) return null
  const n = parseInt(m[1], 10)
  const unit = m[2].toLowerCase()
  const msPerUnit = unit.startsWith("stunde")
    ? 3_600_000
    : unit.startsWith("tag")
      ? 86_400_000
      : unit.startsWith("woche")
        ? 7 * 86_400_000
        : 30 * 86_400_000 // monat
  return new Date(Date.now() - n * msPerUnit).toISOString()
}

/** Days between now and an ISO date, rounded down. */
export function daysAgo(iso: string | null): number | null {
  if (!iso) return null
  const diff = Date.now() - new Date(iso).getTime()
  return Math.max(0, Math.floor(diff / 86_400_000))
}

/**
 * Parse the search results page: one <article data-at="job-item" id="job-item-<id>">
 * per card. Split into per-card chunks so one malformed card cannot break the rest.
 */
export function parseJobCards(html: string): JobCard[] {
  const results: JobCard[] = []
  const starts = [...html.matchAll(/<article[^>]*\bid="job-item-(\d+)"/g)]

  for (let i = 0; i < starts.length; i++) {
    const id = starts[i][1]
    const start = starts[i].index ?? 0
    const end = i + 1 < starts.length ? (starts[i + 1].index ?? html.length) : html.length
    // Strip style/svg noise from the whole card chunk before locating markers -
    // stripping only a small window after each marker leaves unmatched, unclosed
    // "<path ...>" fragments behind (see stripNoise's doc comment).
    const chunk = stripNoise(html.slice(start, end))

    const titleMarker = chunk.match(/<a\b[^>]*\bdata-at="job-item-title"[^>]*>/)
    let title: string | null = null
    let href: string | null = null
    if (titleMarker) {
      const hrefMatch = titleMarker[0].match(/href="([^"]+)"/)
      href = hrefMatch ? decodeHtmlEntities(hrefMatch[1]) : null
      title = firstText(chunk, titleMarker.index! + titleMarker[0].length)
    }
    if (!title) continue

    const companyMarker = chunk.match(/data-at="job-item-company-name"[^>]*>/)
    const company = companyMarker
      ? firstText(chunk, companyMarker.index! + companyMarker[0].length)
      : null

    const locationMarker = chunk.match(/data-at="job-item-location"[^>]*>/)
    const location = locationMarker
      ? firstText(chunk, locationMarker.index! + locationMarker[0].length)
      : null

    const timeMarker = chunk.match(/data-at="job-item-timeago"[^>]*>/)
    const postedRelative = timeMarker
      ? firstText(chunk, timeMarker.index! + timeMarker[0].length)
      : null

    results.push({
      id,
      title,
      company,
      location,
      date: postedRelative ? relativeGermanToISO(postedRelative) : null,
      postedRelative,
      url: href ? (href.startsWith("http") ? href : `${BASE_URL}${href}`) : buildDetailUrl(id),
    })
  }

  return results
}

/** Parse a detail page's embedded schema.org/JobPosting JSON-LD block. */
export function parseJobDetail(html: string, id: string): JobDetail | null {
  const match = html.match(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  )
  if (!match) return null

  let data: any
  try {
    data = JSON.parse(match[1])
  } catch {
    return null
  }
  if (data["@type"] !== "JobPosting") return null

  const addr = data.jobLocation?.address
  const location = addr
    ? [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean).join(", ")
    : null

  const rawDescription = typeof data.description === "string" ? data.description : null
  const description = rawDescription
    ? decodeHtmlEntities(
        stripTags(
          rawDescription
            .replace(/<\s*br\s*\/?>/gi, "\n")
            .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n"),
        )
          .replace(/\|/g, ""),
      )
        .replace(/\n{3,}/g, "\n\n")
        .trim() || null
    : null

  return {
    id,
    title: data.title ?? "(untitled)",
    company: data.hiringOrganization?.name ?? null,
    companyUrl: data.hiringOrganization?.url ?? null,
    location,
    date: data.datePosted ?? null,
    deadline: data.validThrough ?? null,
    employmentType: data.employmentType ?? null,
    industry: data.industry ?? null,
    description,
    url: data.url ?? buildDetailUrl(id),
  }
}
