import { RefreshCw, Trash2 } from "lucide-react";
import type { CreditReport } from '../types/credit';

interface ReportsTabProps {
  reports: CreditReport[];
  loading: boolean;
  onRefresh: () => void;
  onViewReportDetails: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onNavigateToUpload: () => void;
}

export const ReportsTab = ({
  reports,
  loading,
  onRefresh,
  onViewReportDetails,
  onDeleteReport,
  onNavigateToUpload
}: ReportsTabProps) => {
  if (loading) {
    return <p className="text-center text-muted-foreground py-8">Loading reports...</p>;
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No reports available</p>
        <button
          onClick={onNavigateToUpload}
          className="text-primary hover:underline font-medium"
        >
          Upload your first report
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">All Reports</h2>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <div
            key={report._id}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onViewReportDetails(report._id)}
              >
                <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                  {report.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  PAN: {report.pan}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(report.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {report.creditScore}
                </p>
                <button
                  onClick={() => onDeleteReport(report._id)}
                  className="text-destructive hover:text-destructive/80 mt-4 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};