import companyService from './company.service.js'

const companyResolvers = {
  Query: {
    companies() {
      return companyService.getAllCompanies()
    },
    company(_, args) {
      return companyService.getCompany(args.id)
    },
  },
}

export default companyResolvers
