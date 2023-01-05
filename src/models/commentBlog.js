'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commentBlog extends Model {

    static associate(models) {
      // define association here
      commentBlog.belongsTo(models.User, { foreignKey: 'idUser' })
      commentBlog.belongsTo(models.blog, { foreignKey: 'idBlog' })
    }
  }
  commentBlog.init({

    idUser: DataTypes.INTEGER,
    idBlog: DataTypes.INTEGER,
    timeCommentBlog: DataTypes.STRING,
    content: DataTypes.TEXT


  }, {
    sequelize,
    modelName: 'commentBlog',
  });
  return commentBlog;
};