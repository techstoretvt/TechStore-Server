'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      contentHTML: {
        type: Sequelize.TEXT
      },
      contentMarkdown: {
        type: Sequelize.TEXT
      },
      idUser: {
        type: Sequelize.STRING
      },
      timeBlog: {
        type: Sequelize.STRING
      },
      typeBlog: {
        type: Sequelize.STRING
      },
      textShare: {
        type: Sequelize.STRING
      },
      viewBlog: {
        type: Sequelize.INTEGER
      },

      stt: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
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