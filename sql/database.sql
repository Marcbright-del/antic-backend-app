-- This script creates the table to store the onboarding applications.
-- You can run this directly in a tool like pgAdmin or using the psql command line.

CREATE TABLE applications (
  -- 'id' will be our unique identifier for each application.
  -- 'SERIAL' is a special PostgreSQL type that automatically increments.
  -- 'PRIMARY KEY' means it's the main identifier for a row.
  id SERIAL PRIMARY KEY,

  -- Personal information from the form
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  national_id_number VARCHAR(100),
  email_address VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),

  -- File and signature data
  -- We store the PATH to the ID card, not the image itself.
  id_card_filepath VARCHAR(255) NOT NULL,
  -- The signature is captured as a long string of text (Base64).
  signature_base64 TEXT,

  -- Data extracted from the validated certificate
  certificate_subject_name VARCHAR(255),
  certificate_issuer_name VARCHAR(255),
  certificate_serial_number VARCHAR(255),
  certificate_valid_from TIMESTAMP,
  certificate_valid_to TIMESTAMP,

  -- Application status and timestamps
  -- 'status' will track the application's progress (e.g., 'Pending Review').
  status VARCHAR(50) DEFAULT 'Pending Review',
  -- 'submission_date' will automatically record when the application was created.
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
