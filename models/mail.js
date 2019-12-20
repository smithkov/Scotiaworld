"use strict";
module.exports = (sequelize, DataTypes) => {
  const Mail = sequelize.define(
    "Mail",
    {
      subject: DataTypes.STRING,
      hasRead: DataTypes.BOOLEAN,
      hasReadAdmin: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,
      senderId: DataTypes.INTEGER,
      senderPhoto: DataTypes.STRING,
      senderName: DataTypes.STRING,
      message: DataTypes.STRING,
      hasDelete: DataTypes.BOOLEAN,
      isDraft: DataTypes.BOOLEAN,
      isPublic: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE
    },
    {}
  );
  Mail.associate = function(models) {
    // associations can be defined here
    Mail.belongsTo(models.User);
  };
  return Mail;
};
