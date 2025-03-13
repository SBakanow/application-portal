const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
})

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  contactEmail: DataTypes.STRING,
  contactPhone: DataTypes.STRING,
})

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  type: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  description: DataTypes.STRING,
  location: DataTypes.STRING,
  latlong: DataTypes.JSON,
  minSalary: DataTypes.INTEGER,
  maxSalary: DataTypes.INTEGER,
  link: DataTypes.STRING,
  skills: DataTypes.JSON,
  CompanyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'id',
    },
  },
})

Company.hasMany(Application)
Application.belongsTo(Company)

sequelize
  .sync()
  .then(() => {
    console.log('Database & tables created')
  })
  .catch((err) => {
    console.error('Unable to sync database: ', err)
  })

const createApplication = async (data, companyId) => {
  return await Application.create({ ...data, CompanyId: companyId })
}

const getAllApplications = async () => {
  return await Application.findAll({
    include: Company,
  })
}

const getApplication = async (id) => {
  return await Application.findByPk(id, {
    include: Company,
  })
}

const getCountByType = async () => {
  const results = await Application.findAll({
    attributes: [
      'type',
      [sequelize.fn('COUNT', sequelize.col('type')), 'count'],
    ],
    group: ['type'],
  })
  return results.map((result) => result.toJSON())
}

const getCountByStatus = async () => {
  const results = await Application.findAll({
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('status')), 'count'],
    ],
    group: ['status'],
  })
  return results.map((result) => result.toJSON())
}

const getApplicationsByCity = async () => {
  const results = await Application.findAll({
    attributes: ['latlong'],
    include: [
      {
        model: Company,
        attributes: ['name'],
      },
    ],
  })
  return results.map((result) => result.toJSON())
}

const getApplicationsForCSV = async () => {
  const results = await Application.findAll({
    attributes: ['title', 'type', 'status', 'location', 'link', 'createdAt'],
    include: [
      {
        model: Company,
        attributes: ['name'],
      },
    ],
  })
  return results.map((result) => result.toJSON())
}

const updateApplication = async (id, data) => {
  return await Application.update(data, {
    where: {
      id: id,
    },
  })
}

const deleteApplication = async (id) => {
  return await Application.destroy({
    where: {
      id: id,
    },
  })
}

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
  createApplication,
  getAllApplications,
  getApplication,
  getCountByType,
  getCountByStatus,
  getApplicationsByCity,
  getApplicationsForCSV,
  updateApplication,
  deleteApplication,
  createCompany,
  getAllCompanies,
  getCompany,
  getCompanyByName,
  updateCompany,
  deleteCompany,
}
