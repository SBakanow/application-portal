const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Company = require('./Company')

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
  CompanyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'id',
    },
  },
})

Company.hasMany(Application)
Application.belongsTo(Company)

module.exports = Application
