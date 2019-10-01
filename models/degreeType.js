'use strict';
module.exports = (sequelize, DataTypes) => {
  const DegreeType = sequelize.define('DegreeType', {
    name: DataTypes.STRING
  }, {});
  DegreeType.associate = function(models) {
    DegreeType.hasMany(models.Course);

  };
  return DegreeType;
};
