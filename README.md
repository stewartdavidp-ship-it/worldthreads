# WorldThreads

History isn't a collection of events. It's the threads that connect them.

WorldThreads is an experimental historical systems project. Instead of treating a year as a list of isolated events, it models observations, conditions, shocks, responses, outcomes, resilience, lag and recurring mechanisms across natural and human systems.

## Prototype

The first prototype year is **1816**, using an initial 1814–1818 research window.

Current prototype includes:
- 1816 landing page
- system filters
- world-region evidence markers
- clickable observation cards
- a first causal thread explorer
- source, confidence, relationship and lag metadata

## Run locally

From the repository folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project structure

```text
index.html                 Browser prototype
styles.css                 Prototype styling
app.js                     Prototype interactions

data/1816/observations.json  1816 observations with review status

docs/PROJECT_SPEC.md       WorldThreads project specification
```

## Current prototype thread

Gulf of Maine:

```text
1816 temperature shock
  → species-specific fish response
  → food pressure and fishing adaptation
  → persistent structural change in fisheries
```

The dataset is intentionally small. The next phase expands environmental, biological, agricultural, economic, political and cultural evidence globally before drawing broader causal conclusions.

## v0.3 evidence and thread update

33 observations, 25 relationships, eleven threads and 28 sources. The local Tambora batch has scholarly corroboration and page-level evidence; independent review is pending. Its maritime record is now limited to a dated 1819 report.

Thread connections use actual endpoints. Observation details show review status.

Research, review, audit and fix procedures: `docs/RESEARCH_WORKFLOW.md`.
Correction history: `docs/REVIEW_LOG.md`.
Run `python3 scripts/audit.py` to check references and evidence provenance.
All 58 current claims have passage-level evidence. Structural audit: zero errors and zero missing-evidence warnings. All 58 claims await independent review; 19 alternative searches remain open. Some evidence is limited to abstracts or indexed excerpts.

Run `python3 scripts/audit.py --report data/1816/audit-report.json` to refresh the next review queue. See `docs/NEXT_REVIEW_PASSES.md` for specific priorities.

## Community research prototype

Choose an open question, generate a research prompt and output template, and load a returned JSON draft for local intake checks. Drafts stay separate from accepted graph data. See `docs/CONTRIBUTING_RESEARCH.md` for independent verification and repository submission. Badge criteria recognize accepted threads, causal research, challenges, resilience and source work; account-based uploads and awards require a hosted service.

Year-by-year expansion and cross-year relationship review: `docs/YEAR_EXPANSION.md`. The active contribution year is 1816; later-year readiness remains an editorial decision.

## v0.4 community research

Visitors can submit research and factual supporting/counterevidence without a GitHub account. Automatic source inspection, two assessment passes, audit and correction steps publish labelled graph additions and preserve review history. New facts and relationships extend existing threads or form new branches. Private receipts show progress.

The GitHub Pages site uses a Cloudflare Worker with its own D1 database. Read [the service protocol](docs/COMMUNITY_SERVICE.md) for setup, checks, daily limits and current HTML/plain-text retrieval constraints. Run `npm ci` and `npm test` to verify the browser protocol and Worker service. The baseline dataset retains its earlier provenance; community assessments do not imply retrospective review of every existing claim.

The entry investigation challenges the claim that weather was the decisive influence on Frankenstein. Visitors choose a provisional position, inspect five source passages with limits and dependence disclosed, and explain what evidence they still need. These positions stay local; publication assesses cited evidence against actual recorded claims, not the deliberately stronger teaching claim. Research prompts retain the selected fact, passage, uncertainty and a request to seek evidence against the visitor’s position. The full fact/relationship board remains available, preserving the original thread when expanding leads. Exploration and questions can be resumed on the current device; publication receipts remain private.

## Shared investigation sessions

Choose **Investigate together** to host or join a Frankenstein case session. The host chooses a nickname and lead, then shares the invitation link or eight-character code. Up to six people join without accounts. Initial interpretations stay hidden until everyone records support, uncertainty and next evidence; only the host opens comparison. The group then compares passages and saves individual follow-up questions.

Session notes are private to people with session access and never become public historical claims. Share the invitation field, not the private rejoin address. Bookmark your private address to resume on another device. Shared updates refresh every ten seconds while the session view is open. This release offers one cooperative case; more evidence rounds are a content priority.

Database migration: `worker/migrations/0002_shared_sessions.sql` creates separate session tables. Tests cover access isolation, host controls, capacity and publication separation.

### Friends investigation update
Group hosts can choose Frankenstein or the Gulf of Maine mackerel case. Fisheries adds four source summaries plus three rival-explanation clues, each with a locator and a limit. All fisheries cards currently depend on Alexander et al. (2017); different data types are not independent corroboration. Summaries are labeled and do not become graph facts.

Lead counts suggest uncovered questions. Notes can be brief. Guests can withdraw, and hosts may explicitly open comparison with at least two ready participants while unfinished notes stay hidden. Follow-up questions survive note revisions. Follow-up evidence is revealed independently per browser; play in person or on a call. There is no built-in chat or host succession.

Migration `worker/migrations/0003_session_members_active.sql` adds non-destructive withdrawal status. Validation includes 47 automated checks and published browser testing.
