const { sequelize, Application, Company } = require('../models')

const createCSV = async (data) => {
  const header = [
    'Firmenname',
    'Jobtitel',
    'Typ',
    'Status',
    'Ort',
    'Link',
    'Beworben am',
  ]

  const realHeader = [
    'name',
    'title',
    'type',
    'status',
    'location',
    'link',
    'createdAt',
  ]

  const csv = [
    header.join(';'),
    ...data.map((entry) => {
      const row = {
        name: entry.Company?.name || '',
        ...entry,
      }

      return realHeader
        .map((fieldName) => JSON.stringify(row[fieldName]))
        .join(';')
    }),
  ].join('\r\n')

  return csv
}

const createApplication = async (data, companyId) => {
  return await Application.create({ ...data, CompanyId: companyId })
}

const getAllApplications = async () => {
  const applications = await Application.findAll({
    include: Company,
    order: [['createdAt', 'DESC']],
  })
  // Parsing JSON fields to get arrays
  if (applications) {
    applications.forEach((app) => {
      app.skills = JSON.parse(app.skills)
      app.latlong = JSON.parse(app.latlong)
    })
  }
  return applications
}

const getApplication = async (id) => {
  const application = await Application.findByPk(id, {
    include: Company,
  })
  // Parsing JSON fields to get arrays
  if (application) {
    application.skills = JSON.parse(application.skills)
    application.latlong = JSON.parse(application.latlong)
  }
  return application
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
  const applications = results.map((result) => result.toJSON())

  if (applications) {
    applications.forEach((app) => {
      app.latlong = JSON.parse(app.latlong)
    })
  }
  return applications
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
  const applications = results.map((result) => result.toJSON())
  return await createCSV(applications)
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

const getPendingReminderApplications = async () => {
  return await Application.findAll({
    where: {
      status: 'Pending',
      reminderEmailSent: false,
    },
    attributes: ['id', 'title', 'status', 'createdAt', 'reminderEmailSent'],
    include: [
      {
        model: Company,
        attributes: ['name'],
      },
    ],
  })
}

const updateApplicationReminderEmailSent = async (id, data) => {
  return await Application.update(data, {
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
  getPendingReminderApplications,
  updateApplicationReminderEmailSent,
}
