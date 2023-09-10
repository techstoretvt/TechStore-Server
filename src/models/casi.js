'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class casi extends Model {
        static associate(models) {
            // define association here
        }
    }
    casi.init(
        {
            tenCaSi: DataTypes.STRING,
            moTa: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'casi',
        }
    );
    return casi;
};
