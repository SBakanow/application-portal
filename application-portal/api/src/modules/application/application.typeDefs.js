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
    company: Company!
  }

  input AddApplicationInput {
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
    company: AddCompanyInput!
  }

  input EditApplicationInput {
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
    reminderEmailSent: Boolean
  }

  type CountByType {
    type: String!
    count: Int!
  }

  type CountByStatus {
    status: String!
    count: Int!
  }

  type Query {
    applications(status: String, reminderEmailSent: Boolean): [Application!]
    application(id: ID!): Application!
    applicationCountByType: [CountByType!]
    applicationCountByStatus: [CountByStatus!]
    applicationsCSV: String!
  }

  type Mutation {
    createApplication(input: AddApplicationInput!): Application!
    updateApplication(id: ID!, input: EditApplicationInput!): Application!
    deleteApplication(id: ID!): Application
  }
`

export default applicationTypeDef
