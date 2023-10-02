'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('baihats', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            tenBaiHat: {
                type: Sequelize.STRING,
            },
            loiBaiHat: {
                type: Sequelize.TEXT,
            },
            anhBia: {
                type: Sequelize.STRING,
            },
            linkBaiHat: {
                type: Sequelize.STRING,
            },
            idCaSi: {
                type: Sequelize.STRING,
            },
            thoiGian: {
                type: Sequelize.DOUBLE,
            },
            luotNghe: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            linkMV: {
                type: Sequelize.TEXT,
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('baihats');
    },
};
