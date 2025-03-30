import applicationService from './application.service.js'
import companyService from '../company/company.service.js'

const applicationResolvers = {
  Query: {
    applications() {
      return applicationService.getAllApplications()
    },
    application(_, args) {
      return applicationService.getApplication(args.id)
    },
  },
  Application: {
    company(parent) {
      return companyService.getCompany(parent.CompanyId)
    },
  },
}

export default applicationResolvers
