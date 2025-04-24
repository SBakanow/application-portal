import { gql } from 'graphql-tag'

export const getApplicationsQuery = gql`
  query getApplications($user: String!) {
    applications(user: $user) {
      id
      title
      type
      status
      description
      location
      minSalary
      maxSalary
      createdAt
      company {
        name
      }
      user
    }
  }
`

export const getApplicationsCSVQuery = gql`
  query getApplicationsCsv($user: String!) {
    applicationsCSV(user: $user)
  }
`

export const getApplicationsByCityQuery = gql`
  query getApplicationsByCity($user: String!) {
    applications(user: $user) {
      latlong
      company {
        name
      }
    }
  }
`

export const getCountByTypeQuery = gql`
  query getCountByTypeQuery($user: String!) {
    applicationCountByType(user: $user) {
      count
      type
    }
  }
`

export const getCountByStatusQuery = gql`
  query getCountByStatusQuery($user: String!) {
    applicationCountByStatus(user: $user) {
      count
      status
    }
  }
`

export const getApplicationQuery = gql`
  query application($applicationId: ID!) {
    application(id: $applicationId) {
      id
      title
      type
      status
      description
      location
      minSalary
      maxSalary
      link
      skills
      company {
        id
        name
        description
        contactEmail
        contactPhone
      }
    }
  }
`
