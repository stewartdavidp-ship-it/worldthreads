# WorldThreads

History isn't a collection of events. It's the threads that connect them.

WorldThreads v0.4 explores the 1816 world through **Source → Observation → Relationship → Thread → Mechanism**. The main context window includes antecedents and later outcomes; the dataset count includes these records. A clearly labeled 1807–1816 coral reconstruction is retained because it cannot responsibly be presented as an annual 1816 measurement.

The dark-mode prototype contains 78 observations, 48 sources, 55 relationship claims, 23 curated threads and 12 mechanism hypotheses. It covers six continents plus marine records, with major research gaps still open. New coverage includes Asante exchange, Madagascar diplomacy, Korean harvest recovery, seasonal Himalayan drought, Bengal cholera reports, Bali’s prolonged crisis, Dutch relief, Swiss crop models, Virginia measurements, Brazil patronage, Andean workshops, Australian flooding and Pacific exchange.

## Explore locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000. No build or runtime package installation is required.

Search by place, topic, date or evidence type; combine region and system filters. Regional markers filter gathered evidence. Choose a thread, open observations, or click a connection to examine its sources, causal status, alternatives and lag. Follow incoming/outgoing connections from the evidence dialog. Filter evidence types and 1816 coverage separately from earlier/later context; sort observations chronologically or by title. Research gaps link to added records, related threads and remaining questions. Mechanisms expose possible buffers, sourced counterexamples and related threads. Similarity is a hypothesis, not proof of a shared cause.

## Verify

```bash
python3 tests/validate-data.py
node --check app.js
```

The optional browser regression requires Playwright and installed Chromium, plus a running local server on port 8765:

```bash
node tests/explorer.cjs
```

Set `WORLDTHREADS_URL` to use another local port. Browser tests check every rendered relationship endpoint, claim dialogs, filtering, keyboard access, evidence traversal and mobile width. Validation checks graph references and evidence metadata; it cannot certify historical truth.

Research stress-test findings and limitations are in [docs/RESEARCH_AUDIT.md](docs/RESEARCH_AUDIT.md). The model is documented in [docs/DATA_MODEL.md](docs/DATA_MODEL.md) and the project scope in [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md).

### Exploring linked facts

Opening a fact focuses on its incoming and outgoing connections. Follow a neighboring fact to recenter, select “Why linked?” to inspect the relationship, and use Back or the exploration breadcrumbs to retrace your steps. Evidence and record details have separate views; sources expand on demand. Navigation history is not presented as a causal chain.

The default opening is now a six-step guided investigation: **why did a weather shock become a food crisis in some places, while others had good harvests?** Readers choose a working hypothesis, examine a counterexample, and reach a qualified conclusion. The full explorer remains available under **Research library**.

The opening **Choose a story** shelf offers three guided journeys. Each includes an unfolding interactive diagram and an explicit unanswered question. **Help extend this story** saves a sourced proposal locally and downloads it for review; proposals are not submitted or added to the established evidence graph.

Dutch relief now includes a four-layer **evidence workbench**: inspect actual record summaries, compare clues and interpret what they support before advancing. A local field journal tracks unique milestones, badges, ranks and resume points. Investigating one story unlocks a claim challenge; all three unlock a comparison challenge. Rewards track participation and supported in-app interpretations, not historical truth or approval of proposals.

The main progression goal is now **3 case files + 2 evidence challenges**. Each case requires supporting records, an evidence limit and the next research move. Expedition completion unlocks a local **thesis workspace** for your provisional argument, methods, claim–evidence table, counterargument and chapter plan, with Markdown export and registered-source bibliography. Badges remain optional skill markers, and in-app completion does not certify scholarly validity.
