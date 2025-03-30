import express from 'express'
import companyController from '../controllers/companyController.js'

const router = express.Router()

router.get('/companies', async (_, res) => {
  try {
    const companies = await companyController.getAllCompanies()
    res.status(200).json(companies)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params
    const company = await companyController.getCompany(id)
    if (company) {
      res.status(200).json(company)
    } else {
      res.status(404).json({ error: 'Company not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/companies', async (req, res) => {
  try {
    const company = await companyController.createCompany(req.body)
    res.status(201).json(company)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { ...companyData } = req.body
    const companyResult = await companyController.updateCompany(id, companyData)
    if (companyResult[0] === 1) {
      const updatedCompany = await companyController.getCompany(id)
      res.status(200).json(updatedCompany)
    } else {
      res.status(404).json({ error: 'Company not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params
    const applicationResult = await companyController.deleteCompany(id)
    if (applicationResult === 1) {
      res.status(204).send()
    } else {
      res.status(404).json({ error: 'Company not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
