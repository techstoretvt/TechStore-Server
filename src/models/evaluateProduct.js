'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class evaluateProduct extends Model {

    static associate(models) {
      // define association here
      evaluateProduct.belongsTo(models.User, { foreignKey: 'idUser' })
      evaluateProduct.belongsTo(models.product, { foreignKey: 'idProduct' })
      evaluateProduct.hasMany(models.imageEvaluateProduct, { foreignKey: 'idEvaluateProduct' })
      evaluateProduct.hasMany(models.videoEvaluateProduct, { foreignKey: 'idEvaluateProduct' })
    }
  }
  evaluateProduct.init({

    idUser: DataTypes.STRING,
    idProduct: DataTypes.STRING,
    starNumber: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    stt: DataTypes.INTEGER,
    displayname: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'evaluateProduct',
  });
  return evaluateProduct;
};