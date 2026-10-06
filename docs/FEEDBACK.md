# Private, state-aware feedback

WorldThreads follows InviteFromMe's in-place problem-report pattern, reviewed from the live site and `src/reports.js`, `public/report.js`, and the private D1 reports flow in `stewartdavidp-ship-it/party-invites`.

“Share feedback” opens without navigating away. The player chooses a problem, suggestion, question or historical correction, writes a message, and may provide an email for a reply. It also works over an evidence dialog. Closing returns focus to the opener and preserves the investigation.

## Captured state

The form shows the exact structured context before sending. It includes the app asset version, view and stage, startup state, public story/thread/object/record IDs, evidence roles, filter selections, points/case/badge totals where present, and the current dossier ID. The published-site adapter adds the selected clue, seen/pinned clue IDs, chosen stance and flags indicating whether private reasoning or a question was entered. These flags contain no text.

Optional diagnostics contain viewport dimensions, browser user-agent, error and failed-request locations (no error messages, stacks, request contents, private route IDs or URL query/hash values), and the last twelve allowlisted UI actions. The checkbox removes the whole diagnostic section. The page address loses query/hash values; unrecognized paths are reduced to `[other-page]`.

A small head script records error/failed-request locations before application startup, so a failed collection load can still be reported. Buffers are bounded and remain in memory; capture alone sends nothing.

The module does not send thesis text, research notes, search text, local source contents, aliases, session codes/tokens, all browser storage, screenshots or quoted passages. The typed feedback and optional email are intentionally submitted. Both client and Worker project snapshots through `feedback-core.mjs`; extra fields are dropped before storage.

## Storage and operation

Service: `https://worldthreads-feedback.stewartd.workers.dev/api/feedback`.

The dedicated Worker uses WorldThreads' existing `worldthreads-community` D1 binding, with separate `player_feedback` and `feedback_quota` tables. It does not modify the historical graph, start AI review, send emails or award points. The public API has no inbox/read route. Reports are available only through the operator's authenticated Cloudflare dashboard or CLI.

To review feedback in Cloudflare, open D1 → worldthreads-community → Console and run:

```sql
SELECT id, created_at, kind, note, email, page, context_json, diagnostics_json, status
FROM player_feedback
ORDER BY created_at DESC
LIMIT 100;
```

To finish a report, use its exact ID:

```sql
UPDATE player_feedback SET status='done', resolved_at=datetime('now') WHERE id='REPORT-ID';
```

Reports are deleted 180 days after resolution, or after 365 days regardless of state. An independent daily scheduled handler applies this policy only to these new tables. No messages are sent automatically; use an operator's normal reply workflow if an email was supplied.

The Worker restricts browser origins, validates types and lengths, streams a bounded 32 KB body, rejects the bot field, and limits a connection to eight reports per hour and the service to 200 per day. Connection keys use an hourly HMAC with a Worker secret; no raw IP is stored. Request IDs and content fingerprints allow a lost-acknowledgement retry to recover the same receipt without duplicating the report. Limits and unavailable storage return errors; the client retains the user's message.

## Deployment

Using Wrangler already configured for the WorldThreads account:

```bash
wrangler d1 execute worldthreads-community --config feedback-worker/wrangler.jsonc --remote --file feedback-worker/schema.sql
wrangler secret put FEEDBACK_RATE_SECRET --config feedback-worker/wrangler.jsonc
wrangler deploy --config feedback-worker/wrangler.jsonc
```

Use a generated random secret; do not check it into Git. The allowed origins are the published GitHub Pages origin and the current prototype preview on port 8768. Additional preview origins must be configured explicitly. Local integration tests intercept the endpoint and write only to an in-memory test database.

Load `feedback-log.js` early in the head, then add `feedback.css` and the module `feedback.mjs` to the page, keeping `feedback-core.mjs` alongside it. A `worldthreads-feedback-api` meta tag may override the endpoint for an isolated deployment. The published frontend exports a read-only `WorldThreadsExplore.feedbackState()` adapter and annotates opened dossiers with their public IDs; it exposes no new ability to edit research.

## Verification

```bash
node --test tests/feedback-service.mjs
node tests/feedback.cjs
WORLDTHREADS_PUBLISHED_PREVIEW=http://127.0.0.1:8780 node tests/feedback-published.cjs
```

The service suite uses Node's SQLite adapter to execute the real schema and Worker statements. The browser suites test both frontend generations against this local Worker adapter, including privacy projection, persistence, retry deduplication, native modal stacking, focus return, optional diagnostics, mobile reflow and sampled axe accessibility rules. Synthetic reports are never sent to production. Worker packaging is checked with Wrangler. These tests are not a physical-device or screen-reader certification.
