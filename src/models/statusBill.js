'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class statusBill extends Model {

    static associate(models) {
      // define association here
      statusBill.hasMany(models.bill, { foreignKey: 'idStatusBill' })
    }
  }
  statusBill.init({
    nameStatusBill: DataTypes.STRING,


  }, {
    sequelize,
    modelName: 'statusBill',
  });
  return statusBill;
};