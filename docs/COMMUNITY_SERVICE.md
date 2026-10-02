# Account-free research service (v0.4)

The public GitHub Pages site calls `https://worldthreads-community.stewartd.workers.dev`. Visitors need no account. The deployment follows the Worker + D1 boundary used by We Both Care (`cdit/worker`): the client never reads the database directly, and private progress is available only with a receipt whose hash is stored server-side. No email address is collected in this release.

## Flow

Select a thread and a locality → generate a methodology prompt and output template → return structured research → preview proposed facts and connections → consent to public publication → submit → retain a private progress link.

The service validates structure and references against a bundled baseline plus published community records. It namespaces contribution IDs, reuses known source URLs, and stores an immutable draft separately from graph records. Each evidence record must include a short exact `quote` (20–500 characters). New observations remain within 1816; existing contextual facts can be endpoints of an evidenced relationship involving 1816. Up to eight claims, six sources, sixteen evidence records and 80 KB are accepted per submission.

Two isolated Workers AI passes assess retrieved passage windows. They use the same model, not two independent witnesses. They inspect the claim, target relevance, source limitations and competing explanations. A Crossref search supplies bibliographic leads; those titles are explicitly not corroborating evidence. Only the narrow claim actually supported by retrieved passages can pass the automated audit. Personal criticism and argumentative/non-factual material stays private with correction instructions.

Public HTML and plain text are supported. HTTPS destinations and redirects are checked for public addresses; redirects, timeouts and response sizes are bounded. PDF/scanned/inaccessible sources remain provisional, never automatically supported. Matching a quote verifies text presence; the contributor's page locator and source authorship are not independently authenticated. Model outputs can still be wrong. Public records retain method, model, time, source fingerprint, limitations and reasons.

## Publication and the graph

New findings can be `automated_support`, `provisional` or contradicted. Provisional findings are visible as uncertain research leads; contradicted new claims remain in review history rather than becoming graph facts. New facts and actual relationships extend a named thread or form a branch. Unsupported card adjacency never creates a causal arrow.

Supporting evidence and counterevidence use factual forms identifying the target claim, cited passage, relevance and limitations. Both automated passes must agree the passage actually bears on the target. Accepted counterevidence marks the affected claim disputed; it does not remove endpoint facts or declare a theory disproven. The original dataset stays intact; overlays and review events preserve the history.

Thread Finder, Causality Explorer and Theory Challenger can receive contribution-level recognition after their relevant automated checks pass. Labels state the automated basis. Resilience Spotter and Source Detective still need specialized criteria and are not automatically awarded. Public aliases are chosen names, not authenticated identities. No popularity scores or leaderboards determine confidence.

## Receipts and retries

Receipts are random capabilities sent in an Authorization header, never public activity. Browser bookmarks keep them in URL fragments; private progress links must not be shared. A stable client-generated receipt permits recovery after a lost submission response, without duplicating review.

The request starts review immediately; a Worker cron every five minutes recovers queued/interrupted jobs. Atomic leases prevent overlapping reviewers. Three service-failure attempts per day are bounded; unavailable jobs stay private and retry the next day. A correction asks the contributor to submit revised research, with the old review retained. Humans are not required for routine publication.

Beta limits: three submissions per IP per hour, sixty submissions per day, twelve review attempts and twenty-four model calls per day. Additional jobs remain queued. Change the explicit variables in `worker/wrangler.jsonc` to change the review budget. The scheduled job is an application service, not a Codex chat automation.

## Development and deployment

Node 22+ (24 preferred), Python 3, and `npm ci` are required for checks. Run `npm test`; this tests the shared protocol and actual Worker handlers with a SQLite D1 adapter, source/model fixtures and real SQL. It exercises privacy, idempotency, budget limits, corrections, failure retries and connected graph branches.

The D1 schema is `worker/schema.sql`, with one canonical set of idempotent create statements. Apply with `npx wrangler d1 execute worldthreads-community --remote --file worker/schema.sql --config worker/wrangler.jsonc`, then deploy with `npm run deploy:api`. The AI binding uses the existing Cloudflare account; no browser API credentials are shipped. No other application's database or authentication is reused.

Worker code bundles the baseline JSON. Redeploy it whenever the baseline graph changes. The site release continues through the `gh-pages` branch. Deploy the API before publishing an interface that depends on it. Source retrieval/model failures never receive a false success result.

`GET /api/health`, `GET /api/graph`, `GET /api/activity`, `GET /api/reviews/:id`, `POST /api/submissions` and receipt-authorized `GET /api/submissions/:id` are the endpoints. Published per-contribution review events remain accessible from their facts/evidence cards even after they leave the recent activity list. Public graph and activity responses are separate from the private draft store. CORS permits the GitHub Pages origin; local browser testing can use a local Worker with `LOCAL_DEV=true`.

Community additions persist in D1 and appear in the live graph. The hourly GitHub export workflow archives only public graph/activity snapshots under `data/community/` on `gh-pages`; the site can read those snapshots when the API is unavailable. Private drafts and receipts never enter GitHub. The baseline JSON remains intact. Deeper scan/PDF retrieval, full source-identity verification and later year expansion remain separate extensions.

## Group research handoff

A group follow-up question can open the existing research preparation flow with its recorded starting fact, chosen source lead, working interpretation and uncertainty. Players may use external assistants or direct source research. The existing return preview and automatic submission review remain the publication path.

After comparison opens, ready members may share one current returned finding (summary, HTTPS source URL and exact passage) with explicit group-sharing consent. The room stores this in the existing member notes, separately from graph claims. It remains labeled unverified, preserves other notes and follow-up questions, and can be revised. No private submission receipt or authorization token is included in the shared finding. This first bridge does not yet synchronize submission status or maintain a multi-finding group research ledger.
