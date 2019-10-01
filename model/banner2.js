const Sequelize = require('sequelize');
const db = require('../config/database');
const banner = db.define('Banner',{
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  path: {
    type: Sequelize.STRING
    // allowNull defaults to true
  }
})
module.exports = banner;
