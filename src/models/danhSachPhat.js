'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class danhSachPhat extends Model {
        static associate(models) {
            // define association here
            danhSachPhat.belongsTo(models.User, { foreignKey: 'idUser' });
        }
    }
    danhSachPhat.init(
        {
            tenDanhSach: DataTypes.STRING,
            idUser: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'danhSachPhat',
        }
    );
    return danhSachPhat;
};
