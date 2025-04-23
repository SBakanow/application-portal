import mongoose from 'mongoose'
const { Schema } = mongoose

const companySchema = new Schema({
  name: { type: String, required: true },
  description: String,
  contactEmail: String,
  contactPhone: String,
})

companySchema.virtual('id').get(function () {
  return this._id.toString()
})

companySchema.set('toJSON', { virtuals: true })
companySchema.set('toObject', { virtuals: true })

export default companySchema
