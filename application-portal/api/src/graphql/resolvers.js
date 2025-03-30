import applicationResolver from '../modules/application/application.resolver.js'
import companyResolvers from '../modules/company/company.resolver.js'

const resolvers = {
  Query: {
    ...applicationResolver.Query,
    ...companyResolvers.Query,
  },
  Application: {
    ...applicationResolver.Application,
  },
}

export default resolvers
