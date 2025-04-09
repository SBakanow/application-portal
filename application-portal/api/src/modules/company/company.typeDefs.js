import { gql } from 'graphql-tag'

const companyTypeDef = gql`
  scalar DateTime

  type Company {
    id: ID!
    name: String!
    description: String!
    contactEmail: String!
    contactPhone: String
    applications: [Application!]
  }

  input AddCompanyInput {
    name: String!
    description: String!
    contactEmail: String!
    contactPhone: String
  }

  input EditCompanyInput {
    name: String
    description: String
    contactEmail: String
    contactPhone: String
  }
`

export default companyTypeDef
