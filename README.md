
# ANTIC Secure Onboarding Platform - Backend

This repository contains the backend source code for the ANTIC Secure Onboarding Platform, a full-stack web application developed as part of an internship project at the National Agency for Information and Communication Technologies (ANTIC), Cameroon.



## 🌐 Live Application Links

- Frontend (Netlify): [https://velvety-vacherin-33c775.netlify.app/]
- Backend API (Render): [https://antic-onboarding-api.onrender.com/]



## 🚀 Project Overview

The primary goal of this project is to provide a secure, automated, and efficient digital onboarding system for individuals and organizations seeking to use government e-services. The platform establishes a trusted digital identity for users by leveraging strong cryptographic methods, specifically by validating official PKCS#12 digital certificates.

**This backend server is responsible for:**
- Receiving user application data from the frontend
- Securely handling file uploads (ID cards and certificates)
- Performing cryptographic validation of the user's digital certificate
- Persisting the validated application data into a PostgreSQL database

## ✨ System Architecture


[Frontend on Netlify] ---> [Backend API on Render] ---> [PostgreSQL DB on Render]

- **Frontend:** Static single-page application (SPA) providing the user interface
- **Backend:** Node.js server containing all business logic and security features
- **Database:** Cloud-hosted PostgreSQL instance securely storing all application data



## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Cryptography:** node-forge
- **File Handling:** multer
- **Database Driver:** pg
- **Environment Variables:** dotenv
- **CORS Handling:** cors



## ⚙️ Setup and Local Installation

To run this project on your local machine, follow these steps:

1. **Clone the repository:**
	```bash
	git clone https://github.com/Marcbright-del/antic-backend-app.git
	cd antic-backend-app
	
2. **Install dependencies:**
	```bash
	npm install
	
3. **Set up the PostgreSQL Database:**
	- Make sure you have PostgreSQL installed and running.
	- Create a new database (e.g., `antic_onboarding`).
	- Run the SQL script located in `/sql/database.sql` to create the `applications` table.
4. **Configure Environment Variables:**
	- Create a `.env` file in the root of the project.
	- Add the variables as shown in the section below.
5. **Start the server:**
	```bash
	node server.js
	
	The server should now be running on [http://localhost:5000].



## 📝 .env File Configuration

Your `.env` file must contain the following variables for the database connection:

env
# PostgreSQL Database Configuration
DB_USER=your_db_user
DB_HOST=localhost
DB_DATABASE=antic_onboarding
DB_PASSWORD=your_db_password
DB_PORT=5432

# Server Configuration
PORT=5000


## 🔌 API Endpoint

### POST `/api/onboard`

- **Description:** Receives the user's application.
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `fullName` (Text)
  - `emailAddress` (Text)
  - `signatureBase64` (Text)
  - `idCard` (File: .png, .jpg, .pdf)
  - `certificate` (File: .pfx, .p12)
  - `certificatePassword` (Text)

