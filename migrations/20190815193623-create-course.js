'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      requirement: {
        type: Sequelize.STRING
      },
      fee: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.STRING
      },
      isPopular: {
        type: Sequelize.BOOLEAN
      },
      time: {
        type: Sequelize.STRING
      },
      path: {
        type: Sequelize.STRING
      },
      institutionId: {
        type: Sequelize.INTEGER
      },
      degreeTypeId: {
        type: Sequelize.INTEGER
      },
      studyAreaId: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Courses');
  }
};
