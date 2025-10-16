const request = require('supertest');

// Your backend server URL - change this to your actual URL
const BASE_URL = 'http://localhost:5000';

describe('CreditSea Backend API Tests', () => {
  let createdReportId;

  it('should upload XML file and create credit report', async () => {
    const xmlContent = `<?xml version="1.0"?>
    <INProfileResponse>
      <Current_Application>
        <Current_Application_Details>
          <Current_Applicant_Details>
            <First_Name>John</First_Name>
            <Last_Name>Doe</Last_Name>
            <MobilePhoneNumber>9876543210</MobilePhoneNumber>
          </Current_Applicant_Details>
        </Current_Application_Details>
      </Current_Application>
      <CAIS_Account>
        <CAIS_Account_DETAILS>
          <CAIS_Holder_Details>
            <Income_TAX_PAN>ABCDE1234F</Income_TAX_PAN>
          </CAIS_Holder_Details>
          <CAIS_Holder_Address_Details>
            <First_Line_Of_Address_non_normalized>123 Main St</First_Line_Of_Address_non_normalized>
            <City_non_normalized>Mumbai</City_non_normalized>
            <ZIP_Postal_Code_non_normalized>400001</ZIP_Postal_Code_non_normalized>
          </CAIS_Holder_Address_Details>
          <Account_Type>10</Account_Type>
          <Subscriber_Name>ICICI Bank</Subscriber_Name>
          <Account_Number>1234567890</Account_Number>
          <Current_Balance>50000</Current_Balance>
          <Amount_Past_Due>5000</Amount_Past_Due>
          <Account_Status>Active</Account_Status>
        </CAIS_Account_DETAILS>
        <CAIS_Summary>
          <Credit_Account>
            <CreditAccountTotal>2</CreditAccountTotal>
            <CreditAccountActive>1</CreditAccountActive>
            <CreditAccountClosed>1</CreditAccountClosed>
          </Credit_Account>
          <Total_Outstanding_Balance>
            <Outstanding_Balance_All>100000</Outstanding_Balance_All>
            <Outstanding_Balance_Secured>60000</Outstanding_Balance_Secured>
            <Outstanding_Balance_UnSecured>40000</Outstanding_Balance_UnSecured>
          </Total_Outstanding_Balance>
        </CAIS_Summary>
      </CAIS_Account>
      <SCORE>
        <BureauScore>750</BureauScore>
      </SCORE>
      <TotalCAPS_Summary>
        <TotalCAPSLast7Days>2</TotalCAPSLast7Days>
      </TotalCAPS_Summary>
    </INProfileResponse>`;

    const response = await request(BASE_URL)
      .post('/api/credit/upload')
      .attach('xmlFile', Buffer.from(xmlContent), 'test.xml')
      .expect(201);

    console.log('resrponse dara os ',response.body);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('John Doe');
    expect(response.body.data.creditScore).toBe(750);

    // Save the ID for later tests
    createdReportId = response.body.data.reportId;
  });

  it('should get all credit reports', async () => {
    const response = await request(BASE_URL)
      .get('/api/credit/reports')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // Test 3: Get specific report
  it('should get specific credit report by ID', async () => {
    const response = await request(BASE_URL)
      .get(`/api/credit/reports/${createdReportId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(createdReportId);
    expect(response.body.data.name).toBe('John Doe');
    expect(response.body.data.creditScore).toBe(750);
  });

  // Test 4: Get statistics
  it('should get overview statistics', async () => {
    const response = await request(BASE_URL)
      .get('/api/credit/stats/overview')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.totalReports).toBeGreaterThan(0);
    expect(typeof response.body.data.averageCreditScore).toBe('number');
  });

  // Test 5: Delete report
  it('should delete a credit report', async () => {
    const response = await request(BASE_URL)
      .delete(`/api/credit/reports/${createdReportId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('deleted');
  });


  // Test 6: Error handling - empty upload
  it('should handle empty file upload', async () => {
    const response = await request(BASE_URL)
      .post('/api/credit/upload')
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  // Test 7: Get non-existent report
  it('should return 404 for non-existent report', async () => {
    const fakeId = '507f1f77bcf86cd799439011'; // Random MongoDB-like ID
    const response = await request(BASE_URL)
      .get(`/api/credit/reports/${fakeId}`)
      .expect(404);

    expect(response.body.success).toBe(false);
  });
});