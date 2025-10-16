import type { CreditReport, ReportStats, ApiResponse, UploadResponse } from "../types/credit";

const API_BASE = "http://localhost:5000/api/credit";

class CreditService {
  async uploadFile(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append("xmlFile", file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  }

  async getAllReports(): Promise<ApiResponse<CreditReport[]>> {
    const response = await fetch(`${API_BASE}/reports`);

    if (!response.ok) {
      throw new Error("Failed to fetch reports");
    }

    return response.json();
  }

  async getReportById(id: string): Promise<ApiResponse<CreditReport>> {
    const response = await fetch(`${API_BASE}/reports/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch report");
    }

    return response.json();
  }

  async deleteReport(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE}/reports/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete report");
    }

    return response.json();
  }

  async getStats(): Promise<ApiResponse<ReportStats>> {
    const response = await fetch(`${API_BASE}/stats/overview`);

    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }

    return response.json();
  }
}

export const creditService = new CreditService();