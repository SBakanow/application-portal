const express = require('express')
const router = express.Router()
const applicationController = require('../controllers/applicationController')
const companyController = require('../controllers/companyController')

router.get('/applications', async (_, res) => {
  try {
    const applications = await applicationController.getAllApplications()
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params
    const application = await applicationController.getApplication(id)
    if (application) {
      res.status(200).json(application)
    } else {
      res.status(404).json({ error: 'Application not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/applications-count-by-type', async (_, res) => {
  try {
    const applications = await applicationController.getCountByType()
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/applications-count-by-status', async (_, res) => {
  try {
    const applications = await applicationController.getCountByStatus()
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/applications-by-city', async (_, res) => {
  try {
    const applications = await applicationController.getApplicationsByCity()
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/applications-csv', async (_, res) => {
  try {
    const applications = await applicationController.getApplicationsForCSV()
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/applications', async (req, res) => {
  try {
    const { Company: companyData, ...applicationData } = req.body
    let company = await companyController.getCompanyByName(companyData.name)

    if (!company) {
      company = await companyController.createCompany(companyData)
    } else {
      await updateCompany(company.id, companyData)
    }

    const application = await applicationController.createApplication(
      applicationData,
      company.id
    )
    res.status(201).json(application)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { ...applicationData } = req.body
    const applicationResult = await applicationController.updateApplication(
      id,
      applicationData
    )
    if (applicationResult[0] === 1) {
      const updatedApplication = await applicationController.getApplication(id)
      res.status(200).json(updatedApplication)
    } else {
      res.status(404).json({ error: 'Application not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params
    const applicationResult = await applicationController.deleteApplication(id)
    if (applicationResult === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ error: 'Application not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
