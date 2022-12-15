'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likeBlog extends Model {

    static associate(models) {
      // define association here
    }
  }
  likeBlog.init({

    idUser: DataTypes.INTEGER,
    idBlog: DataTypes.INTEGER


  }, {
    sequelize,
    modelName: 'likeBlog',
  });
  return likeBlog;
};