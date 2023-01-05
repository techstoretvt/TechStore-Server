'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class imageEvaluateProduct extends Model {

    static associate(models) {
      // define association here
      imageEvaluateProduct.belongsTo(models.evaluateProduct, { foreignKey: 'idEvaluateProduct' })
    }
  }
  imageEvaluateProduct.init({

    idEvaluateProduct: DataTypes.INTEGER,
    imagebase64: DataTypes.TEXT,


  }, {
    sequelize,
    modelName: 'imageEvaluateProduct',
  });
  return imageEvaluateProduct;
};