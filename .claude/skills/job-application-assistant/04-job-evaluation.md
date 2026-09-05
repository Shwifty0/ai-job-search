---
framework_version: 1.0.0
---

# Job Evaluation Framework

<!-- SETUP: Skill match areas and career goals are personalized by running /setup -->

## Scoring Dimensions

Evaluate each job posting against these five dimensions:

### 1. Technical Skills Match (0-100)
How well do the required/preferred skills align with the candidate's capabilities?

| Score | Meaning |
|-------|---------|
| 80-100 | Core requirements are primary skills |
| 60-79 | Most requirements match, 1-2 gaps that are learnable |
| 40-59 | Partial match, significant upskilling needed |
| 0-39 | Fundamental mismatch |

**Strong match areas:** Python (advanced), PyTorch/TensorFlow/Scikit-learn, MLOps (Docker, Kubernetes, Prometheus, Grafana), FastAPI/backend development, Computer Vision (CNNs, YOLO, object detection, OpenCV)
**Moderate match areas:** Audio/speech processing (Whisper, Librosa, AWS Transcribe), Robotics (ROS2, LIDAR, SLAM), data engineering (Pandas, NumPy, PostgreSQL/MySQL)
**Weak match areas:** Large-scale production ML experience (current work is academic/hackathon/internship scale), formal DevOps/SRE background, team-lead or people-management experience, peer-reviewed publications

### 2. Experience Match (0-100)
Does work history align with what they're looking for?

| Score | Meaning |
|-------|---------|
| 80-100 | Direct experience in the same domain and role type |
| 60-79 | Related experience, transferable skills clear |
| 40-59 | Adjacent experience, would need to make the case |
| 0-39 | Unrelated experience |

**Strong:** ML Engineering, MLOps, Computer Vision - direct experience via research assistantship, internship, and multiple hackathon wins
**Moderate:** Backend/software engineering (FastAPI-heavy projects), Audio/Speech ML roles, Robotics/autonomous systems roles
**Entry-level:** Any role requiring 3+ years of professional (non-internship) experience - candidate is early-career and targeting Werkstudent-to-full-time pathways

### 3. Behavioral/Culture Fit (0-100)
Does the role and company culture match the behavioral profile?

| Score | Meaning |
|-------|---------|
| 80-100 | Culture strongly matches behavioral preferences |
| 60-79 | Mixed signals but mostly compatible |
| 40-59 | Some friction areas |
| 0-39 | Significant culture mismatch |

**Red flags to research:** Department disorganization, work dominated by maintenance over development, poor chemistry with leadership, culture mismatches. Check reviews, media coverage, LinkedIn connections, and network contacts for insider perspective.

### 4. Location & Logistics (Pass/Fail + Notes)
- **Hard requirement (deal-breaker):** the posting's location must be Ilmenau (current base) or a highly populated, international German city. Explicitly confirmed: Hamburg, Berlin, Kiel, Nürnberg. By the same standard, other major metros also qualify: Munich, Frankfurt am Main, Cologne, Stuttgart, Düsseldorf, Leipzig, and similar. This is an open principle, not a closed list - judge a city's size/international character on its merits rather than requiring an exact name match.
- Small towns, suburbs, or non-metro locations: **FAIL**, even for an otherwise strong-fit role. A direct commuter-belt suburb of a qualifying metro (e.g. "Neu-Isenburg bei Frankfurt," "Norderstedt" near Hamburg) can reasonably PASS if genuinely commutable from the metro; a small town with its own separate identity (e.g. Attendorn, Halver, Oberkochen, Wolfsburg) FAILs regardless of the employer's quality.
- Remote within Germany: PASS
- Cannot sponsor a work visa / no path to full-time conversion for a Werkstudent: FAIL (deal-breaker)
- Outside Germany without confirmed sponsorship: FAIL
- Frequent international travel: FLAG (discuss with user)

### 5. Career Alignment & Motivation (0-100)
Does this role advance career goals and contain tasks that energize?

| Score | Meaning |
|-------|---------|
| 80-100 | Strongly aligned with career direction, clear growth path |
| 60-79 | Good role but only partially aligned with long-term goals |
| 40-59 | Decent job but doesn't build toward career goals |
| 0-39 | Dead end or backwards step |

**Career goals:**
- Land a Werkstudent role in ML Engineering, MLOps, Computer Vision, or AI Engineering with a clear, stated path to full-time conversion
- Build production-scale ML/MLOps experience beyond academic, hackathon, and internship scale
- Grow into a team that actively mentors and develops its people, eventually paying that forward to junior engineers

**Motivation filter:** Evaluate not just whether you *can* do the tasks, but whether the tasks will *energize* you. Consider:
- Tasks that energize: Open-ended technical problem-solving, building end-to-end ML/MLOps systems, rapid hands-on prototyping
- Tasks that drain: Not yet established - update as more application/interview experience accumulates
- Non-task factors: leadership style, department culture, company values, degree of autonomy

