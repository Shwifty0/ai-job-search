---
name: stepstone-search
version: 1.0.0
description: >
  Use this skill whenever the user wants to search for jobs in Germany, find German
  job listings, or look up a specific stepstone.de job posting — even if they don't
  mention stepstone.de explicitly. Invoke for open positions, vacancies, and hiring
  across any sector or role in the German market (software, data, engineering,
  marketing, finance, etc.), including Werkstudent / working-student roles. Trigger
  phrases include: stepstone, jobs in germany, german job search, stellenangebote,
  jobsuche, stellenanzeigen, offene stellen, werkstudent, praktikum, jobs in berlin,
  jobs in hamburg, jobs in münchen, "are there any jobs for X in Germany", find a job
  in germany, ausschreibung, bewerbung, karriere.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/stepstone-search/cli/src/cli.ts *)
---

# StepStone Search Skill

Search live job listings from **stepstone.de**, Germany's largest general job board,
covering every sector and role type (including Werkstudent/working-student positions).
No authentication, no API key, and **zero runtime dependencies** — it runs with just
`bun`.

## ⚠️ Robots.txt-respecting limits

stepstone.de's `robots.txt` disallows `/jobs/*?*` (query-string URLs) except for
`?q=*` — this covers the site's own `?page=N` pagination parameter and its posting-age
filter. To stay within the site's crawl rules:

- **Only page 1 is fetched.** The CLI refuses `--page 2` and higher with a clear
  error rather than silently violating robots.txt. Page 1 returns ~25 results.
- **`--jobage` is a client-side approximation**, not a server-side filter. StepStone
  exposes no age parameter this skill can use without hitting a disallowed URL, so
  the CLI parses each card's relative-time text ("vor 3 Tagen", "vor 1 Woche") and
  filters after the fact. It is approximate, not exact.
- Location is passed as a URL path segment (`/jobs/<query>/in-<city>`), which is not
  a query string and is unaffected by the above.

Keep request volume low regardless — this is a personal job-search tool, not a bulk
scraper.

## When to use this skill

- Search for job openings anywhere in Germany, by keyword and optionally by city
- Look up the full description, deadline, and employment type of a specific
  stepstone.de posting
- Find Werkstudent / working-student / Praktikum roles specifically (include the
  term in `--query`, e.g. `"Werkstudent Machine Learning"`)

## Commands

### Search job listings

```bash
bun run .agents/skills/stepstone-search/cli/src/cli.ts search --query "<text>" [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — **required.** Keywords (job title, skill, role), e.g. `"Werkstudent Machine Learning"`, `"Data Scientist"`.
- `--location <text>` / `-l <text>` — city or region, e.g. `"Berlin"`, `"Hamburg"`, `"München"`. Passed as a URL path segment — StepStone has no location query parameter.
- `--jobage <days>` — approximate posted-within-N-days filter, applied client-side (see the robots.txt note above).
- `--page <n>` — must be `1`. Higher pages are rejected (robots.txt disallows the pagination parameter).
- `--limit <n>` / `-n <n>` — cap total results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/stepstone-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`id` is the numeric job ID from `search` results (e.g. `14281015`). You may also pass
a full stepstone.de detail URL — only the trailing ID is used; the slug text before it
is ignored by the site itself. Returns the full description, deadline, employment type,
and industry, parsed from the page's embedded `schema.org/JobPosting` structured data.

## Usage examples

```bash
# Werkstudent ML roles in Hamburg
bun run .agents/skills/stepstone-search/cli/src/cli.ts search -q "Werkstudent Machine Learning" -l "Hamburg" --format table

# Data Scientist roles in Berlin, posted in the last 14 days (approximate)
bun run .agents/skills/stepstone-search/cli/src/cli.ts search -q "Data Scientist" -l "Berlin" --jobage 14 --format table

# Nationwide search, no city filter
bun run .agents/skills/stepstone-search/cli/src/cli.ts search -q "Python Backend Entwickler" --format table

# Full detail for a specific posting
bun run .agents/skills/stepstone-search/cli/src/cli.ts detail 14281015 --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Data is scraped from stepstone.de's public, server-rendered HTML pages — there is no official JSON API.
- Search results come from `data-at="job-item-*"` attributes on each card; detail pages are parsed from an embedded `schema.org/JobPosting` JSON-LD block, which is far more reliable than scraping the rendered description.
- The detail endpoint applies basic bot-detection: requests without browser-like `Accept`/`Accept-Language`/`Referer` headers can hang instead of erroring. The CLI always sends these.
- Query text is slugified into StepStone's URL path format automatically (spaces → hyphens, lowercased). Arbitrary free-text queries work — verified live with both English and German phrasing.
- Page size is fixed at ~25 results per page (page 1 only — see the robots.txt note above).
