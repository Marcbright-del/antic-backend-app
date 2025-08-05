// src/services/cryptoService.js

const forge = require('node-forge');
const fs = require('fs');

/**
 * Validates a user's PKCS#12 certificate.
 * @param {string} certificatePath - The file path to the uploaded .pfx certificate.
 * @param {string} password - The password for the certificate.
 * @returns {Promise<object>} A promise that resolves with certificate details on success.
 * @throws {Error} Throws an error if validation fails.
 */
const validateCertificate = async (certificatePath, password) => {
  try {
    // 1. Read the PFX file from the filesystem
    const pfxAsn1 = forge.asn1.fromDer(fs.readFileSync(certificatePath, 'binary'));

    // 2. Decrypt the PFX file using the provided password
    const p12 = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, password);

    // 3. Find the user's certificate bag.
    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const userCert = certBags[forge.pki.oids.certBag][0].cert;

    // 4. Perform validation checks on the certificate
    // Check 1: Issuer Verification
    // *** UPDATED THIS LINE TO ACCEPT 'CamGovCA' ***
    const issuerCommonName = userCert.issuer.getField('CN').value;
    if (issuerCommonName !== 'CamGovCA') { // Changed from 'ANTIC'
      throw new Error(`Untrusted issuer: ${issuerCommonName}. Certificate must be issued by CamGovCA.`);
    }
    console.log(`[Crypto Service] ✅ Issuer is trusted: ${issuerCommonName}`);

    // Check 2: Validity Period
    const now = new Date();
    if (now < userCert.validity.notBefore || now > userCert.validity.notAfter) {
      throw new Error('Certificate is expired or not yet valid.');
    }
    console.log('[Crypto Service] ✅ Certificate is within its validity period.');

    // 5. If all checks pass, return the certificate details
    return {
      subject: userCert.subject.attributes.map(attr => ({ [attr.shortName]: attr.value })),
      issuer: userCert.issuer.attributes.map(attr => ({ [attr.shortName]: attr.value })),
      validity: userCert.validity,
      serialNumber: userCert.serialNumber,
    };

  } catch (error) {
    console.error('[Crypto Service] ❌ Validation failed:', error.message);
    throw new Error(`Certificate validation failed: ${error.message}`);
  }
};

module.exports = {
  validateCertificate,
};
