'use strict';
module.exports = (sequelize, DataTypes) => {
  const Enquiry = sequelize.define('Enquiry', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    message: DataTypes.STRING
  }, {});
  Enquiry.associate = function(models) {
    // associations can be defined here
  };
  return Enquiry;
};