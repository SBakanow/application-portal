const express = require('express')
const cors = require('cors')
const sequelize = require('./config/database')
const applicationRoutes = require('./routes/applicationRoutes')
const companyRoutes = require('./routes/companyRoutes')
require('dotenv').config()

const app = express()
const port = process.env.APP_PORT

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
})
