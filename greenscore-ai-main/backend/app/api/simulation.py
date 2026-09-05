from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from app.database.session import get_db
from app.models.entities import Zone, SimulationRun
from app.schemas.dtos import SimulationRunRequest, SimulationResponse, ScenarioComparisonRequest
from app.services.simulation.simulator import simulation_engine

router = APIRouter(prefix="/simulation", tags=["What-If Simulator"])

@router.post("/run", response_model=SimulationResponse)
def run_what_if_simulation(req: SimulationRunRequest, db: Session = Depends(get_db)):
    base_score = 72.0
    base_aqi = 118.0
    base_waste = 64.0
    pop = 65000
    
    if req.zone_id:
        zone = db.query(Zone).filter(Zone.id == req.zone_id).first()
        if zone:
            base_score = zone.current_green_score
            base_aqi = zone.aqi
            base_waste = zone.waste_efficiency
            pop = zone.population
            
    res = simulation_engine.run_simulation(
        base_green_score=base_score,
        base_aqi=base_aqi,
        base_waste_eff=base_waste,
        tree_plantation_count=req.tree_plantation_count,
        waste_collection_efficiency_pct_delta=req.waste_collection_efficiency_pct_delta,
        ev_bus_addition_count=req.ev_bus_addition_count,
        solar_power_capacity_mw_delta=req.solar_power_capacity_mw_delta,
        water_conservation_recycled_mld=req.water_conservation_recycled_mld,
        traffic_reduction_pct=req.traffic_reduction_pct,
        population=pop
    )
    
    # Record run in database
    sim_run = SimulationRun(
        name="Custom Scenario Run",
        base_zone_id=req.zone_id,
        tree_plantation_delta=req.tree_plantation_count,
        waste_efficiency_delta=req.waste_collection_efficiency_pct_delta,
        ev_bus_delta=req.ev_bus_addition_count,
        solar_power_delta=req.solar_power_capacity_mw_delta,
        water_conservation_delta=req.water_conservation_recycled_mld,
        simulated_score=res["simulated_green_score"],
        simulated_aqi=res["simulated_aqi"],
        simulated_waste_eff=res["simulated_waste_eff"],
        confidence_pct=res["confidence_pct"]
    )
    db.add(sim_run)
    db.commit()
    
    return res

@router.post("/compare-scenarios")
def compare_scenarios(req: ScenarioComparisonRequest, db: Session = Depends(get_db)):
    comp = simulation_engine.compare_scenarios(
        scenario_a_req=req.scenario_a.model_dump(),
        scenario_b_req=req.scenario_b.model_dump(),
        scenario_c_req=req.scenario_c.model_dump(),
        base_score=72.0,
        base_aqi=118.0,
        base_waste=64.0
    )
    return comp
