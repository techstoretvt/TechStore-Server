'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likeBlog extends Model {

    static associate(models) {
      // define association here
      likeBlog.belongsTo(models.User, { foreignKey: 'idUser' })
      likeBlog.belongsTo(models.blog, { foreignKey: 'idBlog' })
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