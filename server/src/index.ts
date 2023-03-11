import express, { json, urlencoded } from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import router from './routes/index'
import errorHandler from './middleware/error-handling.middleware'
import { load } from 'yamljs'
import { serve, setup } from 'swagger-ui-express'
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT || 8000
const app = express()

app.use(cors())
// For parsing apllication/json
app.use(json())

// For parsing application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }))

// Path to images folder
app.use('/static', express.static(__dirname + '/assets'))

// Redirect || Routers
app.use('/api', router)

// Errors Middleware
app.use(errorHandler)

app.get('/', (request, response) => {
  response.send('Hello world')
})

const swaggerDocument = load('api.yaml')
app.use('/api-docs', serve, setup(swaggerDocument))

connect('mongodb://localhost:27017/online-storedb').then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
})
