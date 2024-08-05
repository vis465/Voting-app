'use strict';

module.exports = (sequelize, DataTypes) => {
  const Sc = sequelize.define('Sc', {
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
    tableName: 'Sc',
    timestamps: false
  });

  return Sc;
};
