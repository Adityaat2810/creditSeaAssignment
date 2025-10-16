// Global test setup
const { exec } = require('child_process');

// Check if backend server is running
const checkServer = () => {
  return new Promise((resolve) => {
    const { default: request } = require('supertest');
    const BASE_URL = 'http://localhost:5000';

    request(BASE_URL)
      .get('/api/credit/reports')
      .timeout(5000)
      .end((err, res) => {
        if (err) {
          console.log('⚠️  Backend server not running. Please start the server with:');
          console.log('   npm run dev');
          console.log('   or');
          console.log('   npm start');
          process.exit(1);
        } else {
          console.log('✅ Backend server is running');
          resolve();
        }
      });
  });
};

// Run before all tests
beforeAll(async () => {
  console.log('🚀 Starting CreditSea API Tests...');
  await checkServer();
});

// Global test timeout
jest.setTimeout(30000);