const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

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

module.exports = Company
