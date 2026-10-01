import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import config from '../config/index.js'
import { createAnswersTable } from '../models/answer.model.js'

mkdirSync(path.dirname(config.dbPath), { recursive: true })

const db = new DatabaseSync(config.dbPath)
createAnswersTable(db)

export default db
