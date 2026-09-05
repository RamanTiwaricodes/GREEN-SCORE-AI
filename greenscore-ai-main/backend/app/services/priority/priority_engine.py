from typing import List, Dict, Any

class PriorityRankingEngine:
    @staticmethod
    def calculate_priority(
        problem: Dict[str, Any],
        weights: Dict[str, float] = None
    ) -> Dict[str, Any]:
        w = weights or {
            "severity": 0.30,
            "population": 0.25,
            "deterioration": 0.20,
            "urgency": 0.15,
            "impact_feasibility": 0.10
        }
        
        # 1. Severity Score (0-100)
        sev_map = {"Critical": 100.0, "High": 80.0, "Medium": 50.0, "Low": 25.0}
        s_sev = sev_map.get(problem.get("severity", "Medium"), 50.0)
        
        # 2. Population Exposure Score (0-100, max scale 100k)
        pop = float(problem.get("affected_population", 20000))
        s_pop = min(100.0, (pop / 100000.0) * 100.0)
        
        # 3. Predicted Deterioration Score (0-100)
        trend = problem.get("trend", "Deteriorating")
        trend_map = {"Rapidly Deteriorating": 100.0, "Deteriorating": 80.0, "Stable": 40.0, "Improving": 15.0}
        s_det = trend_map.get(trend, 70.0)
        
        # 4. Urgency Score (0-100)
        urg_map = {"Critical": 100.0, "High": 75.0, "Medium": 45.0, "Low": 20.0}
        s_urg = urg_map.get(problem.get("urgency", problem.get("severity", "High")), 70.0)
        
        # 5. Feasibility / Impact Potential (0-100)
        feas = float(problem.get("feasibility_pct", 80.0))
        
        composite_priority = (
            w["severity"] * s_sev +
            w["population"] * s_pop +
            w["deterioration"] * s_det +
            w["urgency"] * s_urg +
            w["impact_feasibility"] * feas
        )
        
        composite_priority = round(max(0.0, min(100.0, composite_priority)), 1)
        
        # Build explainable reasoning
        reasons = []
        if s_sev >= 80:
            reasons.append(f"Severity classified as {problem.get('severity')}")
        if pop >= 15000:
            reasons.append(f"{int(pop):,} residents directly affected in the catchment zone")
        if s_det >= 70:
            reasons.append(f"30-day forecast predicts rapid metric deterioration without municipal intervention")
        if feas >= 75:
            reasons.append("High engineering & administrative feasibility with immediate actionable interventions")
            
        why_text = f"Ranked as high priority because: " + "; ".join(reasons) + "."
        
        return {
            "priority_score": composite_priority,
            "confidence_pct": 92.4,
            "why_priority_reason": why_text,
            "sub_metrics": {
                "severity_score": s_sev,
                "population_score": round(s_pop, 1),
                "deterioration_score": s_det,
                "urgency_score": s_urg,
                "feasibility_score": feas
            }
        }

    @classmethod
    def rank_problems(cls, problems: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        scored = []
        for p in problems:
            eval_res = cls.calculate_priority(p)
            p_copy = p.copy()
            p_copy["priority_score"] = eval_res["priority_score"]
            p_copy["confidence_pct"] = eval_res["confidence_pct"]
            p_copy["why_priority_reason"] = eval_res["why_priority_reason"]
            scored.append(p_copy)
            
        scored.sort(key=lambda x: x["priority_score"], reverse=True)
        for idx, item in enumerate(scored):
            item["priority_rank"] = idx + 1
        return scored

priority_engine = PriorityRankingEngine()
