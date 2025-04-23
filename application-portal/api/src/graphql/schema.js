import { gql } from 'graphql-tag'
import applicationTypeDefs from '../modules/application/application.typeDefs.js'
import companyTypeDef from '../modules/company/company.typeDefs.js'

const typeDefs = gql`
  ${applicationTypeDefs}
  ${companyTypeDef}
`
export default typeDefs
