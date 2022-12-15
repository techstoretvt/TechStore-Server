'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {

    static associate(models) {
      // define association here
    }
  }
  blog.init({
    titleBlog: DataTypes.STRING,
    contentHTML: DataTypes.TEXT,
    contentMarkdown: DataTypes.TEXT,
    idUser: DataTypes.INTEGER,
    timeBlog: DataTypes.STRING,
    viewBlog: DataTypes.INTEGER,
    imagebase64: DataTypes.TEXT,


  }, {
    sequelize,
    modelName: 'blog',
  });
  return blog;
};