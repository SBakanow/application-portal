import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import typeDefs from './graphql/schema.js'
import resolvers from './graphql/resolvers.js'
import sendingEmail from './utils/emailService.js'
import 'dotenv/config'
import connectDB from './database/connect.js'

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI)

    const server = new ApolloServer({ typeDefs, resolvers })
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    })
    console.log(`Server ready at ${url}`)
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }

  // sendingEmail()
}

startServer()
