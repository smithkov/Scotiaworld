"use strict";
module.exports = (sequelize, DataTypes) => {
  const StudyArea = sequelize.define(
    "StudyArea",
    {
      name: DataTypes.STRING
    },
    {}
  );
  StudyArea.associate = function(models) {
    // associations can be defined here
    StudyArea.hasMany(models.Course);
    StudyArea.hasMany(models.FacultyImage);
    StudyArea.belongsTo(models.Institution);
    StudyArea.hasMany(models.FeeRange);
  };
  return StudyArea;
};
