'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reportBlogs', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      idBlog: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      idUser: {
        type: Sequelize.STRING
      },
      status: {
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
    await queryInterface.dropTable('reportBlogs');
  }
};