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
    keyVerify: DataTypes.STRING,
    pass: DataTypes.STRING,
    avatar: DataTypes.TEXT,
    idTypeUser: DataTypes.INTEGER,
    statusUser: DataTypes.STRING,
    avatarGoogle: DataTypes.TEXT,
    typeAccount: DataTypes.STRING,
    idFacebook: DataTypes.STRING,
    avatarFacebook: DataTypes.TEXT

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};