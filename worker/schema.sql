CREATE TABLE IF NOT EXISTS submission (
 id TEXT PRIMARY KEY, receipt_hash TEXT NOT NULL, content_hash TEXT NOT NULL UNIQUE,
 kind TEXT NOT NULL, payload TEXT NOT NULL, alias TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'queued', created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0, lease_until TEXT, review TEXT, public_summary TEXT
);
CREATE INDEX IF NOT EXISTS submission_queue ON submission(status, created_at);
CREATE TABLE IF NOT EXISTS review_event (
 id TEXT PRIMARY KEY, submission_id TEXT NOT NULL REFERENCES submission(id),
 at TEXT NOT NULL, phase TEXT NOT NULL, detail TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS events_submission ON review_event(submission_id, at);
CREATE TABLE IF NOT EXISTS graph_patch (
 submission_id TEXT PRIMARY KEY REFERENCES submission(id), created_at TEXT NOT NULL, patch TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS evidence_update (
 submission_id TEXT PRIMARY KEY REFERENCES submission(id), claim_id TEXT NOT NULL, at TEXT NOT NULL, evidence TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS quota (
 key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at TEXT NOT NULL
);
