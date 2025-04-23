import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import cors from 'cors'
import typeDefs from './graphql/schema.js'
import resolvers from './graphql/resolvers.js'
import sendingEmail from './utils/emailService.js'
import 'dotenv/config'
import connectDB from './database/connect.js'
import mongoose from 'mongoose'

let httpServer = null
let apolloServer = null

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI)

    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      stopOnTerminationSignals: false,
    })
    await apolloServer.start()

    const app = express()

    const corsOptions = {
      origin: [process.env.MIDDLEWARE_URI],
      credentials: true,
    }

    app.use(cors(corsOptions))
    app.use(express.json())
    app.use('/graphql', expressMiddleware(apolloServer))

    const PORT = process.env.APP_PORT
    httpServer = app.listen(PORT, () => {
      console.log(`Server ready at ${process.env.APOLLO_SERVER_URI}`)
    })

    sendingEmail()
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

const shutdown = async () => {
  console.log('\nShutting down server...')

  if (mongoose.connection.readyState === 1) {
    try {
      await mongoose.connection.close()
      console.log('MongoDB connection closed')
    } catch (err) {
      console.error('Error closing MongoDB connection:', err)
    }
  }

  try {
    await apolloServer.stop()
    console.log('Apollo server stopped')
  } catch (err) {
    console.error('Error stopping Apollo server:', err)
  }

  httpServer.close(() => {
    console.log('HTTP Server closed.')
    process.exit(0)
  })
}

process.on('SIGINT', () => {
  console.log('SIGINT signal received.')
  shutdown()
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.')
  shutdown()
})

process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`)
})

startServer()
