'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bill extends Model {

    static associate(models) {
      // define association here
      bill.belongsTo(models.User, { foreignKey: 'idUser' })
      bill.belongsTo(models.statusBill, { foreignKey: 'idStatusBill' })
      bill.belongsTo(models.addressUser, { foreignKey: 'idAddressUser' })
      bill.hasMany(models.detailBill, { foreignKey: 'idBill' })
    }
  }
  bill.init({

    idUser: DataTypes.STRING,
    timeBill: DataTypes.STRING,
    idStatusBill: DataTypes.STRING,
    idAddressUser: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'bill',
  });
  return bill;
};