import Application from './application.schema.js'

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
        name: entry.company?.name || '',
        ...entry,
      }

      return realHeader
        .map((fieldName) => JSON.stringify(row[fieldName]))
        .join(';')
    }),
  ].join('\r\n')

  return csv
}

const createApplication = async (user, applicationData, companyData) => {
  try {
    if (!companyData || !companyData.name) {
      throw new Error('Company data is missing or invalid')
    }

    const newApplication = await Application.create({
      ...applicationData,
      company: companyData,
      user,
    })

    if (!newApplication) {
      throw new Error('Failed to create application in MongoDB')
    }

    return newApplication.toObject()
  } catch (error) {
    console.error('Error creating application:', error.message)
    throw new Error(`Failed to create application: ${error.message}`)
  }
}

const getAllApplications = async (filters = {}) => {
  const query = { user: filters.user }

  if (filters.status) {
    query.status = filters.status
  }

  if (filters.reminderEmailSent !== undefined) {
    query.reminderEmailSent = filters.reminderEmailSent
  }

  try {
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .exec()

    if (applications.length === 0) {
      throw new Error('No applications found in MongoDB')
    }

    return applications
  } catch (error) {
    console.error('Error fetching applications:', error.message)
    throw new Error(`Failed to fetch applications: ${error.message}`)
  }
}

const getApplication = async (id) => {
  try {
    const application = await Application.findById(id).exec()

    if (!application) {
      throw new Error(`No application found with ID ${id}`)
    }
    return application
  } catch (error) {
    console.error('Error fetching application:', error.message)
    throw new Error(`Failed to fetch application: ${error.message}`)
  }
}

const getCountByType = async (user) => {
  try {
    const results = await Application.aggregate([
      {
        $match: {
          user: user,
        },
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
        },
      },
    ])

    if (results.length === 0) {
      throw new Error('No applications found')
    }

    return results
  } catch (error) {
    console.error('Error fetching count by type:', error.message)
    throw new Error(`Failed to fetch count by type: ${error.message}`)
  }
}

const getCountByStatus = async (user) => {
  try {
    const results = await Application.aggregate([
      {
        $match: {
          user: user,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ])

    if (results.length === 0) {
      throw new Error('No applications found')
    }

    return results
  } catch (error) {
    console.error('Error fetching count by status:', error.message)
    throw new Error(`Failed to fetch count by status: ${error.message}`)
  }
}

const getApplicationsForCSV = async (user) => {
  try {
    const applications = await Application.find(
      { user },
      'title type status location link createdAt company.name'
    )
      .sort({ createdAt: 1 })
      .lean()
      .exec()

    if (applications.length === 0) {
      throw new Error('No applications found in MongoDB')
    }

    return await createCSV(applications)
  } catch (error) {
    console.error('Error creating csv:', error.message)
    throw new Error(`Error creating csv: ${error.message}`)
  }
}

const updateApplication = async (id, data) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    )

    if (!application) {
      throw new Error('No application found to update in MongoDB')
    }

    return application
  } catch (error) {
    console.error('Error updating application:', error.message)
    throw new Error(`Error updating application: ${error.message}`)
  }
}

const deleteApplication = async (id) => {
  try {
    const application = await Application.findOneAndDelete({ _id: id })

    if (!application) {
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
