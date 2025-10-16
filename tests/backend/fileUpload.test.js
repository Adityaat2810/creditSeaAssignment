const request = require('supertest');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

describe('File Upload Tests with Real XML', () => {
  it('should upload Sagar_Ugle1.xml file', async () => {
    // Read the actual XML file
    const xmlFilePath = path.join(__dirname, 'test-data', 'Sagar_Ugle1.xml');
    const xmlContent = fs.readFileSync(xmlFilePath, 'utf8');

    const response = await request(BASE_URL)
      .post('/api/credit/upload')
      .attach('xmlFile', Buffer.from(xmlContent), 'Sagar_Ugle1.xml')
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Sagar ugle');
    expect(response.body.data.creditScore).toBe(719);
  });

  it('should upload multiple XML files and verify data', async () => {
    // Test with multiple files if you have them
    const testFiles = [
      { name: 'sample1.xml', expectedName: 'John Doe', expectedScore: 750 },
      { name: 'sample2.xml', expectedName: 'Jane Smith', expectedScore: 800 }
    ];

    for (const file of testFiles) {
      const xmlContent = `<?xml version="1.0"?>
      <INProfileResponse>
        <Current_Application>
          <Current_Application_Details>
            <Current_Applicant_Details>
              <First_Name>${file.expectedName.split(' ')[0]}</First_Name>
              <Last_Name>${file.expectedName.split(' ')[1]}</Last_Name>
              <MobilePhoneNumber>9876543210</MobilePhoneNumber>
            </Current_Applicant_Details>
          </Current_Application_Details>
        </Current_Application>
        <CAIS_Account>
          <CAIS_Account_DETAILS>
            <CAIS_Holder_Details>
              <Income_TAX_PAN>TEST1234F</Income_TAX_PAN>
            </CAIS_Holder_Details>
          </CAIS_Account_DETAILS>
        </CAIS_Account>
        <SCORE>
          <BureauScore>${file.expectedScore}</BureauScore>
        </SCORE>
      </INProfileResponse>`;

      const response = await request(BASE_URL)
        .post('/api/credit/upload')
        .attach('xmlFile', Buffer.from(xmlContent), file.name)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(file.expectedName);
      expect(response.body.data.creditScore).toBe(file.expectedScore);
    }
  });
});