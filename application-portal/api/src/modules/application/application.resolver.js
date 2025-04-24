import applicationService from './application.service.js'

const applicationResolvers = {
  Query: {
    async applications(_, args) {
      try {
        return await applicationService.getAllApplications(args)
      } catch (error) {
        throw new Error(`Failed to get applications: ${error.message}`)
      }
    },
    async application(_, { id }) {
      try {
        return await applicationService.getApplication(id)
      } catch (error) {
        throw new Error(`Failed to get application: ${error.message}`)
      }
    },
    async applicationCountByType(_, { user }) {
      try {
        return await applicationService.getCountByType(user)
      } catch (error) {
        throw new Error(`Failed to get Count By Type: ${error.message}`)
      }
    },
    async applicationCountByStatus(_, { user }) {
      try {
        return await applicationService.getCountByStatus(user)
      } catch (error) {
        throw new Error(`Failed to get Count By Status: ${error.message}`)
      }
    },
    async applicationsCSV(_, { user }) {
      try {
        return await applicationService.getApplicationsForCSV(user)
      } catch (error) {
        throw new Error(`Failed to generate CSV: ${error.message}`)
      }
    },
  },
  Mutation: {
    async createApplication(_, { user, input }) {
      const { company: companyData, ...applicationData } = input
      try {
        return await applicationService.createApplication(
          user,
          applicationData,
          companyData
        )
      } catch (error) {
        throw new Error(`Failed to create application: ${error.message}`)
      }
    },
    async updateApplication(_, { id, input }) {
      try {
        return await applicationService.updateApplication(id, input)
      } catch (error) {
        throw new Error(`Failed to update application: ${error.message}`)
      }
    },
    async deleteApplication(_, { id }) {
      try {
        return await applicationService.deleteApplication(id)
      } catch (error) {
        throw new Error(`Failed to delete application: ${error.message}`)
      }
    },
  },
}

export default applicationResolvers
