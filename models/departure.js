'use strict';
module.exports = (sequelize, DataTypes) => {
  const Departure = sequelize.define('Departure', {
    name: DataTypes.STRING
  }, {});
  Departure.associate = function(models) {
    // associations can be defined here
  };
  return Departure;
};