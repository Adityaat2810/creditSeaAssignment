"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditReport = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CreditAccountSchema = new mongoose_1.Schema({
    accountType: { type: String, required: true },
    bank: { type: String, required: true },
    accountNumber: { type: String, required: true },
    currentBalance: { type: Number, required: true, default: 0 },
    amountOverdue: { type: Number, required: true, default: 0 },
    status: { type: String, required: true }
});
const ReportSummarySchema = new mongoose_1.Schema({
    totalAccounts: { type: Number, required: true, default: 0 },
    activeAccounts: { type: Number, required: true, default: 0 },
    closedAccounts: { type: Number, required: true, default: 0 },
    currentBalanceAmount: { type: Number, required: true, default: 0 },
    securedAccountsAmount: { type: Number, required: true, default: 0 },
    unsecuredAccountsAmount: { type: Number, required: true, default: 0 },
    last7DaysEnquiries: { type: Number, required: true, default: 0 }
});
const CreditReportSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    mobilePhone: { type: String, required: true },
    pan: { type: String, required: true },
    creditScore: { type: Number, required: true },
    reportSummary: { type: ReportSummarySchema, required: true },
    creditAccounts: [CreditAccountSchema],
    addresses: [{ type: String }],
    uploadDate: { type: Date, default: Date.now }
});
exports.CreditReport = mongoose_1.default.model('CreditReport', CreditReportSchema);
