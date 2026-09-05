# Search Queries for Job Scraper

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first. Shipped country-agnostic CLIs include `linkedin-search` and `freehire-search`; Danish demos and any skill you add with `/add-portal` are included the same way. You do **not** need a matching `site:` line below for those CLIs to run.

The `site:` query templates in this file are the **WebSearch fallback** — for portals without a CLI, company career pages, or when a CLI fails.

## Search Sites

Primary:
- **stepstone.de** - primary job board used (only portal confirmed so far; add more with `/add-portal` or `/setup --section search`)
- **linkedin.com/jobs** - LinkedIn job listings (filter: Germany, especially Ilmenau, Hamburg, Berlin, Kiel); also covered by `linkedin-search` CLI

Secondary (company career pages via Google):
- Direct Google searches with `site:` filters for known target companies

## Query Categories

Queries are grouped by priority. Each query should be combined with location terms where the site supports it. Visa sponsorship is a hard requirement, and the candidate needs a Werkstudent role with a credible path to full-time conversion — favor postings that explicitly mention "Werkstudent", "student assistant", or sponsorship.

### Priority 1: ML Engineer (Werkstudent)

Strongest and most desired career direction.

```
site:stepstone.de "Werkstudent" "Machine Learning" Germany
site:stepstone.de "ML Engineer" Werkstudent
site:linkedin.com/jobs "Machine Learning Engineer" Werkstudent Germany
```

### Priority 2: MLOps Engineer

Domain expertise in Kubernetes, Docker, and production ML serving.

```
site:stepstone.de "MLOps" Werkstudent Germany
site:stepstone.de "Kubernetes" "Machine Learning" Werkstudent
site:linkedin.com/jobs "MLOps Engineer" Werkstudent Germany
```

### Priority 3: Computer Vision Engineer

Adjacent role, matches CNN/YOLO/object-detection and LIDAR sensor-fusion experience.

```
site:stepstone.de "Computer Vision" Werkstudent Germany
site:stepstone.de "Computer Vision Engineer" Hamburg OR Berlin OR Kiel
site:linkedin.com/jobs "Computer Vision" Werkstudent Germany
```

### Priority 4: AI Engineer / Broader Technical

Wider net for general AI/technical roles.

```
site:stepstone.de "AI Engineer" Werkstudent Germany
site:linkedin.com/jobs "AI Engineer" Germany Werkstudent
site:stepstone.de "FastAPI" OR "PyTorch" Werkstudent Germany
```

## Location Filter

Visa sponsorship is a hard requirement. Relocation is a **hard requirement** too: the candidate will only relocate to highly populated, international German cities. Define acceptable areas:
- Ilmenau (current location) and surrounding areas
- Hamburg, Berlin, Kiel, Nürnberg, Leipzig (explicitly confirmed)
- Other major German metros by the same standard: Munich, Frankfurt am Main, Cologne, Stuttgart, Düsseldorf, and similar - open principle, not a closed list
- Small towns, suburbs, and non-metro locations: **FAIL**, even for an otherwise strong-fit role (a direct commuter-belt suburb of a qualifying metro can reasonably pass; a small town with its own separate identity does not)
- Outside Germany (too far - visa sponsorship pathway unclear unless remote and sponsorship is explicitly confirmed)

## Date Filter

**Hard requirement: only include jobs posted within the last 7 days** (roughly 24 hours up to 7 days old). This is still tighter than a typical "last 2 weeks" scrape - when running a portal CLI's recency flag (`--jobage`, `--since`, etc.), pass a 7-day value, not 14. If a portal's recency filter can't go that granular, fetch its normal window and filter the results client-side against each posting's actual date/timestamp. If a posting's exact date cannot be determined, exclude it rather than guessing - freshness is a hard filter here, not a soft preference.

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape [focus_area]" -> relevant category queries + custom focus-specific queries
