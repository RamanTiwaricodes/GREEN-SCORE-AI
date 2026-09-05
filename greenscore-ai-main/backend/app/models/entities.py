import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(30), default="CITIZEN")  # SUPER_ADMIN, DEPARTMENT_OFFICER, CITIZEN
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    department = relationship("Department", back_populates="officers")
    reports = relationship("CitizenReport", back_populates="user")
    assigned_actions = relationship("ActionAssignment", back_populates="officer")

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    head_name = Column(String(100), nullable=False)
    contact_email = Column(String(100), nullable=False)
    contact_phone = Column(String(20), nullable=True)
    active_projects_count = Column(Integer, default=0)
    budget_allocated = Column(Float, default=0.0)
    budget_spent = Column(Float, default=0.0)

    officers = relationship("User", back_populates="department")
    actions = relationship("ActionAssignment", back_populates="department")
    recommendations = relationship("Recommendation", back_populates="department")

class Zone(Base):
    __tablename__ = "zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    city = Column(String(50), default="Lucknow")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    polygon_geojson = Column(Text, nullable=True)
    population = Column(Integer, default=50000)
    area_sqkm = Column(Float, default=10.0)
    risk_level = Column(String(20), default="Moderate")  # Critical, High, Moderate, Low
    current_green_score = Column(Float, default=70.0)
    predicted_green_score = Column(Float, default=68.0)
    aqi = Column(Float, default=110.0)
    waste_efficiency = Column(Float, default=65.0)
    water_score = Column(Float, default=72.0)
    green_cover_pct = Column(Float, default=25.0)
    energy_score = Column(Float, default=68.0)
    mobility_score = Column(Float, default=60.0)
    open_issues_count = Column(Integer, default=5)

    metrics = relationship("EnvironmentalMetric", back_populates="zone")
    scores = relationship("SustainabilityScore", back_populates="zone")
    predictions = relationship("Prediction", back_populates="zone")
    problems = relationship("Problem", back_populates="zone")
    citizen_reports = relationship("CitizenReport", back_populates="zone")
    actions = relationship("ActionAssignment", back_populates="zone")

class EnvironmentalMetric(Base):
    __tablename__ = "environmental_metrics"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    
    # Air
    aqi = Column(Float, default=100.0)
    pm25 = Column(Float, default=45.0)
    pm10 = Column(Float, default=85.0)
    no2 = Column(Float, default=32.0)
    so2 = Column(Float, default=14.0)
    co = Column(Float, default=1.2)
    o3 = Column(Float, default=28.0)
    
    # Water
    water_quality_index = Column(Float, default=72.0)
    water_stress_level = Column(String(20), default="Moderate")
    water_consumption_mld = Column(Float, default=45.0)
    
    # Waste
    waste_generated_tons = Column(Float, default=120.0)
    waste_collection_pct = Column(Float, default=68.0)
    recycling_rate_pct = Column(Float, default=22.0)
    open_dumping_reports = Column(Integer, default=3)
    
    # Green
    green_cover_pct = Column(Float, default=28.0)
    tree_count = Column(Integer, default=15000)
    plantation_rate_monthly = Column(Integer, default=250)
    
    # Energy
    energy_demand_mwh = Column(Float, default=320.0)
    renewable_energy_pct = Column(Float, default=18.0)
    
    # Mobility
    traffic_intensity_idx = Column(Float, default=64.0)
    ev_adoption_pct = Column(Float, default=8.5)
    
    source = Column(String(50), default="Demo Dataset")  # OpenAQ, Open-Meteo, Demo Dataset
    is_demo = Column(Boolean, default=True)

    zone = relationship("Zone", back_populates="metrics")

class SustainabilityScore(Base):
    __tablename__ = "sustainability_scores"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    score = Column(Float, nullable=False)  # 0 to 100
    air_subscore = Column(Float, default=70.0)
    waste_subscore = Column(Float, default=70.0)
    water_subscore = Column(Float, default=70.0)
    green_subscore = Column(Float, default=70.0)
    energy_subscore = Column(Float, default=70.0)
    mobility_subscore = Column(Float, default=70.0)
    citizen_subscore = Column(Float, default=70.0)
    weights_json = Column(Text, nullable=True)
    delta_last_month = Column(Float, default=0.0)
    risk_trend = Column(String(20), default="Stable")

    zone = relationship("Zone", back_populates="scores")

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    target_metric = Column(String(50), nullable=False)  # GREEN_SCORE, AQI, WASTE_EFFICIENCY, WATER_STRESS, ENERGY
    timeframe_days = Column(Integer, default=30)  # 7 or 30
    current_val = Column(Float, nullable=False)
    predicted_val = Column(Float, nullable=False)
    lower_bound = Column(Float, nullable=False)
    upper_bound = Column(Float, nullable=False)
    confidence_pct = Column(Float, default=88.5)
    risk_level = Column(String(20), default="Moderate")
    risk_factors_json = Column(Text, nullable=True)
    model_name = Column(String(50), default="GreenScore RF Regressor v1.0")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    zone = relationship("Zone", back_populates="predictions")

