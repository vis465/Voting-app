'use strict';

module.exports = (sequelize, DataTypes) => {
  const Rep = sequelize.define('Rep', {
    reg_no: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true
      }
    },
    sec: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    dept: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    
    votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true
      }
    },
    profile: {
      type: DataTypes.BLOB,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'Rep',
    timestamps: false
  });

  return Rep;
};
