'use strict';
module.exports = (sequelize, DataTypes) => {
  const SchoolFaculty = sequelize.define('SchoolFaculty', {
    schoolId: DataTypes.INTEGER,
    facultyId: DataTypes.INTEGER
  }, {});
  SchoolFaculty.associate = function(models) {
    // associations can be defined here
  };
  return SchoolFaculty;
};