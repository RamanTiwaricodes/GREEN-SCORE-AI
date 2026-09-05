# 🌿 GREENScore AI
### *AI-Powered Municipal Sustainability, Action & Impact Optimization System*

> **TAGLINE:** *"Predict. Prioritize. Optimize. Act. Measure."*  
> **TEAM:** Orbit  
> **CITY FOCUS:** Lucknow Municipal Corporation (LMC)  
> **CORE USP:** *"From Prediction to Verified Action"* — A complete closed-loop municipal intelligence engine that monitors city health, forecasts risks, ranks priorities, optimizes budgets, simulates what-if scenarios, tracks execution, and statistically verifies impact.

---

## 🏛️ Executive Summary & Vision

Traditional municipal tools are either **passive pollution dashboards** (showing data without action) or **isolated citizen grievance apps** (tracking complaints without strategic intelligence).

**GREENScore AI** bridges this gap with a closed-loop municipal decision pipeline:

```
  [ CITY SENSORS & OPENAQ ] ───► [ 1. MONITOR & GREEN SCORE (0-100) ]
                                          │
  [ CITIZEN GRIEVANCE PORTAL ] ───► [ 2. PREDICT DETERIORATION (7d/30d ML) ]
                                          │
                                   [ 3. MCDA PRIORITY ENGINE ]
                                          │
                                   [ 4. AI PRESCRIPTIVE RECOMMENDATIONS ]
                                          │
                                   [ 5. KNAPSACK BUDGET OPTIMIZER (₹) ]
                                          │
                                   [ 6. WHAT-IF SCENARIO SIMULATOR ]
                                          │
                                   [ 7. AUTHORITY APPROVAL & KANBAN DISPATCH ]
                                          │
                                   [ 8. DEPARTMENT FIELD EXECUTION ]
                                          │
                                   [ 9. CLOSED-LOOP IMPACT VERIFICATION ]
                                          │
                                   [ 10. REAL-TIME SCORE RECALCULATION ]
```

---

## 🚀 Live Demo & Access Credentials

