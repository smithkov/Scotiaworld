"use strict";
module.exports = (sequelize, DataTypes) => {
  const DegreeType = sequelize.define(
    "DegreeType",
    {
      name: DataTypes.STRING,
      requirements: DataTypes.STRING
    },
    {}
  );
  DegreeType.associate = function(models) {
    DegreeType.hasMany(models.Course);
  };
  return DegreeType;
};
