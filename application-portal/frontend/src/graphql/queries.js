import { gql } from 'graphql-tag'

export const getApplicationsQuery = gql`
  query getApplications {
    applications {
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
    }
  }
`

export const getApplicationsCSVQuery = gql`
  query getApplicationsCsv {
    applicationsCSV
  }
`

export const getApplicationsByCityQuery = gql`
  query getApplicationsByCity {
    applications {
      latlong
      company {
        name
      }
    }
  }
`

export const getCountByTypeQuery = gql`
  query getCountByTypeQuery {
    applicationCountByType {
      count
      type
    }
  }
`

export const getCountByStatusQuery = gql`
  query getCountByStatusQuery {
    applicationCountByStatus {
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
