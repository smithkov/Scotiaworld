'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    roleId: DataTypes.BOOLEAN,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  //  User.hasMany(models.Course);
  };
  return User;
};
