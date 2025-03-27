import express from 'express'
import cors from 'cors'
import db from './models/index.js'
import applicationRoutes from './routes/applicationRoutes.js'
import companyRoutes from './routes/companyRoutes.js'
import sendingEmail from './emailService.js'
import 'dotenv/config'

const app = express()
const port = process.env.APP_PORT

const { sequelize } = db
const whitelist = ['http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(applicationRoutes)
app.use(companyRoutes)

sequelize
  .sync()
  .then(() => {
    console.log('Database & tables created')
  })
  .catch((err) => {
    console.error('Unable to sync database: ', err)
  })

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
  sendingEmail()
})
