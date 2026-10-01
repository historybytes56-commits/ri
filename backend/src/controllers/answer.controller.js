import { ANSWERS } from '../models/answer.model.js'
import * as answerService from '../services/answer.service.js'
import ApiError from '../utils/ApiError.js'

export function createAnswer(req, res) {
  const { answer } = req.body ?? {}
  if (!ANSWERS.includes(answer)) throw new ApiError(400, 'answer must be "yes" or "no"')
  const saved = answerService.create({ answer, userAgent: req.get('user-agent') })
  res.status(201).json(saved)
}

export function getAnswers(req, res) {
  res.json(answerService.findAll())
}
