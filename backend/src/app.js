import { existsSync } from 'node:fs'
import path from 'node:path'
import cors from 'cors'
import express from 'express'
import config from './config/index.js'
import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'
import routes from './routes/index.js'

const app = express()

app.use(cors({ origin: config.clientUrl }))
app.use(express.json())

app.use('/api', routes)

// Serve the built React app (after `npm run build` in frontend/).
if (existsSync(config.frontendDist)) {
  app.use(express.static(config.frontendDist))
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(config.frontendDist, 'index.html'))
  })
}

app.use(notFound)
app.use(errorHandler)

export default app
