'use strict';
module.exports = (sequelize, DataTypes) => {
  const Title = sequelize.define('Title', {
    name: DataTypes.STRING
  }, {});
  Title.associate = function(models) {
    // associations can be defined here
  };
  return Title;
};