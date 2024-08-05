'use strict';

module.exports = (sequelize, DataTypes) => {
  const Eligibility = sequelize.define('Eligibility', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    reg_no: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    roles: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    is_voted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notEmpty: true,
        isInt: true
      }
    }
  }, {
    tableName: 'eligibility',
    timestamps: false
  });

  return Eligibility;
};
