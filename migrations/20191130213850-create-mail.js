"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Mails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subject: {
        type: Sequelize.STRING
      },
	  senderName: {
        type: Sequelize.STRING
      },
	  senderPhoto: {
        type: Sequelize.STRING
      },
      hasRead: {
        type: Sequelize.BOOLEAN
      },
      hasReadAdmin: {
        type: Sequelize.BOOLEAN
      },
      isPublic: {
        type: Sequelize.BOOLEAN
      },
      hasDelete: {
        type: Sequelize.BOOLEAN
      },
      isDraft: {
        type: Sequelize.BOOLEAN
      },
      message: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      senderId: {
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
    return queryInterface.dropTable("Mails");
  }
};
