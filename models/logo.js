'use strict';
module.exports = (sequelize, DataTypes) => {
  const Logo = sequelize.define('Logo', {
    topLogo: DataTypes.STRING,
    bottomLogo: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  Logo.associate = function(models) {
    // associations can be defined here
  };
  return Logo;
};