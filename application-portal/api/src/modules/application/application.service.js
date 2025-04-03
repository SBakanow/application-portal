import db from '../../database/initDb.js'

const { sequelize, Application, Company } = db

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

const createApplication = async (applicationData, companyData) => {
  const [company, created] = await Company.findOrCreate({
    where: { name: companyData.name },
    defaults: companyData,
  })

  if (!company) {
    throw new Error('Failed to find or create company')
  }

  if (!created) {
    await Company.update(companyData, { where: { id: company.id } })
  }

  const newApplication = await Application.create({
    ...applicationData,
    latlong: JSON.stringify(applicationData.latlong),
    skills: JSON.stringify(applicationData.skills || []),
    CompanyId: company.id,
  })

  if (!newApplication) {
    throw new Error('Failed to create application')
  }

  try {
    return {
      ...newApplication.toJSON(),
      latlong: JSON.parse(newApplication.latlong),
      skills: JSON.parse(newApplication.skills),
    }
  } catch (error) {
    throw new Error('Error parsing JSON fields for skills or latlong')
  }
}

const getAllApplications = async (filters = {}) => {
  const where = {}

  if (filters.status) {
    where.status = filters.status
  }
  if (filters.reminderEmailSent !== undefined) {
    where.reminderEmailSent = filters.reminderEmailSent
  }

  const applications = await Application.findAll({
    where,
    include: Company,
    order: [['createdAt', 'DESC']],
  })

  if (applications.length === 0) {
    throw new Error('No applications found')
  }
  // Parsing JSON fields to get arrays
  try {
    applications.forEach((app) => {
      app.skills = JSON.parse(app.skills)
      app.latlong = JSON.parse(app.latlong)
    })
  } catch (error) {
    throw new Error('Error parsing JSON fields for skills or latlong')
  }
  return applications
}

const getApplication = async (id) => {
  const application = await Application.findByPk(id, {
    include: Company,
  })

  if (!application) {
    throw new Error(`Application with ID ${id} not found`)
  }
  // Parsing JSON fields to get arrays
  try {
    application.skills = JSON.parse(application.skills)
    application.latlong = JSON.parse(application.latlong)
  } catch (error) {
    throw new Error('Error parsing JSON fields for skills or latlong')
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

  if (results.length === 0) {
    throw new Error('No applications found')
  }

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

  if (results.length === 0) {
    throw new Error('No applications found')
  }

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

  if (results.length === 0) {
    throw new Error('No applications found')
  }

  const applications = results.map((result) => result.toJSON())
  return await createCSV(applications)
}

const updateApplication = async (id, data) => {
  const [affectedCount] = await Application.update(
    {
      ...data,
      latlong: JSON.stringify(data.latlong),
      skills: JSON.stringify(data.skills || []),
    },
    {
      where: {
        id,
      },
    }
  )

  if (affectedCount === 0) {
    throw new Error(`Application with ID ${id} could not be updated`)
  }

  return await getApplication(id)
}

const deleteApplication = async (id) => {
  try {
    const application = await getApplication(id)

    const deletedCount = await Application.destroy({
      where: { id },
    })

    if (deletedCount === 0) {
      throw new Error(`Failed to delete application with ID ${id}`)
    }

    return application
  } catch (error) {
    throw new Error(`Failed to delete application: ${error.message}`)
  }
}

export default {
  createApplication,
  getAllApplications,
  getApplication,
  getCountByType,
  getCountByStatus,
  getApplicationsForCSV,
  updateApplication,
  deleteApplication,
}
