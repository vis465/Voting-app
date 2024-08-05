'use strict';

module.exports = (sequelize, DataTypes) => {
  const Voter = sequelize.define('Voter', {
    reg_no: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    pass_word: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
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
    section: {
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
    }
  }, {
    tableName: 'voters',
    timestamps: false 
  });

  return Voter;
};
