'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },








      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      keyVerify: {
        type: Sequelize.STRING
      },
      pass: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.BLOB('long')
      },
      avatarGoogle: {
        type: Sequelize.TEXT
      },
      avatarFacebook: {
        type: Sequelize.TEXT
      },
      typeAccount: {
        type: Sequelize.STRING
      },
      idFacebook: {
        type: Sequelize.STRING
      },
      idTypeUser: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      statusUser: {
        allowNull: false,
        type: Sequelize.STRING
      },


















      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};