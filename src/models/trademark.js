'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trademark extends Model {

    static associate(models) {
      // define association here
    }
  }
  trademark.init({
    nameTrademark: DataTypes.STRING,
    idTypeProduct: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'trademark',
  });
  return trademark;
};