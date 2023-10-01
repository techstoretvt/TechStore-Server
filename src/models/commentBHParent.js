'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class commentBHParent extends Model {
        static associate(models) {
            // define association here
            commentBHParent.hasMany(models.commentBHCon, { foreignKey: 'idCommentCha' });
            // casi.hasMany(models.quanTamCaSi, { foreignKey: 'idCaSi' });
        }
    }
    commentBHParent.init(
        {
            idUser: DataTypes.STRING,
            idBaiHat: DataTypes.STRING,
            noiDung: DataTypes.TEXT,
            thoiGian: DataTypes.DOUBLE,
            countLike: DataTypes.DOUBLE,

        },
        {
            sequelize,
            modelName: 'commentBHParent',
        }
    );
    return commentBHParent;
};
