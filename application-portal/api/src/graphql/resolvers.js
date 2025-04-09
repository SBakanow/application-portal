import applicationResolver from '../modules/application/application.resolver.js'

const resolvers = {
  Query: {
    ...applicationResolver.Query,
  },
  Application: {},
  Company: {},
  Mutation: {
    ...applicationResolver.Mutation,
  },
}

export default resolvers
