'use strict';
module.exports = (sequelize, DataTypes) => {
  const Guideline = sequelize.define('Guideline', {
    name: DataTypes.STRING
  }, {});
  Guideline.associate = function(models) {
    // associations can be defined here
  };
  return Guideline;
};