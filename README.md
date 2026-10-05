# WorldThreads

History isn't a collection of events. It's the threads that connect them.

WorldThreads v0.3 explores the 1816 world through **Source → Observation → Relationship → Thread → Mechanism**. The context window includes antecedents and later outcomes; the dataset count includes these records.

The dark-mode prototype contains 31 observations, 21 sources, 23 relationship claims, nine curated threads and seven mechanism hypotheses. It covers six continents, with major research gaps still open. New threads cover local Tambora damage and relief, reconstructed monsoon drying, colonial orders and violence at Appin, and preparation for the Andean campaign.

## Explore locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000. No build or runtime package installation is required.

Search by place, topic, date or evidence type; combine region and system filters. Regional markers filter gathered evidence. Choose a thread, open observations, or click a connection to examine its sources, causal status, alternatives and lag. Follow incoming/outgoing connections from the evidence dialog. Mechanisms expose possible buffers and related threads. Similarity is a hypothesis, not proof of a shared cause.

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
