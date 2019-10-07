"use strict";
module.exports = (sequelize, DataTypes) => {
  const FeeRange = sequelize.define(
    "FeeRange",
    {
      fee: DataTypes.STRING,
      studyAreaId: DataTypes.INTEGER,
      institutionId: DataTypes.INTEGER
    },
    {}
  );
  FeeRange.associate = function(models) {
    FeeRange.belongsTo(models.StudyArea);
    FeeRange.belongsTo(models.Institution);
    FeeRange.hasMany(models.Course);
  };
  return FeeRange;
};
