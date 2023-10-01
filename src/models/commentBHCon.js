'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class commentBHCon extends Model {
        static associate(models) {
            // define association here
            commentBHCon.belongsTo(models.commentBHParent, { foreignKey: 'idCommentCha' });
            // casi.hasMany(models.quanTamCaSi, { foreignKey: 'idCaSi' });
        }
    }
    commentBHCon.init(
        {
            idUser: DataTypes.STRING,
            idCommentCha: DataTypes.STRING,
            noiDung: DataTypes.TEXT,
            thoiGian: DataTypes.DOUBLE,
            countLike: DataTypes.DOUBLE,
            nameUserReply: DataTypes.STRING

        },
        {
            sequelize,
            modelName: 'commentBHCon',
        }
    );
    return commentBHCon;
};
