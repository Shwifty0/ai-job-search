# StepStone URL Reference

No official JSON API was found during investigation (no `/api/` XHR endpoints in the
search page's source). This skill parses server-rendered HTML directly. Recorded here
so a future maintainer can update the parsers when stepstone.de changes its markup.

> Personal use only — automated access should stay low-volume; robots.txt limits are
> hard-enforced by the CLI (see below), not just documented.

## robots.txt (checked 2026-07-18)

Relevant rules:

```
Disallow: /?*
Disallow: /*?*
Disallow: /jobs/vollzeit/
Disallow: /jobs/teilzeit/
Disallow: /jobs/*?*
Disallow: /cmp/*/jobs/*/in-*
Disallow: /search-results
Disallow: /search-results/*
Disallow: /application/
Disallow: /onboarding/*
Disallow: /listing
Disallow: /listing/*
Allow: /jobs/*?q=*
Allow: /cmp/*/jobs/*?q=*
Allow: /5/index.cfm?event=offerView.dsp*
Allow: /?lang=*
```

No `Sitemap:` directive present.

**Implication:** `/jobs/<slug>` with no query string (page 1) is allowed. `/jobs/<slug>?page=2`
is disallowed (`/jobs/*?*`, and `?page=` doesn't match the `?q=*` exception) — this skill
therefore only fetches page 1 and refuses higher page numbers rather than silently
violating the rule. `/stellenangebote--...--<id>-inline.html` detail pages are not
matched by any Disallow rule and are fetched normally.

## Search

```
GET https://www.stepstone.de/jobs/<query-slug>[/in-<location-slug>]
```

- `<query-slug>`: the search query, lowercased, spaces replaced with hyphens, then
  `encodeURIComponent`-ed. Verified live with both English and German multi-word
  queries (e.g. `werkstudent-machine-learning`, `python-backend-entwickler`) — the
  site accepts arbitrary free-text slugs, not just a fixed taxonomy.
- `/in-<location-slug>`: optional. Location is a **path segment, not a query
  parameter** — StepStone has no `?location=` param, and appending one to `/jobs/`
  would in any case violate the `/jobs/*?*` robots.txt rule. Verified live: `/in-hamburg`
  correctly scopes results to Hamburg (page `<title>` confirms the city and result count).
- No further query-string pagination or filtering is used, to stay within robots.txt.

### Response structure

Server-rendered HTML. Each result is an `<article data-at="job-item" id="job-item-<id>">`.
Within each card:

| Field | Anchor |
|-------|--------|
| id | `id="job-item-<N>"` on the `<article>` |
| title | `<a data-at="job-item-title" href="...">` — href is `/stellenangebote--<slug>--<id>-inline.html` |
| company | `data-at="job-item-company-name"` |
| location | `data-at="job-item-location"` |
| posted (relative) | `data-at="job-item-timeago"` — German relative text, e.g. `vor 3 Tagen`, `vor 1 Woche` |

**Parsing pitfall:** each `data-at` marker is immediately followed by emotion
CSS-in-JS `<style>` blocks and inline SVG icons (`<svg><path d="..."/></svg>`) before
the actual text content. `<path>` elements' `d` attributes routinely exceed 300-400
characters, so stripping icon markup only within a small window *after* the marker
frequently truncates mid-tag and leaves an unmatched, unstripped `<path ...>`
fragment behind as garbage "text". The fix: strip `<style>...</style>` content and
`<svg>...</svg>`/`<path>` tags from the **entire card chunk** before searching for
markers and extracting text, not from a small post-marker slice. See `stripNoise()`
in `cli/src/helpers.ts`.

A JSON blob is also embedded in a `data-atx-onpageview-payload` attribute near the
top of the results container, containing `searchResultsTotalJobCount` and
`searchResultsDisplayedJobIds` — not currently parsed by this skill, but available
if a future maintainer wants an exact total-result count.

## Detail

```
GET https://www.stepstone.de/stellenangebote--<any-slug>--<id>-inline.html
```

- **The slug text is ignored server-side** — only the trailing numeric ID before
  `-inline.html` determines which posting is returned. Verified live: a URL with an
  unrelated placeholder slug (`--job--<id>-inline.html`) returned the correct posting
  for that ID. This means `detail <id>` can construct the URL directly without
  needing the original search result's exact slug.
- **Bot-detection quirk:** requests without a realistic `Accept`, `Accept-Language`,
  and `Referer` header can hang indefinitely (TCP connection stays open, no response,
  no error) rather than returning a 4xx/5xx. Confirmed by direct comparison: the same
  URL with only a `User-Agent` header timed out twice in a row; adding
  `Accept: text/html,...`, `Accept-Language: de-DE,de;q=0.9,en;q=0.8`, and a `Referer`
  pointing at a stepstone.de search page succeeded immediately. The CLI always sends
  these three headers.

### Response structure

The page embeds a `<script type="application/ld+json">` block with a full
`schema.org/JobPosting` object — used directly instead of scraping the rendered HTML:

```json
{
  "@type": "JobPosting",
  "title": "...",
  "url": "...",
  "datePosted": "ISO-8601",
  "validThrough": "ISO-8601",
  "employmentType": "FULL_TIME | PART_TIME | ...",
  "industry": "...",
  "directApply": true,
  "hiringOrganization": { "name": "...", "url": "...", "logo": "..." },
  "jobLocation": {
    "geo": { "latitude": 0, "longitude": 0 },
    "address": { "addressLocality": "...", "addressRegion": "...", "addressCountry": "DE", "postalCode": "..." }
  },
  "description": "<html string>"
}
```

`description` is HTML (headings, paragraphs, `<ul>`/`<li>`); the CLI converts block-level
closing tags and `<br>` to newlines, strips remaining tags, and decodes entities.

Fields observed as absent/optional depending on the posting: `baseSalary`,
`applicantLocationRequirements`. Not currently surfaced by this skill.

## Notes

- No authentication required for either endpoint.
- No official JSON API found — HTML + embedded JSON-LD is the most stable available
  approach; JSON-LD in particular should be far more resistant to markup churn than
  the `data-at` card-scraping used for search.
- If stepstone.de changes its emotion CSS-in-JS build (different class-name hashes),
  the `data-at` attribute values themselves are the stable anchor to re-verify first —
  they are semantic markers, not generated class names.
