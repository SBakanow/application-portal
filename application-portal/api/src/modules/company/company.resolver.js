import companyService from './company.service.js'

const companyResolvers = {
  Query: {
    async companies() {
      try {
        return await companyService.getAllCompanies()
      } catch (error) {
        throw new Error('Failed to get companies: ', error.message)
      }
    },
    async company(_, { id }) {
      try {
        return await companyService.getCompany(id)
      } catch (error) {
        throw new Error('Failed to get company: ', error.message)
      }
    },
    async companyByName(_, { name }) {
      try {
        return await companyService.getCompanyByName(name)
      } catch (error) {
        throw new Error('Failed to get company: ', error.message)
      }
    },
  },
  Company: {
    async applications(parent) {
      try {
        return await companyService.getCompanyApplications(parent.id)
      } catch (error) {
        throw new Error('Failed to get applications: ', error.message)
      }
    },
  },
  Mutation: {
    async createCompany(_, { input }) {
      try {
        return await companyService.createCompany(input)
      } catch (error) {
        throw new Error('Failed to create a new company: ', error.message)
      }
    },
    async updateCompany(_, { id, input }) {
      console.log('Trying')
      try {
        return await companyService.updateCompany(id, input)
      } catch (error) {
        throw new Error(`Failed to update company: ${error.message}`)
      }
    },
    async deleteCompany(_, { id }) {
      try {
        return await companyService.deleteCompany(id)
      } catch (error) {
        throw new Error('Failed to delete company: ', error.message)
      }
    },
  },
}

export default companyResolvers
