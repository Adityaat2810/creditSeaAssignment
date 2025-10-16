export interface CreditAccount {
  accountType: string;
  bank: string;
  accountNumber: string;
  currentBalance: number;
  amountOverdue: number;
  status: "Active" | "Closed" | "Inactive";
}

export interface ReportSummary {
  totalAccounts: number;
  activeAccounts: number;
  closedAccounts: number;
  currentBalanceAmount: number;
  securedAccountsAmount: number;
  unsecuredAccountsAmount: number;
  last7DaysEnquiries: number;
}

export interface CreditReport {
  _id: string;
  name: string;
  mobilePhone: string;
  pan: string;
  creditScore: number;
  reportSummary?: ReportSummary;
  creditAccounts?: CreditAccount[];
  addresses?: string[];
  uploadDate: string;
}

export interface ReportStats {
  totalReports: number;
  averageCreditScore: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export interface UploadResponse {
  reportId: string;
  name: string;
  creditScore: number;
}