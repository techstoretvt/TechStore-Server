'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blogs extends Model {

    static associate(models) {
      // define association here
      blogs.belongsTo(models.User, { foreignKey: 'idUser' })
      blogs.hasMany(models.commentBlog, { foreignKey: 'idBlog' })
      blogs.hasMany(models.likeBlog, { foreignKey: 'idBlog' })
      blogs.hasMany(models.imageBlogs, { foreignKey: 'idBlog' })
      blogs.hasOne(models.videoBlogs, { foreignKey: 'idBlog' })

    }
  }
  blogs.init({
    contentHTML: DataTypes.TEXT,
    contentMarkdown: DataTypes.TEXT,
    idUser: DataTypes.STRING,
    timeBlog: DataTypes.STRING,
    viewBlog: DataTypes.INTEGER,
    typeBlog: DataTypes.STRING,
    textShare: DataTypes.STRING,
    stt: DataTypes.INTEGER,
    timePost: DataTypes.DOUBLE,

  }, {
    sequelize,
    modelName: 'blogs',
  });
  return blogs;
};