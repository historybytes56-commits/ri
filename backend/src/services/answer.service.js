import db from '../db/index.js'

const insertStmt = db.prepare(
  'INSERT INTO answers (answer, user_agent) VALUES (?, ?) RETURNING id, answer, created_at',
)
const findAllStmt = db.prepare(
  'SELECT id, answer, user_agent, created_at FROM answers ORDER BY id DESC',
)

export function create({ answer, userAgent }) {
  return { ...insertStmt.get(answer, userAgent ?? null) }
}

export function findAll() {
  return findAllStmt.all().map((row) => ({ ...row }))
}
