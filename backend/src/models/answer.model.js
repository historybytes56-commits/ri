export const ANSWERS = ['yes', 'no']

export function createAnswersTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS answers (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      answer     TEXT NOT NULL CHECK (answer IN ('yes', 'no')),
      user_agent TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `)
}
