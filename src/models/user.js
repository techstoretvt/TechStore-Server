'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    token: DataTypes.STRING,
    pass: DataTypes.STRING,
    avatar: DataTypes.TEXT,
    idTypeUser: DataTypes.INTEGER,
    statusUser: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};