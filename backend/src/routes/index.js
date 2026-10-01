import { Router } from 'express'
import answerRoutes from './answer.routes.js'
import healthRoutes from './health.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/answers', answerRoutes)

export default router
