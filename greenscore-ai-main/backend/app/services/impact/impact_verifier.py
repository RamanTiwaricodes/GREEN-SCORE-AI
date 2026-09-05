from typing import Dict, Any

class ImpactVerificationEngine:
    @staticmethod
    def verify_action_impact(
        pre_val: float,
        post_val: float,
        predicted_delta: float,
        metric_name: str = "Green Score"
    ) -> Dict[str, Any]:
        measured_delta = round(post_val - pre_val, 2)
        
        if abs(predicted_delta) < 0.001:
            attainment = 100.0 if measured_delta >= 0 else 0.0
        else:
            attainment = round((measured_delta / predicted_delta) * 100.0, 1)
            
        if attainment >= 110.0:
            verdict = "Exceeded"
            note = f"Action outperformed target expectations by +{round(attainment - 100, 1)}%. Exceptional field execution."
        elif attainment >= 90.0:
            verdict = "Achieved"
            note = "Intervention achieved target environmental delta within the expected confidence interval."
        elif attainment >= 50.0:
            verdict = "Partially Achieved"
            note = f"Intervention achieved {attainment}% of the projected target. Local factors may require secondary follow-up."
        else:
            verdict = "Underperformed"
            note = "Significant deviation from forecast. Requires departmental review and recalibration."

        return {
            "metric_name": metric_name,
            "pre_metric_val": round(pre_val, 1),
            "post_metric_val": round(post_val, 1),
            "predicted_delta": round(predicted_delta, 1),
            "measured_delta": measured_delta,
            "goal_attainment_pct": max(0.0, attainment),
            "verdict": verdict,
            "score_delta": measured_delta if metric_name == "Green Score" else round(measured_delta * 0.4, 1),
            "verification_notes": note,
            "verified_by": "GreenScore AI Autonomous Verification Auditor"
        }

impact_verifier = ImpactVerificationEngine()
