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
    contentHTML: DataTypes.TEXT,
    contentMarkdown: DataTypes.TEXT,
    idUser: DataTypes.STRING,
    timeBlog: DataTypes.STRING,
    viewBlog: DataTypes.INTEGER,
    typeBlog: DataTypes.STRING,
    textShare: DataTypes.STRING,
    stt: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'blog',
  });
  return blog;
};