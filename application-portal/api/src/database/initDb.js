import { Sequelize } from 'sequelize'
import { config } from './config.js'
import CompanyModel from '../modules/company/company.model.js'
import ApplicationModel from '../modules/application/application.model.js'

const sequelize = new Sequelize(config.development)

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

db.Company = CompanyModel(sequelize)
db.Application = ApplicationModel(sequelize)

db.Company.hasMany(db.Application, {
  foreignKey: 'CompanyId',
  onDelete: 'Cascade',
  onUpdate: 'Cascade',
})
db.Application.belongsTo(db.Company, {
  foreignKey: 'CompanyId',
})

export default db
