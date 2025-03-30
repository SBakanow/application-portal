import { gql } from 'graphql-tag'

const applicationTypeDef = gql`
  scalar DateTime

  type Application {
    id: ID!
    title: String!
    type: String!
    status: String!
    description: String!
    location: String!
    latlong: [String!]!
    minSalary: Int!
    maxSalary: Int!
    link: String!
    skills: [String!]
    reminderEmailSent: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    company: Company
  }

  type Query {
    applications: [Application]
    application(id: ID!): Application
  }

  type Mutation {
    createApplication(
      title: String!
      type: String!
      status: String!
      description: String!
      location: String!
      latlong: [String!]
      minSalary: Int!
      maxSalary: Int!
      link: String!
      skills: [String!]
      companyId: ID!
    ): Application!
    updateApplication(
      title: String
      type: String
      status: String
      description: String
      location: String
      latlong: [String!]
      minSalary: Int
      maxSalary: Int
      link: String
      skills: [String!]
    ): Application!
    deleteApplication(id: ID!): Boolean!
  }
`

export default applicationTypeDef
