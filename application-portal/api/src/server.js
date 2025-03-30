import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import typeDefs from './graphql/schema.js'
import resolvers from './graphql/resolvers.js'
import db from './models/index.js'

const { sequelize } = db

const startServer = async () => {
  await sequelize
    .sync()
    .then(() => {
      console.log('Database & tables created')
    })
    .catch((err) => {
      console.error('Unable to sync database: ', err)
    })

  const server = new ApolloServer({ typeDefs, resolvers })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })

  console.log(`Server ready at ${url}`)
}

startServer()
