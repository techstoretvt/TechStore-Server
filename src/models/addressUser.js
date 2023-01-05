'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class addressUser extends Model {

    static associate(models) {
      // define association here
      addressUser.hasMany(models.bill, { foreignKey: 'idAddressUser' })
      addressUser.belongsTo(models.User, { foreignKey: 'idUser' })
    }
  }
  addressUser.init({
    idUser: DataTypes.INTEGER,
    isDefault: DataTypes.STRING,
    fullname: DataTypes.STRING,
    sdt: DataTypes.STRING,
    country: DataTypes.STRING,
    district: DataTypes.STRING,
    addressText: DataTypes.TEXT,


  }, {
    sequelize,
    modelName: 'addressUser',
  });
  return addressUser;
};