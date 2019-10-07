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
      degreeTypeId: DataTypes.INTEGER,
      feeRangeId: DataTypes.INTEGER,
      time: DataTypes.STRING,
      path: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      facultyImageId: DataTypes.INTEGER
    },
    {}
  );
  Course.associate = function(models) {
    // associations can be defined here
    Course.belongsTo(models.Institution);
    Course.belongsTo(models.DegreeType);
    Course.belongsTo(models.StudyArea);
    Course.belongsTo(models.FeeRange);
  };
  return Course;
};
