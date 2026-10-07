# WorldThreads

History isn't a collection of events. It's the threads that connect them.

WorldThreads v0.5 explores the 1816 world through sources, observations, historical objects, relationships, threads and mechanisms. Objects identify people, movements, places, institutions, inventions, works, events, natural hazards and other factors. Observations remain the sourced claims about them.

The dark-mode prototype contains 78 observations, 48 sources, 55 observation relationship claims, 23 threads, 12 mechanism hypotheses and 173 objects, including 15 people. Its 197 object links include 55 exact projections of existing claims and 142 documented roles/context links. Coverage spans six continents plus marine records; gaps remain open. Dated antecedents, later outcomes and multi-year reconstructions retain their actual scope.

## Ways into the investigation

- **Choose a story:** three guided starting points, with an unfolding diagram, evidence detours and open questions. Dutch relief uses four clue-interpretation tasks before advancing.
- **People, places & things:** start with a familiar object, follow its incoming/outgoing roles and change claims, inspect sources, then enter a thread. Forces affecting a person’s actions or works are distinguished from evidence of their motives. Missing influences can start an object-scoped research question.
- **Research library:** search/filter all observations, inspect actual relationship endpoints, compare mechanisms and follow research gaps. Context and association never automatically become causal claims.

## Progress and the research loop

The optional 1816 Evidence Expedition goal is three case files and two evidence challenges. Each case requires supporting records, an evidence limit and a next research move. Unique rewards, badges, stages and resume positions persist in this browser. Badges recognise activities and supported in-app interpretations; they do not certify historical truth.

Any thread can start a thesis investigation without completing unrelated stories. An earned case also leads directly into its thread’s thesis workspace. Readers write a provisional argument, methods, claim–evidence entries, counterargument, revision criteria, chapters and a research plan, then export a Markdown draft with registered-source bibliography. An evidence board lets them assign records to support, challenge, context or unresolved roles and explain the decision. These are writer interpretations, not accepted graph relationships.

Dead ends become research tasks: specify the missing link, identify a source capable of testing it, check provenance and scope, preserve conflicting evidence and revise the premise. Sourced proposal JSON can be imported into a separate local corpus and selected as explicitly unreviewed candidate evidence. Imports do not change the registered graph; a repeated claim is not new evidence. Drafts, proposals and progress are local, not shared or synced. Failed saves keep the current draft available for recovery download and block filing; competing draft tabs require an explicit choice. Unusable local candidates can be excluded with a reason.

## Review the published prototype

Open [WorldThreads](https://stewartdavidp-ship-it.github.io/worldthreads/). No account is required. Start with Choose a story, follow its evidence and build a locally saved thesis; use Share feedback to report confusing steps. Work is saved in the reviewer’s browser, so it does not sync between people or devices.

GitHub Pages serves the static site from `main` at the repository root. `.nojekyll` preserves direct static-file serving. The previous research interface remains on `gh-pages` for rollback; its public community archive and service remain separate from this single-player prototype.

## Explore locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000. No build or runtime package installation is required.

## Verify

Use the [test plan and coverage ledger](docs/TEST_PLAN.md) to distinguish verified behavior, partial checks and untested scenarios, and to record each new testing pass. The [human test protocol](docs/HUMAN_TEST_PROTOCOL.md) covers uncoached comprehension and delayed return; the [AI handoff review](docs/AI_HANDOFF_REVIEW.md) records source-review limits from the Chrome test.

```bash
python3 tests/validate-data.py
node --check app.js
```

Optional browser suites require Playwright, installed Chromium and a local server on port 8765:

```bash
node tests/explorer.cjs
node tests/progress.cjs
node tests/objects.cjs
node tests/research-flow.cjs
node tests/argument-board.cjs
node tests/examiner.cjs
node tests/ai-research.cjs
node tests/winning-game.cjs
node tests/returning-player.cjs
node tests/durability.cjs
node tests/interruption.cjs
node tests/adversarial-research.cjs
node tests/accessibility.cjs
node tests/concurrent-progress.cjs
node tests/navigation-matrix.cjs
WORLDTHREADS_KEYBOARD=1 node tests/winning-game.cjs
WORLDTHREADS_BROWSER=firefox node tests/winning-game.cjs
WORLDTHREADS_BROWSER=webkit node tests/winning-game.cjs
```

Run the full sequential confirmation with `WORLDTHREADS_CROSS_BROWSER=1 node tests/run-plan.cjs`. The keyboard route uses Tab traversal and keyboard input throughout. Optional semantic accessibility checks require `axe-core`: install it in a test environment, or use `npm install --prefix work/a11y --no-package-lock --no-save axe-core`, then set `WORLDTHREADS_AXE=1` for the confirmation runner. Automated accessibility checks leave manual review obligations.

Set `WORLDTHREADS_URL` for another port. The research-flow suite runs the Dutch thread through the real game, a case, a thesis, a dead end, a local import and draft export. Its import deliberately repeats a registered authorization claim, demonstrating that file acceptance does not resolve the missing delivery evidence. Set `WORLDTHREADS_PILOT_OUTPUT` to save the pilot document to a chosen path.

Validation checks identifiers, dates, reciprocal object membership, provenance and exact preservation of relationship claims. Browser suites check navigation, game gates, rewards, case files, object/thread entry, imports, exports and mobile width. They do not certify historical truth or thesis quality.

See [the data model](docs/DATA_MODEL.md), [exploration design](docs/EXPLORER_DESIGN.md), [research audit and limits](docs/RESEARCH_AUDIT.md) and [project scope](docs/PROJECT_SPEC.md).

## Feedback

“Share feedback” is available throughout an investigation, including evidence dialogs. Messages and an inspectable, bounded UI-state snapshot go to a private Cloudflare D1 inbox. Device diagnostics are optional; private thesis/research text and browser storage are excluded. Failed sends preserve the message, and retries do not duplicate reports. See [feedback operation and verification](docs/FEEDBACK.md).

### Display settings

The header’s Aa button controls Auto / Light / Dark and four text sizes. Settings stay in this browser; unavailable storage keeps them for the current visit. The single-player prototype defaults to dark mode and honors saved preferences. Story, evidence and thesis type scales with the text-size setting.
