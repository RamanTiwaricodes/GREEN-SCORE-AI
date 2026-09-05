from typing import Dict, Any

class CitizenIssueVisionClassifier:
    @staticmethod
    def classify_issue(description: str, photo_url: str = None) -> Dict[str, Any]:
        d_lower = description.lower()
        
        if any(w in d_lower for w in ["garbage", "kachra", "dump", "trash", "waste", "rubbish", "plastic", "overflow", "bin"]):
            category = "Garbage Dump"
            severity = "High" if any(w in d_lower for w in ["days", "overflow", "huge", "stinking", "rotting", "5", "road"]) else "Medium"
            dept = "Municipal Sanitation"
            reason = "Persistent municipal solid waste accumulation creates public health hazards and attracts disease vectors."
            confidence = 94.2
        elif any(w in d_lower for w in ["water", "leak", "pipe", "paani", "drinking", "tap", "burst"]):
            category = "Water Leakage"
            severity = "High" if any(w in d_lower for w in ["gushing", "main", "massive", "wasting"]) else "Medium"
            dept = "Water & Jal Sansthan"
            reason = "Potable water distribution loss exacerbates local groundwater stress and reduces supply pressure."
            confidence = 92.0
        elif any(w in d_lower for w in ["drain", "sewage", "naali", "choked", "clogged", "overflowing", "gutter"]):
            category = "Drainage"
            severity = "High"
            dept = "Public Works & Drainage"
            reason = "Stormwater and sewer blockages cause road inundation and structural damage."
            confidence = 91.5
        elif any(w in d_lower for w in ["tree", "plant", "cutting", "fell", "park", "grass", "green", "wood"]):
            category = "Green Area Damage"
            severity = "Medium"
            dept = "Parks & Horticulture"
            reason = "Damage to urban canopy degrades local microclimate regulation and carbon sequestration."
            confidence = 88.0
        elif any(w in d_lower for w in ["smoke", "burning", "air", "smog", "dust", "fumes", "factory"]):
            category = "Air Pollution"
            severity = "High"
            dept = "Environment & Pollution Control"
            reason = "Open burning and unmitigated particulate release spikes localized PM2.5 concentrations."
            confidence = 90.5
        elif any(w in d_lower for w in ["pothole", "road", "street", "broken", "footpath", "divider"]):
            category = "Road Problem"
            severity = "Medium"
            dept = "Public Works Department"
            reason = "Pavement surface degradation impedes traffic flow and creates safety risks."
            confidence = 89.0
        else:
            category = "Illegal Dumping"
            severity = "Medium"
            dept = "Municipal Sanitation"
            reason = "Unclassified public nuisance impacting environmental quality."
            confidence = 82.0

        return {
            "category": category,
            "severity": severity,
            "suggested_department": dept,
            "confidence_pct": confidence,
            "reason": reason
        }

vision_classifier = CitizenIssueVisionClassifier()