class Problem(Base):
    __tablename__ = "problems"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    title = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)  # Air Quality, Waste Management, Water Stress, Green Loss, Mobility
    severity = Column(String(20), default="High")  # Critical, High, Medium, Low
    affected_population = Column(Integer, default=20000)
    current_metric_val = Column(String(50), nullable=False)
    trend = Column(String(30), default="Deteriorating")
    predicted_deterioration = Column(String(100), nullable=False)
    priority_score = Column(Float, default=85.0)  # 0 to 100
    priority_rank = Column(Integer, default=1)
    confidence_pct = Column(Float, default=90.0)
    suggested_department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    why_priority_reason = Column(Text, nullable=False)
    status = Column(String(20), default="OPEN")  # OPEN, ASSIGNED, IN_PROGRESS, RESOLVED

    zone = relationship("Zone", back_populates="problems")
    recommendations = relationship("Recommendation", back_populates="problem")
    actions = relationship("ActionAssignment", back_populates="problem")

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    estimated_cost = Column(Float, nullable=False)  # In Rupees (₹)
    expected_score_gain = Column(Float, default=4.5)
    expected_env_gain = Column(String(100), nullable=False)
    implementation_days = Column(Integer, default=30)
    population_benefited = Column(Integer, default=25000)
    feasibility_pct = Column(Float, default=85.0)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    explainable_reason = Column(Text, nullable=False)
    status = Column(String(20), default="PROPOSED")  # PROPOSED, APPROVED, ALLOCATED, REJECTED

    problem = relationship("Problem", back_populates="recommendations")
    department = relationship("Department", back_populates="recommendations")

class BudgetScenario(Base):
    __tablename__ = "budget_scenarios"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    available_budget = Column(Float, nullable=False)
    allocated_budget = Column(Float, nullable=False)
    selected_interventions_json = Column(Text, nullable=False)
    expected_total_score_gain = Column(Float, default=0.0)
    total_population_benefited = Column(Integer, default=0)
    reasoning = Column(Text, nullable=False)
    created_by = Column(String(50), default="admin")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SimulationRun(Base):
    __tablename__ = "simulation_runs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    base_zone_id = Column(Integer, ForeignKey("zones.id"), nullable=True)
    tree_plantation_delta = Column(Integer, default=0)
    waste_efficiency_delta = Column(Float, default=0.0)
    ev_bus_delta = Column(Integer, default=0)
    solar_power_delta = Column(Float, default=0.0)
    water_conservation_delta = Column(Float, default=0.0)
    simulated_score = Column(Float, nullable=False)
    simulated_aqi = Column(Float, nullable=False)
    simulated_waste_eff = Column(Float, nullable=False)
    confidence_pct = Column(Float, default=85.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CitizenReport(Base):
    __tablename__ = "citizen_reports"
    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String(30), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    citizen_name = Column(String(100), nullable=False)
    citizen_phone = Column(String(20), nullable=True)
    category = Column(String(50), nullable=False)
    severity = Column(String(20), default="Medium")
    description = Column(Text, nullable=False)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(255), nullable=True)
    photo_url = Column(String(255), nullable=True)
    status = Column(String(30), default="Submitted")  # Submitted, AI Classified, Under Review, Assigned, In Progress, Resolved, Verified
    ai_category = Column(String(50), nullable=True)
    ai_severity = Column(String(20), nullable=True)
    ai_suggested_dept = Column(String(50), nullable=True)
    ai_confidence = Column(Float, default=92.0)
    ai_reason = Column(Text, nullable=True)
    municipal_action_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="reports")
    zone = relationship("Zone", back_populates="citizen_reports")

class ActionAssignment(Base):
    __tablename__ = "action_assignments"
    id = Column(Integer, primary_key=True, index=True)
    action_code = Column(String(30), unique=True, index=True, nullable=False)
    title = Column(String(150), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=True)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    assigned_officer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(30), default="Assigned")  # Planned, Assigned, In Progress, Submitted for Verification, Completed, Verified
    progress_pct = Column(Integer, default=0)
    estimated_cost = Column(Float, default=0.0)
    actual_cost = Column(Float, default=0.0)
    deadline = Column(DateTime, nullable=False)
    completion_date = Column(DateTime, nullable=True)
    evidence_notes = Column(Text, nullable=True)
    evidence_photo_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    problem = relationship("Problem", back_populates="actions")
    zone = relationship("Zone", back_populates="actions")
    department = relationship("Department", back_populates="actions")
    officer = relationship("User", back_populates="assigned_actions")
    impact = relationship("ImpactVerification", back_populates="action", uselist=False)

class ImpactVerification(Base):
    __tablename__ = "impact_verifications"
    id = Column(Integer, primary_key=True, index=True)
    action_id = Column(Integer, ForeignKey("action_assignments.id"), unique=True, nullable=False)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=False)
    metric_name = Column(String(50), default="Green Score")
    pre_metric_val = Column(Float, nullable=False)
    post_metric_val = Column(Float, nullable=False)
    predicted_delta = Column(Float, nullable=False)
    measured_delta = Column(Float, nullable=False)
    goal_attainment_pct = Column(Float, nullable=False)
    verdict = Column(String(30), default="Achieved")  # Exceeded, Achieved, Partially Achieved, Underperformed
    score_delta = Column(Float, default=0.0)
    verification_notes = Column(Text, nullable=True)
    verified_by = Column(String(100), default="Municipal Audit Engine")
    verified_at = Column(DateTime, default=datetime.datetime.utcnow)

    action = relationship("ActionAssignment", back_populates="impact")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id"), nullable=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # AQI, Waste, Water, Score, System
    severity = Column(String(20), default="High")  # Critical, High, Medium, Low
    trigger_metric = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    user_name = Column(String(100), nullable=False)
    role = Column(String(30), nullable=False)
    action_type = Column(String(50), nullable=False)  # APPROVE_ACTION, OPTIMIZE_BUDGET, UPDATE_WEIGHTS, VERIFY_IMPACT, SUBMIT_REPORT
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(50), nullable=True)
    details_json = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class SystemSetting(Base):
    __tablename__ = "system_settings"
    id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String(50), unique=True, index=True, nullable=False)
    setting_value = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
