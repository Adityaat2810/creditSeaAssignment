import { parseString } from 'xml2js';

export interface ParsedCreditData {
  name: string;
  mobilePhone: string;
  pan: string;
  creditScore: number;
  reportSummary: {
    totalAccounts: number;
    activeAccounts: number;
    closedAccounts: number;
    currentBalanceAmount: number;
    securedAccountsAmount: number;
    unsecuredAccountsAmount: number;
    last7DaysEnquiries: number;
  };
  creditAccounts: Array<{
    accountType: string;
    bank: string;
    accountNumber: string;
    currentBalance: number;
    amountOverdue: number;
    status: string;
  }>;
  addresses: string[];
}

export const parseXMLFile = (xmlContent: string): Promise<ParsedCreditData> => {
  return new Promise((resolve, reject) => {
    parseString(xmlContent, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(new Error('Failed to parse XML file'));
        return;
      }

      try {
        const data = extractCreditData(result);
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to extract data from XML'));
      }
    });
  });
};

const extractCreditData = (xmlObj: any): ParsedCreditData => {

  const inquiry = xmlObj?.CreditReport?.Header?.Inquiry || xmlObj?.INProfileResponse?.UserInfo || {};
  const scoreSeg = xmlObj?.CreditReport?.Score || xmlObj?.INProfileResponse?.ScoreSegment || {};
  const accounts = xmlObj?.CreditReport?.Accounts?.Account || xmlObj?.INProfileResponse?.CAIS?.CAIS_Account?.CAIS_Account_DETAILS || [];
  const addresses = xmlObj?.CreditReport?.Addresses?.Address || xmlObj?.INProfileResponse?.UserInfo?.Addresses?.Address || [];
  const enquiries = xmlObj?.CreditReport?.Enquiries?.Enquiry || xmlObj?.INProfileResponse?.CAPS?.CAPS_Application_Details || [];

  // Parse accounts
  const accountsArray = Array.isArray(accounts) ? accounts : [accounts];
  const creditAccounts = accountsArray.filter(Boolean).map((acc: any) => ({
    accountType: acc.AccountType || acc.Account_Type || 'Unknown',
    bank: acc.InstitutionName || acc.Subscriber_Name || 'Unknown',
    accountNumber: acc.AccountNumber || acc.Account_Number || 'N/A',
    currentBalance: parseFloat(acc.CurrentBalance || acc.Current_Balance || '0'),
    amountOverdue: parseFloat(acc.AmountOverdue || acc.Amount_Overdue || '0'),
    status: acc.AccountStatus || acc.Account_Status || 'Unknown'
  }));

  // Parse addresses
  const addressesArray = Array.isArray(addresses) ? addresses : [addresses];
  const addressList = addressesArray.filter(Boolean).map((addr: any) => {
    if (typeof addr === 'string') return addr;
    return `${addr.AddressLine1 || ''} ${addr.AddressLine2 || ''} ${addr.City || ''} ${addr.State || ''} ${addr.PinCode || ''}`.trim();
  });

  // calculate summary
  const activeAccounts = creditAccounts.filter(acc =>
    acc.status.toLowerCase().includes('active') || acc.status === '11'
  ).length;
  const closedAccounts = creditAccounts.filter(acc =>
    acc.status.toLowerCase().includes('closed') || acc.status === '13'
  ).length;
  const currentBalanceAmount = creditAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  // Secured accounts typically home loans, auto loans, gold loans
  const securedTypes = ['home', 'auto', 'vehicle', 'gold', 'property', 'secured'];
  const securedAccountsAmount = creditAccounts
    .filter(acc => securedTypes.some(type => acc.accountType.toLowerCase().includes(type)))
    .reduce((sum, acc) => sum + acc.currentBalance, 0);

  const unsecuredAccountsAmount = currentBalanceAmount - securedAccountsAmount;

  // parse enquiries in last 7 days
  const enquiriesArray = Array.isArray(enquiries) ? enquiries : [enquiries];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const last7DaysEnquiries = enquiriesArray.filter((enq: any) => {
    const dateStr = enq.EnquiryDate || enq.Date_of_Request || '';
    if (!dateStr) return false;
    const enquiryDate = new Date(dateStr);
    return enquiryDate >= sevenDaysAgo;
  }).length;

  return {
    name: inquiry.Name || inquiry.PersonName || 'Unknown',
    mobilePhone: inquiry.MobilePhone || inquiry.MobileTelephoneNumber || 'N/A',
    pan: inquiry.PAN || inquiry.InquiryPAN || 'N/A',
    creditScore: parseInt(scoreSeg.Score || scoreSeg.BureauScore || '0'),
    reportSummary: {
      totalAccounts: creditAccounts.length,
      activeAccounts,
      closedAccounts,
      currentBalanceAmount,
      securedAccountsAmount,
      unsecuredAccountsAmount,
      last7DaysEnquiries
    },
    creditAccounts,
    addresses: addressList
  };
};
