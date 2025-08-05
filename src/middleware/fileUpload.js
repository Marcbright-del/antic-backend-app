// src/middleware/fileUpload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import the 'fs' module to check for directories

// --- 0. CHECK IF UPLOADS DIRECTORY EXISTS ---
const uploadsDir = 'uploads/';
if (!fs.existsSync(uploadsDir)) {
  console.log(`Directory '${uploadsDir}' does not exist. Creating it...`);
  fs.mkdirSync(uploadsDir);
} else {
  console.log(`Directory '${uploadsDir}' already exists.`);
}


// --- 1. CONFIGURE STORAGE ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // DEBUG: Log when this function is called
    console.log(`[Multer Destination] Processing file: ${file.originalname}`);
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // DEBUG: Log when this function is called
    console.log(`[Multer Filename] Assigning filename for: ${file.originalname}`);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const newFilename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log(`[Multer Filename] New filename will be: ${newFilename}`);
    cb(null, newFilename);
  }
});

// --- 2. CONFIGURE FILE FILTER ---
const fileFilter = (req, file, cb) => {
  console.log(`[Multer Filter] Filtering file: ${file.originalname}, field: ${file.fieldname}`);
  if (file.fieldname === 'idCard') {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for ID Card. Only JPG, PNG, and PDF are allowed.'), false);
    }
  } else if (file.fieldname === 'certificate') {
    const extension = path.extname(file.originalname).toLowerCase();
    if (extension === '.pfx' || extension === '.p12') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type for Certificate. Only .pfx and .p12 files are allowed.'), false);
    }
  } else {
    cb(new Error('Unexpected file field.'), false);
  }
};

// --- 3. INITIALIZE MULTER ---
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  },
  fileFilter: fileFilter
});

// --- 4. EXPORT THE MIDDLEWARE ---
const uploadFields = upload.fields([
  { name: 'idCard', maxCount: 1 },
  { name: 'certificate', maxCount: 1 }
]);

module.exports = uploadFields;
