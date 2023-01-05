'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {

    static associate(models) {
      // define association here
      blog.belongsTo(models.User, { foreignKey: 'idUser' })
      blog.hasMany(models.commentBlog, { foreignKey: 'idBlog' })
      blog.hasMany(models.likeBlog, { foreignKey: 'idBlog' })
    }
  }
  blog.init({
    titleBlog: DataTypes.STRING,
    contentHTML: DataTypes.TEXT,
    contentMarkdown: DataTypes.TEXT,
    idUser: DataTypes.INTEGER,
    timeBlog: DataTypes.STRING,
    viewBlog: DataTypes.INTEGER,
    descriptionPhoto: DataTypes.TEXT,


  }, {
    sequelize,
    modelName: 'blog',
  });
  return blog;
};