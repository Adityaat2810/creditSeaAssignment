import mongoose, { Schema, Document } from 'mongoose';

export interface ICreditAccount {
  accountType: string;
  bank: string;
  accountNumber: string;
  currentBalance: number;
  amountOverdue: number;
  status: string;
}

export interface IReportSummary {
  totalAccounts: number;
  activeAccounts: number;
  closedAccounts: number;
  currentBalanceAmount: number;
  securedAccountsAmount: number;
  unsecuredAccountsAmount: number;
  last7DaysEnquiries: number;
}

export interface ICreditReport extends Document {
  name: string;
  mobilePhone: string;
  pan: string;
  creditScore: number;
  reportSummary: IReportSummary;
  creditAccounts: ICreditAccount[];
  addresses: string[];
  uploadDate: Date;
}

const CreditAccountSchema = new Schema<ICreditAccount>({
  accountType: { type: String, required: true },
  bank: { type: String, required: true },
  accountNumber: { type: String, required: true },
  currentBalance: { type: Number, required: true, default: 0 },
  amountOverdue: { type: Number, required: true, default: 0 },
  status: { type: String, required: true }
});

const ReportSummarySchema = new Schema<IReportSummary>({
  totalAccounts: { type: Number, required: true, default: 0 },
  activeAccounts: { type: Number, required: true, default: 0 },
  closedAccounts: { type: Number, required: true, default: 0 },
  currentBalanceAmount: { type: Number, required: true, default: 0 },
  securedAccountsAmount: { type: Number, required: true, default: 0 },
  unsecuredAccountsAmount: { type: Number, required: true, default: 0 },
  last7DaysEnquiries: { type: Number, required: true, default: 0 }
});

const CreditReportSchema = new Schema<ICreditReport>({
  name: { type: String, required: true },
  mobilePhone: { type: String, required: true },
  pan: { type: String, required: true },
  creditScore: { type: Number, required: true },
  reportSummary: { type: ReportSummarySchema, required: true },
  creditAccounts: [CreditAccountSchema],
  addresses: [{ type: String }],
  uploadDate: { type: Date, default: Date.now }
});

export const CreditReport = mongoose.model<ICreditReport>('CreditReport', CreditReportSchema);
