'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      // define association here
      User.hasMany(models.cart, { foreignKey: 'idUser' })
      User.hasMany(models.bill, { foreignKey: 'idUser' })
      User.hasMany(models.evaluateProduct, { foreignKey: 'idUser' })
      User.hasMany(models.blog, { foreignKey: 'idUser' })
      User.hasMany(models.commentBlog, { foreignKey: 'idUser' })
      User.hasMany(models.likeBlog, { foreignKey: 'idUser' })
      User.hasMany(models.addressUser, { foreignKey: 'idUser' })
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    keyVerify: DataTypes.STRING,
    pass: DataTypes.STRING,
    avatar: DataTypes.TEXT,
    idTypeUser: DataTypes.STRING,
    statusUser: DataTypes.STRING,
    idGoogle: DataTypes.STRING,
    avatarGoogle: DataTypes.TEXT,
    typeAccount: DataTypes.STRING,
    idFacebook: DataTypes.STRING,
    idGithub: DataTypes.STRING,
    avatarFacebook: DataTypes.TEXT,
    avatarGithub: DataTypes.TEXT,

    sdt: DataTypes.STRING,
    gender: DataTypes.STRING,
    birtday: DataTypes.STRING,
    avatarUpdate: DataTypes.STRING,


  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};