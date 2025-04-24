import mongoose from 'mongoose'
const { Schema } = mongoose
import companySchema from '../company/company.schema.js'

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
    user: String,
  },
  {
    timestamps: true,
  }
)

applicationSchema.virtual('id').get(function () {
  return this._id.toString()
})

applicationSchema.set('toJSON', { virtuals: true })
applicationSchema.set('toObject', { virtuals: true })

const Application = mongoose.model('Application', applicationSchema)

export default Application
