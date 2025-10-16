"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXMLFile = void 0;
const xml2js_1 = require("xml2js");
const parseXMLFile = (xmlContent) => {
    return new Promise((resolve, reject) => {
        (0, xml2js_1.parseString)(xmlContent, { explicitArray: false, mergeAttrs: true }, (err, result) => {
            if (err)
                return reject(new Error('Invalid XML format'));
            try {
                resolve(extractCreditData(result));
            }
            catch (error) {
                reject(new Error('Failed to extract XML data'));
            }
        });
    });
};
exports.parseXMLFile = parseXMLFile;
const get = (obj, path, fallback = null) => {
    try {
        return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : fallback), obj);
    }
    catch {
        return fallback;
    }
};
const extractCreditData = (xmlObj) => {
    const root = xmlObj?.INProfileResponse || xmlObj?.CreditReport || xmlObj;
    const applicant = get(root, 'Current_Application.Current_Application_Details.Current_Applicant_Details', {});
    const name = `${applicant.First_Name || ''} ${applicant.Last_Name || ''}`.trim() ||
        get(root, 'UserInfo.PersonName', 'Unknown');
    const mobilePhone = applicant.MobilePhoneNumber || get(root, 'UserInfo.MobilePhone', 'N/A');
    const pan = get(root, 'CAIS_Account.CAIS_Account_DETAILS.0.CAIS_Holder_Details.Income_TAX_PAN', 'N/A');
    const creditScore = parseInt(get(root, 'SCORE.BureauScore', '0'));
    const summary = get(root, 'CAIS_Account.CAIS_Summary', {});
    const reportSummary = {
        totalAccounts: parseInt(get(summary, 'Credit_Account.CreditAccountTotal', '0')),
        activeAccounts: parseInt(get(summary, 'Credit_Account.CreditAccountActive', '0')),
        closedAccounts: parseInt(get(summary, 'Credit_Account.CreditAccountClosed', '0')),
        currentBalanceAmount: parseInt(get(summary, 'Total_Outstanding_Balance.Outstanding_Balance_All', '0')),
        securedAccountsAmount: parseInt(get(summary, 'Total_Outstanding_Balance.Outstanding_Balance_Secured', '0')),
        unsecuredAccountsAmount: parseInt(get(summary, 'Total_Outstanding_Balance.Outstanding_Balance_UnSecured', '0')),
        last7DaysEnquiries: parseInt(get(root, 'TotalCAPS_Summary.TotalCAPSLast7Days', '0')),
    };
    const accountData = get(root, 'CAIS_Account.CAIS_Account_DETAILS', []);
    const accountArray = Array.isArray(accountData) ? accountData : [accountData];
    const creditAccounts = accountArray.map((acc) => ({
        accountType: acc.Account_Type || 'Unknown',
        bank: acc.Subscriber_Name || 'Unknown',
        accountNumber: acc.Account_Number || 'N/A',
        currentBalance: parseInt(acc.Current_Balance || '0'),
        amountOverdue: parseInt(acc.Amount_Past_Due || '0'),
        status: acc.Account_Status || 'Unknown',
    }));
    const addr = get(root, 'CAIS_Account.CAIS_Account_DETAILS.0.CAIS_Holder_Address_Details', {});
    const addresses = [
        `${addr.First_Line_Of_Address_non_normalized || ''}, ${addr.City_non_normalized || ''}, ${addr.ZIP_Postal_Code_non_normalized || ''}`.trim(),
    ];
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
