const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
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
        model: 'Companies',
        key: 'id',
      },
    },
  })

  return Application
}