**Life situation alignment:** Consider personal constraints:
- **Security**: Currently a Master's student in Germany. Visa/work-permit sponsorship is a hard requirement for any offer - treat postings that cannot sponsor as an automatic FAIL on this dimension, not just a note.
- **Flexibility**: Needs a role structured to fit around ongoing M.Sc. studies (i.e. genuine Werkstudent hours), with a credible path to full-time after graduation.
- **Professional development**: Strongly prioritizes employers offering a documented Werkstudent -> full-time conversion pathway, since this supports the Permanent Residency process.

### 6. Salary Benchmark (Optional)

If the salary lookup tool is configured (`salary_data.json` exists), look up the company:
```
python salary_lookup.py "<Company Name>" --json
```

If a city is known from the posting, add `--city "<City>"` to narrow results.

Present findings as:
```
### Salary Benchmark
| Metric | Value |
|--------|-------|
| [Category] index | XX.X (+/-X.X% vs baseline) |
| Overall index | XX.X (+/-X.X% vs baseline) |
```

Interpret results relative to the baseline defined in the data file's metadata. For index-based data, higher typically means above-market compensation.

If the salary tool is not configured, skip this section.

## Output Format

Present the evaluation as:

```
## Job Fit Evaluation: [Role] at [Company]

| Dimension | Score | Notes |
|-----------|-------|-------|
| Technical Skills | XX/100 | [brief note] |
| Experience Match | XX/100 | [brief note] |
| Behavioral Fit | XX/100 | [brief note] |
| Location | PASS/FAIL | [brief note] |
| Career Alignment | XX/100 | [brief note] |

**Overall Score: XX/100** (weighted average of scored dimensions)

### Verdict: [Strong Fit / Good Fit / Moderate Fit / Weak Fit / Poor Fit]

### Key Strengths for This Role
- [bullet points]

### Gaps to Address
- [bullet points]

### Recommendation
[1-2 sentences: apply/skip/apply with caveats]

### Company Research Checklist
- [ ] Checked company website (mission, values, recent news)
- [ ] Checked review sites (Glassdoor, Jobindex, etc.)
- [ ] Checked LinkedIn for team size, recent hires, connections
- [ ] Checked media for restructuring, growth, or workplace issues
- [ ] Identified network contacts who may know the team/manager
```

## Weighting
- Technical Skills: 30%
- Experience Match: 25%
- Behavioral Fit: 15%
- Career Alignment: 30%

(Location is pass/fail, not weighted)

## Thresholds
- **Strong Fit** (75+): Definitely apply, tailor everything
- **Good Fit** (60-74): Apply, address gaps in cover letter
- **Moderate Fit** (45-59): Consider carefully, discuss with user
- **Weak Fit** (30-44): Probably skip unless strategic reasons
- **Poor Fit** (<30): Skip

## Pre-Application: Call the Employer (Best Practice)

Before writing the application, consider whether the candidate should call the contact person listed in the posting. **Only call if there are substantive questions** - never call just to "be remembered."

### When to Suggest Calling
- The posting has unclear or ambiguous requirements
- It's unclear which competencies are essential vs. nice-to-have
- The role description is vague about day-to-day tasks
- There's a named contact person who invites questions

### Good Questions to Ask
- "What are the primary challenges in this role?"
- "How is time typically divided across the listed responsibilities?"
- "Which competencies are most critical for success in this position?"
- "What does success look like in the first 6-12 months?"

### Rules for the Call
- Prepare a 30-second "elevator pitch" about your background in case they ask
- The call's purpose is **gathering information**, not delivering a pitch
- Take notes - use what you learn to tailor the application
- Reference the conversation naturally in the cover letter ("After speaking with [name], I was especially drawn to...")

## Calibration from Past Applications

*Auto-generated by `/setup` Path A from resolved `documents/applications/*/outcome.md`. Observational — rejections were boilerplate with no stated reason; treat as correlation, not confirmed cause.*

**As of 2026-08-04 — 20 resolved, all rejected at the screening stage (0 interviews, 0 phone screens):**

