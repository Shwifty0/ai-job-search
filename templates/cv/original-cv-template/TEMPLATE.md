# Template: original-cv-template

- **Type:** CV
- **Engine:** pdflatex
- **Page limit:** 1 page (hard limit)
- **Fill requirement:** the 1 page must be at least ~95% full (hard requirement, every time) — a page ending with a mostly-empty bottom third or more fails inspection exactly like a 2nd-page overflow does
- **Fonts:** Latin Modern (`lmodern`, standard TeX Live) + FontAwesome5 icons (standard TeX Live, `texlive-fontsextra`) — no bundled font files, system/distribution fonts only
- **Class/packages:** `article` (10pt, a4paper) with `inputenc`, `fontenc` (T1), `lmodern`, `microtype`, `xcolor`, `enumitem`, `hyperref`, `fontawesome5`, `geometry` (0.7cm top/bottom, 1.2cm left/right)

## Compile command

    cd cv && pdflatex -interaction=nonstopmode main_<company>_<role>.tex

Verified with a full test compile (dummy content, 1 page, no font/package errors) on this machine's TeX Live install. If `fontawesome5` ever fails under `pdflatex` on a different install (a known MiKTeX issue elsewhere in this repo), fall back to `lualatex` with the same source — no `fontspec`-only features are used, so both engines work.

## Style rules

- Header is centered: bold name (`\Large`), then a small tagline/headline line, then a contact line built from `\contactitem{<icon>}{<text>}` — icons are `\faMapMarker*`, `\faMobile*`, `\faEnvelope`.
- Section headings use `\sectiontitle{...}`: bold colored text (`primarycolor` = RGB 30,55,153) followed by a full-width colored rule. Do not use moderncv-style `\section{}` — this template defines its own macro.
- Entries use `\jobtitle{...} \hfill \daterange{...}` on one line, then `\organization{...}` on the next, then a tight `itemize` (`leftmargin=*,noitemsep,topsep=0.05cm,parsep=0pt`).
- Use `\entryseparator` (a small `\vspace`) between consecutive entries in the same section that don't already have a date-line providing visual separation — see the pattern between the two "Key Projects" entries in the skeleton.
- Sections present, in order: Professional Summary, Technical Skills, Professional Experience, Key Projects & Achievements, Education, Languages. There is **no separate Honors/Awards or References section** in this design — fold awards into a project/experience entry's title instead (e.g. `\jobtitle{Hackathon Name - 1st Place}`), matching the pattern already in the skeleton. Don't add new top-level sections; if a References section is ever needed, add a `\sectiontitle{References}` block following the same pattern as the others.
- Technical Skills is a two-column `tabular` (`l p{13.5cm}`) with bold category labels on the left, not a bullet list.
- Spacing is intentionally tight throughout (`\parindent`, `\parskip`, `\itemsep` all set to 0pt at the document level) to fit everything on one page — do not add extra `\vspace` beyond what's already in the skeleton, since the design has very little margin for overflow.
- Bullet character `\bullet` (rendered as `$\bullet$`) is used inline for the Education institution/focus line and the Languages line — keep this style rather than switching to a different separator.

## Known pitfalls

- The template has almost no vertical slack — even 1-2 extra lines of content can push it to a 2nd page. When tailoring content per role, favor cutting a bullet over letting a section wrap an extra line.
- The flip side of the above: don't over-cut. The page must land at ~95%+ full, not just "under the limit." If a draft compiles with visible empty space at the bottom, restore the highest-relevance previously-cut bullet or project rather than presenting a thin page — check this every time, not just when the layout looks obviously sparse.
- `\sectiontitle{}` inserts its own `\vspace{0.2cm}` before the heading; don't add a manual `\vspace` immediately before calling it or the gap doubles.
- No Honors/Awards or References sections exist by default (see Style rules) — don't invent new `\sectiontitle{}` blocks that don't match the candidate's actual established section list unless the user asks for one.
