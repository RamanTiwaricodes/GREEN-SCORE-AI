import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: str
    role: str = "CITIZEN"
    department_id: Optional[int] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    department_id: Optional[int] = None
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Department
class DepartmentResponse(BaseModel):
    id: int
    name: str
    code: str
    head_name: str
    contact_email: str
    contact_phone: Optional[str] = None
    active_projects_count: int
    budget_allocated: float
    budget_spent: float

    class Config:
        from_attributes = True

# Zone
class ZoneResponse(BaseModel):
    id: int
    name: str
    city: str
    latitude: float
    longitude: float
    polygon_geojson: Optional[str] = None
    population: int
    area_sqkm: float
    risk_level: str
    current_green_score: float
    predicted_green_score: float
    aqi: float
    waste_efficiency: float
    water_score: float
    green_cover_pct: float
    energy_score: float
    mobility_score: float
    open_issues_count: int

    class Config:
        from_attributes = True

# Metrics
class EnvironmentalMetricResponse(BaseModel):
    id: int
    zone_id: int
    timestamp: datetime.datetime
    aqi: float
    pm25: float
    pm10: float
    no2: float
    so2: float
    co: float
    o3: float
    water_quality_index: float
    water_stress_level: str
    water_consumption_mld: float
    waste_generated_tons: float
    waste_collection_pct: float
    recycling_rate_pct: float
    open_dumping_reports: int
    green_cover_pct: float
    tree_count: int
    plantation_rate_monthly: int
    energy_demand_mwh: float
    renewable_energy_pct: float
    traffic_intensity_idx: float
    ev_adoption_pct: float
    source: str
    is_demo: bool

    class Config:
        from_attributes = True

# Scoring
class ScoreWeightConfig(BaseModel):
    air: float = 0.20
    waste: float = 0.20
    water: float = 0.15
    green: float = 0.15
    energy: float = 0.10
    mobility: float = 0.10
    citizen: float = 0.10

class SustainabilityScoreResponse(BaseModel):
    id: int
    zone_id: int
    zone_name: Optional[str] = None
    calculated_at: datetime.datetime
    score: float
    air_subscore: float
    waste_subscore: float
    water_subscore: float
    green_subscore: float
    energy_subscore: float
    mobility_subscore: float
    citizen_subscore: float
    delta_last_month: float
    risk_trend: str

    class Config:
        from_attributes = True

# Predictions
class PredictionResponse(BaseModel):
    id: int
    zone_id: int
    zone_name: Optional[str] = None
    target_metric: str
    timeframe_days: int
    current_val: float
    predicted_val: float
    lower_bound: float
    upper_bound: float
    confidence_pct: float
    risk_level: str
    risk_factors_json: Optional[str] = None
    model_name: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Problems & Priority
class ProblemResponse(BaseModel):
    id: int
    zone_id: int
    zone_name: Optional[str] = None
    title: str
    category: str
    severity: str
    affected_population: int
    current_metric_val: str
    trend: str
    predicted_deterioration: str
    priority_score: float
    priority_rank: int
    confidence_pct: float
    suggested_department_id: Optional[int] = None
    suggested_department_name: Optional[str] = None
    why_priority_reason: str
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class PrioritizeRequest(BaseModel):
    zone_id: Optional[int] = None
    weights: Optional[Dict[str, float]] = None

# Recommendations
class RecommendationResponse(BaseModel):
    id: int
    problem_id: int
    zone_id: int
    zone_name: Optional[str] = None
    title: str
    description: str
    estimated_cost: float
    expected_score_gain: float
    expected_env_gain: str
    implementation_days: int
    population_benefited: int
    feasibility_pct: float
    department_id: int
    department_name: Optional[str] = None
    explainable_reason: str
    status: str

    class Config:
        from_attributes = True

# Budget Optimizer
class BudgetOptimizeRequest(BaseModel):
    available_budget: float = Field(..., gt=0, description="Available municipal budget in Rupees (₹)")
    zone_id: Optional[int] = None
    preferred_category: Optional[str] = None
    risk_appetite: Optional[str] = "BALANCED"  # AGGRESSIVE, BALANCED, CONSERVATIVE

class BudgetAllocationItem(BaseModel):
    recommendation_id: int
    title: str
    category: str
    zone_name: str
    department_name: str
    cost: float
    expected_score_gain: float
    population_benefited: int
    implementation_days: int
    feasibility_pct: float
    roi_score: float
    reason: str

class BudgetOptimizationResponse(BaseModel):
    available_budget: float
    total_allocated: float
    remaining_budget: float
    allocation_efficiency_pct: float
    expected_total_score_gain: float
    total_population_benefited: int
    allocations: List[BudgetAllocationItem]
    optimization_method: str = "Multi-Objective 0/1 Knapsack & Greedy MCDA Solver"
    explainable_summary: str

