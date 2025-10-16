import { Trash2 } from "lucide-react";
import type { CreditReport } from '../types/credit';

interface ReportDetailsProps {
  report: CreditReport;
  onBack: () => void;
  onDelete: (reportId: string) => void;
}

export const ReportDetails = ({ report, onBack, onDelete }: ReportDetailsProps) => {
  return (
    <div>
      <button
        onClick={onBack}
        className="text-primary hover:underline font-medium mb-6"
      >
        ← Back to Reports
      </button>

      <div className="bg-card border border-border rounded-lg p-8 space-y-8">
        {/* Header Info */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-6">
            {report.name}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Credit Score
              </p>
              <p className="text-2xl font-bold text-primary mt-2">
                {report.creditScore}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">PAN</p>
              <p className="text-lg font-semibold text-foreground mt-2">
                {report.pan}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Phone</p>
              <p className="text-lg font-semibold text-foreground mt-2">
                {report.mobilePhone}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Uploaded
              </p>
              <p className="text-lg font-semibold text-foreground mt-2">
                {new Date(report.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Report Summary */}
        {report.reportSummary && (
          <div className="border-t border-border pt-8">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Report Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {report.reportSummary.totalAccounts}
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Active Accounts</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {report.reportSummary.activeAccounts}
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Closed Accounts</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {report.reportSummary.closedAccounts}
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ₹
                  {report.reportSummary.currentBalanceAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Secured Amount</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ₹
                  {report.reportSummary.securedAccountsAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Unsecured Amount
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ₹
                  {report.reportSummary.unsecuredAccountsAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Credit Accounts */}
        {report.creditAccounts && report.creditAccounts.length > 0 && (
          <div className="border-t border-border pt-8">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Credit Accounts
            </h3>
            <div className="space-y-4">
              {report.creditAccounts.map((account, idx) => (
                <div
                  key={idx}
                  className="bg-secondary rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-foreground">
                        {account.accountType}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {account.bank}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        account.status === "Active"
                          ? "bg-success/20 text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {account.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Account #</p>
                      <p className="font-semibold text-foreground">
                        {account.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Balance</p>
                      <p className="font-semibold text-foreground">
                        ₹{account.currentBalance.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount Overdue</p>
                      <p
                        className={`font-semibold ${
                          account.amountOverdue > 0
                            ? "text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        ₹{account.amountOverdue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Addresses */}
        {report.addresses && report.addresses.length > 0 && (
          <div className="border-t border-border pt-8">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Addresses on File
            </h3>
            <div className="space-y-3">
              {report.addresses.map((address, idx) => (
                <div key={idx} className="bg-secondary rounded-lg p-4">
                  <p className="text-foreground">{address}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Button */}
        <div className="border-t border-border pt-8 flex justify-end">
          <button
            onClick={() => onDelete(report._id)}
            className="flex items-center gap-2 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg hover:bg-destructive/90 transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete Report
          </button>
        </div>
      </div>
    </div>
  );
};