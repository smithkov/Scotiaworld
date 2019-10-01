'use strict';
module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define('Banner', {
    path: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  Banner.associate = function(models) {
    // associations can be defined here
  };
  return Banner;
};