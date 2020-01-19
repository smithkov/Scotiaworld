"use strict";
module.exports = (sequelize, DataTypes) => {
  const StudyArea = sequelize.define(
    "StudyArea",
    {
      name: DataTypes.STRING,
      institutionId: DataTypes.INTEGER,
      originalId: DataTypes.INTEGER
    },
    {}
  );
  StudyArea.associate = function(models) {
    // associations can be defined here
    StudyArea.hasMany(models.Course);
    StudyArea.hasMany(models.FacultyImage);
    StudyArea.hasMany(models.surrogateFaculty);
    StudyArea.belongsTo(models.Institution);
    StudyArea.hasMany(models.FeeRange);
  };
  return StudyArea;
};
