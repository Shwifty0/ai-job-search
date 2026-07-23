import {
  BASE_URL,
  buildSearchUrl,
  htmlFetch,
  parseJobCards,
  daysAgo,
  writeError,
  type JobCard,
} from "../helpers.js"

export interface SearchOpts {
  query: string
  location?: string
  jobage?: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const rows = cards.map((c) => {
    const title = (c.title || "").slice(0, 42).padEnd(42)
    const company = (c.company || "—").slice(0, 26).padEnd(26)
    const loc = (c.location || "—").slice(0, 20).padEnd(20)
    const posted = c.postedRelative || "—"
    return `${c.id.padEnd(11)} ${title} ${company} ${loc} ${posted}`
  })
  const header =
    "ID".padEnd(11) +
    " " +
    "TITLE".padEnd(42) +
    " " +
    "COMPANY".padEnd(26) +
    " " +
    "LOCATION".padEnd(20) +
    " POSTED"
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  if (opts.page > 1) {
    writeError(
      "Only page 1 is available. stepstone.de's robots.txt disallows /jobs/*?* " +
        "(the ?page=N pagination parameter) except for ?q=* — fetching page 2+ would " +
        "violate the site's crawl rules, so this CLI does not support it.",
      "PAGE_NOT_ALLOWED",
    )
    return 1
  }

  try {
    const url = buildSearchUrl(opts.query, opts.location)
    const html = await htmlFetch(url)
    let cards = parseJobCards(html)

    if (opts.jobage !== undefined && opts.jobage > 0 && opts.jobage < 9999) {
      cards = cards.filter((c) => {
        const age = daysAgo(c.date)
        // Keep undated cards rather than silently dropping them - StepStone doesn't
        // expose an exact-age field, only a relative-time string we approximate from.
        return age === null || age <= opts.jobage!
      })
    }

    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(cards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) =>
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.postedRelative || "—"}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: cards.length, page: opts.page, source: BASE_URL }, results: cards },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}
