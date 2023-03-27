import express, { json, urlencoded } from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './routes/index'
import errorHandler from './middleware/error-handling.middleware'
import YAML from 'yamljs'
import { serve, setup } from 'swagger-ui-express'
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT || 8000
const app = express()

app.use(json())
app.use(cookieParser())
app.use(cors())

// For parsing application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }))

// Path to images folder
app.use('/static', express.static(__dirname + '/assets'))

// Redirect || Routers
app.use('/api', router)

// Errors Middleware
app.use(errorHandler)

app.get('/activated', (request, response) => {
  response.send('<h1>Account activated successfully</h1>')
})

app.get('/', (request, response) => {
  response.send('Hello world')
})

const swaggerDocument = YAML.load('api.yaml')
app.use('/api-docs', serve, setup(swaggerDocument))

const start = async () => {
  try {
    await connect(process.env.DB_URL)

    app.listen(port, () => {
      console.log(`App listening on port ${port}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
