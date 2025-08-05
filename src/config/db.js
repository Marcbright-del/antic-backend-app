// src/config/db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT, 10),
  
  // This is the new section that enables a secure (SSL) connection
  // required by your live database on Render.
  ssl: {
    rejectUnauthorized: false
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};