CREATE TABLE IF NOT EXISTS investigation_room (
 id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, case_id TEXT NOT NULL,
 phase TEXT NOT NULL DEFAULT 'investigating', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS investigation_member (
 id TEXT PRIMARY KEY, room_id TEXT NOT NULL REFERENCES investigation_room(id),
 token_hash TEXT NOT NULL, alias TEXT NOT NULL, is_host INTEGER NOT NULL DEFAULT 0,
 lead_id TEXT NOT NULL, notes TEXT, ready INTEGER NOT NULL DEFAULT 0,
 joined_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS room_members ON investigation_member(room_id);
