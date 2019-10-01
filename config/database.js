
const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
module.exports = new Sequelize('thescoti_db', 'thescoti_admin', 'nnamdics123', {
  host: '68.66.224.47',
  dialect: 'mysql',
  operatorsAliases:false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
