const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,

  pool: {
    max: +process.env.DB_POOL_MAX,
    min: +process.env.DB_POOL_MIN,
    acquire: process.env.DB_POOL_ACQUIRE,
    idle: process.env.DB_POOL_IDLE
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// define model
db.users = require("./user.model.js")(sequelize, Sequelize);

module.exports = db;
