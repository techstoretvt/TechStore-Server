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
        allowNull: false,
        type: Sequelize.STRING
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pass: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.BLOB('long')
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