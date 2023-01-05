'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class classifyProduct extends Model {

    static associate(models) {
      // define association here
      classifyProduct.belongsTo(models.product, { foreignKey: 'idProduct', as: 'classifyProduct-product' })
      classifyProduct.hasMany(models.cart, { foreignKey: 'idClassifyProduct' })
    }
  }
  classifyProduct.init({
    idProduct: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    nameClassifyProduct: DataTypes.STRING,
    STTImg: DataTypes.INTEGER


  }, {
    sequelize,
    modelName: 'classifyProduct',
  });
  return classifyProduct;
};