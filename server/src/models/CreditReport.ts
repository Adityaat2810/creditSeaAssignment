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

const CreditAccountSchema = new Schema({
  accountType: { type: String, required: true },
  bank: { type: String, required: true },
  accountNumber: { type: String, required: true },
  currentBalance: { type: Number, default: 0 },
  amountOverdue: { type: Number, default: 0 },
  status: { type: String, required: true }
});

const ReportSummarySchema = new Schema({
  totalAccounts: { type: Number, default: 0 },
  activeAccounts: { type: Number, default: 0 },
  closedAccounts: { type: Number, default: 0 },
  currentBalanceAmount: { type: Number, default: 0 },
  securedAccountsAmount: { type: Number, default: 0 },
  unsecuredAccountsAmount: { type: Number, default: 0 },
  last7DaysEnquiries: { type: Number, default: 0 }
});

const CreditReportSchema = new Schema({
  name: { type: String, required: true },
  mobilePhone: { type: String, required: true },
  pan: { type: String, required: true, index: true },
  creditScore: { type: Number, required: true },
  reportSummary: { type: ReportSummarySchema, required: true },
  creditAccounts: [CreditAccountSchema],
  addresses: [String],
  uploadDate: { type: Date, default: Date.now }
});

// Add index for better query performance
CreditReportSchema.index({ pan: 1, uploadDate: -1 });

export const CreditReport = mongoose.model<ICreditReport>('CreditReport', CreditReportSchema);