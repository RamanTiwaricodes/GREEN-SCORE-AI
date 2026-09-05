import datetime
import json
from app.database.session import SessionLocal, engine, Base
from app.models.entities import (
    User, Department, Zone, EnvironmentalMetric, SustainabilityScore,
    Problem, Recommendation, CitizenReport, ActionAssignment, ImpactVerification,
    Alert, AuditLog, SystemSetting
)
from app.core.security import get_password_hash
from app.services.scoring.green_score import DEFAULT_WEIGHTS

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(Zone).count() > 0:
        db.close()
        return

    print("[*] Seeding GREENScore AI Database for Lucknow Municipal Corporation...")

    # 1. Departments
    dept_sanitation = Department(
        name="Municipal Sanitation & Solid Waste",
        code="SAN",
        head_name="Er. R. K. Srivastava",
        contact_email="sanitation@lucknowmc.gov.in",
        contact_phone="+91-522-2287101",
        budget_allocated=2500000.0,
        budget_spent=1640000.0,
        active_projects_count=3
    )
    dept_water = Department(
        name="Water Supply & Jal Sansthan",
        code="WAT",
        head_name="Er. Sunita Mishra",
        contact_email="water@lucknowmc.gov.in",
        contact_phone="+91-522-2287102",
        budget_allocated=1800000.0,
        budget_spent=1120000.0,
        active_projects_count=2
    )
    dept_env = Department(
        name="Environment & Pollution Control",
        code="ENV",
        head_name="Dr. V. P. Tandon",
        contact_email="environment@lucknowmc.gov.in",
        contact_phone="+91-522-2287103",
        budget_allocated=1500000.0,
        budget_spent=850000.0,
        active_projects_count=2
    )
    dept_transport = Department(
        name="Urban Mobility & Transport",
        code="TRN",
        head_name="Shri Alok Pathak",
        contact_email="transport@lucknowmc.gov.in",
        contact_phone="+91-522-2287104",
        budget_allocated=3000000.0,
        budget_spent=1950000.0,
        active_projects_count=2
    )
    dept_energy = Department(
        name="Renewable Energy Development",
        code="ENG",
        head_name="Dr. Meera Joshi",
        contact_email="energy@lucknowmc.gov.in",
        contact_phone="+91-522-2287105",
        budget_allocated=1200000.0,
        budget_spent=600000.0,
        active_projects_count=1
    )
    dept_parks = Department(
        name="Parks, Forestry & Horticulture",
        code="PRK",
        head_name="Shri K. N. Yadav",
        contact_email="horticulture@lucknowmc.gov.in",
        contact_phone="+91-522-2287106",
        budget_allocated=1400000.0,
        budget_spent=980000.0,
        active_projects_count=2
    )
    dept_pwd = Department(
        name="Public Works & Drainage",
        code="PWD",
        head_name="Er. D. C. Pandey",
        contact_email="pwd@lucknowmc.gov.in",
        contact_phone="+91-522-2287107",
        budget_allocated=2200000.0,
        budget_spent=1400000.0,
        active_projects_count=2
    )

    db.add_all([dept_sanitation, dept_water, dept_env, dept_transport, dept_energy, dept_parks, dept_pwd])
    db.commit()

    # 2. Users
    user_admin = User(
        username="admin",
        email="commissioner@lucknowmc.gov.in",
        password_hash=get_password_hash("admin123"),
        full_name="Dr. Anand Verma (Municipal Commissioner)",
        role="SUPER_ADMIN",
        department_id=None
    )
    user_officer_san = User(
        username="officer_sanitation",
        email="rajesh.singh@lucknowmc.gov.in",
        password_hash=get_password_hash("officer123"),
        full_name="Rajesh Kumar Singh (Sanitation Lead)",
        role="DEPARTMENT_OFFICER",
        department_id=dept_sanitation.id
    )
    user_officer_trn = User(
        username="officer_transport",
        email="priya.sharma@lucknowmc.gov.in",
        password_hash=get_password_hash("officer123"),
        full_name="Priya Sharma (Transport Officer)",
        role="DEPARTMENT_OFFICER",
        department_id=dept_transport.id
    )
    user_citizen = User(
        username="citizen",
        email="amit.trivedi@example.com",
        password_hash=get_password_hash("citizen123"),
        full_name="Amit Trivedi (Resident - Hazratganj)",
        role="CITIZEN",
        department_id=None
    )

    db.add_all([user_admin, user_officer_san, user_officer_trn, user_citizen])
    db.commit()

    # 3. Zones (Lucknow Municipal Demo Zones)
    z_gomti = Zone(
        name="Gomti Nagar",
        city="Lucknow",
        latitude=26.8525,
        longitude=80.9995,
        population=85000,
        area_sqkm=14.5,
        risk_level="Low",
        current_green_score=82.0,
        predicted_green_score=84.5,
        aqi=88.0,
        waste_efficiency=84.0,
        water_score=85.0,
        green_cover_pct=34.0,
        energy_score=78.0,
        mobility_score=74.0,
        open_issues_count=3
    )
    z_hazratganj = Zone(
        name="Hazratganj",
        city="Lucknow",
        latitude=26.8467,
        longitude=80.9462,
        population=62000,
        area_sqkm=8.2,
        risk_level="Moderate",
        current_green_score=68.0,
        predicted_green_score=61.0,
        aqi=142.0,
        waste_efficiency=72.0,
        water_score=70.0,
        green_cover_pct=22.0,
        energy_score=66.0,
        mobility_score=52.0,
        open_issues_count=7
    )
    z_aliganj = Zone(
        name="Aliganj",
        city="Lucknow",
        latitude=26.8912,
        longitude=80.9418,
        population=54000,
        area_sqkm=7.5,
        risk_level="Moderate",
        current_green_score=71.0,
        predicted_green_score=70.2,
        aqi=110.0,
        waste_efficiency=68.0,
        water_score=64.0,
        green_cover_pct=28.0,
        energy_score=70.0,
        mobility_score=66.0,
        open_issues_count=4
    )
    z_indira = Zone(
        name="Indira Nagar",
        city="Lucknow",
        latitude=26.8833,
        longitude=80.9850,
        population=72000,
        area_sqkm=11.0,
        risk_level="Low",
        current_green_score=76.0,
        predicted_green_score=77.8,
        aqi=95.0,
        waste_efficiency=78.0,
        water_score=75.0,
        green_cover_pct=31.0,
        energy_score=72.0,
        mobility_score=70.0,
        open_issues_count=4
    )
    z_chowk = Zone(
        name="Chowk",
        city="Lucknow",
        latitude=26.8680,
        longitude=80.9020,
        population=92000,
        area_sqkm=9.0,
        risk_level="Critical",
        current_green_score=54.0,
        predicted_green_score=46.5,
        aqi=182.0,
        waste_efficiency=52.0,
        water_score=58.0,
        green_cover_pct=14.0,
        energy_score=56.0,
        mobility_score=44.0,
        open_issues_count=12
    )
    z_alambagh = Zone(
        name="Alambagh",
        city="Lucknow",
        latitude=26.8120,
        longitude=80.9050,
        population=68000,
        area_sqkm=10.5,
        risk_level="High",
        current_green_score=61.0,
        predicted_green_score=56.0,
        aqi=156.0,
        waste_efficiency=59.0,
        water_score=62.0,
        green_cover_pct=18.0,
        energy_score=62.0,
        mobility_score=48.0,
        open_issues_count=8
    )

    db.add_all([z_gomti, z_hazratganj, z_aliganj, z_indira, z_chowk, z_alambagh])
    db.commit()

    # 4. Environmental Metrics
    all_zones = [z_gomti, z_hazratganj, z_aliganj, z_indira, z_chowk, z_alambagh]
    for z in all_zones:
        m = EnvironmentalMetric(
            zone_id=z.id,
            timestamp=datetime.datetime.utcnow(),
            aqi=z.aqi,
            pm25=z.aqi * 0.42,
            pm10=z.aqi * 0.85,
            no2=36.5 if z.risk_level in ["Critical", "High"] else 22.0,
            so2=14.0,
            co=1.4 if z.risk_level in ["Critical", "High"] else 0.8,
            o3=28.0,
            water_quality_index=z.water_score,
            water_stress_level="High" if z.risk_level == "Critical" else ("Moderate" if z.risk_level in ["High", "Moderate"] else "Low"),
            water_consumption_mld=z.population * 0.000135 * 1000,
            waste_generated_tons=z.population * 0.00045 * 1000,
            waste_collection_pct=z.waste_efficiency,
            recycling_rate_pct=26.0 if z.waste_efficiency > 75 else 14.0,
            open_dumping_reports=6 if z.risk_level == "Critical" else (3 if z.risk_level == "High" else 1),
            green_cover_pct=z.green_cover_pct,
            tree_count=int(z.population * (z.green_cover_pct / 100.0) * 0.6),
            plantation_rate_monthly=350,
            energy_demand_mwh=z.population * 0.004,
            renewable_energy_pct=22.0 if z.green_cover_pct > 25 else 11.0,
            traffic_intensity_idx=100.0 - z.mobility_score,
            ev_adoption_pct=9.5 if z.mobility_score > 65 else 4.2,
            source="Demo Dataset (Lucknow OpenAQ & Municipal Feeds)",
            is_demo=True
        )
        db.add(m)

        # Sustainability Score Entry
        sc = SustainabilityScore(
            zone_id=z.id,
            score=z.current_green_score,
            air_subscore=max(10.0, 100.0 - (z.aqi * 0.35)),
            waste_subscore=z.waste_efficiency,
            water_subscore=z.water_score,
            green_subscore=(z.green_cover_pct / 33.0) * 90.0,
            energy_subscore=z.energy_score,
            mobility_subscore=z.mobility_score,
            citizen_subscore=95.0 - (z.open_issues_count * 3.5),
            weights_json=json.dumps(DEFAULT_WEIGHTS),
            delta_last_month=+3.5 if z.risk_level == "Low" else -2.8,
            risk_trend="Improving" if z.risk_level == "Low" else "Deteriorating"
        )
        db.add(sc)
    db.commit()

    # 5. Problems (for AI Priority Engine)
    p1 = Problem(
        zone_id=z_chowk.id,
        title="Unsegregated Commercial Waste Accumulation & Open Dumping",
        category="Waste Management",
        severity="Critical",
        affected_population=32000,
        current_metric_val="52% Collection Efficiency (6 Open Dumps)",
        trend="Rapidly Deteriorating",
        predicted_deterioration="Score dropping from 54 → 46.5 in 30 days",
        priority_score=94.2,
        priority_rank=1,
        confidence_pct=94.0,
        suggested_department_id=dept_sanitation.id,
        why_priority_reason="Ranked #1 Priority because 32,000 residents in high-density Chowk market are exposed to infectious disease vectors and drainage blockage risk.",
        status="OPEN"
    )
    p2 = Problem(
        zone_id=z_hazratganj.id,
        title="Elevated Particulate Matter (PM2.5) Surge from Peak Traffic",
        category="Air Quality",
        severity="High",
        affected_population=24000,
        current_metric_val="AQI 142 (PM2.5: 64 µg/m³)",
        trend="Deteriorating",
        predicted_deterioration="AQI expected to exceed 175 with winter calm winds",
        priority_score=86.5,
        priority_rank=2,
        confidence_pct=91.5,
        suggested_department_id=dept_transport.id,
        why_priority_reason="High priority due to 24,000 transit commuters exposed to particulate levels 4.2x above WHO safety guidelines.",
        status="OPEN"
    )
    p3 = Problem(
        zone_id=z_aliganj.id,
        title="Groundwater Extraction Deficit & Distribution Pipe Leakage",
        category="Water Stress",
        severity="High",
        affected_population=18500,
        current_metric_val="Water Score: 64% (2.4 MLD Distribution Loss)",
        trend="Deteriorating",
        predicted_deterioration="Sub-surface pressure dropping 18% by month end",
        priority_score=78.4,
        priority_rank=3,
        confidence_pct=88.0,
        suggested_department_id=dept_water.id,
        why_priority_reason="Sub-surface leakage wasting 2.4 million liters daily while Sector C experiences peak summer pressure deficits.",
        status="OPEN"
    )
    p4 = Problem(
        zone_id=z_alambagh.id,
        title="Heavy Transit Diesel Emissions & Street Canopy Deficit",
        category="Mobility & Green",
        severity="High",
        affected_population=21000,
        current_metric_val="AQI 156 (Canopy: 18%)",
        trend="Deteriorating",
        predicted_deterioration="NO2 and soot concentrations projected +15%",
        priority_score=74.0,
        priority_rank=4,
        confidence_pct=86.0,
        suggested_department_id=dept_parks.id,
        why_priority_reason="Arterial bus corridor creates localized heat island effect without sufficient tree buffers.",
        status="OPEN"
    )
    p5 = Problem(
        zone_id=z_gomti.id,
        title="Sub-optimal Segregation Compliance in High-Rise Complexes",
        category="Waste Management",
        severity="Low",
        affected_population=12000,
        current_metric_val="84% Efficiency (Target: 95%)",
        trend="Stable",
        predicted_deterioration="Plateauing recycling rate without incentive scheme",
        priority_score=42.0,
        priority_rank=5,
        confidence_pct=82.0,
        suggested_department_id=dept_sanitation.id,
        why_priority_reason="Moderate opportunity to increase recycling percentage from 26% to 40% with automated RFID bins.",
        status="OPEN"
    )

    db.add_all([p1, p2, p3, p4, p5])
    db.commit()

    # 6. Recommendations
    r1 = Recommendation(
        problem_id=p1.id,
        zone_id=z_chowk.id,
        title="Deploy 40 RFID Smart Sensor Bins & Compactors",
        description="Install solar-powered ultrasonic fill-level sensor bins in Chowk market corridor with dynamic route dispatch.",
        estimated_cost=400000.0,
        expected_score_gain=5.2,
        expected_env_gain="+18% Waste Collection Efficiency, Zero Open Overflow",
        implementation_days=14,
        population_benefited=32000,
        feasibility_pct=92.0,
        department_id=dept_sanitation.id,
        explainable_reason="Highest ROI intervention in Chowk. Directly resolves #1 municipal priority within 14 days.",
        status="APPROVED"
    )
    r2 = Recommendation(
        problem_id=p2.id,
        zone_id=z_hazratganj.id,
        title="Urban Forestry Canopy: Plant 650 Indigenous Shade Trees",
        description="Dense roadside plantation of Neem, Peepal, and Jamun along Hazratganj arterial corridor to trap dust and reduce micro-heat.",
        estimated_cost=250000.0,
        expected_score_gain=2.8,
        expected_env_gain="-8.5 AQI points, -16 tons CO2/yr",
        implementation_days=21,
        population_benefited=24000,
        feasibility_pct=88.0,
        department_id=dept_parks.id,
        explainable_reason="Provides long-term bio-filtration for traffic corridor with low maintenance requirements.",
        status="APPROVED"
    )
    r3 = Recommendation(
        problem_id=p3.id,
        zone_id=z_aliganj.id,
        title="Acoustic Leak Detection & Pressure Valve Retrofitting",
        description="Deploy acoustic leak detection sensors and smart pressure management valves across Aliganj Sector C pipeline network.",
        estimated_cost=200000.0,
        expected_score_gain=2.1,
        expected_env_gain="Recover 1.8 MLD potable water daily",
        implementation_days=18,
        population_benefited=18500,
        feasibility_pct=85.0,
        department_id=dept_water.id,
        explainable_reason="Eliminates distribution losses and restores pressure without complete pipe replacement.",
        status="APPROVED"
    )
    r4 = Recommendation(
        problem_id=p1.id,
        zone_id=z_chowk.id,
        title="Doorstep Segregation Awareness & Incentive Drive",
        description="Community incentives and ward-level door-to-door green champion training for wet and dry waste segregation.",
        estimated_cost=150000.0,
        expected_score_gain=1.5,
        expected_env_gain="+12% Source Segregation Compliance",
        implementation_days=30,
        population_benefited=28000,
        feasibility_pct=90.0,
        department_id=dept_sanitation.id,
        explainable_reason="Builds sustained citizen participation to prevent secondary dumping.",
        status="PROPOSED"
    )
    r5 = Recommendation(
        problem_id=p4.id,
        zone_id=z_alambagh.id,
        title="Deploy 5 Electric Feeder Shuttles & EV Charging Island",
        description="Launch 5 zero-emission 12-seater electric shuttles connecting Alambagh Metro Station with residential catchments.",
        estimated_cost=650000.0,
        expected_score_gain=3.6,
        expected_env_gain="-12.0 AQI points, -48 tons diesel emissions/yr",
        implementation_days=45,
        population_benefited=21000,
        feasibility_pct=82.0,
        department_id=dept_transport.id,
        explainable_reason="Replaces high-emission diesel shared autos in dense commuter corridor.",
        status="PROPOSED"
    )

    db.add_all([r1, r2, r3, r4, r5])
    db.commit()

    # 7. Citizen Reports (Sample real-world complaints)
    c1 = CitizenReport(
        tracking_id="GS-2026-881294",
        user_id=user_citizen.id,
        citizen_name="Amit Trivedi",
        citizen_phone="+91-9876543210",
        category="Garbage Dump",
        severity="High",
        description="Huge pile of commercial garbage lying uncollected for 4 days near Gol Darwaza market. Attracting stray cattle and causing foul odor.",
        zone_id=z_chowk.id,
        latitude=26.8690,
        longitude=80.9035,
        address="Near Gol Darwaza Market, Chowk, Lucknow",
        photo_url="https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500",
        status="In Progress",
        ai_category="Garbage Dump",
        ai_severity="High",
        ai_suggested_dept="Municipal Sanitation & Solid Waste",
        ai_confidence=94.5,
        ai_reason="Persistent municipal solid waste accumulation creates public health hazards and attracts disease vectors."
    )
    c2 = CitizenReport(
        tracking_id="GS-2026-772109",
        user_id=None,
        citizen_name="Sunita Agarwal",
        citizen_phone="+91-9450123456",
        category="Water Leakage",
        severity="Medium",
        description="Underground potable pipeline burst causing continuous clean water wastage onto the road since morning.",
        zone_id=z_aliganj.id,
        latitude=26.8920,
        longitude=80.9430,
        address="Sector C, Ring Road intersection, Aliganj",
        photo_url="https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500",
        status="Verified",
        ai_category="Water Leakage",
        ai_severity="Medium",
        ai_suggested_dept="Water Supply & Jal Sansthan",
        ai_confidence=92.0,
        ai_reason="Potable water distribution loss exacerbates local groundwater stress and reduces supply pressure."
    )
    c3 = CitizenReport(
        tracking_id="GS-2026-663812",
        user_id=None,
        citizen_name="Mohammad Farooq",
        citizen_phone="+91-9123456789",
        category="Air Pollution",
        severity="High",
        description="Heavy black smoke emissions from illegal waste burning behind transport yard during late evening.",
        zone_id=z_alambagh.id,
        latitude=26.8140,
        longitude=80.9070,
        address="Behind Transport Yard, Alambagh",
        photo_url=None,
        status="Assigned",
        ai_category="Air Pollution",
        ai_severity="High",
        ai_suggested_dept="Environment & Pollution Control",
        ai_confidence=90.0,
        ai_reason="Open burning and unmitigated particulate release spikes localized PM2.5 concentrations."
    )

    db.add_all([c1, c2, c3])
    db.commit()

    # 8. Action Assignments (Department Workflow)
    act1 = ActionAssignment(
        action_code="ACT-2026-4401",
        title="Deploy 40 Smart RFID Sensor Bins in Chowk Corridor",
        problem_id=p1.id,
        zone_id=z_chowk.id,
        department_id=dept_sanitation.id,
        assigned_officer_id=user_officer_san.id,
        status="In Progress",
        progress_pct=75,
        estimated_cost=400000.0,
        actual_cost=380000.0,
        deadline=datetime.datetime.utcnow() + datetime.timedelta(days=7),
        evidence_notes="30 of 40 RFID smart bins installed and connected to IoT telematics gateway. Secondary clearance routes initialized.",
        evidence_photo_url="https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=500"
    )
    act2 = ActionAssignment(
        action_code="ACT-2026-3392",
        title="Aliganj Sector C Acoustic Leakage Rectification",
        problem_id=p3.id,
        zone_id=z_aliganj.id,
        department_id=dept_water.id,
        assigned_officer_id=None,
        status="Completed",
        progress_pct=100,
        estimated_cost=200000.0,
        actual_cost=192000.0,
        deadline=datetime.datetime.utcnow() - datetime.timedelta(days=2),
        completion_date=datetime.datetime.utcnow() - datetime.timedelta(days=1),
        evidence_notes="3 primary subsurface fractures welded and pressurized. Distribution pressure restored to 1.8 bar.",
        evidence_photo_url="https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=500"
    )
    act3 = ActionAssignment(
        action_code="ACT-2026-2281",
        title="Hazratganj Roadside Native Tree Plantation (650 Trees)",
        problem_id=p2.id,
        zone_id=z_hazratganj.id,
        department_id=dept_parks.id,
        assigned_officer_id=None,
        status="Assigned",
        progress_pct=25,
        estimated_cost=250000.0,
        actual_cost=65000.0,
        deadline=datetime.datetime.utcnow() + datetime.timedelta(days=14),
        evidence_notes="Soil prep completed. 160 saplings planted with tree guards."
    )

    db.add_all([act1, act2, act3])
    db.commit()

    # 9. Impact Verification (Pre vs Post)
    iv1 = ImpactVerification(
        action_id=act2.id,
        zone_id=z_aliganj.id,
        metric_name="Green Score",
        pre_metric_val=68.9,
        post_metric_val=71.0,
        predicted_delta=2.1,
        measured_delta=2.1,
        goal_attainment_pct=100.0,
        verdict="Achieved",
        score_delta=2.1,
        verification_notes="Target water conservation achieved (1.8 MLD recovered). Water sub-score improved from 59.2 → 64.0.",
        verified_by="GreenScore AI Verification Auditor",
        verified_at=datetime.datetime.utcnow() - datetime.timedelta(hours=6)
    )
    db.add(iv1)

    # 10. Alerts
    a1 = Alert(
        zone_id=z_chowk.id,
        title="Critical Waste Accumulation in Chowk",
        message="Collection efficiency has fallen below 55% threshold. High risk of disease transmission.",
        category="Waste",
        severity="Critical",
        trigger_metric="Waste Efficiency = 52%",
        is_active=True
    )
    a2 = Alert(
        zone_id=z_hazratganj.id,
        title="High AQI Concentration (PM2.5: 64 µg/m³)",
        message="Stagnant atmospheric conditions leading to particulate buildup along Mahatma Gandhi Marg.",
        category="AQI",
        severity="High",
        trigger_metric="AQI = 142",
        is_active=True
    )
    a3 = Alert(
        zone_id=z_aliganj.id,
        title="Action ACT-2026-3392 Verified Successfully",
        message="Water leakage rectification verified with 100% goal attainment.",
        category="System",
        severity="Low",
        trigger_metric="Impact Attainment = 100%",
        is_active=True
    )
    db.add_all([a1, a2, a3])

    # 11. Audit Logs
    l1 = AuditLog(
        user_name="Dr. Anand Verma",
        role="SUPER_ADMIN",
        action_type="OPTIMIZE_BUDGET",
        entity_type="BUDGET_PORTFOLIO",
        details_json='{"budget": 1000000, "allocated": 1000000, "interventions": 4}'
    )
    l2 = AuditLog(
        user_name="Dr. Anand Verma",
        role="SUPER_ADMIN",
        action_type="APPROVE_ACTION",
        entity_type="ACTION_ASSIGNMENT",
        entity_id="ACT-2026-4401",
        details_json='{"department": "Municipal Sanitation", "cost": 400000}'
    )
    db.add_all([l1, l2])

    # 12. System Settings
    s_weights = SystemSetting(
        setting_key="SCORE_WEIGHTS",
        setting_value=json.dumps(DEFAULT_WEIGHTS),
        description="Configurable Green Score Category Weights"
    )
    db.add(s_weights)

    db.commit()
    db.close()
    print("[SUCCESS] GREENScore AI Database seeded successfully with Lucknow demo dataset!")

if __name__ == "__main__":
    seed_database()
