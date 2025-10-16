# CreditSea - Credit Report Parser

A fullstack MERN application that processes XML credit report files from Experian, extracts key financial data, and presents it through a clean, user-friendly interface.

## 🚀 Project Overview

CreditSea is a web application that allows users to upload XML credit report files, automatically parses and extracts critical financial information, and displays comprehensive credit reports with detailed analytics.

## 📋 Assignment Requirements Fulfilled

### ✅ Backend (Node.js & Express)
- [x] RESTful API endpoints for XML file upload
- [x] Data extraction and persistence
- [x] Data retrieval for frontend
- [x] Robust error handling and logging
- [x] Express server with proper middleware

### ✅ Frontend (React)
- [x] Responsive UI consuming backend APIs
- [x] Clean, professional interface
- [x] User-friendly navigation and data presentation
- [x] Multiple view modes (Dashboard, Upload, Reports)

### ✅ Database (MongoDB)
- [x] MongoDB for data persistence
- [x] Well-designed schema for credit reports
- [x] Efficient data modeling

### ✅ Testing & Documentation
- [x] Unit and integration tests
- [x] Comprehensive README with setup instructions
- [x] API documentation

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload handling
- **xml2js** - XML parsing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion testing

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client


## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd creditsea
```

### 2. Backend Setup
```bash
cd src/server

npm install # Add envoirment variable (MONGO_URI) to env
```

### 2. Frontend Setup
```bash
cd src/client

npm install
npm run dev
```

### 3. Test Setup
```bash
cd src/tests

npm install
npm run tests
```

