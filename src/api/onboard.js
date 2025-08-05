// src/api/onboard.js

const express = require('express');
const multer = require('multer'); // Import multer directly
const path = require('path');
const { handleOnboarding } = require('../controllers/onboardController');

const router = express.Router();

// --- TEMPORARY DEBUGGING SETUP ---
// We are putting the multer configuration directly in this file
// to eliminate any module import/export issues.

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`[Multer Destination] Processing file: ${file.originalname}`);
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    console.log(`[Multer Filename] Assigning filename for: ${file.originalname}`);
    const uniqueSuffix = Date.now();
    const newFilename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log(`[Multer Filename] New filename will be: ${newFilename}`);
    cb(null, newFilename);
  }
});

const upload = multer({ storage: storage });

// We define the route to use our local 'upload' variable.
// It expects fields named 'idCard' and 'certificate'.
router.post(
  '/',
  upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
  ]),
  handleOnboarding
);

module.exports = router;