### 🌐 Running Servers:
- **Frontend Command Center:** [http://localhost:5173](http://localhost:5173)
- **FastAPI Backend & Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 👥 1-Click Demo Personas & Login Credentials:

| Role | Username | Password | Persona & Authority Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` | **Municipal Commissioner (Dr. Anand Verma)** — Full city oversight, budget approvals, weight overrides, audit trail. |
| **Department Officer** | `officer_sanitation` | `officer123` | **Sanitation Lead (Rajesh Singh)** — Assigned tickets, execution progress (0-100%), evidence upload. |
| **Department Officer** | `officer_transport` | `officer123` | **Transport Officer (Priya Sharma)** — EV fleet operations, mobility sensor telemetry. |
| **Citizen** | `citizen` | `citizen123` | **Lucknow Resident (Amit Trivedi)** — Public score dashboard, ticket submission with AI vision, 7-stage live tracking. |

*(Note: The navbar and login screen contain instant 1-click persona switcher buttons for quick testing without typing).*

---

## 🔬 Core Mathematical Formulations & Engines

### 1. Standardized Green Score Formula ($0 - 100$)
$$Score = \sum_{i=1}^{n} w_i \times S_i$$
- $S_{\text{Air}} = \max(0, 100 - (\text{AQI} \times 0.35))$
- $S_{\text{Waste}} = \text{Waste Collection Efficiency (\%)} \times 0.70 + \text{Recycling Rate (\%)} \times 0.30$
- $S_{\text{Water}} = \text{Water Quality Index (WQI)} \times 0.60 + \max(0, 100 - \text{Water Stress Score}) \times 0.40$
- $S_{\text{Green}} = \min(100, (\text{Canopy Cover \%} / 33.0) \times 90 + \text{Plantation Index})$
- $S_{\text{Energy}} = \text{Renewable \%} \times 0.50 + \max(0, 100 - \text{Demand Peak Stress}) \times 0.50$
- $S_{\text{Mobility}} = \max(0, 100 - \text{Traffic Intensity}) \times 0.60 + \text{EV Adoption \%} \times 0.40$
- $S_{\text{Citizen}} = \max(0, 100 - (\text{Open Complaints Density} \times 2.5))$

### 2. Multi-Criteria Decision Analysis (MCDA) Priority Engine
$$P = (0.30 \times \text{Severity}) + (0.25 \times \text{NormPop}) + (0.20 \times \text{DeteriorationRisk}) + (0.15 \times \text{Urgency}) + (0.10 \times \text{Feasibility})$$

### 3. Multi-Objective 0/1 Knapsack Budget Optimizer
$$\max \sum_{j \in X} \left( \text{Gain}_j \times \text{PopBenefited}_j \times \text{Feasibility}_j \right)$$
$$\text{subject to } \sum_{j \in X} \text{Cost}_j \le \text{AvailableBudget}$$

### 4. Closed-Loop Impact Attainment
$$\text{Attainment \%} = \frac{\text{Measured Score Delta}}{\text{Predicted Target Delta}} \times 100$$

---

## 🗺️ Lucknow 6-Zone Operational Matrix

| Zone Name | Type & Characteristic | Green Score | AQI | Primary Bottleneck | Recommended Priority Intervention |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gomti Nagar** | Modern Planned Residential | **82.0 (Tier A)** | 92 (Good) | Grid peak load | Smart Solar Microgrids (₹3.5L) |
| **Hazratganj** | High-Density Commercial Core | **71.0 (Tier B)** | 148 (Mod) | Traffic emissions | EV Feeder Shuttle Fleet (₹12.0L) |
| **Aliganj** | Mixed Residential / Commercial | **69.5 (Tier B)** | 134 (Mod) | Water supply loss | Pipeline Sensor Leak Repair (₹2.2L) |
| **Indira Nagar** | Dense Urban Sector | **74.0 (Tier B)** | 118 (Mod) | Tree canopy loss | Miyawaki Urban Afforestation (₹1.8L) |
| **Chowk** | Heritage Commercial Market | **54.0 (Critical)** | **215 (Poor)** | Waste overflow & congestion | Compactor Waste Depots (₹4.5L) |
| **Alambagh** | Transport & Logistics Hub | **62.0 (Tier C)** | 172 (Poor) | Dust & diesel particulate | Smog Cannons & Wet Sweepers (₹3.8L) |

---

## 💻 Tech Stack & Architecture

### Backend:
- **Framework:** FastAPI (Python 3.14)
- **Database:** SQLAlchemy ORM with SQLite (zero-setup) & PostgreSQL compatibility
- **ML / AI:** Scikit-Learn (Random Forest & Ridge Regression), NumPy, Pandas
- **NLP & Vision:** Multi-label issue triage with confidence scoring
- **External Adapters:** OpenAQ API v3 (Station 2178), Open-Meteo Weather API
- **Auth:** JWT tokens & Argon2/PBKDF2 salted password hashing

### Frontend:
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS + Custom CSS Glassmorphism + Glow Tokens
- **GIS Mapping:** Leaflet & OpenStreetMap interactive spatial twin
- **Visualizations:** Recharts (Radar charts, Multi-curve forecasts, Budget breakdowns, Comparison bars)
- **Icons:** Lucide React

---

## 🎯 5-Minute Hackathon Winning Demo Flow for Judges

1. **Step 1: The Public Landing & Citizen Grievance Portal**
   - Open [http://localhost:5173](http://localhost:5173).
   - Click **"Report Environmental Issue"**. Select *Chowk*, type a garbage complaint, and watch the **Live AI Triage Box** immediately predict category, severity (High), and routing department (*Municipal Sanitation*).
   - Submit ticket and copy Tracking ID (e.g. `GS-2026-881294`).
   - Click **"Track Real-Time Progress"** to reveal the interactive **7-stage visual lifecycle stepper**.

2. **Step 2: Municipal Command Cockpit & Digital Twin GIS**
   - Switch role to **Super Admin** (`admin`).
   - View the Command Cockpit: 8 real-time KPI cards, the **Multi-Domain Radar Chart**, and the Leaflet **Digital Twin Map** showing Lucknow zones. Click **Chowk** to open the real-time spatial inspection drawer.

3. **Step 3: AI Predictions & MCDA Priority Engine**
   - Navigate to **"AI Predictions"** to inspect the 7-day and 30-day forecast curves with 95% confidence intervals.
   - Jump to **"AI Priority Engine"** to demonstrate why Chowk's waste accumulation is ranked **#1 Priority** via transparent mathematical explainability cards.

4. **Step 4: Smart Budget Optimizer (Knapsack ₹ Allocation)**
   - Open **"Budget Optimizer"**.
   - Drag the budget slider to **₹10,00,000** (or click preset).
   - Click **"Run Multi-Objective Optimizer"**. Watch the knapsack solver allocate capital across high-ROI interventions, generating **+11.6 pts Green Score Gain**, benefiting **1,25,000 citizens**, and outputting an explainable rationale.

5. **Step 5: What-If Simulation & Scenario Comparison**
   - Navigate to **"What-If Simulator"**. Adjust tree plantation to *+1,500* and waste boost to *+20%* to see live projected score improvements.
   - Click **"Compare Scenarios (A vs B vs C)"** to view the multi-scenario trade-off matrix.

6. **Step 6: Department Execution & Closed-Loop Impact Verification**
   - Switch persona to **Sanitation Lead Officer**. Open **"Action Pipeline"** (Kanban board) and drag/update progress to **100%** with actual cost and field notes.
   - Switch back to **Super Admin** and open **"Impact Verification"**. Click **"Run Impact Audit"** on the completed action.
   - Watch the engine verify **100% Goal Attainment**, celebrate with confetti/verdict, and automatically increment Chowk's zone Green Score!

7. **Step 7: AI Grounded Assistant & Print-Ready Audit Report**
   - Open the **AI Decision Assistant** and ask *"Which zone needs attention today?"*
   - Open **"Audit Reports"** and click **"Print / Export PDF Audit Report"** to show a print-ready municipal audit report.

---

## 🛠️ Local Installation & Setup

### 1. Prerequisites:
- Python 3.10+ installed
- Node.js v18+ and npm installed

### 2. Backend Setup:
```bash
cd c:\Users\ASUS-PC\greenscore-ai\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed_data
python -m uvicorn app.main:app --port 8000 --reload
```

### 3. Frontend Setup:
```bash
cd c:\Users\ASUS-PC\greenscore-ai\frontend
npm install
npm run dev
```

---

## 🏆 Project Accomplishments

- ✅ Complete Closed-Loop Cycle: `MONITOR -> PREDICT -> PRIORITIZE -> OPTIMIZE -> SIMULATE -> ACT -> MEASURE`
- ✅ 28 Full Interactive Views with responsive design & dark-mode glassmorphism
- ✅ Grounded AI assistant with zero hallucination
- ✅ Complete Lucknow municipal dataset seeded and ready to demo
