import mongoose from 'mongoose'
import Application from '../../modules/application/application.schema.js'

const addUserFieldToAllApplications = async () => {
  try {
    const result = await Application.updateMany(
      {},
      { $set: { user: '<defaultValue>' } }
    )
    console.log('Update result:', result)
  } catch (error) {
    console.error('Error updating documents:', error)
  }
}

const connectDB = async () => {
  try {
    const clientOptions = {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
    }

    await mongoose.connect(
      'mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<appName>',
      clientOptions
    )
    console.log('Connected to database:', mongoose.connection.db.databaseName)
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
    process.exit(1)
  }
}

const runMigration = async () => {
  await connectDB()
  await addUserFieldToAllApplications()
  mongoose.disconnect()
}

runMigration()
