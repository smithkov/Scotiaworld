"use strict";
module.exports = (sequelize, DataTypes) => {
  const Requirement = sequelize.define(
    "Requirement",
    {
      name: DataTypes.STRING
    },
    {}
  );
  Requirement.associate = function(models) {
    // associations can be defined here
    Requirement.hasMany(models.Course);
  };
  return Requirement;
};
