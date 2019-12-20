"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Applications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING
      },
      middlename: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      marital: {
        type: Sequelize.STRING
      },
      homeAddress: {
        type: Sequelize.STRING
      },
      contactEmail: {
        type: Sequelize.STRING
      },
      postalAddress: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      hGrade: {
        type: Sequelize.STRING
      },
      hSchoolName: {
        type: Sequelize.STRING
      },
      hCompleted: {
        type: Sequelize.STRING
      },
      hProgrammeYear: {
        type: Sequelize.STRING
      },
      pQualification: {
        type: Sequelize.STRING
      },
      pGrade: {
        type: Sequelize.STRING
      },
      pSchoolName: {
        type: Sequelize.STRING
      },
      pCompleted: {
        type: Sequelize.STRING
      },
      pProgrammeYear: {
        type: Sequelize.STRING
      },
      highSchoolName: {
        type: Sequelize.STRING
      },
      completionYr: {
        type: Sequelize.STRING
      },
      englishTest: {
        type: Sequelize.STRING
      },
      sponsor: {
        type: Sequelize.STRING
      },
      sponsorName: {
        type: Sequelize.STRING
      },
      sponsorOccupation: {
        type: Sequelize.STRING
      },
      budget: {
        type: Sequelize.STRING
      },
      hasApplied: {
        type: Sequelize.STRING
      },
      purpose: {
        type: Sequelize.STRING
      },
      reasonOfRefusal: {
        type: Sequelize.STRING
      },
      moreinfo: {
        type: Sequelize.STRING
      },
      hasSubmitted: {
        type: Sequelize.BOOLEAN
      },
      hasDeleted: {
        type: Sequelize.BOOLEAN
      },
      stage: {
        type: Sequelize.STRING
      },
      decision: {
        type: Sequelize.STRING
      },
      credential: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER
      },
      countryId: {
        type: Sequelize.INTEGER
      },
      hQualification: {
        type: Sequelize.STRING
      },
      pQualification: {
        type: Sequelize.STRING
      },
      course1: {
        type: Sequelize.STRING
      },
      course2: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.STRING
      },
      cityId: {
        type: Sequelize.INTEGER
      },
      courseId: {
        type: Sequelize.INTEGER
      },
      schoolWish1: {
        type: Sequelize.STRING
      },
      schoolWish2: {
        type: Sequelize.STRING
      },
      eligibilityCheck: {
        type: Sequelize.BOOLEAN
      },
      reqProvision: {
        type: Sequelize.BOOLEAN
      },
      hasFinalSubmit: {
        type: Sequelize.BOOLEAN
      },
      hasDecided: {
        type: Sequelize.BOOLEAN
      },
      hasPaid: {
        type: Sequelize.BOOLEAN
      },
      hasCas: {
        type: Sequelize.BOOLEAN
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Applications");
  }
};
