import { request } from './client.js'

export const saveAnswer = (answer) =>
  request('/answers', { method: 'POST', body: JSON.stringify({ answer }) })
