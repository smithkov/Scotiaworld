"use strict";
module.exports = (sequelize, DataTypes) => {
  const Institution = sequelize.define(
    "Institution",
    {
      name: DataTypes.STRING,
      about: DataTypes.STRING,
      path: DataTypes.STRING,
      cityId: DataTypes.STRING,
      banner: DataTypes.STRING
    },
    {}
  );
  Institution.associate = function(models) {
    // associations can be defined here
    Institution.belongsToMany(models.StudyArea, {
      through: "SchoolFaculty",
      as: "studyAreas",
      foreignKey: "institutionId",
      otherKey: "studyAreaId"
    });
    Institution.hasMany(models.Image);
    Institution.hasMany(models.Course);
    //Institution.hasMany(models.Application);
    Institution.belongsTo(models.InstitutionType);
    Institution.hasMany(models.FeeRange);
    Institution.hasMany(models.surrogateFaculty);
    Institution.belongsTo(models.City);
  };
  return Institution;
};
