import { Router } from 'express'
import * as answerController from '../controllers/answer.controller.js'

const router = Router()

router.get('/', answerController.getAnswers)
router.post('/', answerController.createAnswer)

export default router
