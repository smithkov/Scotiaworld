"use strict";
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      path: DataTypes.STRING,
      originalname: DataTypes.STRING
    },
    {}
  );
  Image.associate = function(models) {
    // associations can be defined here
    //Image.belongsTo(models.Institution);
  };
  return Image;
};
