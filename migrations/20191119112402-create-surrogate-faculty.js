"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("surrogateFaculties", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
	  facultImage: {
        type: Sequelize.STRING
      },
	  totalCourse: {
        type: Sequelize.STRING
      },
      institutionId: {
        type: Sequelize.INTEGER
      },
      studyAreaId: {
        type: Sequelize.INTEGER
      },
      facultyId: {
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
    return queryInterface.dropTable("surrogateFaculties");
  }
};
