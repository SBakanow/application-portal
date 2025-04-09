import mongoose from 'mongoose'

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
}

const connectDB = async (uri) => {
  if (mongoose.connection.readyState === 1) {
    console.log('Already connected to MongoDB')
    return
  }

  try {
    await mongoose.connect(uri, clientOptions)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
    process.exit(1)
  }
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected')
})

mongoose.connection.on('disconnecting', () => {
  console.log('MongoDB disconnecting')
})

export default connectDB
