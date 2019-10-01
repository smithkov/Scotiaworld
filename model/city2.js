const Sequelize = require('sequelize');
const db = require('../config/database');
const country = db.define('Country',{

  name: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  code: {
    type: Sequelize.STRING
    // allowNull defaults to true
  }
})
module.exports = country;
