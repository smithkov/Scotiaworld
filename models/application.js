"use strict";
module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    "Application",
    {
      firstname: DataTypes.STRING,
      middlename: DataTypes.STRING,
      lastname: DataTypes.STRING,
      dob: DataTypes.STRING,
      gender: DataTypes.STRING,
      marital: DataTypes.STRING,
      homeAddress: DataTypes.STRING,
      postalAddress: DataTypes.STRING,
      phone: DataTypes.STRING,
      hGrade: DataTypes.STRING,
      hSchoolName: DataTypes.STRING,
      hCompleted: DataTypes.STRING,
      hProgrammeYear: DataTypes.STRING,
      pQualification: DataTypes.STRING,
      pGrade: DataTypes.STRING,
      pSchoolName: DataTypes.STRING,
      pCompleted: DataTypes.STRING,
      pProgrammeYear: DataTypes.STRING,
      highSchoolName: DataTypes.STRING,
      completionYr: DataTypes.STRING,
      englishTest: DataTypes.STRING,
      sponsor: DataTypes.STRING,
      sponsorName: DataTypes.STRING,
      sponsorOccupation: DataTypes.STRING,
      budget: DataTypes.STRING,
      hasApplied: DataTypes.STRING,
      purpose: DataTypes.STRING,
      reasonOfRefusal: DataTypes.STRING,
      moreInfo: DataTypes.STRING,
      hasSubmitted: DataTypes.BOOLEAN,
      stage: DataTypes.STRING,
      decision: DataTypes.STRING,
      credential: DataTypes.STRING,
      countryId: DataTypes.INTEGER,
      hQualification: DataTypes.STRING,
      pQualification: DataTypes.STRING,
      course1: DataTypes.STRING,
      course2: DataTypes.STRING,
      level: DataTypes.STRING,
      cityId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      schoolWish1: DataTypes.STRING,
      schoolWish2: DataTypes.STRING
    },
    {}
  );
  Application.associate = function(models) {
    // associations can be defined here
    //Application.belongsTo(models.Institution);
    Application.belongsTo(models.City);
    Application.belongsTo(models.Country);
    Application.belongsTo(models.User);
  };
  return Application;
};
