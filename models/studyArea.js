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
    StudyArea.belongsTo(models.Institution);
  };
  return StudyArea;
};
