'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bill extends Model {

    static associate(models) {
      // define association here
    }
  }
  bill.init({

    idUser: DataTypes.INTEGER,
    timeBill: DataTypes.STRING,
    idStatusBill: DataTypes.INTEGER,
    idAddressUser: DataTypes.INTEGER


  }, {
    sequelize,
    modelName: 'bill',
  });
  return bill;
};