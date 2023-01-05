'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {

    static associate(models) {
      // define association here
      cart.belongsTo(models.User, { foreignKey: 'idUser' })
      cart.belongsTo(models.product, { foreignKey: 'idProduct' })
      cart.belongsTo(models.classifyProduct, { foreignKey: 'idClassifyProduct' })
    }
  }
  cart.init({
    idUser: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    idClassifyProduct: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'cart',
  });
  return cart;
};