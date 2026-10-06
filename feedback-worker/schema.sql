CREATE TABLE IF NOT EXISTS player_feedback (
 id TEXT PRIMARY KEY, created_at TEXT NOT NULL DEFAULT (datetime('now')),
 kind TEXT NOT NULL CHECK(kind IN ('problem','suggestion','question','history')),
 note TEXT NOT NULL, email TEXT, page TEXT, version TEXT NOT NULL,
 context_json TEXT NOT NULL, diagnostics_json TEXT, fingerprint TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewing','done')),
 resolved_at TEXT
);
CREATE INDEX IF NOT EXISTS player_feedback_inbox ON player_feedback(status,created_at);
CREATE TABLE IF NOT EXISTS feedback_quota (key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL);
