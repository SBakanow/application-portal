import { gql } from 'graphql-tag'

const companyTypeDef = gql`
  scalar DateTime

  type Company {
    id: Int!
    name: String!
    description: String!
    contactEmail: String!
    contactPhone: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    companies: [Company]
    company(id: ID!): Company
  }

  type Mutation {
    createCompany(
      name: String!
      description: String!
      contactEmail: String!
      contactPhone: String!
    ): Company!
    updateCompany(
      name: String
      description: String
      contactEmail: String
      contactPhone: String!
    ): Company!
    deleteCompany(id: ID!): Boolean!
  }
`

export default companyTypeDef
