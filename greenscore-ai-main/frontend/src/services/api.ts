import {
  Zone,
  EnvironmentalMetric,
  SustainabilityScoreSummary,
  ScoreWeights,
  PredictionResponse,
  Problem,
  Recommendation,
  BudgetOptimizationResponse,
  SimulationResult,
  CitizenReport,
  ActionAssignment,
  ImpactVerification,
  Alert,
  AuditLog
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api');

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('greenscore_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {})
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errBody = await response.json();
      if (errBody.detail) errorMsg = typeof errBody.detail === 'string' ? errBody.detail : JSON.stringify(errBody.detail);
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    return fetchJson<{ access_token: string; token_type: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  getMe: async () => fetchJson<any>('/auth/me'),

  // Dashboard
  getDashboardSummary: async () => fetchJson<any>('/dashboard'),

  // Zones
  getZones: async () => fetchJson<Zone[]>('/zones'),
  getZoneDetails: async (id: number) => fetchJson<any>(`/zones/${id}`),

  // Scores
  getCityScoreSummary: async () => fetchJson<SustainabilityScoreSummary>('/scores/city-summary'),
  getWeights: async () => fetchJson<ScoreWeights>('/scores/weights'),
  recalculateScores: async (weights: ScoreWeights) =>
    fetchJson<any>('/scores/recalculate', {
      method: 'POST',
      body: JSON.stringify(weights)
    }),

  // Metrics
  getLatestMetrics: async () => fetchJson<EnvironmentalMetric[]>('/metrics/latest'),
  getZoneMetric: async (zoneId: number) => fetchJson<EnvironmentalMetric>(`/metrics/zone/${zoneId}`),
  getLiveSources: async () => fetchJson<any>('/metrics/live-sources'),

  // Predictions
  getForecast: async (zoneId: number, targetMetric: string = 'GREEN_SCORE', timeframeDays: number = 30) =>
    fetchJson<PredictionResponse>(`/predictions/forecast?zone_id=${zoneId}&target_metric=${targetMetric}&timeframe_days=${timeframeDays}`),
  getAllZonesPredictions: async () => fetchJson<any[]>('/predictions/all-zones-summary'),

  // Problems & Priority
  getProblems: async (zoneId?: number) =>
    fetchJson<Problem[]>(zoneId ? `/problems?zone_id=${zoneId}` : '/problems'),
  prioritizeProblems: async (zoneId?: number) =>
    fetchJson<any>('/problems/prioritize', {
      method: 'POST',
      body: JSON.stringify({ zone_id: zoneId })
    }),

  // Recommendations
  getRecommendations: async (zoneId?: number) =>
    fetchJson<Recommendation[]>(zoneId ? `/recommendations?zone_id=${zoneId}` : '/recommendations'),
  approveRecommendation: async (id: number) =>
    fetchJson<any>(`/recommendations/${id}/approve`, { method: 'POST' }),

  // Budget Optimizer
  optimizeBudget: async (availableBudget: number, riskAppetite: string = 'BALANCED') =>
    fetchJson<BudgetOptimizationResponse>('/budget/optimize', {
      method: 'POST',
      body: JSON.stringify({ available_budget: availableBudget, risk_appetite: riskAppetite })
    }),
  getSavedScenarios: async () => fetchJson<any[]>('/budget/saved-scenarios'),

  // Simulation
  runSimulation: async (params: {
    zone_id?: number;
    tree_plantation_count?: number;
    waste_collection_efficiency_pct_delta?: number;
    ev_bus_addition_count?: number;
    solar_power_capacity_mw_delta?: number;
    water_conservation_recycled_mld?: number;
    traffic_reduction_pct?: number;
  }) =>
    fetchJson<SimulationResult>('/simulation/run', {
      method: 'POST',
      body: JSON.stringify(params)
    }),
  compareScenarios: async (scenarioA: any, scenarioB: any, scenarioC: any) =>
    fetchJson<any>('/simulation/compare-scenarios', {
      method: 'POST',
      body: JSON.stringify({
        scenario_a: scenarioA,
        scenario_b: scenarioB,
        scenario_c: scenarioC
      })
    }),

  // Citizen Reports
  submitCitizenReport: async (report: {
    citizen_name: string;
    citizen_phone?: string;
    category: string;
    description: string;
    zone_id: number;
    latitude: number;
    longitude: number;
    address?: string;
    photo_url?: string;
  }) =>
    fetchJson<CitizenReport>('/citizen-reports/submit', {
      method: 'POST',
      body: JSON.stringify(report)
    }),
  trackReport: async (trackingId: string) => fetchJson<CitizenReport>(`/citizen-reports/track/${trackingId}`),
  getAllCitizenReports: async (zoneId?: number) =>
    fetchJson<CitizenReport[]>(zoneId ? `/citizen-reports?zone_id=${zoneId}` : '/citizen-reports'),
  updateReportStatus: async (reportId: number, status: string) =>
    fetchJson<any>(`/citizen-reports/${reportId}/status?new_status=${encodeURIComponent(status)}`, {
      method: 'PATCH'
    }),

  // Actions
  getActions: async (departmentId?: number, zoneId?: number) => {
    const params = new URLSearchParams();
    if (departmentId) params.append('department_id', departmentId.toString());
    if (zoneId) params.append('zone_id', zoneId.toString());
    const q = params.toString();
    return fetchJson<ActionAssignment[]>(q ? `/actions?${q}` : '/actions');
  },
  assignAction: async (action: {
    title: string;
    problem_id?: number;
    zone_id: number;
    department_id: number;
    assigned_officer_id?: number;
    estimated_cost: number;
    deadline: string;
  }) =>
    fetchJson<ActionAssignment>('/actions/assign', {
      method: 'POST',
      body: JSON.stringify(action)
    }),
  updateActionProgress: async (
    actionId: number,
    progressPct: number,
    actualCost?: number,
    evidenceNotes?: string,
    evidencePhotoUrl?: string,
    status?: string
  ) =>
    fetchJson<any>(`/actions/${actionId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({
        progress_pct: progressPct,
        actual_cost: actualCost,
        evidence_notes: evidenceNotes,
        evidence_photo_url: evidencePhotoUrl,
        status: status
      })
    }),

  // Impact Verification
  getImpactVerifications: async () => fetchJson<ImpactVerification[]>('/impact'),
  verifyActionImpact: async (actionId: number) =>
    fetchJson<any>(`/impact/verify-action/${actionId}`, { method: 'POST' }),

  // AI Assistant
  chatAssistant: async (query: string, zoneId?: number, contextMode: string = 'ADMIN') =>
    fetchJson<any>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ query, zone_id: zoneId, context_mode: contextMode })
    }),

  // Alerts
  getAlerts: async () => fetchJson<Alert[]>('/alerts'),
  dismissAlert: async (id: number) => fetchJson<any>(`/alerts/${id}/dismiss`, { method: 'POST' }),

  // Departments
  getDepartments: async () => fetchJson<any[]>('/departments'),
  getDepartmentDetails: async (id: number) => fetchJson<any>(`/departments/${id}`),

  // Audit Logs
  getAuditLogs: async () => fetchJson<AuditLog[]>('/audit-logs'),

  // Reports
  getSustainabilityAuditReport: async () => fetchJson<any>('/reports/sustainability-audit'),

  // Settings
  getSettings: async () => fetchJson<any>('/settings')
};
