import { timingSafeEqual } from 'node:crypto'
import config from '../config/index.js'
import ApiError from '../utils/ApiError.js'

function matches(given, expected) {
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Allows the request only with header `X-Admin-Password: <ADMIN_PASSWORD>`.
export default function requireAdmin(req, res, next) {
  if (!config.adminPassword) throw new ApiError(503, 'ADMIN_PASSWORD is not set on the server')
  if (!matches(req.get('x-admin-password') ?? '', config.adminPassword)) {
    throw new ApiError(401, 'Wrong password')
  }
  next()
}
