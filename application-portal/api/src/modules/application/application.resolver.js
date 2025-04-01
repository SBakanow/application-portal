import applicationService from './application.service.js'
import companyService from '../company/company.service.js'

const applicationResolvers = {
  Query: {
    async applications(_, args) {
      try {
        return await applicationService.getAllApplications(args)
      } catch (error) {
        throw new Error('Failed to get applications: ', error.message)
      }
    },
    async application(_, { id }) {
      try {
        return await applicationService.getApplication(id)
      } catch (error) {
        throw new Error('Failed to get application: ', error.message)
      }
    },
    async applicationCountByType() {
      try {
        return await applicationService.getCountByType()
      } catch (error) {
        throw new Error('Failed to get Count By Type: ' + error.message)
      }
    },
    async applicationCountByStatus() {
      try {
        return await applicationService.getCountByStatus()
      } catch (error) {
        throw new Error('Failed to get Count By Status: ' + error.message)
      }
    },
    async applicationsCSV() {
      try {
        return await applicationService.getApplicationsForCSV()
      } catch (error) {
        throw new Error('Failed to generate CSV: ' + error.message)
      }
    },
  },
  Application: {
    async company(parent) {
      try {
        return await companyService.getCompany(parent.CompanyId)
      } catch (error) {
        throw new Error('Failed to get company: ', error.message)
      }
    },
  },
  Mutation: {
    async createApplication(_, { input }) {
      const { company: companyData, ...applicationData } = input

      const newApplication = await applicationService.createApplication(
        applicationData,
        companyData
      )

      if (!newApplication) {
        throw new Error(`Application could not be created`)
      }

      return newApplication
    },
    async updateApplication(_, { id, input }) {
      try {
        return await applicationService.updateApplication(id, input)
      } catch (error) {
        throw new Error('Failed to update application: ', error.message)
      }
    },
    async deleteApplication(_, { id }) {
      try {
        return await applicationService.deleteApplication(id)
      } catch (error) {
        throw new Error('Failed to delete application: ', error.message)
      }
    },
  },
}

export default applicationResolvers
