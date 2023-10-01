'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class likeCommentBH extends Model {
        static associate(models) {
            // define association here
            // casi.hasMany(models.baihat, { foreignKey: 'idCaSi' });
            // casi.hasMany(models.quanTamCaSi, { foreignKey: 'idCaSi' });
        }
    }
    likeCommentBH.init(
        {
            idUser: DataTypes.STRING,
            idComment: DataTypes.STRING,
            type: DataTypes.STRING, //parent. child

        },
        {
            sequelize,
            modelName: 'likeCommentBH',
        }
    );
    return likeCommentBH;
};
