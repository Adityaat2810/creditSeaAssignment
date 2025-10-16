import { FileText, BarChart3 } from "lucide-react";
import type { CreditReport, ReportStats } from '../types/credit';

interface DashboardTabProps {
  stats: ReportStats | null;
  reports: CreditReport[];
  onViewReportDetails: (reportId: string) => void;
}

export const DashboardTab = ({ stats, reports, onViewReportDetails }: DashboardTabProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Reports
              </p>
              <p className="text-4xl font-bold text-foreground mt-2">
                {stats?.totalReports || 0}
              </p>
            </div>
            <FileText className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Avg Credit Score
              </p>
              <p className="text-4xl font-bold text-foreground mt-2">
                {stats?.averageCreditScore
                  ? stats.averageCreditScore.toFixed(0)
                  : "—"}
              </p>
            </div>
            <BarChart3 className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Recent Reports
        </h2>
        {reports.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No reports yet. Start by uploading an XML file.
          </p>
        ) : (
          <div className="space-y-3">
            {reports.slice(0, 5).map((report) => (
              <div
                key={report._id}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                onClick={() => onViewReportDetails(report._id)}
              >
                <div>
                  <p className="font-medium text-foreground">
                    {report.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {report.pan}
                  </p>
                </div>
                <p className="text-lg font-bold text-primary">
                  {report.creditScore}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};