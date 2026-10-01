import { Router } from 'express'
import * as answerController from '../controllers/answer.controller.js'
import requireAdmin from '../middleware/requireAdmin.js'

const router = Router()

router.get('/', requireAdmin, answerController.getAnswers)
router.post('/', answerController.createAnswer)

export default router
