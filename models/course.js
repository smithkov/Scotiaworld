"use strict";
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      name: DataTypes.STRING,
      requirement: DataTypes.STRING,
      fee: DataTypes.STRING,
      duration: DataTypes.STRING,
      isPopular: DataTypes.BOOLEAN,
      studyAreaId: DataTypes.INTEGER,
      institutionId: DataTypes.INTEGER,
      requirementId: DataTypes.INTEGER,
      degreeTypeId: DataTypes.INTEGER,
      feeRangeId: DataTypes.INTEGER,
      time: DataTypes.STRING,
      scholarshipAmount: DataTypes.STRING,
      path: DataTypes.STRING,
      intake: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      facultyImageId: DataTypes.INTEGER
    },
    {}
  );
  Course.associate = function(models) {
    // associations can be defined here
    Course.belongsTo(models.Institution);
    Course.belongsTo(models.DegreeType);
    Course.belongsTo(models.Requirement);
    Course.belongsTo(models.StudyArea);
    Course.belongsTo(models.FeeRange);
	//Course.hasMany(models.Application);
  };
  return Course;
};
