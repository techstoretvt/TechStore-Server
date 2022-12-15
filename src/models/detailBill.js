'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detailBill extends Model {

    static associate(models) {
      // define association here
    }
  }
  detailBill.init({

    idBill: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    isReviews: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'detailBill',
  });
  return detailBill;
};