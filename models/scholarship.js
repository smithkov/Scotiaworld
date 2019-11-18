"use strict";
module.exports = (sequelize, DataTypes) => {
  const Scholarship = sequelize.define(
    "Scholarship",
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      grade: DataTypes.STRING,
      email: DataTypes.STRING,
      content: DataTypes.STRING
    },
    {}
  );
  Scholarship.associate = function(models) {
    // associations can be defined here
  };
  return Scholarship;
};
