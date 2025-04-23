import { Sequelize } from 'sequelize'
import { DataTypes } from 'sequelize'
import mongoose from 'mongoose'
const { Schema } = mongoose

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database/database.sqlite',
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
  reminderEmailSent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  CompanyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'id',
    },
  },
})

Company.hasMany(Application, {
  foreignKey: 'CompanyId',
  onDelete: 'Cascade',
  onUpdate: 'Cascade',
})

Application.belongsTo(Company, {
  foreignKey: 'CompanyId',
})

const companySchema = new Schema({
  name: { type: String, required: true },
  description: String,
  contactEmail: String,
  contactPhone: String,
})

const applicationSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true, default: 'Pending' },
    description: String,
    location: String,
    latlong: {
      type: [Number],
      validate: {
        validator: (v) => v.length === 2 && v.every((num) => !isNaN(num)),
        message: 'latlong must contain exactly two float values [lat, long].',
      },
    },
    minSalary: Number,
    maxSalary: Number,
    link: String,
    skills: [String],
    reminderEmailSent: { type: Boolean, default: false },
    company: { type: companySchema, required: true },
  },
  {
    timestamps: true,
  }
)

const mongooseApplication = mongoose.model('Application', applicationSchema)

const createApplication = async (applicationData, companyData) => {
  try {
    if (!companyData || !companyData.name) {
      throw new Error('Company data is missing or invalid')
    }

    const newApplication = await mongooseApplication.create({
      ...applicationData,
      company: companyData,
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

const migrateData = async () => {
  const applications = await Application.findAll({
    attributes: [
      'title',
      'type',
      'status',
      'description',
      'location',
      'latlong',
      'minSalary',
      'maxSalary',
      'link',
      'skills',
      'reminderEmailSent',
      'createdAt',
      'updatedAt',
    ],
    include: [
      {
        model: Company,
        attributes: ['name', 'description', 'contactEmail', 'contactPhone'],
      },
    ],
  })

  if (applications.length === 0) {
    throw new Error('No applications found')
  }

  try {
    applications.forEach((app) => {
      app.skills = JSON.parse(app.skills)
      app.latlong = JSON.parse(app.latlong)
    })
  } catch (error) {
    throw new Error('Error parsing JSON fields for skills or latlong')
  }

  applications.forEach(async (app) => {
    try {
      const applicationData = {
        title: app.title,
        type: app.type,
        status: app.status,
        description: app.description,
        location: app.location,
        latlong: app.latlong,
        minSalary: app.minSalary,
        maxSalary: app.maxSalary,
        link: app.link,
        skills: app.skills,
        reminderEmailSent: app.reminderEmailSent,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
      }

      const companyData = app.Company
        ? {
            name: app.Company.name,
            description: app.Company.description,
            contactEmail: app.Company.contactEmail,
            contactPhone: app.Company.contactPhone,
          }
        : null

      await createApplication(applicationData, companyData)
    } catch (error) {
      console.error('Error processing application:', error)
    }
  })
}

const startDB = async () => {
  await sequelize
    .sync()
    .then(() => {
      console.log('Database & tables created')
    })
    .catch((err) => {
      console.error('Unable to sync database: ', err)
    })

  try {
    const clientOptions = {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
    }

    await mongoose.connect(
      'mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<appName>',
      clientOptions
    )
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
    process.exit(1)
  }

  migrateData()
}

startDB()
