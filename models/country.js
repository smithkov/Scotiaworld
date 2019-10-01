'use strict';
module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  Country.associate = function(models) {
    Country.hasMany(models.Institution);
    Country.hasMany(models.Application);
  };
  return Country;
};
