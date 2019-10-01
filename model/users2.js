const Sequelize = require('sequelize');
const db = require('../config/database');
const user = db.define('User',{
  roleId: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  email: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  string: {
    type: Sequelize.STRING
    // allowNull defaults to true
  }
});
module.exports = user;
