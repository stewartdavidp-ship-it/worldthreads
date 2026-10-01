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
