'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      titleBlog: {
        type: Sequelize.STRING
      },
      contentHTML: {
        type: Sequelize.TEXT
      },
      contentMarkdown: {
        type: Sequelize.TEXT
      },
      idUser: {
        type: Sequelize.INTEGER
      },
      timeBlog: {
        type: Sequelize.STRING
      },
      viewBlog: {
        type: Sequelize.INTEGER
      },
      descriptionPhoto: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('blogs');
  }
};