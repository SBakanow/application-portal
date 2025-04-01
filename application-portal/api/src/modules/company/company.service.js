import db from '../../models/index.js'

const { Application, Company } = db

const createCompany = async (data) => {
  const company = await Company.create(data)

  if (!company) {
    throw new Error('Could not create a new company')
  }

  return company
}

const getAllCompanies = async () => {
  const companies = await Company.findAll({
    include: Application,
  })

  if (companies.length === 0) {
    throw new Error('No companies found')
  }

  return companies
}

const getCompany = async (id) => {
  const company = await Company.findByPk(id, {
    include: Application,
  })

  if (!company) {
    throw new Error(`Company with ID ${id} not found`)
  }

  return company
}

const getCompanyByName = async (name) => {
  const company = await Company.findOne({
    where: { name: name },
  })

  if (!company) {
    throw new Error(`Company with name ${name} not found`)
  }

  return company
}

const getCompanyApplications = async (id) => {
  const applications = await Application.findAll({
    where: {
      companyId: id,
    },
  })
  if (applications.length === 0) {
    throw new Error(`No applications found for company with ID ${id}`)
  }

  return applications
}

const updateCompany = async (id, data) => {
  const [affectedCount] = await Company.update(data, {
    where: {
      id,
    },
  })

  if (affectedCount === 0) {
    throw new Error(`Company with ID ${id} could not be updated`)
  }

  return await getCompany(id)
}

const deleteCompany = async (id) => {
  try {
    const company = await getCompany(id)

    const deletedCount = await Company.destroy({
      where: {
        id: id,
      },
    })

    if (deletedCount === 0) {
      throw new Error(`Failed to delete company with ID ${id}`)
    }

    return company
  } catch (error) {
    throw new Error(`Failed to delete company: ${error.message}`)
  }
}

export default {
  createCompany,
  getAllCompanies,
  getCompany,
  getCompanyByName,
  getCompanyApplications,
  updateCompany,
  deleteCompany,
}
