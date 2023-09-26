'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class baihat extends Model {
        static associate(models) {
            // define association here
            baihat.belongsTo(models.casi, { foreignKey: 'idCaSi' });
            baihat.hasOne(models.chiTietDanhSachPhat, {
                foreignKey: 'idBaiHat',
            });
        }
    }
    baihat.init(
        {
            tenBaiHat: DataTypes.STRING,
            loiBaiHat: DataTypes.TEXT,
            anhBia: DataTypes.STRING,
            linkBaiHat: DataTypes.STRING,
            idCaSi: DataTypes.STRING,
            thoiGian: DataTypes.DOUBLE,
            linkMV: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'baihat',
        }
    );
    return baihat;
};
