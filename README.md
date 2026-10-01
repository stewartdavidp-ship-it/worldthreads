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

data/1816/observations.json  Initial verified 1816 records

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

The dataset has 24 observations, 18 relationships, six threads and 17 sources.
The new local Tambora thread distinguishes direct food/water and maritime
disruption from distant climatic effects. Its three new observations have
medium confidence and explicitly require scholarly corroboration; recovery
through 1816 remains open.

Thread connections now use each relationship's actual endpoints instead of
assuming every thread is a linear chain. Observation details show review status.
