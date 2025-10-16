import { useState, useEffect } from "react";
import type { CreditReport, ReportStats } from './types/credit';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardTab } from './components/DashboardTab';
import { UploadTab } from './components/UploadTab';
import { ReportsTab } from './components/ReportsTab';
import { creditApi } from "./api/creditApis";
import { ReportDetails } from "./components/ReportDetail";

export default function CreditSeaApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reports, setReports] = useState<CreditReport[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CreditReport | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await creditApi.fetchReports();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      alert("Error fetching reports: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await creditApi.fetchStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      await creditApi.uploadReport(file);
      await fetchReports();
      await fetchStats();
      setActiveTab("reports");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this report?")) return;

    try {
      await creditApi.deleteReport(id);
      await fetchReports();
      await fetchStats();
      setSelectedReport(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete error: " + (err as Error).message);
    }
  };

  const viewReportDetails = async (reportId: string) => {
    try {
      const data = await creditApi.fetchReportDetails(reportId);
      setSelectedReport(data);
    } catch (err) {
      console.error("Error fetching report details:", err);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedReport(null);
  };

  const renderMainContent = () => {
    if (selectedReport) {
      return (
        <ReportDetails
          report={selectedReport}
          onBack={() => setSelectedReport(null)}
          onDelete={handleDelete}
        />
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            stats={stats}
            reports={reports}
            onViewReportDetails={viewReportDetails}
          />
        );
      case "upload":
        return (
          <UploadTab
            onUpload={handleUpload}
            uploading={uploading}
          />
        );
      case "reports":
        return (
          <ReportsTab
            reports={reports}
            loading={loading}
            onRefresh={fetchReports}
            onViewReportDetails={viewReportDetails}
            onDeleteReport={handleDelete}
            onNavigateToUpload={() => setActiveTab("upload")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="max-w-7xl mx-auto px-6 py-10">
        {renderMainContent()}
      </main>
    </div>
  );
}