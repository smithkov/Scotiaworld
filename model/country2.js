const Sequelize = require('sequelize');
const db = require('../config/database');
const city = db.define('City',{

  name: {
    type: Sequelize.STRING
    // allowNull defaults to true
  }
})
module.exports = city;
