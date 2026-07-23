# stepstone-cli

CLI for searching jobs on **stepstone.de**, Germany's largest general job board,
across any sector or role type.

**Data source**: stepstone.de public HTML pages (search) + embedded `schema.org/JobPosting` JSON-LD (detail). No official JSON API.
**Authentication**: None required.
**Dependencies**: None (plain `bun` + `fetch`). `bun install` is optional and only pulls dev type defs.

> **robots.txt-respecting.** stepstone.de disallows query-string pagination
> (`/jobs/*?*`), so this CLI only fetches page 1 (~25 results) and refuses
> `--page 2` and higher rather than silently violating the site's crawl rules.
> `--jobage` is a best-effort client-side filter for the same reason — see
> `../SKILL.md` for details. Keep request volume low.

## Installation

```bash
cd .agents/skills/stepstone-search/cli
bun install   # optional — only installs TypeScript dev types
```

The CLI runs without any install because it has zero runtime dependencies.

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search for job listings (`--query` required) |
| `detail` | Fetch full detail for a single job listing |

`search` accepts `--format json|table|plain` (default `json`); `detail` accepts `--format json|plain`.
All errors are written to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
# Werkstudent ML roles in Hamburg
bun run src/cli.ts search -q "Werkstudent Machine Learning" -l "Hamburg" --format table

# Data Scientist roles in Berlin, last ~14 days
bun run src/cli.ts search -q "Data Scientist" -l "Berlin" --jobage 14 --format table

# Full detail for one job
bun run src/cli.ts detail 14281015 --format plain
```

See `../SKILL.md` for the full flag reference and the robots.txt note.

## Search flags

| Flag | Alias | Description |
|------|-------|--------------|
| `--query` | `-q` | **Required.** Keywords, e.g. `"Werkstudent Machine Learning"`. |
| `--location` | `-l` | City/region, e.g. `"Hamburg"`, `"München"`. Passed as a URL path segment. |
| `--jobage` | | Approximate posted-within-N-days filter (client-side, best-effort). |
| `--page` | | Must be `1` — higher pages are rejected (robots.txt). |
| `--limit` | `-n` | Cap results emitted. |
| `--format` | | `json` \| `table` \| `plain`. |
