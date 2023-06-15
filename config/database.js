const { createPool } = require("mysql");

const pool = createPool({
  port: process.env.DB_PORT,
  host: "elgc-admin.ctnbf4kd3i59.ap-south-1.rds.amazonaws.com",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
  connectionLimit: 10,
});

module.exports = pool;
