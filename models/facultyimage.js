"use strict";
module.exports = (sequelize, DataTypes) => {
  const FacultyImage = sequelize.define(
    "FacultyImage",
    {
      name: DataTypes.STRING,
      path: DataTypes.STRING,
      studyAreaId: DataTypes.INTEGER
    },
    {}
  );
  FacultyImage.associate = function(models) {
    FacultyImage.belongsTo(models.StudyArea);
    FacultyImage.hasMany(models.Course);
    // associations can be defined here
  };
  return FacultyImage;
};
