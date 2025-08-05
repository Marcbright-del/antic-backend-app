// src/config/db.js

// Import the Pool class from the 'pg' library.
const { Pool } = require('pg');

// Create a new Pool instance with an explicit configuration object.
// This method is the most robust way to connect, as it leaves no room for errors.
// It directly reads the variables we loaded with dotenv and passes them to the Pool.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD), // Forcing it to be a string
  port: parseInt(process.env.DB_PORT, 10), // Forcing it to be a number
});

// We export a query function that will be a wrapper around pool.query.
// This allows us to easily send queries to the database from anywhere in our app.
module.exports = {
  query: (text, params) => pool.query(text, params),
};
