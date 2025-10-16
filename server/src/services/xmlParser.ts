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
    parseString(xmlContent, {
      explicitArray: false,
      mergeAttrs: true,
      trim: true,
      normalize: true
    }, (err, result) => {
      if (err) {
        console.error('XML parsing error:', err);
        return reject(new Error('Invalid XML format'));
      }

      try {
        const extractedData = extractCreditData(result);
        resolve(extractedData);
      } catch (error) {
        console.error('Data extraction error:', error);
        reject(new Error('Failed to extract credit data from XML'));
      }
    });
  });
};

const get = (obj: any, path: string, fallback: any = null): any => {
  try {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : fallback), obj);
  } catch {
    return fallback;
  }
};

const safeParseInt = (value: any, fallback: number = 0): number => {
  if (value === null || value === undefined || value === '') return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

const extractCreditData = (xmlObj: any): ParsedCreditData => {
  const root = xmlObj?.INProfileResponse || xmlObj;

  if (!root) {
    throw new Error('Invalid XML structure: Missing root element');
  }

  // basic details
  const applicant = get(root, 'Current_Application.Current_Application_Details.Current_Applicant_Details', {});
  const firstName = applicant.First_Name || '';
  const lastName = applicant.Last_Name || '';
  const name = `${firstName} ${lastName}`.trim() || 'Unknown';

  const mobilePhone = applicant.MobilePhoneNumber || 'N/A';

  // extract pan from multiple possible locations
  let pan = get(root, 'CAIS_Account.CAIS_Account_DETAILS.0.CAIS_Holder_Details.Income_TAX_PAN', '');
  if (!pan) {
    pan = get(root, 'Current_Application.Current_Application_Details.Current_Applicant_Details.IncomeTaxPan', 'N/A');
  }

  // extract credi score
  const creditScore = safeParseInt(get(root, 'SCORE.BureauScore', '0'));

  // extract report summary
  const summary = get(root, 'CAIS_Account.CAIS_Summary', {});
  const creditAccountSummary = get(summary, 'Credit_Account', {});
  const outstandingBalance = get(summary, 'Total_Outstanding_Balance', {});

  const reportSummary = {
    totalAccounts: safeParseInt(get(creditAccountSummary, 'CreditAccountTotal', '0')),
    activeAccounts: safeParseInt(get(creditAccountSummary, 'CreditAccountActive', '0')),
    closedAccounts: safeParseInt(get(creditAccountSummary, 'CreditAccountClosed', '0')),
    currentBalanceAmount: safeParseInt(get(outstandingBalance, 'Outstanding_Balance_All', '0')),
    securedAccountsAmount: safeParseInt(get(outstandingBalance, 'Outstanding_Balance_Secured', '0')),
    unsecuredAccountsAmount: safeParseInt(get(outstandingBalance, 'Outstanding_Balance_UnSecured', '0')),
    last7DaysEnquiries: safeParseInt(get(root, 'TotalCAPS_Summary.TotalCAPSLast7Days', '0')),
  };

  // extrcat credit accounts
  const accountData = get(root, 'CAIS_Account.CAIS_Account_DETAILS', []);
  const accountArray = Array.isArray(accountData) ? accountData : [accountData].filter(Boolean);

  const creditAccounts = accountArray.map((acc: any) => ({
    accountType: acc.Account_Type || 'Unknown',
    bank: (acc.Subscriber_Name || 'Unknown').trim(),
    accountNumber: acc.Account_Number || 'N/A',
    currentBalance: safeParseInt(acc.Current_Balance, 0),
    amountOverdue: safeParseInt(acc.Amount_Past_Due, 0),
    status: acc.Account_Status || 'Unknown',
  }));

  // extract address from all account details
  const addressesSet = new Set<string>();

  accountArray.forEach((acc: any) => {
    const addr = acc.CAIS_Holder_Address_Details;
    if (addr) {
      const addressParts = [
        addr.First_Line_Of_Address_non_normalized,
        addr.Second_Line_Of_Address_non_normalized,
        addr.Third_Line_Of_Address_non_normalized,
        addr.City_non_normalized,
        addr.State_non_normalized,
        addr.ZIP_Postal_Code_non_normalized
      ].filter(part => part && part.trim() !== '');

      if (addressParts.length > 0) {
        addressesSet.add(addressParts.join(', '));
      }
    }
  });

  // If no addresses found in accounts, try to get from current application
  if (addressesSet.size === 0) {
    const currentAddr = get(root, 'Current_Application.Current_Application_Details.Current_Applicant_Address_Details', {});
    const addressParts = [
      currentAddr.FlatNoPlotNoHouseNo,
      currentAddr.BldgNoSocietyName,
      currentAddr.RoadNoNameAreaLocality,
      currentAddr.City,
      currentAddr.State,
      currentAddr.PINCode
    ].filter(part => part && part.trim() !== '');

    if (addressParts.length > 0) {
      addressesSet.add(addressParts.join(', '));
    }
  }

  const addresses = Array.from(addressesSet);
  if (addresses.length === 0) {
    addresses.push('Address not available');
  }

  return {
    name,
    mobilePhone,
    pan,
    creditScore,
    reportSummary,
    creditAccounts,
    addresses,
  };
};