# Simulation & Scenarios
class SimulationRunRequest(BaseModel):
    zone_id: Optional[int] = None
    tree_plantation_count: int = 0
    waste_collection_efficiency_pct_delta: float = 0.0
    ev_bus_addition_count: int = 0
    solar_power_capacity_mw_delta: float = 0.0
    water_conservation_recycled_mld: float = 0.0
    traffic_reduction_pct: float = 0.0

class SimulationResponse(BaseModel):
    base_green_score: float
    simulated_green_score: float
    score_delta: float
    base_aqi: float
    simulated_aqi: float
    aqi_delta: float
    base_waste_eff: float
    simulated_waste_eff: float
    waste_eff_delta: float
    estimated_implementation_cost: float
    confidence_pct: float
    status_label: str = "SIMULATED / ESTIMATED"
    interventions_applied: Dict[str, Any]
    projected_co2_reduction_tons: float
    population_impacted: int

class ScenarioComparisonRequest(BaseModel):
    scenario_a: SimulationRunRequest
    scenario_b: SimulationRunRequest
    scenario_c: SimulationRunRequest
    scenario_names: Optional[List[str]] = ["Scenario A: Green Canopy Expansion", "Scenario B: Smart Waste Infrastructure", "Scenario C: Clean Mobility & Solar"]

# Citizen Reports
class CitizenReportCreate(BaseModel):
    citizen_name: str
    citizen_phone: Optional[str] = None
    category: str
    description: str
    zone_id: int
    latitude: float
    longitude: float
    address: Optional[str] = None
    photo_url: Optional[str] = None

class CitizenReportResponse(BaseModel):
    id: int
    tracking_id: str
    citizen_name: str
    category: str
    severity: str
    description: str
    zone_id: int
    zone_name: Optional[str] = None
    latitude: float
    longitude: float
    address: Optional[str] = None
    photo_url: Optional[str] = None
    status: str
    ai_category: Optional[str] = None
    ai_severity: Optional[str] = None
    ai_suggested_dept: Optional[str] = None
    ai_confidence: Optional[float] = None
    ai_reason: Optional[str] = None
    created_at: datetime.datetime
    resolved_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

# Action Assignment
class ActionAssignmentCreate(BaseModel):
    title: str
    problem_id: Optional[int] = None
    zone_id: int
    department_id: int
    assigned_officer_id: Optional[int] = None
    estimated_cost: float
    deadline: datetime.datetime

class ActionProgressUpdate(BaseModel):
    progress_pct: int = Field(..., ge=0, le=100)
    actual_cost: Optional[float] = None
    evidence_notes: Optional[str] = None
    evidence_photo_url: Optional[str] = None
    status: Optional[str] = None

class ActionAssignmentResponse(BaseModel):
    id: int
    action_code: str
    title: str
    problem_id: Optional[int] = None
    zone_id: int
    zone_name: Optional[str] = None
    department_id: int
    department_name: Optional[str] = None
    assigned_officer_id: Optional[int] = None
    assigned_officer_name: Optional[str] = None
    status: str
    progress_pct: int
    estimated_cost: float
    actual_cost: float
    deadline: datetime.datetime
    completion_date: Optional[datetime.datetime] = None
    evidence_notes: Optional[str] = None
    evidence_photo_url: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Impact Verification
class ImpactVerificationResponse(BaseModel):
    id: int
    action_id: int
    action_code: Optional[str] = None
    action_title: Optional[str] = None
    zone_id: int
    zone_name: Optional[str] = None
    metric_name: str
    pre_metric_val: float
    post_metric_val: float
    predicted_delta: float
    measured_delta: float
    goal_attainment_pct: float
    verdict: str
    score_delta: float
    verification_notes: Optional[str] = None
    verified_by: str
    verified_at: datetime.datetime

    class Config:
        from_attributes = True

# Alert
class AlertResponse(BaseModel):
    id: int
    zone_id: Optional[int] = None
    zone_name: Optional[str] = None
    title: str
    message: str
    category: str
    severity: str
    trigger_metric: Optional[str] = None
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# AI Assistant
class AssistantChatRequest(BaseModel):
    query: str
    zone_id: Optional[int] = None
    context_mode: Optional[str] = "ADMIN"  # ADMIN, DEPARTMENT, PUBLIC

class AssistantChatResponse(BaseModel):
    reply: str
    grounded_data: Dict[str, Any]
    source_attribution: str = "GreenScore AI Real-Time Urban Knowledge Graph"
    suggested_followups: List[str]

# Audit Log
class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    user_name: str
    role: str
    action_type: str
    entity_type: str
    entity_id: Optional[str] = None
    details_json: Optional[str] = None
    ip_address: str
    timestamp: datetime.datetime

    class Config:
        from_attributes = True
