import type { CreditReport, ReportStats, ApiResponse, UploadResponse } from '../types/credit';

const API_BASE = "http://localhost:5000/api/credit";

export const creditApi = {
  // Fetch all reports
  async fetchReports(): Promise<CreditReport[]> {
    const res = await fetch(`${API_BASE}/reports`);
    const data: ApiResponse<CreditReport[]> = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch reports');
  },

  // Fetch overview statistics
  async fetchStats(): Promise<ReportStats> {
    const res = await fetch(`${API_BASE}/stats/overview`);
    const data: ApiResponse<ReportStats> = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch stats');
  },

  // Upload XML file
  async uploadReport(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("xmlFile", file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    const data: ApiResponse<UploadResponse> = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Upload failed');
  },

  // Fetch single report details
  async fetchReportDetails(reportId: string): Promise<CreditReport> {
    const res = await fetch(`${API_BASE}/reports/${reportId}`);
    const data: ApiResponse<CreditReport> = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch report details');
  },

  // Delete report
  async deleteReport(reportId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/reports/${reportId}`, {
      method: "DELETE",
    });
    const data: ApiResponse<void> = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Delete failed');
    }
  }
};