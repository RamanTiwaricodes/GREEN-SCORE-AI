export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'SUPER_ADMIN' | 'DEPARTMENT_OFFICER' | 'CITIZEN';
  department_id?: number | null;
  department_name?: string | null;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  head_name: string;
  contact_email: string;
  contact_phone?: string;
  active_projects_count: number;
  budget_allocated: number;
  budget_spent: number;
}

export interface Zone {
  id: number;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  polygon_geojson?: string;
  population: number;
  area_sqkm: number;
  risk_level: 'Critical' | 'High' | 'Moderate' | 'Low';
  current_green_score: number;
  predicted_green_score: number;
  aqi: number;
  waste_efficiency: number;
  water_score: number;
  green_cover_pct: number;
  energy_score: number;
  mobility_score: number;
  open_issues_count: number;
}

export interface EnvironmentalMetric {
  id: number;
  zone_id: number;
  timestamp: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  water_quality_index: number;
  water_stress_level: string;
  water_consumption_mld: number;
  waste_generated_tons: number;
  waste_collection_pct: number;
  recycling_rate_pct: number;
  open_dumping_reports: number;
  green_cover_pct: number;
  tree_count: number;
  plantation_rate_monthly: number;
  energy_demand_mwh: number;
  renewable_energy_pct: number;
  traffic_intensity_idx: number;
  ev_adoption_pct: number;
  source: string;
  is_demo: boolean;
}

export interface SustainabilityScoreSummary {
  city: string;
  overall_score: number;
  tier: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical';
  delta_month: number;
  risk_trend: string;
  subscores: {
    air: number;
    waste: number;
    water: number;
    green_cover: number;
    energy: number;
    mobility: number;
  };
  zones_count: number;
  source: string;
}

export interface ScoreWeights {
  air: number;
  waste: number;
  water: number;
  green: number;
  energy: number;
  mobility: number;
  citizen: number;
}

export interface PredictionCurvePoint {
  day: number;
  label: string;
  value: number;
  lower: number;
  upper: number;
}

export interface PredictionResponse {
  zone_id: number;
  zone_name: string;
  target_metric: string;
  timeframe_days: number;
  current_val: number;
  predicted_val: number;
  lower_bound: number;
  upper_bound: number;
  confidence_pct: number;
  risk_level: string;
  risk_factors: string[];
  curve_points: PredictionCurvePoint[];
  model_name: string;
}

export interface Problem {
  id: number;
  zone_id: number;
  zone_name?: string;
  title: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  affected_population: number;
  current_metric_val: string;
  trend: string;
  predicted_deterioration: string;
  priority_score: number;
  priority_rank: number;
  confidence_pct: number;
  suggested_department_id?: number;
  suggested_department_name?: string;
  why_priority_reason: string;
  status: string;
  created_at: string;
}

export interface Recommendation {
  id: number;
  problem_id: number;
  zone_id: number;
  zone_name?: string;
  title: string;
  description: string;
  estimated_cost: number;
  expected_score_gain: number;
  expected_env_gain: string;
  implementation_days: number;
  population_benefited: number;
  feasibility_pct: number;
  department_id: number;
  department_name?: string;
  explainable_reason: string;
  status: string;
}

export interface BudgetAllocationItem {
  recommendation_id: number;
  title: string;
  category: string;
  zone_name: string;
  department_name: string;
  cost: number;
  expected_score_gain: number;
  population_benefited: number;
  implementation_days: number;
  feasibility_pct: number;
  roi_score: number;
  reason: string;
}

export interface BudgetOptimizationResponse {
  available_budget: number;
  total_allocated: number;
  remaining_budget: number;
  allocation_efficiency_pct: number;
  expected_total_score_gain: number;
  total_population_benefited: number;
  allocations: BudgetAllocationItem[];
  optimization_method: string;
  explainable_summary: string;
}

export interface SimulationResult {
  base_green_score: number;
  simulated_green_score: number;
  score_delta: number;
  base_aqi: number;
  simulated_aqi: number;
  aqi_delta: number;
  base_waste_eff: number;
  simulated_waste_eff: number;
  waste_eff_delta: number;
  estimated_implementation_cost: number;
  confidence_pct: number;
  status_label: string;
  interventions_applied: Record<string, any>;
  projected_co2_reduction_tons: number;
  population_impacted: number;
}

export interface CitizenReport {
  id: number;
  tracking_id: string;
  citizen_name: string;
  citizen_phone?: string;
  category: string;
  severity: string;
  description: string;
  zone_id: number;
  zone_name?: string;
  latitude: number;
  longitude: number;
  address?: string;
  photo_url?: string;
  status: 'Submitted' | 'AI Classified' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Verified';
  ai_category?: string;
  ai_severity?: string;
  ai_suggested_dept?: string;
  ai_confidence?: number;
  ai_reason?: string;
  created_at: string;
  resolved_at?: string;
}

export interface ActionAssignment {
  id: number;
  action_code: string;
  title: string;
  problem_id?: number;
  zone_id: number;
  zone_name?: string;
  department_id: number;
  department_name?: string;
  assigned_officer_id?: number;
  assigned_officer_name?: string;
  status: 'Planned' | 'Assigned' | 'In Progress' | 'Submitted for Verification' | 'Completed' | 'Verified';
  progress_pct: number;
  estimated_cost: number;
  actual_cost: number;
  deadline: string;
  completion_date?: string;
  evidence_notes?: string;
  evidence_photo_url?: string;
  created_at: string;
}

export interface ImpactVerification {
  id: number;
  action_id: number;
  action_code?: string;
  action_title?: string;
  zone_id: number;
  zone_name?: string;
  metric_name: string;
  pre_metric_val: number;
  post_metric_val: number;
  predicted_delta: number;
  measured_delta: number;
  goal_attainment_pct: number;
  verdict: 'Exceeded' | 'Achieved' | 'Partially Achieved' | 'Underperformed';
  score_delta: number;
  verification_notes?: string;
  verified_by: string;
  verified_at: string;
}

export interface Alert {
  id: number;
  zone_id?: number;
  zone_name?: string;
  title: string;
  message: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  trigger_metric?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_name: string;
  role: string;
  action_type: string;
  entity_type: string;
  entity_id?: string;
  details_json?: string;
  ip_address: string;
  timestamp: string;
}
