const express = require('express')
const cors = require('cors')
const {
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
} = require('./db')

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

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

      return realHeader.map((fieldName) => JSON.stringify(row[fieldName])).join(';')
    }),
  ].join('\r\n')

  return csv
}

app.get('/applications', async (_, res) => {
  try {
    const applications = await getAllApplications()
    applications.forEach((app) => {
      app.skills = JSON.parse(app.skills)
      app.latlong = JSON.parse(app.latlong)
    })
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params
    const application = await getApplication(id)
    application.skills = JSON.parse(application.skills)
    application.latlong = JSON.parse(application.latlong)
    if (application) {
      res.status(200).json(application)
    } else {
      res.status(404).json({ error: 'Application not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/applications-count-by-type', async (_, res) => {
  try {
    const applications = await getCountByType()
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/applications-count-by-status', async (_, res) => {
  try {
    const applications = await getCountByStatus()
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/applications-by-city', async (_, res) => {
  try {
    const applications = await getApplicationsByCity()
    applications.forEach((app) => {
      app.latlong = JSON.parse(app.latlong)
    })
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/applications-csv', async (_, res) => {
  try {
    const applications = await getApplicationsForCSV()
    const applicationsCSV = await createCSV(applications)
    res.status(200).json(applicationsCSV)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/applications', async (req, res) => {
  try {
    const { Company: companyData, ...applicationData } = req.body
    let company = await getCompanyByName(companyData.name)

    if (!company) {
      company = await createCompany(companyData)
    } else {
      await updateCompany(company.id, companyData)
    }

    const application = await createApplication(applicationData, company.id)
    res.status(201).json(application)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { ...applicationData } = req.body
    const applicationResult = await updateApplication(id, applicationData)
    if (applicationResult[0] === 1) {
      const updatedApplication = await getApplication(id)
      updatedApplication.skills = JSON.parse(updatedApplication.skills)
      res.status(200).json(updatedApplication)
    } else {
      res.status(404).json({ error: 'Application not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params
    const applicationResult = await deleteApplication(id)
    if (applicationResult === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ error: 'Application not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/companies', async (_, res) => {
  try {
    const companies = await getAllCompanies()
    res.status(200).json(companies)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params
    const company = await getCompany(id)
    if (company) {
      res.status(200).json(company)
    } else {
      res.status(404).json({ error: 'Company not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/companies', async (req, res) => {
  try {
    const company = await createCompany(req.body)
    res.status(201).json(company)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { ...companyData } = req.body
    const companyResult = await updateCompany(id, companyData)
    if (companyResult[0] === 1) {
      const updatedCompany = await getCompany(id)
      res.status(200).json(updatedCompany)
    } else {
      res.status(404).json({ error: 'Company not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params
    const applicationResult = await deleteCompany(id)
    if (applicationResult === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ error: 'Company not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