| Application | Fit rating | Posting language | Structural notes |
|---|---|---|---|
| dataspark Werkstudent ML/MLOps (Frankfurt) | Strong 82 | German (verhandlungssicher) required | explicit Festanstellung path; answered A2/B1 |
| otto Werkstudent Data Eng & DS (Hamburg) | Strong 80 | German B1 required | answered A2/B1 |
| primetals Werkstudent DevOps/MLOps (Erlangen) | Strong 80 | English accepted | 2nd screen-out from same employer (Primetals/MHI, cf. Mitsubishi Edge-AI) |
| thryve AI Engineer (remote in DE) | Strong 80 | German C1 required | recruiter-placed; predicted language screen-out, confirmed |
| Siemens Werkstudent Data Science (Berlin) | Strong 79 | German required | — |
| s-kreditpartner Werkstudent Advanced Analytics & AI (Berlin) | Strong 79 | German posting | decision-maker-facing; answered in English, A2/B1 disclosed |
| CeramTec Werkstudent Digital Transformation CV (Plochingen) | Strong 78.5 | German expected | small town (borderline location); routed via Ausbildung/Early-Career desk |
| ARRK Werkstudent ML Automated Driving (Munich) | Strong 77.8 | German required | — |
| Avelios Working Student ML (Munich) | Strong 77 | English-fluency, German a plus | explicit full-time path |
| limehome Working Student AI Enablement (Munich/remote) | Strong 75 | English team, applied B1 German | visa confirmed; strong agentic-tooling angle; still screened out |
| exclusive-associates Working Student AI & Backend (Düsseldorf) | Good 74 | English-only | CV-only (no cover letter); agency-placed, end client unknown |
| amber AI Engineering Intern (Cologne) | Good 74 | German posting | full-time internship (not Werkstudent); unverified visa; ~30-person seed startup |
| nxp Working Student AI/ML Solutions (Hamburg) | Good 72 | English | GenAI/LLM; working-student visa policy unconfirmed |
| Infineon Working Student Gen AI (Munich) | Good 72 | English | enrollment certificate not attached to the application itself |
| osapiens ML Engineer geospatial (Munich) | Good 70 | English | permanent full-time (not Werkstudent) |
| Jungheinrich Praktikum ML/CV robotics (Norderstedt) | Good 69 | German | Praktikum (not Werkstudent) |
| allianz-digital-health Working Student Data Engineer (Munich) | Good 66 | English | genuine working student; language low-risk |
| atos Werkstudent MLOps (Hamburg) | — | German (A2/B1 answered) | secure-AI platform; language plausible |
| sap Working Student Cloud Native & AI (Garching) | — | English | highly competitive; language low-risk |
| aiomatic Werkstudent Data Science (Hamburg) | — | English application | — |

**Observed patterns (correlational — no rejection stated a reason):**

1. **Paper-fit scores are strongly overpredicting callbacks — 0/20, including every "Strong Fit" (75+).** The 75+ band has a **0% callback rate across 10 attempts**; no score band has produced even a phone screen. Read scores as *fit-on-paper only* and stay candid with the user that a strong score has not translated into a callback in this market. The German early-career ML Werkstudent field is clearly being filtered on factors the score under-captures.

2. **German-language gap: still the dominant factor among German-required postings.** Siemens, ARRK, CeramTec (and amber's German posting) all required/expected German and were answered with English or honest A2/B1 applications. When a posting states "**gute/sehr gute Deutschkenntnisse**" (distinct from "Deutsch von Vorteil" or an English-language posting), keep surfacing German-language fit as an explicit **screening risk** and flag it prominently in the recommendation — the scored dimensions under-weight it.

3. **Experience scale is now co-dominant with language — English-friendly is necessary but NOT sufficient.** The resolved set now splits evenly: **10 German-language-gap rejections and 10 English-friendly / low-language-risk rejections**. The English-friendly count grew from ~3 to 10 (adding allianz-digital-health, exclusive-associates, limehome, nxp, osapiens, primetals, sap). limehome is the sharpest data point: English-working team, **confirmed visa sponsorship**, a genuine agentic-tooling differentiator, Strong 75, and still screened out with no interview. Removing the language barrier has not produced a single callback across 10 attempts, so the residual factor is **experience scale** (academic/hackathon/internship vs. production ML, against fields of qualified applicants). Treat experience scale as a **primary factor equal to language**, not a secondary one; never present an English-friendly role as high-probability merely because language is not a blocker.

4. **Execution/process errors cost applications.** Infineon's rejection followed a failure to attach the enrollment certificate to the *application itself* (documents were uploaded to the portal profile instead). Before submitting any Werkstudent application, verify all required documents (enrollment certificate / Immatrikulationsbescheinigung, transcript) are attached to the application, not just the profile.

5. **Stop spending effort on structurally-off roles even when technical fit is high.** amber (full-time internship not Werkstudent; unverified visa sponsorship; ~30-person seed startup), osapiens (permanent full-time ML Engineer, not a Werkstudent — its rejection language pointed directly at experience scale), and CeramTec (sub-metro small town, flagged borderline pre-application) all carried explicit pre-application caveats and all screened out. A separate signal: **Primetals/MHI screened out two different Werkstudent applications** (Mitsubishi Edge-AI and Primetals DevOps) on paper without interview — some employer pipelines will not convert regardless of role-level fit. Reinforce deal-breaker discipline in triage: a non-Werkstudent structure, unverified visa sponsorship, or a sub-metro location should down-rank a posting regardless of a strong technical score.

**Net triage guidance:** Continue to prefer English-friendly + genuine-Werkstudent + confirmed-metro + stated-full-time-path postings, but frame even those to the user as *fit-on-paper, callback-unproven*. The highest-leverage moves now sit outside the score — raising German toward B2, and closing the experience-scale gap (a production-scale project via `/upskill`) — since 20 screen-outs with 0 callbacks show the current profile is not converting regardless of per-application polish.
