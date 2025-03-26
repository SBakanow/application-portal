const { Sequelize } = require('sequelize')
const config = require('../config/config.js')

const sequelize = new Sequelize(config.development)

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

db.Company = require('./Company.js')(sequelize)
db.Application = require('./Application.js')(sequelize)

db.Company.hasMany(db.Application, {
  foreignKey: 'CompanyId',
  onDelete: 'Cascade',
  onUpdate: 'Cascade',
})
db.Application.belongsTo(db.Company, {
  foreignKey: 'CompanyId',
})

module.exports = db
