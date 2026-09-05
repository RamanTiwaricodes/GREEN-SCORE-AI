from typing import Dict, Any

DEFAULT_WEIGHTS = {
    "air": 0.20,
    "waste": 0.20,
    "water": 0.15,
    "green": 0.15,
    "energy": 0.10,
    "mobility": 0.10,
    "citizen": 0.10
}

def normalize_air_score(aqi: float, pm25: float) -> float:
    # CPCB AQI Scale: 0-50 Good (100-90), 51-100 Satisfactory (89-75), 101-200 Moderate (74-50), 201-300 Poor (49-30), 301-400 Very Poor (29-15), 401-500 Severe (14-0)
    if aqi <= 50:
        return max(0.0, min(100.0, 100.0 - (aqi / 50.0) * 10.0))
    elif aqi <= 100:
        return max(0.0, min(100.0, 90.0 - ((aqi - 50.0) / 50.0) * 15.0))
    elif aqi <= 200:
        return max(0.0, min(100.0, 75.0 - ((aqi - 100.0) / 100.0) * 25.0))
    elif aqi <= 300:
        return max(0.0, min(100.0, 50.0 - ((aqi - 200.0) / 100.0) * 20.0))
    elif aqi <= 400:
        return max(0.0, min(100.0, 30.0 - ((aqi - 300.0) / 100.0) * 15.0))
    else:
        return max(0.0, min(100.0, 15.0 - ((min(500.0, aqi) - 400.0) / 100.0) * 15.0))

def normalize_waste_score(collection_pct: float, recycling_pct: float, open_dumps: int) -> float:
    base = (collection_pct * 0.7) + (recycling_pct * 1.5)
    penalty = open_dumps * 4.0
    return max(5.0, min(100.0, base - penalty))

def normalize_water_score(wqi: float, stress_level: str) -> float:
    stress_penalty = {"Low": 0.0, "Moderate": 10.0, "High": 25.0, "Critical": 40.0}.get(stress_level, 10.0)
    return max(5.0, min(100.0, wqi - stress_penalty))

def normalize_green_score(green_cover_pct: float) -> float:
    # Target standard: 33% urban green cover
    return max(10.0, min(100.0, (green_cover_pct / 33.0) * 90.0))

def normalize_energy_score(renewable_pct: float, demand_mwh: float) -> float:
    return max(10.0, min(100.0, 50.0 + (renewable_pct * 1.5) - (demand_mwh / 50.0)))

def normalize_mobility_score(traffic_idx: float, ev_pct: float) -> float:
    # Traffic idx 0-100 (lower is better), EV pct (higher is better)
    return max(10.0, min(100.0, (100.0 - traffic_idx) * 0.75 + (ev_pct * 2.5)))

def normalize_citizen_score(open_issues: int, population: int) -> float:
    rate_per_10k = (open_issues / max(1, population)) * 10000.0
    return max(10.0, min(100.0, 95.0 - (rate_per_10k * 8.0)))

def calculate_green_score(
    metrics: Dict[str, Any],
    weights: Dict[str, float] = None,
    open_issues: int = 5,
    population: int = 50000
) -> Dict[str, Any]:
    w = weights if weights else DEFAULT_WEIGHTS
    
    # Normalize weights if sum != 1.0
    total_w = sum(w.values())
    if total_w > 0:
        w = {k: v / total_w for k, v in w.items()}
        
    s_air = normalize_air_score(metrics.get("aqi", 100.0), metrics.get("pm25", 45.0))
    s_waste = normalize_waste_score(
        metrics.get("waste_collection_pct", 65.0),
        metrics.get("recycling_rate_pct", 20.0),
        metrics.get("open_dumping_reports", 2)
    )
    s_water = normalize_water_score(
        metrics.get("water_quality_index", 75.0),
        metrics.get("water_stress_level", "Moderate")
    )
    s_green = normalize_green_score(metrics.get("green_cover_pct", 25.0))
    s_energy = normalize_energy_score(
        metrics.get("renewable_energy_pct", 15.0),
        metrics.get("energy_demand_mwh", 300.0)
    )
    s_mobility = normalize_mobility_score(
        metrics.get("traffic_intensity_idx", 60.0),
        metrics.get("ev_adoption_pct", 8.0)
    )
    s_citizen = normalize_citizen_score(open_issues, population)
    
    composite_score = (
        w.get("air", 0.20) * s_air +
        w.get("waste", 0.20) * s_waste +
        w.get("water", 0.15) * s_water +
        w.get("green", 0.15) * s_green +
        w.get("energy", 0.10) * s_energy +
        w.get("mobility", 0.10) * s_mobility +
        w.get("citizen", 0.10) * s_citizen
    )
    
    composite_score = round(max(0.0, min(100.0, composite_score)), 1)
    
    # Category tier
    if composite_score >= 80:
        tier = "Excellent"
    elif composite_score >= 60:
        tier = "Good"
    elif composite_score >= 40:
        tier = "Moderate"
    elif composite_score >= 20:
        tier = "Poor"
    else:
        tier = "Critical"
        
    return {
        "score": composite_score,
        "tier": tier,
        "subscores": {
            "air": round(s_air, 1),
            "waste": round(s_waste, 1),
            "water": round(s_water, 1),
            "green": round(s_green, 1),
            "energy": round(s_energy, 1),
            "mobility": round(s_mobility, 1),
            "citizen": round(s_citizen, 1)
        },
        "weights": w
    }
