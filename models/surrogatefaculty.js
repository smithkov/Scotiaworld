"use strict";
module.exports = (sequelize, DataTypes) => {
  const surrogateFaculty = sequelize.define(
    "surrogateFaculty",
    {
      name: DataTypes.STRING,
      institutionId: DataTypes.INTEGER,
      studyAreaId: DataTypes.INTEGER,
	  facultyImage: DataTypes.STRING,
	  totalCourse: DataTypes.STRING,
      facultyId: DataTypes.INTEGER
    },
    {}
  );
  surrogateFaculty.associate = function(models) {
    // associations can be defined here
    surrogateFaculty.belongsTo(models.Institution);
    surrogateFaculty.belongsTo(models.StudyArea);
  };
  return surrogateFaculty;
};
