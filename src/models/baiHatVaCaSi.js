'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class baiHatVaCaSi extends Model {
        static associate(models) {
            // define association here
            // baiHatVaCaSi.hasMany(models.baihat, { foreignKey: 'idbaiHatVaCaSi' });
            // baiHatVaCaSi.hasMany(models.quanTambaiHatVaCaSi, { foreignKey: 'idbaiHatVaCaSi' });
        }
    }
    baiHatVaCaSi.init(
        {
            idCaSi: DataTypes.STRING,
            idBaiHat: DataTypes.STRING,

        },
        {
            sequelize,
            modelName: 'baiHatVaCaSi',
        }
    );
    return baiHatVaCaSi;
};
