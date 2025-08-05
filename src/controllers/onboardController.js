// src/controllers/onboardController.js

const { validateCertificate } = require('../services/cryptoService');
const db = require('../config/db'); // Import our database query function
const fs = require('fs');

const handleOnboarding = async (req, res) => {
  // We need to keep track of file paths for cleanup
  const uploadedFilePaths = [];
  if (req.files) {
    if (req.files.idCard) uploadedFilePaths.push(req.files.idCard[0].path);
    if (req.files.certificate) uploadedFilePaths.push(req.files.certificate[0].path);
  }

  try {
    // --- 1. Basic Validation ---
    if (!req.files || !req.files.certificate || !req.files.idCard) {
      throw new Error('ID Card or Certificate file is missing.');
    }
    const { certificatePassword, fullName, emailAddress, signatureBase64 } = req.body;
    if (!certificatePassword || !fullName || !emailAddress || !signatureBase64) {
      throw new Error('Missing required form fields (password, name, email, or signature).');
    }

    // --- 2. Crypto Validation ---
    const certificatePath = req.files.certificate[0].path;
    const certificateDetails = await validateCertificate(certificatePath, certificatePassword);
    console.log('✅ Certificate validation successful!');

    // --- 3. Save to Database ---
    const idCardPath = req.files.idCard[0].path;

    const queryText = `
      INSERT INTO applications(
        full_name, email_address, signature_base64, id_card_filepath,
        certificate_subject_name, certificate_issuer_name,
        certificate_serial_number, certificate_valid_from, certificate_valid_to
      )
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;

    // Extract subject and issuer common names for storage
    const subjectCN = certificateDetails.subject.find(f => f.CN)?.CN || 'N/A';
    const issuerCN = certificateDetails.issuer.find(f => f.CN)?.CN || 'N/A';

    const values = [
      fullName,
      emailAddress,
      signatureBase64,
      idCardPath,
      subjectCN,
      issuerCN,
      certificateDetails.serialNumber,
      certificateDetails.validity.notBefore,
      certificateDetails.validity.notAfter
    ];

    const dbResult = await db.query(queryText, values);
    console.log(`✅ Application data saved to database with ID: ${dbResult.rows[0].id}`);

    // --- 4. SUCCESS RESPONSE ---
    res.status(201).json({ // 201 Created is a better status code for success
      message: "Application submitted and validated successfully!",
      applicationId: dbResult.rows[0].id,
    });

  } catch (error) {
    // --- 5. FAILURE RESPONSE ---
    console.error('❌ Onboarding process failed:', error.message);
    res.status(400).json({
      message: "Application submission failed.",
      error: error.message,
    });

  } finally {
    // --- 6. CLEANUP ---
    // Securely delete the certificate file. We keep the ID card for admin review.
    if (req.files && req.files.certificate) {
        fs.unlinkSync(req.files.certificate[0].path);
        console.log('Cleaned up certificate file.');
    }
  }
};

module.exports = {
  handleOnboarding,
};