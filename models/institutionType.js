'use strict';
module.exports = (sequelize, DataTypes) => {
  const InstitutionType = sequelize.define('InstitutionType', {
    name: DataTypes.STRING
  }, {});
  InstitutionType.associate = function(models) {
    // associations can be defined here
    InstitutionType.hasMany(models.Institution);
  };
  return InstitutionType;
};
