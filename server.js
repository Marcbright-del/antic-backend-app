// server.js

// --- 1. LOAD ENVIRONMENT VARIABLES FIRST ---
const dotenv = require('dotenv');
dotenv.config();

// --- 2. IMPORT OUR TOOLS ---
const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');
const onboardRoutes = require('./src/api/onboard');

// --- 3. INITIALIZE APP ---
const app = express();

// --- 4. CONFIGURE THE APP (MIDDLEWARE) ---
app.use(cors());
app.use(express.json());

// --- 5. TEST DATABASE CONNECTION ---
const testDbConnection = async () => {
  try {
    await db.query('SELECT NOW()');
    console.log('✅ Database connection successful.');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// --- 6. DEFINE A SIMPLE TEST ROUTE ---
app.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to the ANTIC Onboarding API! The server is running." });
});

// --- 7. DEFINE API ROUTES ---
app.use('/api/onboard', onboardRoutes);

// --- 8. GLOBAL ERROR HANDLER ---
// This is a special type of middleware that will catch errors from other parts of the app.
// It MUST have 4 arguments (err, req, res, next).
app.use((err, req, res, next) => {
  console.error("--- AN ERROR OCCURRED ---");
  console.error(err.stack); // This prints the full error details
  res.status(500).send(`Something broke! Error: ${err.message}`);
});


// --- 9. START THE SERVER ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await testDbConnection();
  console.log(`✅ Server is running on port ${PORT}`);
});
