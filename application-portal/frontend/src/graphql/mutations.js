import { gql } from 'graphql-tag'

export const addApplicationMutation = gql`
  mutation addApplication($input: AddApplicationInput!) {
    createApplication(input: $input) {
      id
      title
    }
  }
`

export const updateApplicationMutation = gql`
  mutation updateApplication($id: ID!, $input: EditApplicationInput!) {
    updateApplication(id: $id, input: $input) {
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

export const deleteApplicationMutation = gql`
  mutation deleteApplication($id: ID!) {
    deleteApplication(id: $id) {
      id
    }
  }
`

export const updateCompanyMutation = gql`
  mutation updateCompany($id: ID!, $input: EditCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      name
      description
      contactEmail
      contactPhone
    }
  }
`

export const deleteCompanyMutation = gql`
  mutation deleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
    }
  }
`
