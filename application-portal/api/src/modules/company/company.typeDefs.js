import { gql } from 'graphql-tag'

const companyTypeDef = gql`
  scalar DateTime

  type Company {
    id: ID!
    name: String!
    description: String!
    contactEmail: String!
    contactPhone: String
    createdAt: DateTime!
    updatedAt: DateTime!
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

  type Query {
    companies: [Company!]
    company(id: ID!): Company!
    companyByName(name: String!): Company!
  }

  type Mutation {
    createCompany(input: AddCompanyInput!): Company!
    updateCompany(id: ID!, input: EditCompanyInput!): Company!
    deleteCompany(id: ID!): Company
  }
`

export default companyTypeDef
