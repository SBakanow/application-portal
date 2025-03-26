const { Application, Company } = require('../models')

const createCompany = async (data) => {
  return await Company.create(data)
}

const getAllCompanies = async () => {
  return await Company.findAll({
    include: Application,
  })
}

const getCompany = async (id) => {
  return await Company.findByPk(id, {
    include: Application,
  })
}

const getCompanyByName = async (name) => {
  return await Company.findOne({
    where: { name: name },
  })
}

const updateCompany = async (id, data) => {
  return await Company.update(data, {
    where: {
      id: id,
    },
  })
}

const deleteCompany = async (id) => {
  await Application.destroy({
    where: {
      CompanyId: id,
    },
  })

  return await Company.destroy({
    where: {
      id: id,
    },
  })
}

module.exports = {
  createCompany,
  getAllCompanies,
  getCompany,
  getCompanyByName,
  updateCompany,
  deleteCompany,
}
