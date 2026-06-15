import { supabase } from "@/integrations/supabase/client";

async function authHeaders() {
  const mockUserStr = localStorage.getItem("mock_user_session");
  if (mockUserStr) {
    try {
      const parsed = JSON.parse(mockUserStr);
      if (parsed?.access_token) {
        return { Authorization: `Bearer ${parsed.access_token}` };
      }
    } catch {
      // ignore
    }
  }
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const BASE_URL = "http://localhost:8000/api/v1";

async function callApi<T = any>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(await authHeaders()),
    ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(init?.headers as any),
  };
  const res = await fetch(`${BASE_URL}/${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    let parsedError = "";
    try {
      const errJson = JSON.parse(text);
      parsedError = errJson.detail || errJson.message;
    } catch {
      parsedError = text;
    }
    throw new Error(parsedError || `${path} failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  uploadDocument: async (file: File, source = "Unknown") => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("source", source);
    return callApi<{ documentId: string; status: string; document: any }>("documents/upload", {
      method: "POST",
      body: fd,
    });
  },
  listDocuments: () => callApi<{ documents: any[] }>("documents"),
  extractText: (documentId: string) =>
    callApi<{ documentId: string; pages: number; text: string }>(`documents/${documentId}/extract-text`, {
      method: "POST",
    }),
  extractClauses: (documentId: string) =>
    callApi<{ documentId: string; count: number; clauses: any[] }>(`documents/${documentId}/extract-clauses`, {
      method: "POST",
    }),
  compare: (oldDocumentId: string, newDocumentId: string) =>
    callApi<{ comparisonId: string; added: any[]; removed: any[]; modified: any[]; counts: any }>("comparisons", {
      method: "POST",
      body: JSON.stringify({ oldDocumentId, newDocumentId }),
    }),
  impact: (comparisonId: string) =>
    callApi<{ matrix: any[]; perClause: any[] }>(`comparisons/${comparisonId}/impact`, {
      method: "POST",
    }),
  generateMaps: (comparisonId: string) =>
    callApi<{ count: number; maps: any[] }>(`comparisons/${comparisonId}/generate-maps`, {
      method: "POST",
    }),
  copilot: (message: string, sessionId?: string) =>
    callApi<{ sessionId: string; answer: string; citations: any[] }>("copilot/chat", {
      method: "POST",
      body: JSON.stringify({ message, sessionId }),
    }),
  auditReadiness: () =>
    callApi<{
      score: number;
      total: number;
      completed: number;
      overdue: number;
      departments: any[];
      recentActivity: any[];
      insights: any[];
      complianceTrend: any[];
      mapProgress: any[];
    }>("dashboard/overview"),
  regulationsLatest: () =>
    callApi<any>("regulations").then((res) => {
      if (Array.isArray(res)) {
        const customRes = [...res] as any;
        customRes.regulations = res;
        return customRes;
      }
      return res;
    }),
  generateReport: (type: string) =>
    callApi<{ report: any; signed_url: string }>("reports/generate", {
      method: "POST",
      body: JSON.stringify({ type }),
    }),
  
  // Custom API additions for complete E2E connectivity
  listMaps: () => callApi<any[]>("maps"),
  createMap: (map: {
    title: string;
    description?: string;
    owner?: string;
    severity?: string;
    deadline?: string;
    clause_ref?: string;
    comparison_id?: string;
  }) =>
    callApi<any>("maps", {
      method: "POST",
      body: JSON.stringify(map),
    }),
  updateMapStatus: (id: string, status: string) =>
    callApi<any>(`maps/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  listAuditLogs: (query?: string) =>
    callApi<any[]>(query ? `audit-logs?query=${encodeURIComponent(query)}` : "audit-logs"),
  listAlerts: () => callApi<any[]>("notifications"),
  markAlertRead: (id: string) =>
    callApi<any>(`notifications/${id}/read`, {
      method: "PATCH",
    }),
};
export type ApiType = typeof api;